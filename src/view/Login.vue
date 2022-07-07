<template>
  <div>
    <el-card shadow="always" class="loginContainer" v-loading="loading">
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
        <h3 class="loginTitle">VHR系统登录</h3>
        <el-form-item label="密码" prop="username">
          <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input v-model="loginForm.captcha" placeholder="点击图片更换验证码" style="width: 250px;margin-right: 5px;">
          </el-input>
          <img :src="captchaUrl" @click="updateCaptcha" class="imageStyle">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>
<script>


export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123',
        captcha: '',
      },
      captchaUrl: '/captcha',
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest('/login', this.loginForm).then(res => {
            if (res.code === 200) {
              const tokenStr = res.data.tokenHead + ' ' + res.data.token
              window.sessionStorage.setItem('tokenStr', tokenStr)
              // 睡眠一秒，等待页面跳转
              setTimeout(() => {
                const path = this.$route.query.redirect;
                console.log(path);
                this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
              }, 1000)
            }
          })
        } else {
          this.$message({
            message: '提交失败',
            type: 'error'
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    updateCaptcha() {
      this.captchaUrl = '/captcha?t=' + new Date().getTime()
    }
  }
}
</script>
<style>
.loginContainer {
  width: 500px;
  margin: 180px auto;
  padding: 15px 35px 15px 35px;
  border-radius: 15px;
}

.loginTitle {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>