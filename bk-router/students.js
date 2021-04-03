let {
  querySql,
  getLimitStr,
  totalRows,
  selectTotal,
  paramsConfig,
  studentExportScoreCol,
  studentsInterfaces,
  access,
  scoreLevel
} = require('./db.js')
let {
  filterQuery,
  checkParams,
  getScoreSqlByScoreCode,
  getExcelData,
  setExcelType,
  accessControl
} = require('./utils.js')
let express = require('express')
let nodeExcel = require('excel-export')
let studentRouter = express.Router()
/*学生获取成绩分布数据*/
studentRouter.get(studentsInterfaces.getGradeDistributions, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  querySql(function (connection) {
    let sql = ''
    for (let i = 0, len = scoreLevel.length; i < len; i++) {
      sql += `SELECT count(1) level${i} FROM scores WHERE ${scoreLevel[i]} AND studentId = ${req.headers.id};`
    }
    connection.query(sql, function (error, results) {
      if (error) return res.json({message: '查询数据失败', status: 5022})
      res.json({data: results.flat(1), status: 0})
    })
  })
})
/*学生查看成绩*/
studentRouter.get(studentsInterfaces.selectScores, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  let query = filterQuery(req.query)
  let id = req.headers.id
  querySql(function (connection) {
    connection.query(`SELECT courseId FROM scores WHERE studentId = ${id}`, function (error, results) {
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
      connection.query(`SELECT ${totalRows} co.name courseName,te.name teacherName,te.id teacherId,sc.score,co.id courseId,sc.id scoreId,co.classTime,
        sc.updatedBy,sc.createdAt,sc.updatedAt
        FROM courses co, teachers te, scores sc WHERE co.id in (${courseIds}) AND
        co.teacherId=te.id AND sc.studentId=${id} AND sc.courseId = co.id AND ${search}
        ORDER BY co.createdAt DESC ${getLimitStr(query)};
        ${selectTotal}`, function (error2, results2) {
        if (error2) return res.json({message: '查询数据失败', status: 5021})
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
  let sql_score_id = ''
  if (!Array.isArray(scoreIds)) return res.json({message: '参数scoreIds须为数组', status: 4066})
  let scoreConf
  if (!(body.all && body.all === 1)) {
    sql_score_id = `AND sc.id in (${scoreIds.join(',') || 0})`
    scoreConf = paramsConfig.scoreIds
  }
  if (!checkParams(res, [scoreConf], body, 4098)) return
  let sql_score = getScoreSqlByScoreCode(body.scoreCode)
  let search = `co.name like '${body.courseName || ''}%' AND te.name like '${body.teacherName || ''}%' ${sql_score}`
  querySql(function (connection) {
    connection.query(`SELECT co.name courseName,co.id courseId,te.name teacherName,te.id teacherId,sc.score,co.classTime,
        sc.updatedBy,sc.createdAt,sc.updatedAt
        FROM courses co, teachers te, scores sc WHERE co.teacherId=te.id AND sc.studentId=${req.headers.id} ${sql_score_id} AND 
        sc.courseId = co.id AND ${search} ORDER BY co.createdAt DESC ${getLimitStr(body)};`, function (error, results) {
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
  if (!checkParams(res, [paramsConfig.courseId], body, 4004)) return
  querySql(function (connection) {
    connection.query(`SELECT classTime FROM scores sc INNER JOIN courses co ON co.id = sc.courseId WHERE sc.studentId=${req.headers.id} AND sc.courseId=${body.courseId}`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '您未选择此课程', status: 4011})
      results = results.flat(1)
      if (new Date(results[0].classTime).getTime() <= Date.now()) return res.json({
        message: '此课程已开课，无法退选',
        status: 4012
      })
      connection.query(`BEGIN;DELETE FROM scores WHERE studentId=? AND courseId=?;
        UPDATE courses SET selectedCount = selectedCount - 1 WHERE id = ?`,
        [req.headers.id, body.courseId, body.courseId],
        function (error2, results2) {
          if (error2 || results2[1].affectedRows < 1 || results2[2].affectedRows < 1) {
            connection.query('ROLLBACK;')
            res.json({message: '操作失败', status: 4007})
          } else {
            connection.query('COMMIT;', function () {
              res.json({message: '操作成功', status: 0})
            })
          }
        })
    })
  })
})
/*学生获取已发布课程*/
studentRouter.get(studentsInterfaces.selectAllCourses, function (req, res) {
  if (!accessControl(req, res, access.ONLY_STUDENTS)) return
  let query = filterQuery(req.query)
  let {courseId, maxCount} = query
  let search = `co.name like '${query.courseName || ''}%' ${courseId ? 'AND co.id = \'' + courseId + '\'' : ''}
    AND te.name like '${query.teacherName || ''}%' AND co.classroom like '${query.classroom}%'
    AND selectedCount like '${query.selectedCount || ''}%' ${maxCount ? 'AND co.maxCount = \'' + maxCount + '\'' : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} co.id courseId,co.name courseName,te.name teacherName,te.id teacherId,co.classroom,co.selectedCount,co.maxCount,co.classTime,
        co.updatedBy,co.createdAt,co.updatedAt
        FROM courses co,teachers te WHERE co.teacherId=te.id AND ${search} ORDER BY co.updatedAt DESC ${getLimitStr(query)};
        ${selectTotal}SELECT courseId FROM scores where studentId = ${req.headers.id}`,
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
  let headers = req.headers
  if (!checkParams(res, [paramsConfig.courseId], body, 4018)) return
  querySql(function (connection) {
    connection.query(`SELECT count(1) scoreCount FROM scores WHERE studentId = ${headers.id} AND courseId = ${body.courseId};
        SELECT selectedCount,maxCount,classTime FROM courses WHERE id=${body.courseId}`,
      function (error, results) {
        if (error) return res.json({message: '查询数据失败', status: 4096})
        if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 4013})
        results = results.flat(1)
        if (!results[1]) return res.json({message: '暂无此课程', status: 4020})
        if (new Date(results[1].classTime).getTime() <= Date.now()) return res.json({
          message: '该课程已开课,无法选择',
          status: 4016
        })
        if (results[1].selectedCount >= results[1].maxCount) return res.json({message: '人数已达上限', status: 4017})
        if (results[0].scoreCount > 0) return res.json({message: '课程重复', status: 4014}) // 分数表里重复
        connection.query(`BEGIN;UPDATE courses SET selectedCount = selectedCount+1 WHERE id = ${body.courseId};
            INSERT scores (studentId,courseId,score,createdBy) VALUES(?,?,?,?)`, [headers.id, body.courseId, -1,
            decodeURIComponent(headers.name)],
          function (error2, results2) {
            if (error2 || results2[1].affectedRows < 1 || results2[2].affectedRows < 1) {
              connection.query('ROLLBACK;')
              res.json({message: '操作失败', status: 4015})
            } else {
              connection.query('COMMIT;', function () {
                res.json({message: '操作成功', status: 0})
              })
            }
          })
      })
  })
})
module.exports = studentRouter
