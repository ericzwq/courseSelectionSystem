<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="课程名称" prop="courseName">
      <el-input v-model="ruleForm.courseName"></el-input>
    </el-form-item>
    <el-form-item label="教室" prop="classroom">
      <el-input v-model="ruleForm.classroom"></el-input>
    </el-form-item>
    <el-form-item label="人数上限" prop="maxCount">
      <el-input v-model="ruleForm.maxCount"></el-input>
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
          maxCount: ''
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
          maxCount: [
            {required: true, message: '请输入人数上限', trigger: 'blur'},
            {
              validator: (r, v, cb) => {
                if (!/^[1-9]\d{0,2}$/.test(v)) return cb(new Error('请输入3位及3位以下正整数'))
                cb()
                // if (!/^\d+$/.test(v)) {
                //   cb(new Error('请输入正整数'))
                // } else if (v > 999 || v < 0) {
                //   cb(new Error('请输入1-3位的数字'))
                // } else {
                //   cb()
                // }
              }, trigger: 'blur'
            }
          ]
        }
      };
    },
    props: ['courseName', 'classroom', 'maxCount'],
    created() {
      this.getFormData()
    },
    methods: {
      getFormData(row) {
        this.ruleForm.courseName = row.courseName
        this.ruleForm.classroom = row.classroom
        this.ruleForm.maxCount = row.maxCount
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
      courseName() {
        console.log(1)
        // this.getFormData()
      }
    }
  }
</script>
