let mysql = require('mysql')
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hellowq',
  database: 'CourseSelection',
  multipleStatements: true,
  timezone: "08:00"
})
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
exports.totalRows = 'SQL_CALC_FOUND_ROWS'
exports.selectTotal = 'SELECT FOUND_ROWS() as totalCount'
exports.paramsConfig = {
  courseName: {k: 'courseName', max: 10, type: 'string'},
  classroom: {k: 'classroom', max: 10, type: 'string'},
  courseId: {k: 'courseId'},
  teacherId: {k: 'teacherId'},
  studentId: {k: 'studentId'},
  maxCount: {k: 'maxCount', min: 1, max: 999},
  // score: {k: 'score', min: 0, max: 100},
  teacherName: {k: 'teacherName', max: 10, type: 'string'},
  // phone: {k: 'phone', fixed: 11},
  studentName: {k: 'studentName', max: 10, type: 'string'},
  // id: {k: 'id'},
  level: {k: 'level', type: 'string'},
  username: {k: 'username', type: 'string', max: 18},
  password: {k: 'password', type: 'string', max: 18, min: 6},
  newPsw: {k: 'newPsw', type: 'string', max: 18, min: 6},
  oldPsw: {k: 'oldPsw', type: 'string', max: 18, min: 6},
  invitation: {k: 'invitation', type: 'string', max: 54, min: 3},
  name: {k: 'name', type: 'string', max: 18},
  scoreIds: {k: 'scoreIds', type: 'array'},
  scoreId: {k: 'scoreId'},
  sex: {k: 'sex', type: 'string', max: 1},
  materialId: {k: 'materialId'},
  email: {k: 'email', type: 'email', max: 18},
  isRegister: {k: 'isRegister', type: 'enum', enum: ['0', '1']},
  classTime: {k: 'classTime', type: 'date'}
}
exports.upScoreDetailsDir = './bk-assets/upload/scoreDetails'

let width = 20
exports.commonExportScoreCol = [
  {
    caption: '学生名',
    type: 'string',
    width
  },
  {
    caption: '学号',
    type: 'number',
    width
  },
  {
    caption: '课程名',
    type: 'string',
    width
  },
  {
    caption: '课程号',
    type: 'number',
    width
  },
  {
    caption: '教师名',
    type: 'string',
    width
  },
  {
    caption: '教师号',
    type: 'number',
    width
  },
  {
    caption: '分数',
    type: 'number',
    width
  },
  {
    caption: '开课时间',
    type: 'string',
    width
  },
  {
    caption: '修改人',
    type: 'string',
    width
  },
  {
    caption: '创建时间',
    type: 'string',
    width
  },
  {
    caption: '修改时间',
    type: 'string',
    width
  }
]

exports.studentExportScoreCol = [
  {
    caption: '课程名',
    type: 'string',
    width
  },
  {
    caption: '课程号',
    type: 'number',
    width
  },
  {
    caption: '教师名',
    type: 'string',
    width
  },
  {
    caption: '教师号',
    type: 'number',
    width
  },
  {
    caption: '分数',
    type: 'number',
    width
  },
  {
    caption: '开课时间',
    type: 'string',
    width
  },
  {
    caption: '修改人',
    type: 'string',
    width
  },
  {
    caption: '创建时间',
    type: 'string',
    width
  },
  {
    caption: '修改时间',
    type: 'string',
    width
  }
]
exports.Student = 'students'
exports.Teacher = 'teachers'
exports.Admin = 'admins'
exports.Course = 'courses'
exports.Score = 'scores'
exports.Material = 'materials'

let studentsPrefix = '/api/students/'
let teachersPrefix = '/api/teachers/'
let adminsPrefix = '/api/admins/'

/*
* /api/public     无需验证
* /api/code       需验证邮箱验证码
* /api/authCode   需验证用户名的邮箱验证码
* /api/qr         二维码，需验证token
* /api/...        需验证token
*/
let commonInterfaces = {
  login: '/api/public/login', // 登录
  register: '/api/code/register', // 注册
  verificationCode: '/api/public/verificationCode', // 注册获取邮箱验证码
  authVerificationCode: '/api/public/authVerificationCode', // 找回密码获取邮箱验证码(需认证用户名)
  findPsw: '/api/authCode/findPsw', // 找回密码(需认证用户名的验证码)
  updatePsw: '/api/updatePsw', // 修改密码
  exportStudentScore: '/api/exportStudentScores', // 老师，管理员导出学生成绩
  getScoreDetails: '/api/scoreDetails', // 学生,老师,管理员获取成绩详情
  deleteScoreDetail: '/api/deleteScoreDetail', // 老师，管理员删除成绩详情
  getQrPic: '/api/qrExportScore',// 学生，老师，管理员获取二维码导出图片
  qrExportScore: '/api/qr/exportScore', // 学生，老师，管理员二维码导出成绩
  getAllGradeDistributions: '/api/getAllGradeDistributions' // 老师，管理员获取全部成绩分布
}
exports.commonInterfaces = commonInterfaces
exports.studentsInterfaces = {
  getGradeDistributions: studentsPrefix + 'getGradeDistributions', // 获取成绩分布数据
  selectScores: studentsPrefix + 'myScores', // 查看成绩
  exportScores: studentsPrefix + 'exportScore', // 导出成绩
  unselectCourse: studentsPrefix + 'deleteCourse', // 退选课程
  selectAllCourses: studentsPrefix + 'allCourses', // 查询所有课程
  selectCourse: studentsPrefix + 'selectCourse', // 选择课程
}

exports.teachersInterfaces = {
  getAllCourses: teachersPrefix + 'allCourses', // 获取所有课程
  addCourse: teachersPrefix + 'addCourse', // 添加课程
  getStuScores: teachersPrefix + 'stuScores', // 获取学生成绩
  getTemplate: teachersPrefix + 'template', // 获取导入成绩模板
  upScoreFile: teachersPrefix + 'upScoreFile', // 上传成绩文件
  addScore: teachersPrefix + 'addScore', // 添加成绩
  addScoreDetail: teachersPrefix + 'upScoreDetail/:scoreId', // 添加成绩详情
  getAddedCourses: teachersPrefix + 'addedCourses', // 获取自己添加的课程
  updateCourse: teachersPrefix + 'updateCourse', // 修改自己添加的课程
}

exports.adminsInterfaces = {
  getTeacherCourses: adminsPrefix + 'teacherCourses', // 获取老师课程
  updateCourse: adminsPrefix + 'updateCourse', // 修改课程信息
  getAllScores: adminsPrefix + 'allScores', // 获取学生成绩
  updateScore: adminsPrefix + 'updateScore', // 修改学生成绩
  getAllTeachers: adminsPrefix + 'allTeachers', // 查询所有老师信息
  updateTeacherStatus: adminsPrefix + 'updateTeacherStatus', // 修改老师状态
  getAllStudents: adminsPrefix + 'allStudents', // 查询所有学生信息
  updateStudentStatus: adminsPrefix + 'updateStudentStatus', // 修改学生状态
  deleteCourse: adminsPrefix + 'deleteCourse', // 删除课程
}

exports.access = {
  ONLY_STUDENTS: ['students'],
  ONLY_TEACHERS: ['teachers'],
  ONLY_ADMINS: ['admins'],
  OVER_STUDENTS: ['students', 'teachers', 'admins'],
  OVER_TEACHERS: ['teachers', 'admins']
}

exports.scoreLevel = [
  'score >= 90',
  'score >= 80 and score < 90',
  'score >= 70 and score < 80',
  'score >= 60 and score < 70',
  'score >= 0 and score < 60',
  'score < 0',
]
