<template>
  <el-form class="r-container" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <h1 class="r-title">学生选课系统-注册</h1>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input type="password" v-model="ruleForm.pass"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass"></el-input>
    </el-form-item>
    <el-form-item label="密保手机" prop="phone">
      <el-input v-model.number="ruleForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="邀请码" prop="invitation">
      <el-input v-model="ruleForm.invitation"></el-input>
    </el-form-item>
    <div class="r-radioBox">
      <el-radio-group v-model="level">
        <el-radio :label="'students'">学生</el-radio>
        <el-radio :label="'teachers'">教师</el-radio>
        <el-radio :label="'admins'">管理员</el-radio>
      </el-radio-group>
      <div>
        <router-link to="/login" class="r-login">登录 </router-link>
        <router-link to="/findPsw" class="f-register"> 忘记密码？</router-link>
      </div>
    </div>
    <el-form-item class="r-register">
      <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'register',
    data() {
      let usernameVal = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      let passVal = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (value.length < 6) {
            callback(new Error('密码不能小于6位'));
          } else if (value.length > 18) {
            callback(new Error('密码不能大于18位'));
          } else {
            callback()
          }
        }
      };
      let checkPassVal = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        level: 'students',
        ruleForm: {
          name: '',
          username: '',
          pass: '',
          checkPass: '',
          dept: '',
          phone: '',
          invitation: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          username: [
            {required: true, validator: usernameVal, trigger: 'blur'}
          ],
          pass: [
            {required: true, validator: passVal, trigger: 'blur'}
          ],
          checkPass: [
            {required: true, validator: checkPassVal, trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {type: 'number', message: '请输入正确的手机号', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let ruleForm = this.ruleForm
            this.axios.post('/register', {
              name: ruleForm.name,
              username: ruleForm.username,
              password: ruleForm.checkPass,
              phone: ruleForm.phone,
              invitation: ruleForm.invitation,
              level:this.level
            }).then(r => {
              let data = r.data
              if (data.status !== 0) return this.$message.error(data.message)
              sessionStorage.setItem('token', data.token)
              sessionStorage.setItem('level', this.level)
              sessionStorage.setItem('id', data.id)
              this.$message.success('注册成功,3秒后跳转')
              console.log(data)
              setTimeout(() => {
                this.$router.push('/' + this.level)
              }, 3000)
            }, err => this.$err(err))
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="less" scoped>
  a {
    text-decoration: none;
    color: blue;
  }

  .r-container {
    width: 60%;
    margin: 0 auto;
    padding-top: 20px;

    .r-title {
      text-align: center;
      margin-bottom: 20px;
    }

    .r-radioBox {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
    }

    .r-login {
      font-size: 14px;
    }

    .r-register {
      text-align: center;
    }
  }
</style>