<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/man.jpeg" alt="" class="header_img" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <!-- 折叠功能 -->
        <div class="toggle_btn" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          unique-opened
          router
          :default-active="$route.path"
          :collapse-transition="false"
          :collapse="iscollapse"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模版区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + listName.path"
              v-for="listName in item.children"
              :key="listName.id"
              @click="saveNavState('/' + listName.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ listName.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      //iconfont
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      //是否折叠
      iscollapse: false,
      //被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //退出登录
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单数据   async await 简化promise对象
    async getMenuList() {
      const { data: res } = await this.axios.get('menus')
      //console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.menuList = res.data
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.iscollapse = !this.iscollapse
    },
    //存储链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-menu {
  border-right: 0px;
}
.header_img {
  width: 100px;
  height: 60px;
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle_btn {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
  text-align: center;
}
</style>
