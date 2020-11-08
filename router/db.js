let mysql = require('mysql')
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hellowq',
  database: 'CourseSelection',
  multipleStatements: true,
});

exports.getLimitStr = function (query) {
  if (!query.page || !query.count) throw Error('参数错误')
  return `LIMIT ${(query.page - 1) * query.count},${query.count}`
}

exports.querySql = function (callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw err
    callback(connection)
    connection.release()
  })
}