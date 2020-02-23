<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 投向区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"  
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //真是表单的验证
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入正确的密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields() //重置的方法，调用下就就行了。。。
    },
    //登录的验证
    login() {
      this.$refs.loginFormRef.validate(async valid=>{
          //console.log(valid);
          if(!valid) return 0;
          //请求数据
          var {data : res} = await this.axios.post('/login',this.loginForm);
          console.log(res);
          //请求失败
          if(res.meta.status !== 200) return this.$message.error('登录失败！！！');
          //请求成功
          this.$message.success('登录成功！！！');
          //登录成功后，将token保存在sessionstorage中
          window.sessionStorage.setItem('token',res.data.token);
          //跳转到home页面
          this.$router.push('/home');
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
    background: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
