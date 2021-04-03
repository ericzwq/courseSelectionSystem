import axios from 'axios'
import {Message, Loading} from "element-ui";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

let loading
let isProduction = process.env.NODE_ENV === 'production'
export let baseURL = isProduction ? 'http://api.cheesestudio.cn:3000/api/' : 'http://localhost:3000/api/'
export let fileURL = isProduction ? 'http://api.cheesestudio.cn:3000/' : 'http://localhost:3000/'
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
let instance = axios.create({
  baseURL,
  // baseURL: 'http://localhost:3000/api/',
  // baseURL: 'http://192.168.7.201:3000/api/',
  // baseURL: 'http://192.168.43.104:3000/api/',
  // headers: {Authorization: sessionStorage.getItem('token')}//只计算一次
})
instance.interceptors.request.use(config => {
  NProgress.start()
  loading = Loading.service({/*Vue.prototype.loaded*/
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.3)'
  })
  // config.headers['Content-Type'] = 'application/json;charset=GBK'
  config.headers.Authorization = sessionStorage.getItem('token')
  // config.headers['X-Refresh-Token'] = localStorage.getItem('refreshToken')
  config.headers['level'] = sessionStorage.getItem('level')
  config.headers['id'] = sessionStorage.getItem('id')
  config.headers['name'] = encodeURIComponent(sessionStorage.getItem('name'))
  return config
})
instance.interceptors.response.use(response => {
  NProgress.done()
  loading.close()
  let data = response.data
  if (data.notLogin) {
    location.href = location.origin + location.pathname + '#/login'
    // location.href = location.origin + '#/login'
  }
  if (data.status && data.status !== 0) {
    Message.error(data.message)
  }
  return response
}, error => {
  console.log(error)
  NProgress.done()
  loading.close()
  Message.error('系统繁忙，请稍后重试！')
  return Promise.reject(error)
})
export default instance
