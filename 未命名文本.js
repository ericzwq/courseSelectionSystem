var express = require('express');
// var router = express.Router();
var app = express();
var multiparty = require('multiparty');//上传处理模块
var fs = require('fs'); //文件模块
var bodyParser = require('body-parser')//post请求解析
var path = require('path');//
var util = require('util');
var request = require('request');
// const moment = require('moment-timezone')
const mysql = require('mysql');
const { config } = require('process');
const e = require('express');
// moment.tz.setDefault("Asia/Shanghai");
//***********************************时间转换区******************************************* */
// let date = moment().format()//获取当前时间
// let mdate = moment(date, 'YYYY-MM-DD HH:mm:ss').valueOf();//转换成时间戳
// let newDate = moment(mdate).format('YYYY-MM-DD HH:mm') //转换时间


//************************************创建连接状态************************************************* */
const db = mysql.createConnection({
  host: '81.70.160.239',
  user: 'xcxsq',
  password: 'Wuzeyi123',
  port: '3306',
  database: 'xcxsq',
  useConnectionPooling: true
});
db.connect();
//条件查询数据
function checkData(data) {
  console.log(data)
  return new Promise((res, rej) => {
    let openid = data.openid;
    let table = data.table;
    var sql = `SELECT * FROM ${table} where openid = "${openid}"`;
    db.query(sql, function (err, result) {
      if (err) {
        console.log(err)
        console.log('error');
        return;
      }
      // console.log(result);
      res(result)
      console.log('e')
    });
  })
}
//全部查询数据
function allData(data) {
  console.log(data)
  //${data}.money,
  //money:result[i].money,
  return new Promise((res, rej) => {
    var sql = `
    SELECT  
    user.nickName,
    user.avatarUrl,
    user.label,
    ${data}.id,
    ${data}.openid,
    ${data}.content,
    ${data}.region,
    ${data}.school,
    ${data}.img,
    ${data}.comments,
    ${data}.like,
    ${data}.forwarding,
    ${data}.review,
    ${data}.teasingDate
    FROM 
    user
    INNER JOIN
    ${data}
    WHERE 
    user.openid=${data}.openid`;
    db.query(sql, function (err, result) {
      console.log(result)
      if (err) {
        console.log(err)
        console.log('error');
        return;
      }
      let data = []
      for (let i = 0; i < result.length; i++) {
        data.push({
          id: result[i].id,
          openid: result[i].openid,
          nickName: result[i].nickName,
          avatarUrl: result[i].avatarUrl,
          label: result[i].label,
          content: result[i].content,
          region: result[i].region,
          school: result[i].school,
          img: result[i].img.split(','),
          comments: result[i].comments,
          like: result[i].like,
          forwarding: result[i].forwarding,
          review: result[i].review,
          teasingDate: '2020-01-02 12:34'})
      }
      console.log(data)
      res(data)
    });
  })
}
//全部查询市场数据
function allGoodsData(data) {
  console.log(data)
  return new Promise((res, rej) => {
    var sql = `
    SELECT  
    user.nickName,
    user.avatarUrl,
    user.label,
    ${data}.id,
    ${data}.openid,
    ${data}.content,
    ${data}.region,
    ${data}.school,
    ${data}.img,
    ${data}.comments,
    ${data}.like,
    ${data}.forwarding,
    ${data}.review,
    ${data}.money,
    ${data}.teasingDate
    FROM 
    user
    INNER JOIN
    ${data}
    WHERE 
    user.openid=${data}.openid`;
    db.query(sql, function (err, result) {
      console.log(result)
      if (err) {
        console.log(err)
        console.log('error');
        return;
      }
      let data = []
      for (let i = 0; i < result.length; i++) {
        data.push({
          id: result[i].id,
          openid: result[i].openid,
          nickName: result[i].nickName,
          avatarUrl: result[i].avatarUrl,
          label: result[i].label,
          content: result[i].content,
          region: result[i].region,
          school: result[i].school,
          img: result[i].img.split(','),
          comments: result[i].comments,
          like: result[i].like,
          forwarding: result[i].forwarding,
          review: result[i].review,
          money:result[i].money,
          teasingDate: '2020-01-02 12:34'})
      }
      console.log(data)
      res(data)
    });
  })
}
//增加数据
function addUser(data, dataName) {
  return new Promise((res, reject) => {
    var addsql = 'INSERT INTO user(openid,nickName,avatarUrl) VALUES(?,?,?)';
    var addsqlparams = [data.openid, data.nickName, data.avatarUrl];
    db.query(addsql, addsqlparams, function (err, result) {
      if (err) {
        console.log(err)
        return;
      }
      res(result)
    })
  })
}

//添加发布数据模块
function addTeasing(data, dataName) {
  let tableName = dataName
  let datas = data
  console.log(datas);
  if (tableName = 'goodsData') {
    return new Promise((res, reject) => {
      var addsql = `INSERT INTO ${tableName}(openid,content,region,school,img,money,teasingDate) VALUES(?,?,?,?,?,?,?)`;
      var addsqlparams = [data.openid, data.content, data.region, data.school, data.img,data.money,data.date];
      console.log(addsqlparams)
      db.query(addsql, addsqlparams, function (err, result) {
        if (err) {
          console.log(err)
          return;
        }
        res(result)
      })
    })
  }else{
    return new Promise((res, reject) => {
      var addsql = `INSERT INTO ${tableName}(openid,content,region,school,img,teasingDate) VALUES(?,?,?,?,?,?)`;
      var addsqlparams = [data.openid, data.content, data.region, data.school, data.img, data.date];
      console.log(addsqlparams)
      db.query(addsql, addsqlparams, function (err, result) {
        if (err) {
          console.log(err)
          return;
        }
        res(result)
      })
    })
  }

}
//处理新用户
app.post('/api/user', (req, res) => {
  let userInfo = req.body;
  let data = {
    openid: userInfo.openid,
    nickName: userInfo.userInfo.nickName,
    avatarUrl: userInfo.userInfo.avatarUrl
  }
  let checkDatas = {
    openid: req.body.openid,
    table: 'user'
  }
  new Promise((es, ej) => {
    console.log(checkData)
    checkData(checkDatas).then(e => {
      console.log('a')
      console.log(e)
      if (e == '') {
        es()
      } else {
        ej()
      }
    })
  }).then(en => {
    console.log('b')
    addUser(data).then((data) => {
      if (data) {
        checkData(checkDatas).then(es => {
          console.log(es)
          res.send(es)
        })
      } else {
        res.send('创建未成功')
      }
    })
  }).catch(ej => {
    checkData(checkDatas).then(es => {
      console.log(es)
      res.send(es)
    })
  })

})

// 存在用户直接查询用户信息
app.get('/api/userChenck', (req, res) => {
  let checkDatas = {
    openid: req.query.openid,
    table: 'user'
  }
  checkData(checkDatas).then(e => {
    res.send(e)
  })
})
// 获取用户
app.get('/getSession', (req, res) => {
  let code = req.query.code;
  if (!code) {
    res.json(util.handleFail('cide不能为空', 10001));
  } else {
    let sessioUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=wx3ce1e263f12e8f9d&secret=acd2ec34fa9820cc8a6290660e23c23b&js_code=${code}&grant_type=authorization_code`
    // console.log(sessioUrl)
    request(sessioUrl, (err, response, body) => {
      console.log(body)
      res.send(body)
    })
  }
})

// 图片上传
app.post('/upload', function (req, res) {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({ uploadDir: './public/teasingFile/' });

  //上传完成后处理
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log('parse error: ' + err);
    }
    else {
      // console.log(files.file.path)
      let file = files.file
      let img = file[0].path.slice(6)
      var uploadedPath = file[0].path;
      var dstPath = './upload/picture/' + file[0].path;
      //重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function (err) {
        res.send(img)
      });
    }
  });
});
// 发布
app.post('/api/userTeasing', (req, res) => {
  let tData = req.body
  console.log(tData)
  let dataName = tData.modules
  // let img =  tData.releaseData.img.toString()
  let data = {
    openid: tData.releaseData.openid,//唯一id
    content: tData.releaseData.content,// 用户输入的内容
    region: tData.releaseData.region,//地区
    school: tData.releaseData.schoolName,//高校
    img: tData.releaseData.img.toString(),//图片
    money:tData.releaseData.money,// 钱
    comments: "",//评论内容1级
    like: 0,//点赞
    forwarding: 0,//转发
    review: 0,//差评
    date: mdate//时间戳
  }
  if (dataName == 1) {
    // console.log("前往发布模块")
    let tableName = 'teasingData'
    addTeasing(data, tableName).then(es => {
      // console.log(res)
      res.send('发布成功')

    })
  } else if (dataName == 2) {
    let tableName = 'goodsData'
    addTeasing(data, tableName).then(es => {
      // console.log(res)
      res.send('发布成功')

    })
  } else {
    let tableName = 'itemsData'
    addTeasing(data, tableName).then(es => {
      // console.log(res)
      res.send('发布成功')

    })
  }

})

//推荐
app.get('/api/recommended', (req, res) => {
  let data = 'teasingData'
  allData(data).then(es => {
    res.send(es)
  })
})
//市场
app.get('/api/market',(req,res)=>{
  let data = 'goodsData'
  allGoodsData(data).then(es => {
    res.send(es)
  })
})
/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
console.log(1)
app.listen('3000',()=>console.log('server is start'))
module.exports = app;
