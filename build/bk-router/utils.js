let {scoreLevel} = require('./db')

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
  let level = req.headers['level']
  if (access.indexOf(level) > -1) return true
  return res.json({message: '无权访问', status: status || 1}) === 1
}

exports.checkParams = function (res, config, params, status) {
  let numReg = /^-?\d+$/
  status = status || 1
  for (let i = 0; i < config.length; i++) {
    let item = config[i]
    if (!item) continue
    let k = item.k
    let v = params[k]
    let max = item.max
    let min = item.min
    let type = item.type
    let m = item.m
    // let fixed = item.fixed  // 固定长度
    let validator = item.validator
    let reg = item.reg
    if (!v && (v !== 0)) return res.json({message: m || `参数${k}缺失`, status}) === 1 // res.json返回值为res，永远不会等于1，所以返回false
    if (validator) { // 校验函数优先
      let r = validator(v)
      if (!r.valid) {
        let m = r.m
        return res.json({message: m ? '参数' + k + m : `参数${k}非法`, status}) === 1
      }
    } else if (item.reg) { // 正则
      if (!reg.test(v)) return res.json({message: m || `参数${k}格式非法`, status}) === 1
    } else {
      // if (fixed && v.toString().length !== fixed) return res.json({message: `参数${k}长度须为${fixed}`, status}) === 1
      if (type) {
        if (type === 'string') { // 字符串
          // if (fixed) continue
          if (max && v.toString().length > max) {
            return res.json({message: m || `参数${k}的长度须小于或等于${max}`, status}) === 1
          } else if (min && v.toString().length < min) {
            return res.json({message: m || `参数${k}的长度须大于或等于${min}`, status}) === 1
          }
        } else if (type === 'array') { // 数组
          if (!Array.isArray(v)) return res.json({message: m || `参数${k}须为数组`, status}) === 1
          // for (let j = 0; j < v.length; j++) {
          //   if (!numReg.test(v[j])) return res.json({message: m || `参数${k}的子项须为整数`, status}) === 1
          // }
        } else if (type === 'email') { // 邮箱
          if (!/\w+@\w+.\w+$/.test(v)) return res.json({message: m || '邮箱格式错误', status}) === 1
          v = v.toString()
          if (max && v.length > max) {
            return res.json({message: m || `参数${k}的长度须小于或等于${max}`, status}) === 1
          } else if (min && v.length < min) {
            return res.json({message: m || `参数${k}的长度须大于或等于${min}`, status}) === 1
          }
        } else if (type === 'enum') { // 枚举
          if (item['enum'].indexOf(v) < 0) return res.json({message: m || `参数${k}的值非法`, status}) === 1
        } else if (type === 'date') { // 日期
          if (isNaN(new Date(v).valueOf())) return res.json({message: m || `参数${k}格式错误`, status}) === 1
        } else {
          throw Error('校验类型错误')
        }
      } else { //默认为整数
        if (!numReg.test(v)) return res.json({message: m || `参数${k}须为整数`, status}) === 1
        // if (fixed) continue
        if (min && v < min) {
          return res.json({message: m || `参数${k}须大于或等于${min}`, status}) === 1
        } else if (max && v > max) {
          return res.json({message: m || `参数${k}须小于或等于${max}`, status}) === 1
        }
      }
    }
  }
  return true
}

exports.getScoreSqlByScoreCode = function (code) {
  let sql_score = 'and '
  let scoreStr = scoreLevel[code]
  if (scoreStr) {
    sql_score += scoreStr
  } else {
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
  // res.setHeader('Content-Type', 'application/vnd.ms-excel') // application/vnd.openxmlformats
  // res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8')
  res.setHeader("Content-Disposition", "attachment; filename=scores.xlsx")
}
