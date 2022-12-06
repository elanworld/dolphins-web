<script>
import axios from "axios";

const service = axios.create()
// 请求拦截器
service.interceptors.request.use(config => {
  config.params.credentials = 'include'
  let storageSync = window.localStorage.getItem("Authorization");
  if (storageSync) {
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
    window.location.replace("/")
    window.location.reload()
  }
  return res
}, err => {
  return Promise.reject(err)  //返回错误
})

export default service
</script>