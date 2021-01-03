let {querySql, getLimitStr, totalRows, selectTotal, paramsConfig, adminsInterfaces, access} = require('./db.js')
let {filterQuery, checkParams, getLog, getScoreSqlByScoreCode, accessControl} = require('./utils.js')
let express = require('express')
let adminRouter = express.Router()
/*管理员获取老师课程信息*/
adminRouter.get(adminsInterfaces.getTeacherCourses, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let query = filterQuery(req.query)
  let search = `co.name like '${query.courseName || ''}%' ${query.courseId ? 'AND co.id = ' + query.courseId : ''}
    AND te.name like '${query.teacherName || ''}%' AND classroom like '${query.classroom || ''}%'`
  getLog('get-->admins/teacherCourses: ', query)
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} co.id courseId,co.name courseName,te.name teacherName,co.classroom,co.selectedCount,
        co.maxCount,te.id teacherId,co.updatedBy,co.createdAt,co.updatedAt 
        FROM courses co INNER JOIN teachers te ON co.teacherId=te.id AND ${search}
        ORDER BY co.updatedAt DESC ${getLimitStr(query)};${selectTotal}`,
      function (error, results) {
        if (error) return res.json({message: '查询数据失败', status: 4033})
        results[1] = {totalCount: results[1][0].totalCount}
        res.json({message: 'ok', status: 0, data: results})
      })
  })
})
/*管理员编辑老师课程信息*/
adminRouter.post(adminsInterfaces.updateCourse, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let body = req.body
  getLog('post-->admins/updateCourse: ', body)
  if (!checkParams(res, [paramsConfig.courseName, paramsConfig.classroom, paramsConfig.courseId,
    paramsConfig.teacherId, paramsConfig.maxCount], body, 4034)) return
  querySql(function (connection) {
    connection.query(`UPDATE courses SET courses.name = ?,classroom  = ?,maxCount = ?,updatedBy = ? WHERE courses.id = ?
        AND teacherId=?`,
      [body.courseName, body.classroom, body.maxCount, decodeURIComponent(req.headers.name), body.courseId, body.teacherId],
      function (error, results) {
        if (results && results.affectedRows > 0) {
          res.json({message: '修改成功', status: 0})
        } else {
          res.json({message: '修改失败', status: 4035})
        }
      })
  })
})
/*管理员获取学生成绩*/
adminRouter.get(adminsInterfaces.getAllScores, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let query = filterQuery(req.query)
  getLog('get-->admins/allScores: ', query)
  let sql_score = getScoreSqlByScoreCode(query.scoreCode)
  let search = `st.name like '${query.studentName || ''}%' AND co.name like '${query.courseName || ''}%'
    AND te.name like '${query.teacherName || ''}%' ${sql_score}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} st.name studentName,sc.studentId,sc.score,co.name courseName,sc.courseId,
    co.teacherId,te.name teacherName,sc.id scoreId,sc.updatedBy,sc.createdAt,sc.updatedAt
    FROM ((scores sc INNER JOIN students st ON sc.studentId = st.id)
      INNER JOIN courses co IGNORE INDEX(\`primary\`) ON sc.courseId=co.id)
      INNER JOIN teachers te ON te.id = co.teacherId
      WHERE ${query.studentId ? 'st.id = ' + query.studentId : "st.id >= ''"} AND ${search}
      ${getLimitStr(query)};${selectTotal};`, function (error, results) {
      if (error) return res.json({message: '数据查询失败', status: 4036})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*管理员修改学生成绩*/
adminRouter.post(adminsInterfaces.updateScore, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let body = req.body
  getLog('post-->admins/updateScore: ', body)
  if (!checkParams(res, [paramsConfig.courseId, paramsConfig.studentId, paramsConfig.score], body, 4054)) return
  querySql(function (connection) {
    connection.query(`UPDATE scores SET score = ?,updatedBy = ? WHERE courseId=? AND studentId=?`,
      [body.score, decodeURIComponent(req.headers.name), body.courseId, body.studentId],
      function (error, results) {
        if (results && results.affectedRows > 0) {
          res.json({message: '修改成功', status: 0})
        } else {
          res.json({message: '修改失败', status: 4037})
        }
      })
  })
})
/*管理员获取所有老师信息*/
adminRouter.get(adminsInterfaces.getAllTeachers, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let query = filterQuery(req.query)
  getLog('get-->admins/allTeachers: ', query)
  let search = `name like '${query.teacherName || ''}%' AND username like '${query.username || ''}%'
    ${query.teacherId ? 'AND id = ' + query.teacherId : ''} AND phone like '${query.phone || ''}%'
    ${query.status ? 'AND status = ' + query.status : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} id teacherId,name teacherName,phone,sex,username,status,createdAt,updatedAt,status
    FROM teachers WHERE ${search} ${getLimitStr(query)};${selectTotal}`, // ORDER BY updatedAt DESC
      function (error, results) {
        if (error) return res.json({message: '数据查询失败', status: 4038})
        results[1] = {totalCount: results[1][0].totalCount}
        res.json({message: 'ok', status: 0, data: results})
      })
  })
})
/*管理员改变老师状态*/
adminRouter.post(adminsInterfaces.updateTeacherStatus, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let body = req.body
  getLog('post-->admins/updateTeacher: ', body)
  if (!checkParams(res, [paramsConfig.id], body, 4039)) return
  querySql(function (connection) {
    connection.query(`SELECT status FROM teachers WHERE id = ${body.id}`, function (error, results) {
      if (results.length < 1) return res.json({message: '该用户不存在', status: 4090})
      let status = results[0].status === 0 ? 1 : 0
      connection.query(`UPDATE teachers SET status = ? WHERE id = ?`, [status, body.id], function (error2, results2) {
        if (results2 && results2.affectedRows > 0) {
          res.json({message: '操作成功', status: 0})
        } else {
          res.json({message: '操作失败', status: 4040})
        }
      })
    })
  })
})
/*管理员获取所有学生信息*/
adminRouter.get(adminsInterfaces.getAllStudents, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let query = filterQuery(req.query)
  getLog('get-->admins/allStudents: ', query)
  let search = `name like '${query.studentName || ''}%' AND username like '${query.username || ''}%'
    ${query.studentId ? 'AND id = ' + query.studentId : ''} AND phone like '${query.phone || ''}%'
    ${query.status ? 'AND status = ' + query.status : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} id studentId,name studentName,phone,sex,username,status,createdAt,updatedAt,status
        FROM students WHERE ${search}
        ${getLimitStr(query)}; ${selectTotal}`, function (error, results) {
      if (error) return res.json({message: '数据查询失败', status: 4041})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*管理员修改学生状态*/
adminRouter.post(adminsInterfaces.updateStudentStatus, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let body = req.body
  getLog('post-->admins/updateStudent: ', body)
  if (!checkParams(res, [paramsConfig.id], body, 4042)) return
  querySql(function (connection) {
    connection.query(`SELECT status FROM students WHERE id = ${body.id}`, function (error, results) {
      if (results.length < 1) return res.json({message: '该用户不存在', status: 4091})
      let status = results[0].status === 0 ? 1 : 0
      connection.query(`UPDATE students SET status = ? WHERE id = ?`, [status, body.id], function (error2, results2) {
        if (results2 && results2.affectedRows > 0) {
          res.json({message: '操作成功', status: 0})
        } else {
          res.json({message: '操作失败', status: 4043})
        }
      })
    })
  })
})
/*管理员删除课程*/
adminRouter.post(adminsInterfaces.deleteCourse, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let body = req.body
  getLog('post-->admins/deleteCourse: ', body)
  if (!checkParams(res, [paramsConfig.courseId], body, 4044)) return
  querySql(function (connection) {
    connection.query(`BEGIN;DELETE FROM courses WHERE id = ${body.courseId};DELETE FROM scores WHERE courseId = ${body.courseId}`,
      function (error, results) {
        if (error || results[1].affectedRows < 1) {
          connection.query('ROLLBACK;')
          return res.json({message: '删除失败', status: 4043})
        }
        connection.query('COMMIT;', function () {
          res.json({message: '删除成功', status: 0})
        })
      })
  })
})

module.exports = adminRouter
