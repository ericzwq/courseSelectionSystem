<template>
  <form class="l-container">
    <h1 class="l-title">学生选课系统-登录</h1>
    <el-input v-model="username" placeholder="请输入账号" class="l-username" v-focus></el-input>
    <el-input placeholder="请输入密码" v-model="password" show-password class="l-password"
              @keyup.enter.native="login"></el-input>
    <div class="l-radioBox">
      <el-radio-group v-model="level" class="l-radio">
        <el-radio :label="'students'">学生</el-radio>
        <el-radio :label="'teachers'">教师</el-radio>
        <el-radio :label="'admins'">管理员</el-radio>
      </el-radio-group>
      <div>
        <router-link to="/findPsw" style="font-size: 14px">忘记密码？</router-link>
        <router-link to="/register" style="font-size: 14px" class="l-register">注册</router-link>
      </div>
    </div>
    <br>
    <div class="l-button">
      <el-button type="primary" @click="login" class="l-login">登录</el-button>
    </div>
  </form>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        username: '',
        password: '',
        level: 'students'
      };
    },
    methods: {
      login() {
        if (this.username === '') return this.$message.error('请输入用户名')
        if (this.password === '') return this.$message.error('请输入密码')
        this.loading()
        this.axios.post('/login', {
          username: this.username,
          password: this.password,
          level: this.level
        }).then(r => {
          this.loaded.close()
          let data = r.data
          if (data.status === 0) {
            this.$message.success('登录成功，3秒后挑转~');
            sessionStorage.setItem('token', data.token)
            sessionStorage.setItem('level', this.level)
            sessionStorage.setItem('id', data.id)
            sessionStorage.setItem('name', data.name)
            sessionStorage.setItem('username', this.username)
            sessionStorage.setItem('phone', data.phone)
            // localStorage.setItem('refreshToken', data.refreshToken)
            setTimeout(() => {
              let path = this.$router.prePath
              if (path === '/' || path === '/register' || path === '/findPsw' || path === '/login' || !path.includes(this.level)) {//路由与身份不一致
                location.href = location.origin + '/#/' + this.level
              } else {
                location.href = location.origin + '#' + this.$router.prePath
                // this.$router.push(this.$router.prePath)
              }
            }, 3000)
          } else {
            this.$message.error(data.message)
          }
        }, err => this.$err(err))
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
  a {
    text-decoration: none;
    color: blue;
  }

  .l-container {
    width: 60%;
    margin: 0 auto;
    padding-top: 80px;

    .l-title {
      text-align: center;
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
      align-items: center;
      margin-top: 20px;
    }
  }
</style>