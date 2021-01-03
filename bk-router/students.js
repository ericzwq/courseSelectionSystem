let {querySql, getLimitStr, totalRows, selectTotal, paramsConfig, studentExportScoreCol, studentsInterfaces, access} = require('./db.js')
let {filterQuery, checkParams, getLog, getScoreSqlByScoreCode, getExcelData, setExcelType, accessControl} = require('./utils.js')
let express = require('express')
let nodeExcel = require('excel-export')
let studentRouter = express.Router()
/*学生查看成绩*/
studentRouter.get(studentsInterfaces.selectScores, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  let query = filterQuery(req.query)
  getLog('get-->students/myScores: ', query)
  if (!checkParams(res, [paramsConfig.id], query, 4003)) return
  querySql(function (connection) {
    connection.query(`SELECT courseId FROM scores WHERE studentId = ${query.id}`, function (error, results) {
      if (error) return res.json({message: '查询数据失败', status: 4083})
      if (results.flat(Infinity).length === 0) return res.json({
        message: '暂无数据',
        status: 0,
        data: [[], {totalCount: 0}]
      })
      let courseIds = []
      results.forEach(i => {
        courseIds.push(i.courseId)
      })
      if (!courseIds) return res.json({message: '暂无数据', status: 0, data: [[], {totalCount: 0}]})
      let sql_score = getScoreSqlByScoreCode(query.scoreCode)
      let search = `co.name like '${query.courseName || ''}%' AND te.name like '${query.teacherName || ''}%' ${sql_score}`
      connection.query(`SELECT ${totalRows} co.name courseName,te.name teacherName,te.id teacherId,sc.score,co.id courseId,sc.id scoreId,
        sc.updatedBy,sc.createdAt,sc.updatedAt
        FROM courses co, teachers te, scores sc WHERE co.id in (${courseIds}) AND
        co.teacherId=te.id AND sc.studentId=${query.id} AND sc.courseId = co.id AND ${search}
        ORDER BY co.createdAt DESC ${getLimitStr(query)};
        ${selectTotal}`, function (error2, results2) {
        if (error2) throw error2
        results2[1] = {totalCount: results2[1][0].totalCount}
        res.json({message: 'ok', status: 0, data: results2})
      })
    })
  })
})
/*学生导出成绩*/
studentRouter.post(studentsInterfaces.exportScores, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  let body = filterQuery(req.body)
  let scoreIds = body.scoreIds
  getLog('post-->students/exportScore: ', body)
  let sql_score_id = ''
  if (!Array.isArray(scoreIds)) return res.json({message: '参数scoreIds须为数组', status: 4066})
  let scoreConf
  if (!(body.all && body.all === 1)) {
    sql_score_id = `AND sc.id in (${scoreIds.join(',') || 0})`
    scoreConf = paramsConfig.scoreIds
  }
  if (!checkParams(res, [paramsConfig.id, scoreConf], body, 4098)) return
  querySql(function (connection) {
    connection.query(`SELECT co.name courseName,co.id courseId,te.name teacherName,te.id teacherId,sc.score,
        sc.updatedBy,sc.createdAt,sc.updatedAt
        FROM courses co, teachers te, scores sc WHERE co.teacherId=te.id AND sc.studentId=${body.id} ${sql_score_id} AND 
        sc.courseId = co.id ORDER BY co.createdAt DESC ${getLimitStr(body)};`, function (error, results) {
      if (error) throw error
      let conf = {}
      conf.cols = studentExportScoreCol
      conf.rows = getExcelData(results)
      let r = nodeExcel.execute(conf)
      setExcelType(res)
      res.end(r, 'binary')
    })
  })
})
/*学生退选课程*/
studentRouter.post(studentsInterfaces.unselectCourse, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  let body = req.body
  getLog('post-->students/deleteCourse: ', body)
  if (!checkParams(res, [paramsConfig.id, paramsConfig.courseId], body, 4004)) return
  querySql(function (connection) {
    connection.query(`SELECT score FROM scores WHERE studentId=${body.id} AND courseId=${body.courseId}`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '您未选择此课程', status: 4011})
      results = results.flat(1)
      if (results[0].score > -1) return res.json({message: '此课程已考试，无法退选', status: 4012})
      connection.query(`DELETE FROM scores WHERE studentId=? AND courseId=?;
        UPDATE courses SET selectedCount = selectedCount - 1 WHERE id = ?`,
        [body.id, body.courseId, body.courseId],
        function (error2, results2) {
          if (error2) throw error2
          if (results2[0].affectedRows > 0 && results2[1].affectedRows > 0) {
            res.json({message: '操作成功', status: 0})
          } else {
            res.json({message: '操作失败', status: 4007})
          }
        })
    })
  })
})
/*学生获取已发布课程*/
studentRouter.get(studentsInterfaces.selectAllCourses, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  let query = filterQuery(req.query)
  getLog('get-->students/allCourses: ', query)
  if (!checkParams(res, [paramsConfig.id], query, 4005)) return
  let search = `co.name like '${query.courseName || ''}%' ${query.courseId ? 'AND co.id = ' + query.courseId : ''}
    AND te.name like '${query.teacherName || ''}%' AND co.classroom like '${query.classroom}%'
    ${query.selectedCount ? 'AND co.selectedCount = ' + query.selectedCount : ''}
    ${query.maxCount ? 'AND co.maxCount = ' + query.maxCount : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} co.id courseId,co.name courseName,te.name teacherName,te.id teacherId,classroom,selectedCount,maxCount,
        co.updatedBy,co.createdAt,co.updatedAt
        FROM courses co,teachers te WHERE co.teacherId=te.id AND ${search} ORDER BY co.createdAt DESC ${getLimitStr(query)};
        ${selectTotal};SELECT courseId FROM scores where studentId = ${query.id}`,
      function (error, results) {
        if (error) return res.json({message: '数据查询失败', status: 4006})
        results[1] = {totalCount: results[1][0].totalCount}
        let courseIds = []
        results[2].forEach(i => {
          courseIds.push(i.courseId)
        })
        results[2] = {selectedCourseIds: courseIds}
        res.json({message: 'ok', status: 0, data: results})
      })
  })
})
/*学生选择课程*/
studentRouter.post(studentsInterfaces.selectCourse, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  let body = req.body
  getLog('post-->students/selectCourse: ', body)
  if (!checkParams(res, [paramsConfig.id, paramsConfig.courseId], body, 4018)) return
  querySql(function (connection) {
    connection.query(`SELECT count(1) scoreCount FROM scores WHERE studentId = ${body.id} AND courseId = ${body.courseId};
        SELECT count(1) selectedCount FROM scores WHERE studentId=${body.id} AND courseId = ${body.courseId};
        SELECT selectedCount,maxCount FROM courses WHERE id=${body.courseId}`,
      function (error, results) {
        if (error) return res.json({message: '查询数据失败', status: 4096})
        if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 4013})
        results = results.flat(1)
        if (!results[2]) return res.json({message: '暂无此课程', status: 4020})
        if (results[2].selectedCount >= results[2].maxCount) return res.json({message: '人数已达上限', status: 4017})
        if (results[1].selectedCount > 0) return res.json({message: '课程重复', status: 4014}) //分数表里重复
        if (results[0].scoreCount > 0) return res.json({message: '课程重复', status: 4016})
        connection.query(`UPDATE courses SET selectedCount = selectedCount+1 WHERE id = ${body.courseId};
            INSERT scores (studentId,courseId,score,createdBy) VALUES(?,?,?,?)`, [body.id, body.courseId, -1,
            decodeURIComponent(req.headers.name)],
          function (error2, results2) {
            if (error2) return res.json({message: '查询数据失败', status: 4097})
            if (results2[0].affectedRows < 1 || results2[1].affectedRows < 1) {
              res.json({message: '操作失败', status: 4015})
            } else {
              res.json({message: '操作成功', status: 0})
            }
          })
      })
  })
})
module.exports = studentRouter
