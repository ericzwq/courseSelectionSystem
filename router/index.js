let express = require('express')
let {querySql} = require('./db.js')
let {checkNumParam} = require('./utils.js')
let bodyParser = require('body-parser')
let jwt = require('jsonwebtoken')
let router = express.Router()
router.use('/CourseSelectionSystem/views/', express.static('/CourseSelectionSystem/views/'));
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: false}))

router.get('/', function (req, res) {
  res.render('index.html')
})

function getJwt(body, level, expiresIn) {
  return jwt.sign({username: body.username, password: body.password}, level, {
    expiresIn,//过期时间
  })
}

/*登录*/
router.post('/api/login', function (req, res) {
  let body = req.body
  let level = body.level
  console.log('post-->login:username', body.username, 'password', body.password, 'level', level)
  if (level !== 'students' && level !== 'teachers' && level !== 'admins') {
    return res.json({message: '未知的身份', status: 1, notLogin: true})
  }
  querySql(function (connection) {
    connection.query(`SELECT password,id,phone,name FROM ${level} WHERE username = '${body.username}' LIMIT 1;`, function (error, results) {
      if (error) throw error
      if (results.length === 0) return res.json({message: '用户名不存在', status: 1})
      let sqlData = results[0]
      let password = sqlData.password
      if (body.password !== password) return res.json({message: '密码错误', status: 1})
      res.json({
        message: '登录成功',
        token: getJwt(body, level, 3600 * 12),
        // refreshToken: getJwt(body, level, 3600 * 24 * 7),
        status: 0,
        id: sqlData.id,
        phone: sqlData.phone,
        name: sqlData.name
      })//0 成功， 1 失败
    })
  })
})
/*注册-->学生邀请码111 教师222 管理员333*/
router.post('/api/register', function (req, res) {
  let body = req.body
  let invitation = parseInt(body.invitation)
  let level = body.level
  console.log('post-->register:', level, 'name', body.name, 'username', body.username, 'password', body.password, 'phone', body.phone, 'invitation', body.invitation)
  /*验证邀请码*/
  if ((level === 'students' && invitation !== 111) || (level === 'teachers' && invitation !== 222) ||
    (level === 'admins') && invitation !== 333) return res.json({message: '邀请码错误', status: 1})
  querySql(function (connection) {
    connection.query(`SELECT count(1) as count FROM ${body.level} WHERE username = '${body.username}'`, function (error, results) {
      if (error) throw error
      if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 1})
      if (results[0].count > 0) return res.json({message: '用户名已存在', status: 1})
      connection.query(`INSERT ${level}(name, phone, username,password) VALUES(?,?,?,?);`, [body.name, body.phone, body.username, body.password], function (error2, results2) {
        if (error2) throw error2
        if (results2.affectedRows > 0) {
          res.json({message: '注册成功', token: getJwt(body, level, 3600 * 12), status: 0, id: results2.insertId})
        } else {
          res.json({message: '注册失败', status: 1})
        }
      })
    })
  })
})
/*找回密码*/
router.post('/api/findPsw', function (req, res) {
  let body = req.body
  let level = body.level
  console.log('post-->findPsw:', level, 'username', body.username, 'phone', body.phone, 'password', body.password)
  querySql(function (connection) {
    connection.query(`SELECT count(1) as count,phone,id,name FROM ${level} WHERE username = ?`, [body.username], function (error, results) {
      if (error) throw error
      let sqlData = results[0]
      if (sqlData.count === 0) return res.json({message: '用户名不存在', status: 1})
      if (sqlData.phone !== body.phone) return res.json({message: '密保手机错误', status: 1})
      connection.query(`UPDATE ${level} SET password=? WHERE username=?`, [body.password, body.username], function (error2, results2) {
        if (error2) throw error2
        if (results2.affectedRows > 0) {
          res.json({
            message: '修改成功',
            token: getJwt(body, level, 3600 * 12),
            status: 0,
            id: sqlData.id,
            phone: sqlData.phone,
            name: sqlData.name
          })
        } else {
          res.json({message: '修改失败', status: 1})
        }
      })
    })
  })
})
/*修改密码*/
router.post('/api/updatePsw', function (req, res) {
  let body = req.body
  console.log('post-->updatePsw:id', body.id, 'level', body.level, 'oldPsw', body.oldPsw, 'newPsw', body.newPsw)
  if (!checkNumParam(body.id)) return res.json({message: '参数类型错误', status: 1})
  querySql(function (connection) {
    connection.query(`SELECT password FROM ${body.level} WHERE id = ${body.id}`, function (error, results) {
      if (error) throw error
      if (results.length === 0) return res.json({message: '身份错误', status: 1})
      if (results[0].password !== body.oldPsw) return res.json({message: '旧密码错误', status: 1})
      connection.query(`UPDATE ${body.level} SET password = ? WHERE id = ?`, [body.newPsw, parseInt(body.id)], function (error2, results2) {
        if (error2) throw error2
        if (results2.affectedRows > 0) {
          res.json({message: '修改成功', token: getJwt(body, level, 3600 * 12), status: 0})
        } else {
          res.json({message: '修改失败', status: 1})
        }
      })
    })
  })
})

router.use(require('./teachers.js'))
router.use(require('./students.js'))
router.use(require('./admins.js'))

module.exports = router