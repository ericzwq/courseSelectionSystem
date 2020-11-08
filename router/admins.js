let {querySql, getLimitStr} = require('./db.js')
let {filterQuery, checkNumParam} = require('./utils.js')
let express = require('express')
let adminRouter = express.Router()
/*管理员获取老师课程信息*/
adminRouter.get('/api/admins/teacherCourses', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->admins/teacherCourses:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT courseId,courseName,teachers.name AS teacherName,classroom,selectedCount,maxCount,teachers.id AS teacherId FROM courses INNER JOIN teachers ON courses.teacherId=teachers.id ORDER BY courses.created_at DESC ${getLimitStr(query)}; SELECT count(1) as totalCount FROM courses`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*管理员编辑老师课程信息*/
adminRouter.post('/api/admins/updateCourse', function (req, res) {
  let body = req.body
  console.log('post-->admins/updateCourse:courseId', body.courseId, 'teacherId', body.teacherId, 'courseName', body.courseName, 'classroom', body.classroom, 'maxCount', body.maxCount)
  if (!checkNumParam([body.courseId, body.teacherId, body.maxCount])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`UPDATE courses SET courseName = ?,classroom  = ?,maxCount = ? WHERE courseId = ? AND teacherId=?`, [body.courseName, body.classroom, body.maxCount, body.courseId, body.teacherId], function (error, results) {
      if (error) throw error
      if (results.affectedRows > 0) {
        res.json({message: '修改成功', status: 0})
      } else {
        res.json({message: '修改失败', status: 1})
      }
    })
  })
})
/*管理员获取学生成绩*/
adminRouter.get('/api/admins/allScores', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->admins/allScores:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT courses.courseId,students.id AS stuId,score,courseName,students.name AS studentName,teachers.name AS teacherName FROM ((scores INNER JOIN courses ON scores.courseId=courses.courseId) INNER JOIN students ON students.id=scores.stuId) INNER JOIN teachers ON teachers.id=courses.teacherId ORDER BY scores.created_at DESC ${getLimitStr(query)}; SELECT count(1) as totalCount FROM scores`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*管理员修改学生成绩*/
adminRouter.post('/api/admins/updateScore', function (req, res) {
  let body = req.body
  console.log('post-->admins/updateScore:courseId', body.courseId, 'stuId', body.stuId, 'score', body.score)
  if (!checkNumParam([body.courseId, body.stuId, body.score])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`UPDATE scores SET score = ? WHERE courseId=? AND stuId=?`, [body.score, body.courseId, body.stuId], function (error, results) {
      if (error) throw error
      if (results.affectedRows > 0) {
        res.json({message: '修改成功', status: 0})
      } else {
        res.json({message: '修改失败', status: 1})
      }
    })
  })
})
/*管理员获取所有老师信息*/
adminRouter.get('/api/admins/allTeachers', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->admins/allTeachers:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT id AS teacherId,name AS teacherName,phone,username FROM teachers ORDER BY teachers.created_at DESC ${getLimitStr(query)}; SELECT count(1) as totalCount FROM teachers`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*管理员修改老师信息*/
adminRouter.post('/api/admins/updateTeacher', function (req, res) {
  let body = req.body
  console.log('post-->admins/updateTeacher:teacherId', body.teacherId, 'teacherName', body.teacherName, 'phone', body.phone)
  if (!checkNumParam([body.teacherId, body.phone])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`UPDATE teachers SET name=?,phone=? WHERE id=?`, [body.teacherName, body.phone, body.teacherId], function (error, results) {
      if (error) throw error
      if (results.affectedRows > 0) {
        res.json({message: '修改成功', status: 0})
      } else {
        res.json({message: '修改失败', status: 1})
      }
    })
  })
})
/*管理员获取所有学生信息*/
adminRouter.get('/api/admins/allStudents',function (req,res) {
  let query = filterQuery(req.query)
  console.log('get-->admins/allStudents:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT id AS stuId,name AS studentName,phone,username FROM students ORDER BY students.created_at DESC ${getLimitStr(query)}; SELECT count(1) as totalCount FROM students`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*管理员修改学生信息*/
adminRouter.post('/api/admins/updateStudent', function (req, res) {
  let body = req.body
  console.log('post-->admins/updateStudent:stuId', body.stuId, 'studentName', body.studentName, 'phone', body.phone)
  if (!checkNumParam([body.stuId, body.phone])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`UPDATE students SET name=?,phone=? WHERE id=?`, [body.studentName, body.phone, body.stuId], function (error, results) {
      if (error) throw error
      if (results.affectedRows > 0) {
        res.json({message: '修改成功', status: 0})
      } else {
        res.json({message: '修改失败', status: 1})
      }
    })
  })
})

module.exports = adminRouter