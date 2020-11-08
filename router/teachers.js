let {querySql,getLimitStr} = require('./db.js')
let {filterQuery, checkNumParam} = require('./utils.js')
let express = require('express')
let teacherRouter = express.Router()
/*老师获取所有课程*/
teacherRouter.get('/api/teachers/allCourses', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->teachers/allCourses:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT courseName,teachers.name as teacherName,classroom,maxCount,selectedCount FROM courses INNER JOIN teachers WHERE courses.teacherId = teachers.id ORDER BY courses.created_at DESC ${getLimitStr(query)}; SELECT count(1) as totalCount FROM courses`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    });
  })
})
/*老师添加新课程*/
teacherRouter.post('/api/teachers/addCourse', function (req, res) {
  let body = req.body
  console.log('post-->teachers/addCourse:courseName', body.courseName, 'teacherId', body.teacherId, 'maxCount', body.maxCount, 'classroom', body.classroom)
  if (!checkNumParam([body.teacherId, body.maxCount])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`INSERT courses(courseName,teacherId,classroom,selectedCount,maxCount) values(?,?,?,?,?);`, [body.courseName, body.teacherId, body.classroom, 0, body.maxCount], function (error, results) {
      if (error) throw error
      if (results.affectedRows > 0) {
        res.json({message: '添加成功', status: 0})
      } else {
        res.json({message: '添加失败', status: 1})
      }
    })
  })
})
/*老师获取学生成绩*/
teacherRouter.get('/api/teachers/stuScores', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->teachers/stuScores:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT students.name as studentName,stuId,score,courseName,scores.courseId FROM scores INNER JOIN students ON scores.stuId = students.id
    INNER JOIN courses ON scores.courseId=courses.courseId ORDER BY scores.created_at DESC ${getLimitStr(query)}
    SELECT count(1) as totalCount FROM scores;`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*老师添加学生成绩*/
teacherRouter.post('/api/teachers/addScore', function (req, res) {
  let body = req.body
  console.log('post-->teachers/addScore:courseId', body.courseId, 'stuId', body.stuId, 'score', body.score)
  if (!checkNumParam([body.courseId, body.stuId, body.score])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`UPDATE scores SET score = ${body.score} WHERE stuId = ${body.stuId} AND courseId = ${body.courseId}`, function (error, results) {
      if (error) throw error
      if (results.affectedRows > 0) {
        res.json({message: '添加成功', status: 0})
      } else {
        res.json({message: '添加失败', status: 1})
      }
    })
  })
})
/*老师获取所有自己添加的课程信息*/
teacherRouter.get('/api/teachers/addedCourses', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->teachers/addedCourses:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT courseName,classroom,selectedCount,courseId FROM courses WHERE teacherId = ${query.teacherId} ORDER BY courses.created_at DESC ${getLimitStr(query)}; SELECT count(1) as totalCount FROM courses`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*老师修改自己添加的课程信息*/
teacherRouter.post('/api/teachers/updateCourse', function (req, res) {
  let body = req.body
  console.log('post-->teachers/updateCourse:courseId', body.courseId, 'teacherId', body.teacherId, 'courseName', body.courseName, 'classroom', body.classroom)
  if (!checkNumParam([body.courseId, body.teacherId])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`UPDATE courses SET courseName = ?,classroom  = ? WHERE courseId = ? AND teacherId=?`, [body.courseName, body.classroom, body.courseId, body.teacherId], function (error, results) {
      if (error) throw error
      if (results.affectedRows > 0) {
        res.json({message: '修改成功', status: 0})
      } else {
        res.json({message: '修改失败', status: 1})
      }
    })
  })
})

module.exports = teacherRouter