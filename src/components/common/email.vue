<template>
  <div>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="ruleForm.email" size="small"></el-input>
      <!--      <input class="input el-input__inner" v-model="ruleForm.email"></input>-->
      <!--      <div class="message" ref="email_msg">请输入邮箱</div>-->
    </el-form-item>
    <el-form-item label="验证码" prop="verificationCode">
      <div style="display: flex;flex-wrap: wrap;justify-content: space-between">
        <el-input v-model="ruleForm.verificationCode" size="small" style="flex-basis: 40%"></el-input>
        <!--        <input class="input el-input__inner" v-model="ruleForm.verificationCode" style="flex-basis: 40%"></input>-->
        <!--        <div class="message" ref="code_msg">请输入验证码</div>-->
        <el-button type="primary" style="flex-basis: 40%;" size="small" @click="getVerificationCode" ref="code"
                   :disabled="isGettingCode">获取验证码
        </el-button>
      </div>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    name: "email",
    props: ['ruleForm', 'url', 'params', 'validator'],
    data() {
      return {
        isGettingCode: false
      }
    },
    methods: {
      getVerificationCode() {
        if (this.validator && !this.validator()) return
        let email = this.ruleForm.email
        if (!email) {
          return this.$message.error('请输入邮箱')
        } else if (!/\w+@\w+.com$/.test(email)) {
          return this.$message.error('请输入正确的邮箱')
        } else if (email.length > 18) {
          return this.$message.error('长度须小于或等于18')
        }
        this.axios.get(this.url, {params: {email, ...this.params}}).then(r => {
          let data = r.data
          if (data.status !== 0) return
          this.$message.success('验证码已发送至您的邮箱')
          sessionStorage.setItem('codeToken', data.token)
          this.isGettingCode = true
          let el = this.$refs['code'].$el
          let text = 60
          let timer = setInterval(() => {
            if (text <= 0) {
              clearInterval(timer)
              el.innerText = '重新获取'
              this.isGettingCode = false
            } else {
              el.innerText = '重新获取(' + text + 's)'
              text--
            }
          }, 1000)
        })
      },
      validate() {
        let email = this.ruleForm.email
        if (!email) return this.$message.error('请输入邮箱') === 1
        if (!/\w+@\w+.com$/.test(email)) return this.$message.error('请输入正确的邮箱') === 1
        let code = this.ruleForm.verificationCode
        if (!code) return this.$message.error('请输入验证码') === 1
        if (!/\d+/.test(code)) return this.$message.error('请输入数字') === 1
        if (code.length !== 6) return this.$message.error('验证码长度为6') === 1
        return true
      }
    }
  }
</script>
