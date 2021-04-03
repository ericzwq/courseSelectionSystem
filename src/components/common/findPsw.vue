<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="f-container">
    <h2 class="f-title">学生选课系统-找回密码</h2>
    <el-form-item label="账号" prop="id">
      <el-input v-model.trim="ruleForm.id" size="small"></el-input>
    </el-form-item>
    <email :rule-form="ruleForm" :params="emailParams" url="public/authVerificationCode" :validator="emailValidator" :level="level"
           ref="email"></email>
    <el-form-item label="新密码" prop="password">
      <el-input type="password" v-model.trim="ruleForm.password" show-password size="small"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPsw">
      <el-input type="password" v-model.trim="ruleForm.checkPsw" show-password size="small"></el-input>
    </el-form-item>
    <div class="f-radioBox">
      <el-radio-group v-model="level">
        <el-radio :label="'students'">学生</el-radio>
        <el-radio :label="'teachers'">教师</el-radio>
        <el-radio :label="'admins'">管理员</el-radio>
      </el-radio-group>
      <div>
        <router-link to="/login">登录</router-link>
        <!--        <router-link to="/bindInfo" class="f-register"> 注册</router-link>-->
      </div>
    </div>
    <div class="f-btn">
      <el-button type="primary" @click="submitForm('ruleForm')" size="small">确定</el-button>
      <el-button @click="resetForm('ruleForm')" size="small" style="color:#409EFF;">重置</el-button>
    </div>
  </el-form>
</template>

<script>
import email from "./email";

export default {
  name: 'findPsw',
  data() {
    let oldPswVal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密保手机'));
      } else {
        callback()
      }
    };
    let passwordVal = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
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
    let checkPswVal = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      level: 'students',
      ruleForm: {
        id: '',
        email: '',
        verificationCode: '',
        password: '',
        checkPsw: ''
      },
      emailParams: {id: this.id},
      rules: {
        id: [
          {required: true, trigger: 'blur', message: '请输入账号'},
        ],
        verificationCode: [{require: true, message: '请输入验证码', trigger: 'blur'}],
        password: [
          {required: true, trigger: 'blur', validator: passwordVal},
        ],
        checkPsw: [
          {required: true, trigger: 'blur', validator: checkPswVal},
        ],
      }
    };
  },
  methods: {
    emailValidator() {
      if (!this.ruleForm.id) return this.$message.error('请输入账号') === 1
      this.emailParams.id = this.ruleForm.id
      return true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.$refs['email'].validate()) {
          let ruleForm = this.ruleForm
          this.axios.post('/authCode/findPsw', {
            level: this.level,
            codeToken: sessionStorage.getItem('codeToken'),
            ...ruleForm
          }, {
            headers: {
              level: this.level
            }
          }).then(r => {
            let data = r.data
            if (data.status !== 0) return
            this.$message.success('修改成功，3秒后跳转')
            sessionStorage.setItem('routers', JSON.stringify(data.routers))
            sessionStorage.setItem('token', data.token)
            sessionStorage.setItem('level', this.level)
            sessionStorage.setItem('id', data.id)
            sessionStorage.setItem('name', data.name)
            sessionStorage.setItem('sex', data.sex)
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
.f-container {
  width: 60%;
  min-width: 375px;
  margin: 0 auto;
  padding: 80px 20px 20px 20px;

  .f-title {
    text-align: center;
    margin-bottom: 50px;
    color: #409EFF;
  }

  .f-radioBox {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 20px 0;
    padding-left:20px;
  }

  .f-btn {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
