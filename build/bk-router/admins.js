let {querySql, getLimitStr, totalRows, selectTotal, paramsConfig, adminsInterfaces, access} = require('./db.js')
let {filterQuery, checkParams, getScoreSqlByScoreCode, accessControl} = require('./utils.js')
let express = require('express')
let adminRouter = express.Router()
/*管理员获取老师课程信息*/
adminRouter.get(adminsInterfaces.getTeacherCourses, function (req, res) {
  if (!accessControl(req, res, access.ONLY_ADMINS)) return
  let query = filterQuery(req.query)
  let {courseId, createdAtStart, createdAtEnd, classTimeStart, classTimeEnd} = query
  let search = `co.name like '${query.courseName || ''}%' ${courseId ? 'AND co.id = \'' + courseId + '\'' : ''}
    AND te.name like '${query.teacherName || ''}%' AND classroom like '${query.classroom || ''}%' ${createdAtStart && createdAtEnd ?
    `AND co.createdAt BETWEEN '${createdAtStart}' AND '${createdAtEnd}'` : ''} ${classTimeStart && classTimeEnd ?
    `AND co.classTime BETWEEN '${classTimeStart}' AND '${classTimeEnd}'` : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} co.id courseId,co.name courseName,te.name teacherName,co.classroom,co.selectedCount,
        co.maxCount,co.classTime,te.id teacherId,co.updatedBy,co.createdAt,co.updatedAt
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
  if (!checkParams(res, [paramsConfig.courseName, paramsConfig.classroom, paramsConfig.courseId, paramsConfig.classTime,
    paramsConfig.maxCount], body, 4034)) return
  querySql(function (connection) {
    connection.query(`UPDATE courses
                      SET courses.name = ?,
                          classroom    = ?,
                          maxCount     = ?,
                          classTime    = ?,
                          updatedBy    = ?
                      WHERE courses.id = ?`,
      [body.courseName, body.classroom, body.maxCount, body.classTime, decodeURIComponent(req.headers.name), body.courseId],
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
  let {studentId, createdAtStart, createdAtEnd, classTimeStart, classTimeEnd} = query
  let sql_score = getScoreSqlByScoreCode(query.scoreCode)
  let search = `st.name like '${query.studentName || ''}%' AND co.name like '${query.courseName || ''}%'
    AND te.name like '${query.teacherName || ''}%' ${sql_score} ${createdAtStart && createdAtEnd ?
    `AND sc.createdAt BETWEEN '${createdAtStart}' AND '${createdAtEnd}'` : ''} ${classTimeStart && classTimeEnd ?
    `AND co.classTime BETWEEN '${classTimeStart}' AND '${classTimeEnd}'` : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} st.name studentName,sc.studentId,sc.score,co.name courseName,sc.courseId,
    co.teacherId,te.name teacherName,sc.id scoreId,co.classTime,sc.updatedBy,sc.createdAt,sc.updatedAt
    FROM ((scores sc INNER JOIN students st ON sc.studentId = st.id)
      INNER JOIN courses co IGNORE INDEX(\`primary\`) ON sc.courseId=co.id)
      INNER JOIN teachers te ON te.id = co.teacherId
      WHERE ${studentId ? 'st.id = \'' + studentId + '\'' : "st.id >= ''"} AND ${search}
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
  if (!checkParams(res, [paramsConfig.courseId, paramsConfig.studentId, {
    k: 'score', validator: v => {
      if (!/^-?\d{1,3}(\.\d)?$/.test(v)) return {valid: false}
      v = +v
      if (v < 0 && v !== -1) return {valid: false}
      return {valid: v <= 100}
    }
  }], body, 4054)) return
  querySql(function (connection) {
    connection.query(`UPDATE scores
                      SET score     = ?,
                          updatedBy = ?
                      WHERE courseId = ?
                        AND studentId = ?`,
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
  let {phone, teacherId, email, status, createdAtStart, createdAtEnd} = query
  let search = `name like '${query.teacherName || ''}%'
    ${teacherId ? 'AND id = \'' + teacherId + '\'' : ''} ${phone ? 'AND phone = \'' + phone + '\'' : ''}
    ${email ? 'AND email like \'' + email + '%\'' : ''} ${status ? 'AND status = ' + status : ''} ${createdAtStart && createdAtEnd ?
    `AND createdAt BETWEEN '${createdAtStart}' AND '${createdAtEnd}'` : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} id teacherId,name teacherName,phone,email,sex,status,createdAt,updatedAt,status
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
  if (!checkParams(res, [paramsConfig.id], body, 4039)) return
  querySql(function (connection) {
    connection.query(`SELECT status FROM teachers WHERE id = ${body.id}`, function (error, results) {
      if (results.length < 1) return res.json({message: '该用户不存在', status: 4090})
      let status = results[0].status === 0 ? 1 : 0
      connection.query(`UPDATE teachers
                        SET status = ?
                        WHERE id = ?`, [status, body.id], function (error2, results2) {
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
  let {phone, studentId, email, status, studentName, createdAtStart, createdAtEnd} = query
  let search = `name like '${studentName || ''}%'
    ${studentId ? 'AND id = \'' + studentId + '\'' : ''} ${phone ? 'AND phone = \'' + phone + '\'' : ''}
    ${email ? 'AND email like \'' + email + '%\'' : ''} ${status ? 'AND status = ' + status : ''} ${createdAtStart && createdAtEnd ?
    `AND createdAt BETWEEN '${createdAtStart}' AND '${createdAtEnd}'` : ''}`
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} id studentId,name studentName,phone,email,sex,status,createdAt,updatedAt,status
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
  if (!checkParams(res, [paramsConfig.id], body, 4042)) return
  querySql(function (connection) {
    connection.query(`SELECT status FROM students WHERE id = ${body.id}`, function (error, results) {
      if (results.length < 1) return res.json({message: '该用户不存在', status: 4091})
      let status = results[0].status === 0 ? 1 : 0
      connection.query(`UPDATE students
                        SET status = ?
                        WHERE id = ?`, [status, body.id], function (error2, results2) {
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
  if (!checkParams(res, [paramsConfig.courseId], body, 4044)) return
  querySql(function (connection) {
    connection.query(`BEGIN;DELETE FROM courses WHERE id = ${body.courseId};DELETE FROM scores WHERE courseId = ${body.courseId}`,
      function (error, results) {
        if (error || results[1].affectedRows < 1) {
          connection.query('ROLLBACK;')
          return res.json({message: '删除失败', status: 4043})
        } else {
          connection.query('COMMIT;', function () {
            res.json({message: '删除成功', status: 0})
          })
        }
      })
  })
})

module.exports = adminRouter
