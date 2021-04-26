<template>
    <div class="login-body">
        <div class="login-container">
            <div class="head">
                <img class="logo" src="https://s.weituibao.com/1582958061265/mlogo.png" alt="logo" />
                <div class="name">
                    <div class="title">waiting shop</div>
                    <div class="tips">vue3.0 shop admin</div>
                </div>
            </div>
            <el-form :model="ruleForm" label-position="top" class="login-form" :rules="rules" ref="loginForm">
                <el-form-item label="账号" prop="username">
                    <!-- v-model.trim 校验 去除空格 -->
                    <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model.trim="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <div style="color: #333;">登录表示您已同意<a>《服务条款》</a></div>
                    <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
                    <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import md5 from 'js-md5'
import axios from '@/utils/axios'
import { localSet } from '@/utils'
import { useRouter } from 'vue-router'
export default {
    name: 'Login',
    setup(){
        const router = useRouter()
        const loginForm = ref(null)

        const state = reactive({
            //v-model绑定表单数据
            ruleForm: {
                username: '',
                password: ''
            },

            checked: true,
            //在el-form中通过 :rules="rules"绑定规则，rules里面的规则键名与每个el-form-item的prop值对应完成绑定
            rules: {
                username: [
                    { required: true, message: '账户不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur'}
                ]
            }
        })

        const submitForm = async () => {
            // ref数据必须通过xxx.value访问
            loginForm.value.validate((valid) => {
                // valid为true代表通过验证
                if (valid) {
                    axios.post('/adminUser/login',{
                        userName: state.ruleForm.username || '',
                        passwordMd5: md5(state.ruleForm.password)
                    }).then( res => {//Promise.then的第一个函数是resolved(成功)状态执行的回调函数，此处的res是axios.js中拦截器的返回值
                        localSet('token',res)
                        router.push({ path: '/' })
                    })

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }




        return{
            ...toRefs(state),
            submitForm,
            loginForm
        }
    }
}
</script>

<style scoped>
  .login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
    /* background-image: linear-gradient(25deg, #077f7c, #3aa693, #5ecfaa, #7ffac2); */
  }
  .login-container {
    width: 420px;
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
  }
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0 20px 0;
  }
  .head img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .head .title {
    font-size: 28px;
    color: #1BAEAE;
    font-weight: bold;
  }
  .head .tips {
    font-size: 12px;
    color: #999;
  }
  .login-form {
    width: 70%;
    margin: 0 auto;
  }
</style>
<style>
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .login-form .el-form-item {
    margin-bottom: 12px;
  }
</style>