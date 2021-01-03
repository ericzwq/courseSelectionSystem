<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="学生名" prop="studentName">
      <el-input v-model="ruleForm.studentName"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="ruleForm.phone"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'updateStudentBox',
    data() {
      return {
        ruleForm: {
          studentName: '',
          phone: '',
        },
        rules: {
          studentName: [
            {required: true, message: '请输入学生名', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '长度在11个字符', trigger: 'blur'}
          ],
        }
      };
    },
    props:['studentName','phone'],
    created() {
      this.getFormData()
    },
    methods: {
      getFormData() {
        let ruleForm = this.ruleForm
        ruleForm.studentName = this.studentName
        ruleForm.phone = this.phone
      },
      submitForm(formName) {
        let res
        this.$refs[formName].validate((valid) => {
          if (valid) {
            res = true
          } else {
            console.log('error submit!!');
            res = false
            return false;
          }
        });
        return res
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    watch: {
      studentName() {
        this.getFormData()
      }
    }
  }
</script>
