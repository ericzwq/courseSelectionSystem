<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="旧密码" prop="oldPsw">
      <el-input type="password" v-model="ruleForm.oldPsw" show-password></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPsw">
      <el-input type="password" v-model="ruleForm.newPsw" show-password></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPsw">
      <el-input type="password" v-model="ruleForm.checkPsw" show-password></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'updatePsw',
    data() {
      let oldPswVal = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入旧密码'));
        }
        setTimeout(() => {
          if (value.length < 6) {
            callback(new Error('密码不能小于6位'));
          } else if (value.length > 18) {
            callback(new Error('密码不能大于18位'));
          } else {
            callback()
          }
        }, 1000);
      };
      let newPswVal = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          callback();
        }
      };
      let checkPswVal = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.ruleForm.newPsw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oldPsw: '',
          newPsw: '',
          checkPsw: ''
        },
        rules: {
          oldPsw: [
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
            this.loading()
            let formData = this.ruleForm
            this.axios.post('/updatePsw', {
              oldPsw: formData.oldPsw,
              newPsw: formData.newPsw
            }).then(r => {
              this.loaded.close()
              let data = r.data
              if (data.status === 0) {
                this.$message.success(data.message)
                for (let k in formData) {//清空输入框
                  formData[k] = ''
                }
              }
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
    }
  }
</script>
