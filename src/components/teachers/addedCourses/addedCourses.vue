<template>
  <div class="a-container">
    <el-table
        :data="tableData"
        height="528px"
        stripe
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
          prop="classroom"
          label="教室">
      </el-table-column>
      <el-table-column
          prop="selectedCount"
          label="选课人数">
      </el-table-column>
      <el-table-column
          prop=""
          label="操作">
        <template slot-scope="scope">
          <el-button @click="updateCourse(scope.row.courseId)" size="mini" type="primary" plain class="updateScore"
                     :data-id="scope.row.courseId">编辑
          </el-button>
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

  import updateScore from "./updateCoursesBox";

  export default {
    name: 'addedCourses',
    data() {
      return {
        ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100),
        tableData: [],
        totalCount: 0,
        page: 1,
        count: 10,
        teacherId:sessionStorage.getItem('id')
      }
    },
    created() {
      this.getCourses(this.page, this.count)
    },
    methods: {
      getCourses(page, count) {
        this.getData.call(this, '/teachers/addedCourses', {
          page,
          count,
          teacherId: this.teacherId
        })
      },
      updateCourse(courseId) {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h(updateScore, {ref: this.ruleFormIndex}),
          showCancelButton: true,
          showConfirmButton: true,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let ruleForm = this.$refs[this.ruleFormIndex]
              let form = ruleForm.ruleForm
              let formData
              if (ruleForm.submitForm('ruleForm')) {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '修改中...';
                formData = ruleForm.$data.ruleForm
                this.axios.post('/teachers/updateCourse', {
                  courseName: formData.courseName,
                  classroom: formData.classroom,
                  courseId,
                  teacherId: this.teacherId
                }).then(r => {
                  let data = r.data
                  done();
                  instance.confirmButtonLoading = false;
                  if (data.status === 0) {
                    this.$message.success(data.message)
                    this.getCourses(this.page, this.count)
                  } else {
                    this.$message.error(data.message)
                  }
                  for (let k in form) {
                    form[k] = ''
                  }
                }, err => this.$err(err))
              }
            } else {
              done();
            }
          },
        })
      },
      pageChange(page) {
        this.getCourses(page, this.count)
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getCourses(1, count)
      },
      computeIndex(index) {
        return (this.page - 1) * this.count + index + 1
      },
    },
  }
</script>