import axios from 'axios'
import {Message} from "element-ui";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
let instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  // baseURL: 'http://192.168.7.139:3000/api',
  // baseURL: 'http://192.168.1.114:3000/api',
  // headers: {Authorization: sessionStorage.getItem('token')}//只计算一次
})
instance.interceptors.request.use(config => {
  NProgress.start()
  // config.headers['Content-Type'] = 'application/json;charset=GBK'
  config.headers.Authorization = sessionStorage.getItem('token')
  // config.headers['X-Refresh-Token'] = localStorage.getItem('refreshToken')
  config.headers['X-Level'] = sessionStorage.getItem('level')
  config.headers['id'] = sessionStorage.getItem('id')
  config.headers['name'] = encodeURIComponent(sessionStorage.getItem('name'))
  return config
})
instance.interceptors.response.use(response => {
  NProgress.done()
  let data = response.data
  if (data.notLogin) {
    location.href = location.origin + '#/login'
  }
  if (data.status && data.status !== 0) {
    Message.error(data.message)
  }
  return response
}, error => {
  console.log(error)
  Message.error('系统繁忙，请稍后重试！')
  return Promise.reject(error)
})
export default instance
