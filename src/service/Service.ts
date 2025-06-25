/**
 * @typedef {Object} Service
 * @property {function(): void} service
 * @property {function(): void} setStorage
 * @property {function(): void} getStorage
 */

/** @type {Service} */
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';

const service = axios.create()
const router = useRouter();
// 请求拦截器
service.interceptors.request.use(config => {
  if (config.params)
    config.params.credentials = 'include'
  let storageSync = window.localStorage.getItem("Authorization");
  if (storageSync && !config.headers.Authorization) {
    config.headers.Authorization = storageSync
  }
  return config
}, err => {
  return Promise.reject(err)  //返回错误
})

// 响应拦截器
service.interceptors.response.use(res => {
  if (res.status === 200) {
    if (res?.headers?.Authorization) {
      window.localStorage.setItem("Authorization", res.header.Authorization)
    }
  }
  if (res.status === 203) {
    // window.location.replace("/")
    // window.location.reload()
    ElMessage('请登录再访问！')
      router.push('/');
    return Promise.reject('请登录再访问！')
  }
  if (res.status === 403) {
    // window.location.replace("/")
    // window.location.reload()
    ElMessage('您没有权限访问！')
    return Promise.reject('您没有权限访问！')
  }
  return res
}, err => {
  return Promise.reject(err)  //返回错误
})


const setStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value)
}
const getStorage = (key: string) => {
  return window.localStorage.getItem(key)
}

export { service, setStorage, getStorage };
