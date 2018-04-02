<style scoped>
  .login{
    width: 400px;
    margin: 100px auto 0;
    padding: 50px 60px 50px 30px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .1);
  }
  .login .login-btn{
    display: block;
    width: 100%;
    margin-top: 10px;
  }
  .captcha-img{
    float: right;
    width: 115px;
    cursor: pointer;
  }
  .captcha-txt{
    display: block;
    width: auto;
    margin-right: 125px;
  }
</style>
<template>
  <div>
    <div class="login">
      <el-form :model="oFormData" status-icon :rules="oFormRules" ref="oFormData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="erp账号" prop="username">
          <el-input v-model="oFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="图片验证码" prop="captcha">
          <img class="captcha-img" @click="changeCaptchaImg" alt="加载中..." :src="captchaImg">
          <el-input @keyup.enter.native="getPhoneCaptcha" class="captcha-txt" v-model="oFormData.captcha" placeholder="请输入图片验证码"></el-input>
        </el-form-item>
        <el-form-item label="手机验证码" prop="phoneCaptcha">
          <el-button style="float: right;" @click="getPhoneCaptcha()">获取验证码</el-button>
          <el-input type="text" @keyup.enter.native="onLogin" class="captcha-txt" v-model="oFormData.phoneCaptcha" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="onLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    let phoneRule = (rule, value, callback) => {
      let regExp = /^1\d{10}$/
      if (regExp.test(value) === false) {
        callback(new Error('手机号码不正确'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      captchaTemp: '1',
      oFormData: {
        username: '',
        phoneCaptcha: '',
        captcha: ''
      },
      oFormRules: {
        username: [
          {required: true, message: '请输入erp账号', trigger: 'blur'}
          // ,{validator: phoneRule, trigger: 'blur'}
        ],
        captcha: [
          {required: true, message: '请输入图片验证码', trigger: 'blur'}
        ],
        phoneCaptcha: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    captchaImg () {
      return `/api/user/captcha?${+new Date() + this.captchaTemp}`
    }
  },
  methods: {
    getCaptcha () {
      if (!this.oFormData.username) return this.$message.error('请输入账号')
      this.showCaptchaImg()
    },
    getPhoneCaptcha () {
      if (!this.oFormData.captcha) return this.$message.error('请输入图片验证码')
      // 获取验证码
      this.$http({
        url: 'api/user/getPhoneCaptcha',
        method: 'post',
        data: {
          username: this.oFormData.username,
          captcha: this.oFormData.captcha
        }
      }).then(data => {
        data = data.data
        this.dialogVisible = false
        if (data.code === '0000') {
          // 发送验证码
          this.$message.success('验证码发送成功')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    showCaptchaImg () {
      this.dialogVisible = true
      this.oFormData.captcha = ''
      this.changeCaptchaImg()
    },
    changeCaptchaImg () {
      this.captchaTemp = Math.random()
    },
    onLogin () {
      this.$refs['oFormData'].validate((valid) => {
        if (valid) {
          this.$http({
            url: 'api/user/login',
            method: 'post',
            data: {
              username: this.oFormData.username,
              phoneCode: this.oFormData.phoneCaptcha
            }
          }).then(data => {
            data = data.data
            if (data.code === '0000') {
              window.localStorage.token = data.data
              window.localStorage.tokenCreateDate = +new Date()
              this.$router.push('/')
              this.$message.success('登录成功')
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  },
  mounted () {
  }
}
</script>
