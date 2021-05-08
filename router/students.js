let {querySql,getLimitStr} = require('./db.js')
let {filterQuery, checkNumParam} = require('./utils.js')
let express = require('express')
let studentRouter = express.Router()
/*学生获取已选课程*/
studentRouter.get('/api/students/selectedCourses', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->students/selectedCourses:page', query.page, 'count', query.count, 'id', query.id)
  if (!checkNumParam(query.id)) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`SELECT selectedCourseId FROM students WHERE id = ${query.id}`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      let courseIds = results[0].selectedCourseId
      if (!courseIds) return res.json({message: '暂无数据', status: 0, data: [[], {totalCount: 0}]})
      connection.query(`SELECT courseName,teachers.name AS teacherName,score,courses.courseId FROM courses, teachers, scores WHERE courses.courseId in (${courseIds}) AND courses.teacherId=teachers.id AND scores.stuId=${query.id} AND scores.courseId = courses.courseId ORDER BY courses.created_at DESC ${getLimitStr(query)}; SELECT count(1) AS totalCount FROM courses WHERE courseId in (${courseIds});`, function (error2, results2) {
        if (error2) throw error2
        results2[1] = {totalCount: results2[1][0].totalCount}
        res.json({message: 'ok', status: 0, data: results2})
      })
    })
  })
})
/*学生退选课程*/
studentRouter.post('/api/students/deleteCourse', function (req, res) {
  let body = req.body
  console.log('post-->students/deleteCourse:id', body.id, 'courseId', body.courseId)
  if (!checkNumParam([body.id, body.courseId])) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`SELECT selectedCourseId FROM students WHERE id = ${body.id}; SELECT score FROM scores WHERE stuId=${body.id} AND courseId=${body.courseId}`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results = results.flat(1)
      let selectedIds = results[0].selectedCourseId
      if (!selectedIds) return res.json({message: '未选择此课程', status: 1})
      selectedIds = selectedIds.split(',')
      let courseIndex = selectedIds.indexOf(body.courseId + '')
      if (courseIndex < 0) return res.json({message: '未选择此课程', status: 1})
      if (results[1].score > -1) return res.json({message: '此课程已考试，无法退选', status: 1})
      selectedIds.splice(courseIndex, 1)
      let newCourseIds = selectedIds.join(',')
      connection.query(`UPDATE students SET selectedCourseId=? WHERE id=?; DELETE FROM scores WHERE stuId=? AND courseId=?`, [newCourseIds, body.id, body.id, body.courseId], function (error2, results2) {
        if (error2) throw error2
        if (results2[0].affectedRows > 0 && results2[1].affectedRows > 0) {
          res.json({message: '操作成功', status: 0})
        } else {
          res.json({message: '操作失败', status: 1})
        }
      })
    })
  })
})
/*学生获取已发布课程*/
studentRouter.get('/api/students/allCourses', function (req, res) {
  let query = filterQuery(req.query)
  console.log('get-->students/allCourses:page', query.page, 'count', query.count)
  querySql(function (connection) {
    connection.query(`SELECT courseId,courseName,teachers.name AS teacherName,classroom,selectedCount,maxCount FROM courses,teachers WHERE teacherId=teachers.id ORDER BY courses.created_at DESC ${getLimitStr(query)};SELECT count(1) AS totalCount FROM courses;SELECT selectedCourseId FROM students`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results[1] = {totalCount: results[1][0].totalCount}
      results[2] = {selectedCourseId: results[2][0].selectedCourseId}
      res.json({message: 'ok', status: 0, data: results})
    })
  })
})
/*学生选择课程*/
studentRouter.post('/api/students/selectCourse', function (req, res) {
  let body = req.body
  console.log('post-->students/selectCourse:courseId', body.courseId, 'stuId', body.id)
  if (!checkNumParam([body.id, body.courseId])) return res.json({message: '参数类型错误', status: 1})
  if (parseInt(body.courseId) !== parseInt(body.courseId)) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`SELECT selectedCourseId FROM students WHERE id = ${body.id}; SELECT count(1) AS selectedCount FROM scores WHERE stuId=${body.id} AND courseId = ${body.courseId};SELECT selectedCount,maxCount FROM courses WHERE courseId=${body.courseId}`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      results = results.flat(1)
      if (results[2].selectedCount >= results[2].maxCount) return res.json({message: '人数已达上限', status: 1})
      if (results[1].selectedCount > 0) return res.json({message: '课程重复', status: 1}) //分数表里重复
      let selectedCourseId = results[0].selectedCourseId
      if (!selectedCourseId) {
        selectedCourseId = body.courseId + ''
      } else {
        if (selectedCourseId.split(',').indexOf(body.courseId + '') > -1) return res.json({
          message: '课程重复',//已选id重复
          status: 1
        })
        selectedCourseId = selectedCourseId + ',' + body.courseId
      }
      connection.query(`UPDATE students SET selectedCourseId = '${selectedCourseId}' WHERE id = ${body.id}; UPDATE courses SET selectedCount = selectedCount+1 WHERE courseId = ${body.courseId}; INSERT scores (stuId,courseId,score) VALUES(?,?,?)`, [body.id, body.courseId, -1], function (error2, results2) {
        if (error2) throw error2
        if (results2[0].affectedRows < 1 || results2[1].affectedRows < 1) {
          res.json({message: '操作失败', status: 1})
        } else {
          res.json({message: '操作成功', status: 0})
        }
      })
    })
  })
})
module.exports = studentRouter