<script>
import axios from "axios";

const service = axios.create()

// 请求拦截器
service.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)  //返回错误
})

// 响应拦截器
service.interceptors.response.use(res => {
  return res
}, err => {
  return Promise.reject(err)  //返回错误
})


export default service

</script>