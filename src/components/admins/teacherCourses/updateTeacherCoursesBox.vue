<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="课程名称" prop="courseName">
      <el-input v-model="ruleForm.courseName"></el-input>
    </el-form-item>
    <el-form-item label="教室" prop="classroom">
      <el-input v-model="ruleForm.classroom"></el-input>
    </el-form-item>
    <el-form-item label="人数上限" prop="maxCount">
      <el-input v-model="ruleForm.maxCount"></el-input>
    </el-form-item>
    <el-form-item label="开课日期" prop="classTime">
      <el-date-picker
          v-model="ruleForm.classTime"
          type="date"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'updateTeacherCoursesBox',
    data() {
      return {
        ruleForm: {
          courseName: '',
          teacherName: '',
          maxCount: '',
          classroom: '',
          classTime: ''
        },
        rules: {
          courseName: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur'}
          ],
          classroom: [
            {required: true, message: '请输入教室', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
          maxCount: [
            {required: true, message: '请输入人数', trigger: 'blur'},
            {
              validator: (rule, v, cb) => {
                if (!/^[1-9]\d{0,2}$/.test(v)) return cb(new Error('请输入3位及3位以下正整数'))
                cb()
                // if (isNaN(v)) {
                //   cb(new Error('请输入正整数'))
                // } else {
                //   if (v.length < 1 || v.length > 3) {
                //     cb(new Error('请输入长度为1-3的数字'))
                //   } else {
                //     cb()
                //   }
                // }
              }, trigger: 'blur'
            }
          ],
          classTime: [
            {required: true, message: '请选择开课日期', trigger: 'blur'}
          ]
        },
        pickerOptions: {
          // disabledDate(time) {
          //   return time.getTime() < Date.now()
          // }
        }
      }
    },
    props: ['courseName', 'classroom', 'maxCount','classTime'],
    created() {
      this.getFormData()
    },
    methods: {
      getFormData() {
        let ruleForm = this.ruleForm
        ruleForm.courseName = this.courseName
        ruleForm.classroom = this.classroom
        ruleForm.maxCount = this.maxCount
        ruleForm.classTime = this.classTime
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
        this.getFormData()
      }
    }
  }
</script>
