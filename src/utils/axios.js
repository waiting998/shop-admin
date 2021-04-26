import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
import { localGet } from './index'
import config from '~/config'

axios.defaults.baseURL = config[
    import.meta.env.MODE].baseUrl
axios.defaults.withCredentials = true
    // header 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截
axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        ElMessage.error('服务端异常!')
        return Promise.reject(res)
    }
    if (res.data.resultCode != 200) {
        if (res.data.ElMessage) {
            ElMessage.error(res.data.ElMessage)
        }
        if (res.data.resultCode == 419) { //返回419是未找到token  即未登录
            router.push({ path: '/login' })
        }
        ElMessage.error(res.data.message)
        return Promise.reject(res.data)
    }
    return res.data.data
})
export default axios