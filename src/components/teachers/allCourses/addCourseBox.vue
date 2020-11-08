<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="addBox">
    <el-form-item label="课程名称" prop="courseName">
      <el-input v-model="ruleForm.courseName"></el-input>
    </el-form-item>
    <el-form-item label="人数上限" prop="maxCount">
      <el-input v-model="ruleForm.maxCount"></el-input>
    </el-form-item>
    <el-form-item label="教室" prop="classroom">
      <el-input v-model="ruleForm.classroom"></el-input>
    </el-form-item>
    <!--    <el-form-item>-->
    <!--      <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>-->
    <!--      <el-button @click="resetForm('ruleForm')">重置</el-button>-->
    <!--    </el-form-item>-->
  </el-form>
</template>

<script>
  export default {
    name: 'addScoreBox',
    data() {
      return {
        ruleForm: {
          courseName: '',
          maxCount: '',
          classroom: '',
        },
        rules: {
          courseName: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur'}
          ],
          maxCount: [
            {required: true, message: '请输入人数', trigger: 'blur'},
            {
              validator: (rule, v, callback) => {
                if (isNaN(v)) {
                  callback(new Error('必须为数字'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            },
            {min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur'}
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
            return false
          }
        });
        return res
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>