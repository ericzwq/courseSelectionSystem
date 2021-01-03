let jwt = require('jsonwebtoken')

exports.filterQuery = function (query) {
  query.page = parseInt(query.page)
  query.count = parseInt(query.count)
  if (isNaN(query.page) || isNaN(query.count)) {
    query.page = 1
    query.count = 100
  }
  return query
}
exports.getJwt = function (body, secret, expiresIn) {
  return jwt.sign({username: body.username}, secret, {
    expiresIn,//过期时间
  })
}

exports.accessControl = function (req, res, access, status) {
  if (access.length < 1) return
  let level = req.headers['x-level']
  if (access.indexOf(level) > -1) return true
  res.json({message: '无权访问', status: status || 1})
  return false
}

exports.checkParams = function (res, config, params, status) {
  let numReg = /^\d+$/
  status = status || 1
  for (let i = 0; i < config.length; i++) {
    let item = config[i]
    if (!item) continue
    let k = item.k
    let v = params[k]
    let max = item.max
    let min = item.min
    let type = item.type
    let fixed = item.fixed  //固定长度
    if (!v) return res.json({message: `参数${k}缺失`, status}) === 1 // res.json返回值为res，永远不会等于1，所以返回false
    if (fixed && v.toString().length !== fixed) return res.json({message: `参数${k}长度须为${fixed}`, status}) === 1
    if (type && type === 'string') { // 字符串
      if (fixed) continue
      if (max && v.toString().length > max) {
        return res.json({message: `参数${k}的长度须小于${max}`, status}) === 1
      } else if (min && v.toString().length < min) {
        return res.json({message: `参数${k}的长度须大于${min}`, status}) === 1
      }
    } else if (type && type === 'array') {
      if (!Array.isArray(v)) return res.json({message: `参数${k}须为数组`, status}) === 1
      for (let j = 0; j < v.length; j++) {
        if (!numReg.test(v[j])) return res.json({message: `参数${k}的子项须为正整数`, status}) === 1
      }
    } else { //默认为正整数
      if (!numReg.test(v)) return res.json({message: `参数${k}须为正整数`, status}) === 1
      if (fixed) continue
      if (min && v < min) {
        return res.json({message: `参数${k}须大于${min}`, status}) === 1
      } else if (max && v > max) {
        return res.json({message: `参数${k}须小于${max}`, status}) === 1
      }
    }
  }
  return true
}

exports.getLog = function (head, body) {
  for (let k in body) {
    head = head + '|' + k + ': ' + body[k]
  }
  console.log(head)
}
exports.getScoreSqlByScoreCode = function (code) {
  let sql_score = 'and '
  switch (parseInt(code)) {
    case 1:
      sql_score += 'score >= 90'
      break
    case 2:
      sql_score += 'score between 80 and 89'
      break
    case 3:
      sql_score += 'score between 70 and 79'
      break
    case 4:
      sql_score += 'score between 60 and 69'
      break
    case 5:
      sql_score += 'score between 0 and 59'
      break
    case 6:
      sql_score += 'score < 0'
      break
    default:
      sql_score = ''
  }
  return sql_score
}
exports.getExcelData = function (data) {
  let datas = []
  data.forEach(i => {
    let arr = []
    for (let k in i) {
      arr.push(i[k])
    }
    datas.push(arr)
  })
  return datas
}
exports.setExcelType = function (res) {
  res.setHeader('Content-Type', 'application/vnd.ms-excel') // openxmlformats
  res.setHeader("Content-Disposition", "attachment; filename=" + "scores.xls")
}
