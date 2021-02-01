<template>
  <el-form class="r-container" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <h1 class="r-title">学生选课系统-注册</h1>
    <el-form-item label="姓名" prop="name">
      <el-input v-model.trim="ruleForm.name" size="small"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model.trim="ruleForm.username" size="small"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model.trim="ruleForm.password" show-password size="small"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model.trim="ruleForm.checkPass" show-password size="small"></el-input>
    </el-form-item>
    <el-form-item label="密保手机" prop="phone">
      <el-input v-model.number="ruleForm.phone" size="small"></el-input>
    </el-form-item>
    <email :rule-form="ruleForm" :params="emailParams" url="/public/verificationCode" ref="email"></email>
    <el-form-item label="邀请码" prop="invitation">
      <el-input v-model="ruleForm.invitation" size="small"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="ruleForm.sex" placeholder="请选择" size="small">
        <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <div class="r-radioBox">
      <el-radio-group v-model="level">
        <el-radio :label="'students'">学生</el-radio>
        <el-radio :label="'teachers'">教师</el-radio>
        <el-radio :label="'admins'">管理员</el-radio>
      </el-radio-group>
      <div>
        <router-link to="/login" class="r-login">登录</router-link>
        <router-link to="/findPsw" class="f-register"> 忘记密码？</router-link>
      </div>
    </div>
    <el-form-item class="r-register">
      <el-button type="primary" @click="submitForm('ruleForm')" size="mini">注册</el-button>
      <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import email from "./email";

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
        } else if (value !== this.ruleForm.password) {
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
          password: '',
          checkPass: '',
          phone: '',
          email: '',
          verificationCode: '',
          sex: '',
          invitation: '',
        },
        sexOptions: [
          {value: '男', label: '男'},
          {value: '女', label: '女'}
        ],
        emailParams: {isRegister: 1},
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          username: [
            {required: true, validator: usernameVal, trigger: 'blur'}
          ],
          password: [
            {required: true, validator: passVal, trigger: 'blur'}
          ],
          checkPass: [
            {required: true, validator: checkPassVal, trigger: 'blur'}
          ],
          phone: [
            {
              validator: (rule, v, cb) => {
                if (!v) return cb('请输入手机号')
                if (!/\d+/.test(v)) return cb('请输入正确的手机号')
                if (v.toString().length !== 11) return cb('手机号长度为11')
                cb()
              },
              trigger: 'blur'
            }
          ],
          // email: [{
          //   trigger: 'blur', validator: (rule, value, callback) => {
          //     if (!value) return callback('请输入邮箱')
          //     if (!/\w+@\w+.com$/.test(value)) return callback('请输入正确的邮箱')
          //     callback()
          //   }
          // }],
          // verificationCode: [{require: true, message: '请输入验证码', trigger: 'blur'}],
          invitation: [
            {required: true, message: '请输入邀请码', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'}
          ]
        },
        isGettingCode: false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.$refs['email'].validate()) {
            let ruleForm = this.ruleForm
            this.axios.post('/code/register', {
              level: this.level,
              token: sessionStorage.getItem('codeToken'), ...ruleForm
            }).then(r => {
              let data = r.data
              if (data.status !== 0) return
              this.$message.success('注册成功,3秒后跳转')
              sessionStorage.setItem('routers', JSON.stringify(data.routers))
              sessionStorage.setItem('token', data.token)
              sessionStorage.setItem('level', this.level)
              sessionStorage.setItem('id', data.id)
              sessionStorage.setItem('name', data.name)
              sessionStorage.setItem('sex', data.sex)
              sessionStorage.setItem('username', ruleForm.username)
              sessionStorage.setItem('phone', data.phone)
              sessionStorage.setItem('email', data.email)
              setTimeout(() => {
                this.$router.push(this.level)
              }, 3000)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    components: {
      email
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
    padding-top: 40px;

    .r-title {
      text-align: center;
      margin-bottom: 30px;
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
