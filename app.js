let express = require('express')
let router = require('./bk-router/index.js')
let app = express()
let {filterQuery, getJwt} = require('./bk-router/utils.js')
let jwt = require('jsonwebtoken')
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
  if (pathname.includes('/qr/')) {
    let query = filterQuery(req.query)
    jwt.verify(query.authorization, query.level + query.id + encodeURIComponent(query.name), function (err, decoded) {
      if (err) return res.json({message: '二维码已失效，请重新获取', status: 4092, notLogin: true})
      next()
    })
  } else {
    if (pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/findPsw') || pathname.includes('/test/') || pathname.includes('/bk-assets/')) return next()
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
      next()
    })
  }
})
app.use(router)
app.listen(3000, function () {
  console.log('start')
})
