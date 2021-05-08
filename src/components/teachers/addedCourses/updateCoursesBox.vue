<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="课程名称" prop="courseName">
      <el-input v-model="ruleForm.courseName"></el-input>
    </el-form-item>
    <el-form-item label="教室" prop="classroom">
      <el-input v-model="ruleForm.classroom"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'updateScoreBox',
    data() {
      return {
        ruleForm: {
          courseName: '',
          classroom: '',
        },
        rules: {
          courseName: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur'},
          ],
          classroom: [
            {required: true, message: '请输入教室', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
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
        console.log(formName)
        this.$refs[formName].resetFields();
      }
    }
  }
</script>