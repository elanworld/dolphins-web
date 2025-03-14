import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import './assets/main.css'
import {Axios} from "axios";

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.config.globalProperties.Axios=Axios
app.mount('#app')
