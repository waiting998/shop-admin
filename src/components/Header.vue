<template>
    <div class="header">
        <div class="left">
            <i v-if="hasBack" class="el-icon-back" @click="back"></i>
            <span style="font-size: 20px">{{ name }}</span>
        </div>
        <div class="right">
            <el-popover
                placement="top"
                :width="320"
                trigger="click"
                popper-class="popper-user-box"
            >
                <template #reference>
                    <div class="author">
                        <i class="icon el-icon-s-custom"></i>
                        {{ userInfo && userInfo.nickName || '' }}
                        <i class="el-icon-caret-bottom"></i>
                    </div>
                </template>
                <div class="nickname">
                    <p>登录名：{{ userInfo && userInfo.loginUserName || ''}}</p>
                    <p>昵称：{{ userInfo && userInfo.nickName || ''}}</p>
                    <el-tag size="small" effect="dark" class="logout" @click="logout">退出</el-tag>
                </div>
            </el-popover>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { pathMap, localRemove} from '@/utils'
import axios from '@/utils/axios'
export default {
    name: 'Header',
    setup(){

        const router = useRouter()

        const state = reactive({
            name: 'page name',
            userInfo: null,
            hasBack: false
        })

        onMounted(() => {
            //地址栏url通过/分割
            const pathname = window.location.hash.split('/') || ''
            console.log('pathname:',pathname)
            //排除登录页面 未登录是没有登录信息的
            if(!['login'].includes(pathname)){
              getUserInfo()
            }
        })

        const getUserInfo = async () => {
            const userInfo = await axios.get('/adminUser/profile')
            state.userInfo = userInfo
        }


        const back = () => {
            router.back()
        }

        const logout = () => {
          axios.delete('/logout').then(() => {
            localRemove('token')
            router.push({ path: '/login'})
          })
        }

        router.afterEach(to => {
          console.log('to' ,to)
          const { id }  = to.query
          // to.name 返回跳转路由的name
          state.name = pathMap[to.name]
          // add+参数 就是编辑商品
          if(id && to.name== 'add'){
            state.name = '编辑商品'
          }
          // 判断数组里面的路由名 决定是否有返回按钮
          state.hasBack = ['level2','level3','order_detail'].includes(to.name)

        })

        return{
            ...toRefs(state),
            back,
            logout
        }
    }
}
</script>

<style scoped>
  .header {
    height: 50px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  .el-icon-back {
    border: 1px solid #e9e9e9;
    padding: 4px;
    border-radius: 50px;
    margin-right: 10px;
  }
  .right > div > .icon{
    font-size: 18px;
    margin-right: 6px;
  }
  .author {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
<style>
  .popper-user-box {
    background: url('https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png') 50% 50% no-repeat!important;
    background-size: cover!important;
    border-radius: 0!important;
  }
  .popper-user-box .nickname {
    position: relative;
    color: #ffffff;
  }
  .popper-user-box .nickname .logout {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
</style>