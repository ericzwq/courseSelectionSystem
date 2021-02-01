let express = require('express')
let router = require('./bk-router/index.js')
let app = express()
let {filterQuery, getJwt} = require('./bk-router/utils.js')
let jwt = require('jsonwebtoken')
let bodyParser = require('body-parser')
let {querySql} = require('./bk-router/db')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type,Authorization,X-Level,id,name,X-Refresh-Token");//加Authorization防止跨域
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() === 'options')
    res.sendStatus(200);  //让options尝试请求快速结束
  else
    next();

})
// app.engine('html', require('express-art-template'))
app.use((req, res, next) => {
  let pathname = req._parsedUrl.pathname
  if (pathname.startsWith('/api/qr/')) { // 扫描二维码
    let query = filterQuery(req.query)
    jwt.verify(query.authorization, query.level + query.id + encodeURIComponent(query.name), function (err, decoded) {
      if (err) return res.json({message: '二维码已失效，请重新获取', status: 4092, notLogin: true})
      next()
    })
  } else if (pathname.startsWith('/api/public/') || pathname.startsWith('/bk-assets/')) { // 无需验证
    return next()
  } else if (pathname.startsWith('/api/code/')) { // 验证邮箱验证码
    let body = req.body
    let key = body.username + body.verificationCode
    jwt.verify(body.token, body.verificationCode, function (err, decoded) {
      if (err) {
        return res.json({message: '验证码错误', status: 5001})
      }
      next()
    })
  } else if (pathname.startsWith('/api/authCode/')) { // 验证带用户名的邮箱验证码
    let body = req.body
    console.log(body.username, body.verificationCode)
    jwt.verify(body.token, body.username.toString() + body.verificationCode, function (err, decoded) {
      if (err) {
        return res.json({message: '验证码错误', status: 5006})
      }
      next()
    })
  } else { // 一般情况登录验证
    let level = req.headers['x-level']
    let id = req.headers['id']
    let name = req.headers['name']
    if (!level || !id || !name) return res.json({message: '获取用户信息失败', status: 4067, notLogin: true})
    // let refreshToken = req.headers['x-refresh-token']
    jwt.verify(req.headers.authorization, level + id + name, function (err, decoded) {
      if (err) {
        console.log('server:', level, ' token fail')
        return res.json({message: '登录验证失败', status: 4017, notLogin: true})
      }
      querySql(function (connection) {
        connection.query(`SELECT status FROM ${level} WHERE id = ${id}`, function (error, results) {
          if (results.length < 1) return res.json({message: '用户不存在', status: 5007, notLogin: true})
          if (results[0]['status'] !== 1) return res.json({message: '账号已禁用！请联系管理员', status: 5008, notLogin: true})
          next()
        })
      })
    })
  }
})
app.use(router)
app.listen(3000, function () {
  console.log('start')
})
