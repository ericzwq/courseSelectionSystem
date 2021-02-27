import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/courseselection/index'},
  {path: '/login', component: () => import('@/components/common/login.vue'), meta: {title: '登录'}},
  {path: '/findPsw', component: () => import('@/components/common/findPsw.vue'), meta: {title: '找回密码'}},
  {path: '/register', component: () => import('@/components/common/register.vue'), meta: {title: '注册'}},
  {path: '/teachers', redirect: '/courseselection/index'},
  {path: '/students', redirect: '/courseselection/index'},
  {path: '/admins', redirect: '/courseselection/index'},
  {
    path: '/courseselection', component: () => import('@/courseselection.vue'), children: [
      {path: 'index', component: () => import('@/components/common/index.vue')},
      {
        path: 'logout',
        component: () => import('@/components/common/setting.vue'),
        meta: {title: '设置', auth: true, noLevel: true}
      },
      {
        path: 'updatePsw',
        component: () => import('@/components/common/updatePsw.vue'),
        meta: {title: '修改密码', auth: true, noLevel: true}
      },
      {
        path: 'teachers/allCourses',
        component: () => import('@/components/teachers/allCourses/allCourses.vue'),
        meta: {title: '所有课程', name: 'allCourses', auth: true}
      },
      {
        path: 'teachers/stuScores',
        component: () => import('@/components/teachers/stuScores/stuScores.vue'),
        meta: {title: '学生成绩', auth: true}
      },
      {
        path: 'teachers/scoreDetails',
        component: () => import('@/components/common/scoreDetails.vue'),
        meta: {title: '成绩详情', auth: true}
      },
      {
        path: 'teachers/addedCourses',
        component: () => import('@/components/teachers/addedCourses/addedCourses.vue'),
        meta: {title: '已发课程', auth: true}
      },
      {
        path: 'students/myScores',
        component: () => import('@/components/students/myScores/myScores.vue'),
        meta: {title: '查看成绩', auth: true}
      },
      {
        path: 'students/scoreDetails',
        component: () => import('@/components/common/scoreDetails.vue'),
        meta: {title: '成绩详情', auth: true}
      },
      {
        path: 'students/selectCourses',
        component: () => import('@/components/students/selectCourses/selectCourses.vue'),
        meta: {title: '选择课程', auth: true}
      },
      {
        path: 'admins/teachersCourses',
        component: () => import('@/components/admins/teacherCourses/teacherCourses.vue'),
        meta: {title: '老师课程', auth: true}
      },
      {
        path: 'admins/allScores',
        component: () => import('@/components/admins/allScores/allScores.vue'),
        meta: {title: '所有成绩', auth: true}
      },
      {
        path: 'admins/scoreDetails',
        component: () => import('@/components/common/scoreDetails.vue'),
        meta: {title: '成绩详情', auth: true}
      },
      {
        path: 'admins/allTeachers',
        component: () => import('@/components/admins/allTeachers/allTeachers.vue'),
        meta: {title: '所有老师', auth: true}
      },
      {
        path: 'admins/allStudents',
        component: () => import('@/components/admins/allStudents/allStudents.vue'),
        meta: {title: '所有学生', auth: true}
      },
      // {path: '/', redirect: '/courseselection/students/myScores'}
      {path: '/', redirect: '/courseselection/index'}
    ]
  },
  {path: '*', component: () => import('@/components/common/404.vue'), meta: {title: '404'}},
]
const router = new VueRouter({
  routes,
  linkActiveClass: 'now',
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  let oldPath = from.fullPath
  if (to.meta.auth && !sessionStorage.getItem('token')) {
    console.log('no token')
    return next('/login')
  }//没有token
  if (!to.meta.noLevel && to.meta.auth && !to.fullPath.includes(sessionStorage.getItem('level'))) { // 路由与session中身份不匹配
    console.log('wrong level')
    return next('/login')
  }
  if (to.fullPath === '/login') router.prePath = from.fullPath // 如果去登录页，则记录旧路由
  if (!router.oldRoute) {
    if (oldPath.includes('/admins')) {
      router.oldRoute = 'admins'
    } else if (oldPath.includes('/teachers')) {
      router.oldRoute = 'teachers'
    } else if (oldPath.includes('/students')) {
      router.oldRoute = 'students'
    } else {
      router.oldRoute = undefined
    }
  }
  // let oldRoute = oldPath.includes('/admins') ? 'admins' : (oldPath.includes('/teachers') ? 'teachers' : 'students')
  let path = to.fullPath
  if (path.includes('/logout') || path.includes('/updatePsw')) {
    router.route = router.oldRoute
  } else {
    router.route = path.includes('/admins') ? 'admins' : (path.includes('/teachers') ? 'teachers' : 'students')
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
