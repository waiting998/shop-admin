<template>
  <div class="layout">
    <el-container v-if="showMenu" class="container">
      <el-aside class="aside">
        <div class="head">
          <div>
            <img src="https://s.weituibao.com/1582958061265/mlogo.png" alt="logo" />
            <span>waiting shop</span>
          </div>
        </div>
        <div class="line"></div>
        <el-menu
          :default-openeds="defaultOpen"
          background-color="#222832"
          text-color="#fff"
          :router="true"
          :default-active="currentPath"
        >
          <!-- :default-openeds 默认打开的菜单，数组，可多选 -->
          <!-- :router="true" 启用vue-router模式，启用后，el-menu-item 绑定的index为要跳转的路由 -->
          <!-- :default-active 绑定的值为string，绑定el-menu-item绑定的index的值 
                来设置默认的当前选中的菜单,相当于element内部会记录一个active，
                active的值大概是el-menu-item绑定的index，也就是说如果index绑定的都一样，
                只要是绑定的index跟active记录值一样就会是选中状态
          -->
          <el-submenu index="1">
            <template #title>
              <span>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/introduce"><i class="el-icon-data-line" />系统介绍</el-menu-item>
              <el-menu-item index="/dashboard"><i class="el-icon-odometer" />Dashboard</el-menu-item>
              <el-menu-item index="/add"><i class="el-icon-plus" />添加商品</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template #title>
              <span>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swiper"><i class="el-icon-picture" />轮播图配置</el-menu-item>
              <el-menu-item index="/hot"><i class="el-icon-star-on" />热销商品配置</el-menu-item>
              <el-menu-item index="/new"><i class="el-icon-sell" />新品上线配置</el-menu-item>
              <el-menu-item index="/recommend"><i class="el-icon-thumb" />为您推荐配置</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template #title>
              <span>模块管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/category"><i class="el-icon-menu" />分类管理</el-menu-item>
              <el-menu-item index="/good"><i class="el-icon-s-goods" />商品管理</el-menu-item>
              <el-menu-item index="/guest"><i class="el-icon-user-solid" />会员管理</el-menu-item>
              <el-menu-item index="/order"><i class="el-icon-s-order" />订单管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template #title>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/account"><i class="el-icon-lock" />修改密码</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </el-container>
    </el-container>
    <el-container v-else class="container">
      <router-view /> 
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useRouter }  from "vue-router"
import { reactive, toRefs } from 'vue';
import { pathMap, localGet } from '@/utils'
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  setup(){
    const noMenu = ['/login']
    const router = useRouter()
    const state = reactive({
      showMenu: true,
      currentPath: '/introduce',
      defaultOpen:['1','2','3','4']
    })

    // login的页面不同于其他页面，这里利用router钩子做处理
    router.beforeEach((to,from,next) => {
      if(to.path == '/login'){
        //router钩子 to.path 判断路由是否跳转到login，如果是则正常执行
        next()
      }else{
        console.log('token:',localGet('token'))
        // 如果不是 ，就判断是否登录了有token，如果有则继续执行
        if(localGet('token')){
          next()
        }else{
          // 没有token则是没登录，需要跳转到登录页面
          next({ path: '/login' })
        }
      }
      // 通过判断路由即将要跳转的路径，改变showMenu的值来切换界面显示
      state.showMenu = !noMenu.includes(to.path)
      // 修改el-menu的default-active值
      state.currentPath = to.path
      // 修改page title
      document.title = pathMap[to.name]
    })

    return{
      ...toRefs(state)
    }
  }
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}
.container {
  height: 100vh;
}
.aside {
  width: 200px !important;
  background-color: #222832;
  overflow: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
.aside::-webkit-scrollbar {
  display: none;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.head span {
  font-size: 20px;
  color: #ffffff;
}
.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}
.main {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>
<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.el-menu {
  border-right: none !important;
}
.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.el-submenu:first-child {
  border-top: none;
}
.el-submenu [class^="el-icon-"] {
  vertical-align: -1px !important;
}
a {
  color: #409eff;
  text-decoration: none;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.el-popper__arrow {
  display: none;
}
</style>
