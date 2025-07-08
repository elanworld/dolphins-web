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
import api from "./Api.vue";

const service = axios.create()
const router = useRouter();
// 请求拦截器
service.interceptors.request.use(config => {
  if (config.params)
    config.params.credentials = 'include'
  const storageSync = window.localStorage.getItem("Authorization");
  if (storageSync && !config.headers.Authorization) {
    config.headers.Authorization = storageSync
  }
  if(config?.url && !config?.url?.startsWith("http")) {
    config.url = api.preLink + config.url
  }
  return config
}, err => {
  return Promise.reject(err)  //返回错误
})

// 响应拦截器
service.interceptors.response.use(res => {
  if (res.status === 200) {
    if (res?.headers?.Authorization) {
      window.localStorage.setItem("Authorization", res?.headers.Authorization)
    }
  }
  if (res.status === 203) {
    ElMessage('请登录再访问！')
    window.location.href = ("/dolphins-web/login")
    setStorage("Authorization", "")
    return Promise.reject('请登录再访问！')
  }
  return res
}, err => {
  if (err.response.status === 403) {
    ElMessage('您没有权限访问！')
    return Promise.reject('您没有权限访问！')
  }
  return Promise.reject(err)  //返回错误
})


const setStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value)
}
const getStorage = (key: string) => {
  return window.localStorage.getItem(key)
}

export { service, setStorage, getStorage };
