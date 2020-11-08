import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
let instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  // headers: {Authorization: sessionStorage.getItem('token')}//只计算一次
})
instance.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  // config.headers['X-Refresh-Token'] = localStorage.getItem('refreshToken')
  config.headers['X-Level'] = sessionStorage.getItem('level')
  return config
})
instance.interceptors.response.use(response => {
  NProgress.done()
  if (response.data.notLogin) {
    console.log('browser:no token')
    location.href = location.origin + '#/login'
  }
  return response
}, error => {
  return Promise.reject(error)
})
export default instance