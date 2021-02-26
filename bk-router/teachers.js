let {querySql, getLimitStr, totalRows, selectTotal, paramsConfig, upScoreDetailsDir, teachersInterfaces, access} = require('./db.js')
let {filterQuery, checkParams, getScoreSqlByScoreCode, getExcelData, setExcelType, accessControl} = require('./utils.js')
let express = require('express')
let nodeExcel = require('excel-export')
let xlsx = require('node-xlsx')
let multiparty = require('multiparty')
let fs = require('fs')
let teacherRouter = express.Router()
/*老师获取所有课程*/
teacherRouter.get(teachersInterfaces.getAllCourses, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let query = filterQuery(req.query)
  let search = `co.name like '${query.courseName || ''}%' AND te.name like '${query.teacherName || ''}%' AND
    co.classroom like '${query.classroom || ''}%' ${query.courseId ? 'AND co.id = ' + query.courseId : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} co.name courseName,co.id courseId,te.id teacherId,te.name teacherName,co.classroom,co.maxCount,co.classTime,
        co.selectedCount,co.createdBy,co.updatedBy,co.createdAt,co.updatedAt
        FROM courses co INNER JOIN teachers te WHERE co.teacherId = te.id AND ${search} ORDER BY co.updatedAt
        DESC ${getLimitStr(query)};${selectTotal}`,
      function (error, results) {
        if (error) return res.json({message: '数据查询失败', status: 4021})
        results[1] = {totalCount: results[1][0].totalCount}
        res.json({message: 'ok', status: 0, data: results})
      });
  })
})
/*老师添加新课程*/
teacherRouter.post(teachersInterfaces.addCourse, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let body = req.body
  let headers = req.headers
  if (!checkParams(res, [paramsConfig.courseName, paramsConfig.classroom, paramsConfig.classTime,
    paramsConfig.maxCount], body, 4052)) return
  querySql(function (connection) {
    connection.query(`INSERT courses(name,teacherId,classroom,selectedCount,maxCount,classTime,createdBy) values(?,?,?,?,?,?,?);`,
      [body.courseName, headers.id, body.classroom, 0, body.maxCount, body.classTime, decodeURIComponent(headers.name)],
      function (error, results) {
        if (error) return res.json({message: '添加失败', status: 4023})
        res.json({message: '添加成功', status: 0})
      })
  })
})
/*老师获取学生成绩*/
teacherRouter.get(teachersInterfaces.getStuScores, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let query = filterQuery(req.query)
  let sql_student = (!query.studentCategory || parseInt(query.studentCategory) !== 2) ? '' : 'AND co.teacherId = ' + req.headers.id
  let sql_score = getScoreSqlByScoreCode(query.scoreCode)
  let search = `st.name like '${query.studentName || ''}%' AND co.name like '${query.courseName || ''}%'
    AND te.name like '${query.teacherName || ''}%' ${sql_score}`
  querySql(function (connection) {
    // select /*+ QB_NAME(QB1) JOIN_PREFIX(`courses`@QB1) */ * from   scores join courses on courses.id = scores.courseId;
    // select * from scores FORCE INDEX(`primary`) join courses IGNORE INDEX(`primary`) on courses.id = scores.courseId;
    // select SQL_CALC_FOUND_ROWS st.name studentName,sc.studentId,sc.score,co.name courseName,sc.courseId,co.teacherId,te.name teacherName,sc.id scoreId,sc.createdBy,sc.updatedBy,sc.createdAt,sc.updatedAt from scores sc join students st on st.id = sc.studentId join courses co ignore index(`primary`) on co.id = sc.courseId join teachers te on te.id = co.teacherId ORDER BY sc.updatedAt DESC;
    let sql = `SELECT ${totalRows} sc.id scoreId,st.name studentName,sc.studentId,co.name courseName,co.id courseId,te.name teacherName,
    te.id teacherId,sc.score,co.classTime,sc.updatedBy,sc.createdAt,sc.updatedAt
    FROM ((scores sc INNER JOIN students st ON sc.studentId = st.id)
      INNER JOIN courses co IGNORE INDEX(\`primary\`) ON sc.courseId=co.id ${sql_student})
      INNER JOIN teachers te ON te.id = co.teacherId 
      WHERE ${query.studentId ? 'st.id = ' + query.studentId : "st.id >= ''"} AND ${search}
      ${getLimitStr(query)};${selectTotal};` // ORDER BY sc.updatedAt DESC
    connection.query(sql, function (error, results) {
      if (error) throw error
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
    // connection.query(`SELECT ${totalRows} studentId,score,courseId,scores.id scoreId,createdBy,updatedBy,createdAt,updatedAt
    // FROM scores WHERE scores.courseId like '${query.courseId}%' AND ${sql_score} AND studentId like '${query.studentId || ''}%'
    //   ORDER BY updatedAt DESC ${getLimitStr(query)};${selectTotal};`,
    //   function (error, results) {
    //     if (error) res.json({message: '查询数据失败', status: 4024})
    //     if (results[0].length < 1) return res.json({message: '暂无数据', status: 0})
    //     let stu_cou_ids = ''
    //     results[0].forEach((i, index) => {
    //       stu_cou_ids += `(${i.studentId},${i.courseId})${index < results[0].length - 1 ? ',' : ''}`
    //     })
    //     connection.query(`SELECT students.id studentId,students.name studentName,teachers.name teacherName,courses.id courseId,courses.name courseName
    //     FROM (students INNER JOIN courses ON (students.id,courses.id) in (${stu_cou_ids}))
    //     INNER JOIN teachers ON courses.teacherId = teachers.id AND ${search}`, function (error2, results2) {
    //       if (error2) return res.json({message: '数据查询失败', status: 4095})
    //       results[0].forEach(i => {
    //         for (let j = 0; j < results2.length; j++) {
    //           if (results2[j].courseId === i.courseId && results2[j].studentId === i.studentId) {
    //             Object.assign(i, results2[j])
    //             break
    //           }
    //         }
    //       })
    //       results[2] = results2
    //       results[1] = {totalCount: results[1][0].totalCount}
    //       res.json({message: 'ok', status: 0, data: results})
    //     })
    //   })
  })
})
/*老师获取导入模板*/
teacherRouter.post(teachersInterfaces.getTemplate, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let body = req.body
  if (!checkParams(res, [paramsConfig.scoreIds], body, 4071)) return
  if (body.scoreIds.length < 1) return res.json({message: '请先选择相应的项目再下载模板', status: 4070})
  querySql(function (connection) {
    connection.query(`SELECT st.name studentName,sc.studentId,co.name courseName,co.id courseId,sc.score
    FROM ((scores sc INNER JOIN students st ON sc.studentId = st.id AND sc.id in (${body.scoreIds.join(',')}))
      INNER JOIN courses co ON sc.courseId=co.id)
      INNER JOIN teachers te ON te.id = co.teacherId WHERE sc.score < 0`, function (error, results) {
      console.log(error)
      if (error) return res.json({message: '查询数据失败', status: 5019})
      let conf = {}
      let width = 20
      conf.cols = [
        {
          caption: '学生名',
          type: 'string',
          width
        },
        {
          caption: '学号',
          type: 'number',
          width
        },
        {
          caption: '课程名',
          type: 'string',
          width
        },
        {
          caption: '课程号',
          type: 'number',
          width
        },

        {
          caption: '分数',
          type: 'number',
          width
        }
      ]
      conf.rows = getExcelData(results)
      let r = nodeExcel.execute(conf)
      setExcelType(res)
      res.end(r, 'binary')
    })
  })
})
/*老师上传成绩文件*/
teacherRouter.post(teachersInterfaces.upScoreFile, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  console.log('post-->teachers/upScoreFile: ', req.query)
  // if (!checkParams(res, [paramsConfig.id], query, 4073)) return
  let form = new multiparty.Form()
  form.encoding = 'utf-8'
  form.uploadDir = './bk-assets/upload'
  form.maxFilesSize = 1024 * 1024
  form.parse(req, function (err, fields, files) {
    if (err) return res.json({message: '上传失败', status: 4072})
    let file = files.file[0]
    let data = xlsx.parse(file.path)[0].data
    querySql(function (connection) {
      let headers = req.headers
      let now = new Date()
      let date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      connection.query(`SELECT id FROM courses WHERE teacherId = ${headers.id} AND classTime <= '${date}';`,
        function (error, results) { // 根据教师id过滤该教师没有发布的课程得到课程id
          if (error) throw error
          let courseIds = []
          results.forEach(i => courseIds.push(i.id))
          // console.log('courseIds',courseIds)
          connection.query(`SELECT DISTINCT studentId FROM scores WHERE courseId in (${courseIds.join(',') || 0}) AND score < 0`,
            function (error2, results2) { // 根据分数表中有的课程id且分数未录入的得到学生id
              if (error2) throw error2
              // console.log('result2',results2)
              let studentIds = []
              results2.forEach(i => studentIds.push(i.studentId))
              data = data.filter(i => {
                return studentIds.indexOf(i[1]) > -1 && courseIds.indexOf(i[3]) > -1 && i[4] >= 0 && i[4] <= 100
              })
              console.log('data', data)
              if (data.length < 1) {
                fs.unlink(file.path, () => console.log('删除导入成绩文件'))
                return res.json({message: '导入失败，请勿导入已有成绩的学生或表格数据不符要求', status: 4075})
              }
              let sql_update = '(CASE '
              data.forEach(i => {
                sql_update = sql_update + `WHEN score = -1 AND studentId = ${i[1]} AND courseId = ${i[3]} THEN ${i[4]} `
              })
              sql_update += 'ELSE score END)'
              connection.query(`UPDATE scores SET score = ${sql_update},updatedBy = '${decodeURIComponent(headers.name)}'`,
                function (error3, results3) {
                  if (error3) throw error3
                  // console.log(results3)
                  if (results3.changedRows > 0) {
                    res.json({message: '导入成功', status: 0})
                  } else {
                    res.json({message: '导入失败，请勿导入已有成绩的学生或表格不符要求', status: 4074})
                  }
                  fs.unlink(file.path, () => console.log('删除导入成绩文件'))
                })
            })
        })
    })
  })
})
/*老师添加学生成绩*/
teacherRouter.post(teachersInterfaces.addScore, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let body = req.body
  if (!checkParams(res, [paramsConfig.courseId, paramsConfig.studentId, {
    k: 'score', validator: v => {
      if (!/^\d{1,3}(\.\d)?$/.test(v)) return {valid: false, m: '参数score格式错误'}
      v = +v
      if (v < 0 || v > 100) {
        return {valid: false, m: '参数score超过限制'}
      }
      return {valid: true}
    }
  }], body, 4029)) return
  querySql(function (connection) {
    let headers = req.headers
    connection.query(`SELECT score,courseId FROM scores WHERE studentId = ${body.studentId} AND courseId = ${body.courseId}`,
      function (error, results) {
        if (error) throw error
        if (results.length < 1) return res.json({message: '该学生未选择此课程', status: 4030})
        if (results[0].score > -1) return res.json({message: '分数已提交，您无权修改', status: 4031})
        let courseId = results[0].courseId
        connection.query(`SELECT classTime FROM courses WHERE id = ${courseId} AND teacherId = ${headers.id}`,
          function (error2, results2) {
            if (error2) throw error2
            if (results2.length <= 0) return res.json({message: '该学生此课程非您所授，您无权提交分数', status: 4047})
            if (new Date(results2[0]['classTime']).getTime() > Date.now()) return res.json({
              message: '该课程未开课,无法添加成绩',
              status: 5017
            })
            connection.query(`UPDATE scores SET score = ${body.score},updatedBy = '${decodeURIComponent(headers.name)}'
            WHERE studentId = ${body.studentId} AND courseId = ${body.courseId}`, function (error3, results3) {
              if (error3) return res.json({message: '添加失败', status: 4025})
              res.json({message: '添加成功', status: 0})
            })
          })
      })
  })
})
/*老师添加学生成绩详情*/
teacherRouter.post(teachersInterfaces.addScoreDetail, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let params = req.params
  if (!checkParams(res, [paramsConfig.scoreId], params, 4077)) return
  let form = new multiparty.Form()
  form.encoding = 'utf-8'
  form.uploadDir = upScoreDetailsDir
  form.maxFilesSize = 1024 * 1024
  querySql(function (connection) {
    connection.query(`SELECT score FROM scores WHERE id = ${params.scoreId} AND score > -1`, function (error, result) {
      if (error) return res.json({message: '查询数据失败', status: 4079})
      if (result.length < 1) return res.json({message: '请先录入成绩', status: 4080})
      form.parse(req, function (err, fields, files) {
        let file = files.file[0]
        if (err) return res.json({message: '上传文件失败', status: 4076})
        connection.query(`INSERT materials(fileName, url, size, scoreId,createdBy) VALUES (?,?,?,?,?)`,
          [file.originalFilename, file.path, file.size, params.scoreId, decodeURIComponent(req.headers.name)],
          function (error2, results2) {
            if (error2) return res.json({message: '上传文件失败', status: 4078})
            res.json({message: '上传文件成功', status: 0})
          })
      })
    })
  })
})
/*老师获取所有自己添加的课程信息*/
teacherRouter.get(teachersInterfaces.getAddedCourses, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let query = filterQuery(req.query)
  let search = `name like '${query.courseName || ''}%' ${query.courseId ? 'AND id = ' + query.courseId : ''} AND classroom like '${query.classroom || ''}%' 
    AND selectedCount like '${query.selectedCount || ''}%'`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} name courseName,classroom,selectedCount,id courseId,maxCount,classTime,createdBy,
        updatedBy,createdAt,updatedAt
        FROM courses WHERE teacherId = ${req.headers.id} AND ${search} ORDER BY updatedAt DESC ${getLimitStr(query)};
        ${selectTotal}`, function (error, results) {
      if (error) return res.json({message: '查询数据失败', status: 4026})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*老师修改自己的课程信息*/
teacherRouter.post(teachersInterfaces.updateCourse, function (req, res) {
  if (!accessControl(req, res, access.ONLY_TEACHERS)) return
  let body = req.body
  let headers = req.headers
  if (!checkParams(res, [paramsConfig.courseName, paramsConfig.classroom, paramsConfig.courseId,
    paramsConfig.maxCount], body, 4048)) return
  querySql(function (connection) {
    connection.query(`SELECT classTime FROM courses WHERE id = ${body.courseId}`, function (error, results) {
      if (error) return res.json({message: '查询数据失败', status: 5013})
      if (results.length < 1) return res.json({message: '该课程不存在', status: 5014})
      if (new Date(results[0]['classTime']).getTime() <= Date.now()) return res.json({
        message: '该课程已开课，无法修改',
        status: 5015
      })
      connection.query(`UPDATE courses SET name = ?,classroom  = ?,maxCount = ?,updatedBy = ?
        WHERE id = ? AND teacherId=?`,
        [body.courseName, body.classroom, body.maxCount, decodeURIComponent(headers.name), body.courseId, headers.id],
        function (error2, results2) {
          if (error2) return res.json({message: '修改失败', status: 5016})
          if (results2.affectedRows > 0) {
            res.json({message: '修改成功', status: 0})
          } else {
            res.json({message: '此课程非您的课程，您不可更改', status: 4028})
          }
        })
    })
  })
})

module.exports = teacherRouter
