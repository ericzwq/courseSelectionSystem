let express = require('express')
let {
  querySql,
  paramsConfig,
  getLimitStr,
  selectTotal,
  totalRows,
  studentExportScoreCol,
  commonExportScoreCol,
  commonInterfaces,
  access,
  scoreLevel
} = require('./db.js')
let path = require('path')
let {
  getJwt,
  checkParams,
  filterQuery,
  getExcelData,
  setExcelType,
  getScoreSqlByScoreCode,
  accessControl
} = require('./utils.js')
let nodeExcel = require('excel-export')
let fs = require('fs')
let qrImg = require('qr-image')
// let bodyParser = require('body-parser')
let router = express.Router()
let nodemailer = require('nodemailer');
let emailUser = '1872757047@qq.com'
let transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465, // SMTP 端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: emailUser,
    //smtp密码
    pass: 'gghpyttasdhcfaae'
  }
})

// router.use('/CourseSelectionSystem/views/', express.static('/CourseSelectionSystem/views/'))
router.use('/bk-assets/', express.static(path.join(__dirname, '../bk-assets')))
// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({extended: false}))
let os = require('os')
let key = Object.keys(os.networkInterfaces())[0]
let ip = os.networkInterfaces()[key][1].address
router.get('/', function (req, res) {
  res.render('index.html')
})

let updatePswRouter = {to: '/courseselection/updatePsw', class: 't-slider-item el-icon-edit', content: '修改密码'}
let logoutRouter = {to: '/courseselection/logout', class: 't-slider-item el-icon-setting', content: '设置'}
let adminRouters = [
  {
    to: '/courseselection/admins/teachersCourses',
    class: 't-slider-item el-icon-chat-line-square',
    content: '老师课程'
  },
  {to: '/courseselection/admins/allScores', class: 't-slider-item el-icon-chat-line-square', content: '所有成绩'},
  {to: '/courseselection/admins/scoreDetails', class: 't-slider-item el-icon-postcard', content: '成绩详情'},
  {to: '/courseselection/admins/allTeachers', class: 't-slider-item el-icon-document-add', content: '所有老师'},
  {to: '/courseselection/admins/allStudents', class: 't-slider-item el-icon-document-add', content: '所有学生'},
  updatePswRouter,
  logoutRouter,
]
let teacherRouters = [
  {
    to: '/courseselection/teachers/allCourses',
    class: 't-slider-item el-icon-chat-line-square',
    content: '所有课程'
  },
  {to: '/courseselection/teachers/stuScores', class: 't-slider-item el-icon-s-data', content: '学生成绩'},
  {to: '/courseselection/teachers/scoreDetails', class: 't-slider-item el-icon-postcard', content: '成绩详情'},
  {to: '/courseselection/teachers/addedCourses', class: 't-slider-item el-icon-document-add', content: '已发课程'},
  updatePswRouter,
  logoutRouter,
]
let studentRouters = [
  {
    to: '/courseselection/students/myScores',
    class: 't-slider-item el-icon-chat-line-square',
    content: '查看成绩'
  },
  {to: '/courseselection/students/scoreDetails', class: 't-slider-item el-icon-postcard', content: '成绩详情'},
  {to: '/courseselection/students/selectCourses', class: 't-slider-item el-icon-document-add', content: '选择课程'},
  updatePswRouter,
  logoutRouter,
]

// 添加学生测试数据
router.get('/test/insertStudents', function (req, res) {
  querySql(function (connection) {
    let j = req.query.i
    let len = 400
    let sql_head = 'insert students(name, sex, phone, username, password) values'
    let sql_body = ''
    for (let i = 1; i <= len; i++) {
      sql_body += `('学生${j + ':' + i}', '${i % 2 === 0 ? '男' : '女'}', '15593749832', 'student${i * j}', '123456')${i < len ? ',' : ';'}`
    }
    connection.query(sql_head + sql_body, function (error, results) {
      if (error) throw error
      res.end('ok')
    })
  })
})
// 添加老师测试数据
router.get('/test/insertTeachers', function (req, res) {
  querySql(function (connection) {
    let j = req.query.i
    let sql_head = 'insert teachers(name,sex, username, phone, password) values'
    let sql_body = ''
    let len = 400
    for (let i = 1; i <= len; i++) {
      sql_body += `('教师${j + ':' + i}', '${i % 2 === 0 ? '男' : '女'}', 'teacher${i * j}', '18945948394', '123456')${i < len ? ',' : ';'}`
    }
    connection.query(sql_head + sql_body, function (error, results) {
      if (error) throw error
      res.end(sql_head + sql_body)
    })
  })
})
// 添加管理员测试数据
router.get('/test/insertAdmins', function (req, res) {
  let j = req.query.i
  querySql(function (connection) {
    let sql_head = 'insert into admins(name, sex, username, phone, password) values'
    let sql_body = ''
    let len = 400
    for (let i = 1; i <= len; i++) {
      sql_body += `('管理员${j + ':' + i}', '${i % 2 === 0 ? '男' : '女'}', 'admin${i * j}', '18948394839', '123456')${i < len ? ',' : ';'}`
    }
    connection.query(sql_head + sql_body, function (error, results) {
      if (error) throw error
      res.end('ok')
    })
  })
})
/*测试老师添加课程*/
router.get('/test/addCourses', function (req, res) {
  querySql(function (connection) {
    let j = req.query.i
    connection.query(`SELECT name FROM teachers WHERE id = ${j}`, function (error, results) {
      if (error) throw error
      if (results.length < 1) return res.end('no teacher id')
      let len = 20
      sql = `insert into courses(name, teacherId, classroom, selectedCount, maxCount, createdBy)
             values`
      for (let i = 1; i <= len; i++) {
        sql += `('课程${j + ':' + i}', ${j}, '教室${i}', 0, 100,'${results[0].name}')${i < len ? ',' : ';'}`
      }
      connection.query(sql, function (error2, results2) {
        if (error2) throw error2
        res.end('ok')
      })
    })
  })
})
/*测试学生选课*/
router.get('/test/selectCourses', function (req, res) {
  querySql(function (connection) {
    let j = req.query.i
    connection.query(`SELECT name FROM students WHERE id = ${j}`, function (error, results) {
      if (error) throw error
      if (results.length < 1) return res.end('no student id')
      let len = 20
      sql = `insert into scores(studentId, courseId, score, createdBy)
             values `
      for (let i = 1; i <= len; i++) {
        sql += `(${j}, ${Math.ceil(Math.random() * 171200)}, ${Math.ceil(Math.random() * 101) - 1},'${results[0].name}')${i < len ? ',' : ';'}`
      }
      connection.query(sql, function (error, results) {
        if (error) throw error
        res.end('ok')
      })
    })
  })
})
/*导出测试成绩*/
router.get('/test/export', function (req, res) {
  console.log('导出测试成绩')
  querySql(function (connection) {
    connection.query(`SELECT st.name studentName,
                             sc.studentId,
                             co.name courseName,
                             co.id   courseId,
                             te.name teacherName,
                             te.id   teacherId,
                             sc.score,
                             sc.updatedBy,
                             sc.createdAt,
                             sc.updatedAt
                      FROM ((scores sc INNER JOIN students st ON sc.studentId = st.id)
                          INNER JOIN courses co ON sc.courseId = co.id)
                               INNER JOIN teachers te ON te.id = co.teacherId
                      ORDER BY sc.updatedAt DESC
                      limit 0,40000`, function (error, results) {
      if (error) throw error
      let conf = {}
      let width = 20
      conf.cols = commonExportScoreCol
      conf.rows = getExcelData(results)
      let r = nodeExcel.execute(conf)
      setExcelType(res)
      res.end(r, 'binary')
    })
  })
})
/*登录*/
router.post(commonInterfaces.login, function (req, res) {
  let body = req.body
  let level = body.level
  if (!checkParams(res, [paramsConfig.level, paramsConfig.username, paramsConfig.password], body, 4055)) return
  if (level !== 'students' && level !== 'teachers' && level !== 'admins') {
    return res.json({message: '未知的身份', status: 4056, notLogin: true})
  }
  querySql(function (connection) {
    connection.query(`SELECT password,id,phone,email,name,status,sex FROM ${level} WHERE username = '${body.username}' LIMIT 1;`,
      function (error, results) {
        if (error) throw error
        if (results.length === 0) return res.json({message: '用户名不存在', status: 4057})
        let sqlData = results[0]
        let password = sqlData.password
        if (sqlData.status !== 1) return res.json({message: '账号已禁用！请联系管理员', status: 4084})
        if (body.password !== password) return res.json({message: '密码错误', status: 4058})
        res.json({
          message: '登录成功',
          token: getJwt(body, level + sqlData.id + encodeURIComponent(sqlData.name), 3600 * 12),
          // refreshToken: getJwt(body, level, 3600 * 24 * 7),
          routers: level === 'admins' ? adminRouters : level === 'teachers' ? teacherRouters : studentRouters,
          status: 0,
          id: sqlData.id,
          phone: sqlData.phone,
          email: sqlData.email,
          name: sqlData.name,
          sex: sqlData.sex
        })
      })
  })
})

function getVerificationCode(req, res, isAuth) {
  let query = req.query
  let email = query.email
  if (!checkParams(res, [paramsConfig.email, paramsConfig.isRegister], query, 4099)) return
  if (isAuth && !checkParams(res, [paramsConfig.username], query, 5004)) return // 非注册验证用户名
  let levels = ['students', 'teachers', 'admins']
  let sql = ''
  levels.forEach(i => {
    sql += `SELECT email FROM ${i} WHERE email = '${email}' ${isAuth ? 'AND username = \'' + query.username + '\'' : ''} LIMIT 1;`
  })
  querySql(function (connection) {
    connection.query(sql, function (error, results) {
      if (error) return res.json({message: '查询数据失败', status: 5002})
      if (!isAuth) { // 注册
        if (results.flat(Infinity).length > 0) return res.json({message: '该邮箱已注册', status: 5003})
      } else {
        if (results.flat(Infinity).length < 1) return res.json({message: '用户名与邮箱不匹配', status: 5005})
      }
      let code = Math.random().toString().substr(-6)
      console.log('code:', code, 'time:', new Date())
      let mailOptions = {
        from: emailUser, // 发件地址
        to: email, // 收件列表
        subject: '选课系统', // 标题
        //text和html两者只支持一种
        text: '您的验证码为：' + code + '，有效期为10分钟，请尽快使用', // 标题
        // html: '<b>Hello world ?</b>' // html 内容
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) return res.json({message: '发送失败', status: 5000})
        let secret = (isAuth ? query.username.toString() : email.toString()) + code
        let token = getJwt({username: query.username}, secret, 600)
        res.json({message: '验证码发送成功', status: 0, token})
      });
    })
  })
}

/*注册获取邮箱验证码*/
router.get(commonInterfaces.verificationCode, function (req, res) {
  getVerificationCode(req, res, false)
})
/*找回密码获取邮箱验证码*/
router.get(commonInterfaces.authVerificationCode, function (req, res) {
  getVerificationCode(req, res, true)
})
/*注册-->学生邀请码111 教师222 管理员333*/
router.post(commonInterfaces.register, function (req, res) {
  let body = req.body
  let invitation = body.invitation.toString()
  let level = body.level
  let username = body.username
  let email = body.email
  if (!checkParams(res, [paramsConfig.invitation, paramsConfig.level, paramsConfig.name, paramsConfig.username,
    paramsConfig.password, paramsConfig.sex, paramsConfig.email, {
      k: 'phone', reg: /^1\d{10}$/
    }], body, 4059)) return
  /*验证邀请码*/
  if ((level === 'students' && invitation !== '111') || (level === 'teachers' && invitation !== '222') ||
    (level === 'admins') && invitation !== '333') return res.json({message: '邀请码错误', status: 5009})
  querySql(function (connection) {
    connection.query(`SELECT username,email FROM ${body.level} WHERE username = '${username}' OR email = '${email}'`, function (error, results) {
      if (error) throw error
      // if (results.flat(Infinity).length === 0) return res.json({message: '暂无数据', status: 5010})
      for (let i = 0, l = results.length; i < l; i++) {
        if (results[i].username === username) {
          return res.json({message: '用户名已存在', status: 5011})
        } else if (results[i].email === email) {
          return res.json({message: '邮箱已存在', status: 5018})
        }
      }
      connection.query(`INSERT ${level}(name, sex, phone, email, username, password) VALUES(?,?,?,?,?,?);`,
        [body.name, body.sex, body.phone, email, username, body.password], function (error2, results2) {
          if (error2) throw error2
          if (results2.affectedRows > 0) {
            res.json({
              message: '注册成功',
              token: getJwt(body, level + results2.insertId + encodeURIComponent(body.name), 3600 * 12),
              status: 0,
              name: body.name,
              phone: body.phone,
              email: body.email,
              routers: level === 'admins' ? adminRouters : level === 'teachers' ? teacherRouters : studentRouters,
              id: results2.insertId,
              sex: body.sex
            })
          } else {
            res.json({message: '注册失败', status: 5012})
          }
        })
    })
  })
})
/*找回密码*/
router.post(commonInterfaces.findPsw, function (req, res) {
  let body = req.body
  let level = body.level
  if (!checkParams(res, [paramsConfig.level, paramsConfig.username, paramsConfig.password, paramsConfig.email], body, 4060)) return
  querySql(function (connection) {
    connection.query(`SELECT count(1) as count,phone,email,id,name,sex,status FROM ${level} WHERE username = ?`, [body.username],
      function (error, results) {
        if (error) throw error
        let sqlData = results[0]
        if (sqlData.count === 0) return res.json({message: '该用户不存在', status: 4061})
        if (sqlData.status !== 1) return res.json({message: '该账户已禁用！', status: 4085})
        if (sqlData.email !== body.email) return res.json({message: '邮箱与用户名不匹配', status: 4062})
        connection.query(`UPDATE ${level} SET password=? WHERE username=?`, [body.password, body.username], function (error2, results2) {
          if (error2) return res.json({message: '修改失败', status: 4063})
          if (results2.affectedRows > 0) {
            res.json({
              message: '修改成功',
              token: getJwt(body, level + sqlData.id + encodeURIComponent(sqlData.name), 3600 * 12),
              status: 0,
              routers: level === 'admins' ? adminRouters : level === 'teachers' ? teacherRouters : studentRouters,
              id: sqlData.id,
              phone: sqlData.phone,
              email: sqlData.email,
              name: sqlData.name,
              sex: sqlData.sex
            })
          }
        })
      })
  })
})
/*修改密码*/
router.post(commonInterfaces.updatePsw, function (req, res) {
  if (!accessControl(req, res, access.OVER_STUDENTS)) return
  let body = req.body
  let level = req.headers['x-level']
  body.level = level
  if (!checkParams(res, [paramsConfig.level, paramsConfig.newPsw, paramsConfig.oldPsw], body, 4064)) return
  querySql(function (connection) {
    let headers = req.headers
    connection.query(`SELECT password FROM ${level} WHERE id = ${headers.id}`, function (error, results) {
      if (error) return res.json({message: '修改失败', status: 4065})
      if (results.length === 0) return res.json({message: '身份错误', status: 4000})
      if (results[0].password !== body.oldPsw) return res.json({message: '旧密码错误', status: 4001})
      connection.query(`UPDATE ${level} SET password = ? WHERE id = ?`, [body.newPsw, parseInt(headers.id)], function (error2, results2) {
        if (error2) throw error2
        if (results2.affectedRows > 0) {
          res.json({
            message: '修改成功',
            token: getJwt(body, body.level + body.id + encodeURIComponent(headers['name']), 3600 * 12),
            status: 0
          })
        }
      })
    })
  })
})
/*老师，管理员查看成绩分布*/
router.get(commonInterfaces.getAllGradeDistributions, function (req, res) {
  if (!accessControl(req, res, access.OVER_TEACHERS)) return
  let query = req.query
  querySql(function (connection) {
    let sql = ''
    let {teacherName, studentId, studentName, courseName, teacherId, courseId} = query
    let innerStu = 'INNER JOIN students st ON st.id = sc.studentId'
    let innerCou = 'INNER JOIN courses co IGNORE INDEX(\`primary\`) ON co.id = sc.courseId'
    let innerTea = 'INNER JOIN teachers te ON te.id = co.teacherId'
    for (let i = 0, len = scoreLevel.length; i < len; i++) {
      sql += `SELECT count(1) level${i} FROM scores sc ${(studentId || studentName) ? innerStu : ''} ${(teacherName || courseName || teacherId) ? innerCou : ''} ${(teacherName ? innerTea : '')}
      WHERE ${scoreLevel[i]} ${studentId ? 'AND st.id = ' + studentId : ''} ${studentName ? 'AND st.name = \'' + studentName + '\'' : ''}
      ${courseName ? 'AND co.name = \'' + courseName + '\'' : ''} ${teacherName ? 'AND te.name = \'' + teacherName + '\'' : ''} ${teacherId ? 'AND co.teacherId = ' + teacherId : ''}
      ${courseId ? 'AND sc.courseId = ' + courseId : ''};`
    }
    // console.log(sql)
    connection.query(sql, function (error, results) {
      if (error) return res.json({message: '查询数据失败', status: 5023})
      res.json({data: results.flat(1), status: 0})
    })
  })
})
/*老师，管理员导出学生成绩*/
router.post(commonInterfaces.exportStudentScore, function (req, res) {
  if (!accessControl(req, res, access.OVER_TEACHERS)) return
  let body = filterQuery(req.body)
  let scoreIds = body.scoreIds
  let limit = req.headers['x-level'] === 'admins' ? 100000 : 10000
  let sql_score_id = ''
  if (!Array.isArray(scoreIds)) return res.json({message: '参数scoreIds须为数组', status: 4067})
  let scoreConf
  if (!(body.all && body.all === 1)) {
    sql_score_id = `sc.id in (${scoreIds.join(',') || 0}) AND`
    scoreConf = paramsConfig.scoreIds
  }
  let sql_student = (!body.studentCategory || parseInt(body.studentCategory) !== 2) ? '' : 'AND co.teacherId = ' + req.headers.id
  let sql_score = getScoreSqlByScoreCode(body.scoreCode)
  let search = `st.name like '${body.studentName || ''}%' AND co.name like '${body.courseName || ''}%'
    AND te.name like '${body.teacherName || ''}%' ${sql_score}`
  if (!checkParams(res, [scoreConf], body, 4069)) return
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} st.name studentName,sc.studentId,co.name courseName,co.id courseId,te.name teacherName,
    te.id teacherId,sc.score,co.classTime,sc.updatedBy,sc.createdAt,sc.updatedAt
    FROM ((scores sc INNER JOIN students st ON sc.studentId = st.id)
      INNER JOIN courses co IGNORE INDEX(\`primary\`) ON sc.courseId=co.id ${sql_student})
      INNER JOIN teachers te ON te.id = co.teacherId
      WHERE ${sql_score_id} ${body.studentId ? 'st.id = ' + body.studentId : "st.id >= ''"} AND ${search}
      LIMIT ${limit};`, function (error, results) {
      if (error) throw error
      let conf = {}
      conf.cols = commonExportScoreCol
      conf.rows = getExcelData(results)
      let r = nodeExcel.execute(conf)
      setExcelType(res)
      res.end(r, 'binary')
    })
  })
})
/*学生,老师,管理员获取成绩详情*/
router.get(commonInterfaces.getScoreDetails, function (req, res) {
  if (!accessControl(req, res, access.OVER_STUDENTS)) return
  let query = filterQuery(req.query)
  let level = req.headers['x-level']
  let id = req.headers.id
  let sql_student = (!query.studentCategory || parseInt(query.studentCategory) !== 2) ? '' : 'AND co.teacherId = ' + id
  let sql_score = getScoreSqlByScoreCode(query.scoreCode)
  let studentSearch = `${query.courseId ? 'sc.courseId = ' + query.courseId + ' AND' : ''} ma.fileName like '${query.fileName || ''}%'
    AND co.name like '${query.courseName || ''}%' AND te.name like '${query.teacherName || ''}%' ${sql_score}`
  let search = level !== 'students' ? studentSearch + ` AND st.name like '${query.studentName || ''}%'
    ${query.studentId ? 'AND st.id = ' + query.studentId : ''}` : studentSearch
  querySql(function (connection) {
    connection.query(`SELECT ${totalRows} st.name studentName,st.id studentId,co.name courseName,sc.courseId,
       ma.fileName,ma.size,ma.url,sc.score,te.name teacherName,co.teacherId,ma.id materialId,
       ma.updatedBy,ma.createdAt,ma.updatedAt
        FROM (((materials ma INNER JOIN scores sc ON ma.scoreId = sc.id)
        INNER JOIN students st ON sc.studentId = st.id ${level === 'students' ? `AND sc.studentId=${id}` : ''})
        INNER JOIN courses co ON sc.courseId = co.id ${level === 'teachers' ? sql_student : ''})
        INNER JOIN teachers te ON te.id = co.teacherId WHERE ${search}
        ORDER BY ma.updatedAt DESC ${getLimitStr(query)};${selectTotal}`,
      function (error, results) {
        if (error) return res.json({message: '查询数据失败', status: 4082})
        results[1] = {totalCount: results[1][0].totalCount}
        res.json({message: 'ok', status: 0, data: results})
      })
  })
})
/*老师，管理员删除成绩详情*/
router.post(commonInterfaces.deleteScoreDetail, function (req, res) {
  if (!accessControl(req, res, access.OVER_TEACHERS)) return
  let body = req.body
  let headers = req.headers
  let level = headers['x-level']
  let url = ''
  if (!checkParams(res, [paramsConfig.materialId], body, 4086)) return
  if (level !== 'teachers' && level !== 'admins') return res.json({message: '您无权删除！', status: 4089})
  querySql(function (connection) {
    connection.query(`SELECT ma.url,co.teacherId FROM materials ma INNER JOIN scores sc on sc.id = ma.scoreId INNER JOIN courses co
        ON sc.courseId = co.id WHERE ma.id = ${body.materialId}`, function (error, results) {
      if (results.length < 1) return res.json({message: '文件不存在！', status: 5020})
      if (level === 'teachers' && results[0]['teacherId'] !== +headers.id) return res.json({
        message: '此材料非您的学生所属，您无权删除！',
        status: 4087
      })
      url = results[0].url
      querySql(function (connection) {
        connection.query(`DELETE
                          FROM materials
                          WHERE id = ?`, [body.materialId],
          function (error, results) {
            if (results.affectedRows > 0) {
              fs.unlink(url, () => console.log('删除成绩详情文件'))
              res.json({message: '删除成功', status: 0})
            } else {
              res.json({message: '删除失败', status: 4088})
            }
          })
      })
    })
  })
})
/*学生，老师，管理员获取二维码导出图片*/
router.get(commonInterfaces.getQrPic, function (req, res) {
  if (!accessControl(req, res, access.OVER_STUDENTS)) return
  let headers = req.headers
  let query = req.query
  console.log('get-->qrExportScore:获取二维码 name', decodeURIComponent(headers.name), 'level', headers['x-level'], 'id', headers.id)
  let params = ''
  for (let k in query) {
    if ((query[k] || query[k] === 0) && k !== 'token' && k !== 'level' && k !== 'id' && k !== 'name') {
      params += `&${k}=${encodeURIComponent(query[k])}`
    }
  }
  let token = getJwt({}, headers['x-level'] + headers.id + headers.name, 600)
  let url = `http://${ip}:3000/api/qr/exportScore?authorization=${token}&level=${headers['x-level']}&id=${headers.id}&name=${headers.name}${params}`
  let img = qrImg.image(url, {size: 10, ec_level: 'H'}) // 容错30%
  res.writeHead(200, {'Content-Type': 'image/png'})
  res.token = token
  img.pipe(res)
  console.log(url)
})
/*学生，老师，管理员二维码导出成绩*/
router.get(commonInterfaces.qrExportScore, function (req, res) {
  // if (!accessControl(req, res, access.OVER_STUDENTS)) return
  let query = filterQuery(req.query)
  let level = query.level
  let limit = level === 'admins' ? 100000 : 10000
  let sql_score = getScoreSqlByScoreCode(query.scoreCode)
  let search = `st.name like '${query.studentName || ''}%' AND co.name like '${query.courseName || ''}%'
    AND te.name like '${query.teacherName || ''}%' ${sql_score}`
  let sql_select = `${level === 'students' ? '' : 'st.name studentName,studentId,'}co.name courseName,co.id courseId,te.name teacherName,
    te.id AS teacherId,sc.score,co.classTime,sc.updatedBy,sc.createdAt,sc.updatedAt`
  let sql_student = (!query.studentCategory || parseInt(query.studentCategory) !== 2) ? '' : 'AND co.teacherId = ' + query.id
  querySql(function (connection) {
    console.log('二维码导出中~')
    connection.query(`SELECT ${totalRows} ${sql_select}
    FROM ((scores sc INNER JOIN students st ON sc.studentId = st.id ${level === 'students' ? `AND sc.studentId=${query.id}` : ''})
      INNER JOIN courses co IGNORE INDEX(\`primary\`) ON sc.courseId=co.id ${level === 'teachers' ? sql_student : ''})
      INNER JOIN teachers te ON te.id = co.teacherId
      WHERE ${query.studentId ? 'st.id = ' + query.studentId : "st.id >= ''"} AND ${search}
      LIMIT ${limit};`, function (error, results) {
      if (error) return res.json({message: '查询数据失败', status: 4093})
      let conf = {}
      conf.cols = level === 'students' ? studentExportScoreCol : commonExportScoreCol
      conf.rows = getExcelData(results)
      let r = nodeExcel.execute(conf)
      setExcelType(res)
      res.end(r, 'binary')
      console.log('二维码导出完成')
    })
  })
})
router.use(require('./teachers.js'))
router.use(require('./students.js'))
router.use(require('./admins.js'))
router.get('*', function (req, res) {
  res.send('404')
})

module.exports = router
