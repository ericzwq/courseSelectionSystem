<template>
  <form class="l-container">
    <h2 class="l-title">学生选课系统-登录</h2>
    <el-input v-model="id" placeholder="请输入账号" class="l-username" v-focus @keyup.enter.native="login"></el-input>
    <el-input placeholder="请输入密码" v-model="password" show-password class="l-password"
              @keyup.enter.native="login"></el-input>
    <div class="l-radioBox">
      <el-radio-group v-model="level" class="l-radio">
        <el-radio :label="'students'">学生</el-radio>
        <el-radio :label="'teachers'">教师</el-radio>
        <el-radio :label="'admins'">管理员</el-radio>
      </el-radio-group>
<!--      <div>-->
        <router-link to="/findPsw" style="font-size: 14px;">忘记密码？</router-link>
<!--        <router-link to="/register" style="font-size: 14px" class="l-register">注册</router-link>-->
<!--      </div>-->
    </div>
    <br>
    <div class="l-button">
      <el-button type="primary" @click="login" size="small" class="l-login">登录</el-button>
    </div>
  </form>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      id: '',
      password: '',
      level: 'students'
    };
  },
  methods: {
    login() {
      if (this.id === '') return this.$message.error('请输入账号')
      if (this.password === '') return this.$message.error('请输入密码')
      this.loading()
      this.axios.post('/public/login', {
        id: this.id,
        password: this.password,
        level: this.level
      }).then(r => {
        this.loaded.close()
        let data = r.data
        if (data.status === 0) {
          this.$message.success('登录成功，3秒后挑转~');
          sessionStorage.setItem('routers', JSON.stringify(data.routers))
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('level', this.level)
          sessionStorage.setItem('id', this.id)
          sessionStorage.setItem('name', data.name)
          sessionStorage.setItem('sex', data.sex)
          sessionStorage.setItem('phone', data.phone)
          sessionStorage.setItem('email', data.email)
          // localStorage.setItem('refreshToken', data.refreshToken)
          setTimeout(() => {
            if (!data.email) {
              this.$router.push('/bindInfo')
              this.$message.warning('为了您的账号安全，首次登录请绑定信息并修改密码！')
            } else {
              let path = this.$router.prePath
              if (path === '/' || path === '/bindInfo' || path === '/findPsw' || path === '/login' || !path.includes(this.level)) {//路由与身份不一致
                // location.href = location.origin + '/#/' + this.level
                this.$router.push(this.level)
              } else {
                // location.href = location.origin + '#' + this.$bk-router.prePath
                this.$router.push(this.$router.prePath)
              }
            }
          }, 3000)
        }
      })
    },
  },
  directives: {
    focus: {
      inserted(el) {
        // el.querySelector('input').focus()
        // document.querySelector('input').focus()
        el.children[0].focus()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.l-container {
  width: 60%;
  min-width: 375px;
  margin: 0 auto;
  padding: 20vh 20px 0 20px;

  .l-title {
    text-align: center;
    color: #409EFF;
  }

  .l-username {
    margin: 50px 0;
  }

  .l-button {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .l-radioBox {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 20px;
  }
}
</style>
