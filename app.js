let express = require('express')
let router = require('./router/index.js')
let app = express();
let jwt = require('jsonwebtoken')
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type,Authorization,X-Level,X-Refresh-Token");//加Authorization防止跨域
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() === 'options')
    res.sendStatus(200);  //让options尝试请求快速结束
  else
    next();

})
app.engine('html', require('express-art-template'))
app.use((req, res, next) => {
  let url = req.url
  if (url.includes('/login') || url.includes('/register') || url.includes('/findPsw')) return next()
  let level = req.headers['x-level']
  // let refreshToken = req.headers['x-refresh-token']
  if (!url.includes('/updatePsw') && !url.includes(level)) return res.json({message: '身份错误', status: 1, notLogin: true})//修改密码不判断身份
  jwt.verify(req.headers.authorization, level, function (err, decoded) {
    if (err) {
      console.log('server:', level, ' token fail')
      return res.json({message: '验证失败', status: 1, notLogin: true})
    }
    next()
  })
})
app.use(router)
app.listen(3000, function () {
  console.log('start')
})