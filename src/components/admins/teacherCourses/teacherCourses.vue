<template>
  <div>
    <el-table
        :data="tableData"
        stripe
        height="528px"
        style="width: 100%">
      <el-table-column
          type="index"
          :index="computeIndex"
          label="序号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="courseName"
          label="课程名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="teacherName"
          label="教师名">
      </el-table-column>
      <el-table-column
          prop="classroom"
          label="教室">
      </el-table-column>
      <el-table-column
          prop="selectedCount"
          label="已选人数">
      </el-table-column>
      <el-table-column
          prop="maxCount"
          label="人数上限">
      </el-table-column>
      <el-table-column
          prop=""
          label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="updateCourse(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="float: right"
        background
        layout="sizes,prev, pager, next,jumper"
        :current-page="page"
        @current-change="pageChange"
        @size-change="countChange"
        :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
  import updateCourseBox from "./updateTeacherCoursesBox.vue";

  export default {
    name: 'teacherCourses',
    data() {
      return {
        ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100),
        tableData: [],
        totalCount: 0,
        selectedCourseId: '',
        page: 1,
        count: 10,
      }
    },
    created() {
      this.getData.call(this, '/admins/teacherCourses', {page: this.page, count: this.count})
    },
    methods: {
      updateCourse(row) {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h(updateCourseBox, {ref: this.ruleFormIndex}),
          showCancelButton: true,
          showConfirmButton: true,
          beforeClose: (action, instance, done) => {
            let ruleForm = this.$refs[this.ruleFormIndex]
            let form = ruleForm.ruleForm
            let formData
            if (action === 'confirm') {
              if (ruleForm.submitForm('ruleForm')) {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '修改中...';
                formData = ruleForm.$data.ruleForm
                this.loading()
                this.axios.post('/admins/updateCourse', {
                  courseName: formData.courseName,
                  maxCount: formData.maxCount,
                  classroom: formData.classroom,
                  courseId: row.courseId,
                  teacherId: row.teacherId
                }).then(r => {
                  let data = r.data
                  this.loaded && this.loaded.close()
                  done();
                  instance.confirmButtonLoading = false;
                  for (let k in form) {
                    form[k] = ''
                  }
                  if (data.status === 0) {
                    this.$message.success(data.message)
                    this.getData.call(this, '/admins/teacherCourses', {page: this.page, count: this.count})
                  } else {
                    this.$message.error(data.message)
                  }
                }, err => {
                  this.$err(err)
                  done();
                  instance.confirmButtonLoading = false;
                })
              }
            } else {
              done();
            }
          }
        })
      },
      computeIndex(index) {
        return (this.page - 1) * this.count + index + 1
      },
      pageChange(page) {
        this.getData.call(this, '/admins/teacherCourses', {page, count: this.count})
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getData.call(this, '/admins/teacherCourses', {page: 1, count})
      }
    },
  }
</script>