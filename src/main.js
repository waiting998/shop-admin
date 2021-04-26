import { createApp } from 'vue'
import App from './App.vue'
import { ElContainer, ElCard, ElAside, ElMenu, ElSubmenu, ElMenuItemGroup, ElMenuItem, ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElPopover, ElTag, ElCascader, ElRadio, ElUpload, ElRadioGroup, ElTable, ElTableColumn, ElLoading, ElPagination, ElPopconfirm, ElDialog, ElSelect, ElOption } from 'element-plus'
import router from './router'
// 修改后的主题样式必须放在最后面
import '../theme/index.css'

// 匹配订单状态文本内容
const orderStatus = {
    0: '待支付',
    1: '已支付',
    2: '配货完成',
    3: '出库成功',
    4: '交易成功',
    '-1': '手动关闭',
    '-2': '超时关闭',
    '-3': '商家关闭'
}


const app = createApp(App)
    // 注册全局过滤器 解决图片路径问题
app.config.globalProperties.$filters = {
    orderMap(status) {
        return orderStatus[status] || '未知状态'
    },
    prefix(url) {
        if (url && url.startsWith('http')) {
            return url
        } else {
            url = `http://backend-api-02.newbee.ltd${url}`
            return url
        }
    }
}
app.use(router)
app.use(ElContainer)
    .use(ElCard)
    .use(ElAside)
    .use(ElMenu)
    .use(ElSubmenu)
    .use(ElMenuItemGroup)
    .use(ElMenuItem)
    .use(ElForm)
    .use(ElFormItem)
    .use(ElInput)
    .use(ElButton)
    .use(ElCheckbox)
    .use(ElPopover)
    .use(ElTag)
    .use(ElCascader)
    .use(ElRadio)
    .use(ElUpload)
    .use(ElRadioGroup)
    .use(ElTable)
    .use(ElTableColumn)
    .use(ElLoading)
    .use(ElPagination)
    .use(ElPopconfirm)
    .use(ElDialog)
    .use(ElSelect)
    .use(ElOption)

app.mount('#app')