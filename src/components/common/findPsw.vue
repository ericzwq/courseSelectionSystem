<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="f-container">
    <h1 class="f-title">学生选课系统-找回密码</h1>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密保手机" prop="phone">
      <el-input v-model="ruleForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPsw">
      <el-input type="password" v-model="ruleForm.newPsw"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPsw">
      <el-input type="password" v-model="ruleForm.checkPsw"></el-input>
    </el-form-item>
    <div class="f-radioBox">
      <el-radio-group v-model="level">
        <el-radio :label="'students'">学生</el-radio>
        <el-radio :label="'teachers'">教师</el-radio>
        <el-radio :label="'admins'">管理员</el-radio>
      </el-radio-group>
      <div>
        <router-link to="/login">登录</router-link>
        <router-link to="/register" class="f-register"> 注册</router-link>
      </div>
    </div>
    <el-form-item class="f-btn">
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
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
      let newPswVal = (rule, value, callback) => {
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
        } else if (value !== this.ruleForm.newPsw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        level: 'students',
        ruleForm: {
          username: '',
          phone: '',
          newPsw: '',
          checkPsw: ''
        },
        rules: {
          username: [
            {required: true, trigger: 'blur', message: '请输入用户名'},
          ],
          phone: [
            {required: true, trigger: 'blur', validator: oldPswVal},
          ],
          newPsw: [
            {required: true, trigger: 'blur', validator: newPswVal},
          ],
          checkPsw: [
            {required: true, trigger: 'blur', validator: checkPswVal},
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let ruleForm = this.ruleForm
            this.axios.post('/findPsw', {
              level: this.level,
              username: ruleForm.username,
              phone: ruleForm.phone,
              password: ruleForm.newPsw
            }).then(r => {
              let data = r.data
              if (data.status !== 0) return this.$message.error(data.message)
              this.$message.success('修改成功，3秒后跳转')
              sessionStorage.setItem('token', data.token)
              sessionStorage.setItem('level', this.level)
              sessionStorage.setItem('id', data.id)
              sessionStorage.setItem('name', data.name)
              sessionStorage.setItem('username', ruleForm.username)
              sessionStorage.setItem('phone', data.phone)
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

  .f-container {
    width: 60%;
    margin: 0 auto;
    padding-top: 80px;

    .f-title {
      text-align: center;
      margin-bottom: 50px;
    }

    .f-radioBox {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
    }

    .f-btn {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>