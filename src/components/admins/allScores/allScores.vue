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
          prop="studentName"
          label="学生名"
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
          prop="score"
          label="分数">
        <template slot-scope="scope">
          <span>{{scope.row.score===-1?'暂无':scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain :data-id="scope.row.courseId"
                     @click="updateScore(scope.row)">修改
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
  export default {
    name: 'allCourses',
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
      this.getData.call(this, '/admins/allScores', {page: this.page, count: this.count})
    },
    methods: {
      updateScore(row) {
        this.$prompt('请输入分数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]+$/,
          inputErrorMessage: '格式不正确',
          inputValidator: function (v) {
            if (v < 0 || v > 150) {
              return '分数超过限制'
            }
          }
        }).then(value => {
          this.loading()
          this.axios.post('/admins/updateScore', {
            score: value.value,
            stuId: row.stuId,
            courseId: row.courseId
          }).then(r => {
              let data = r.data
              this.loaded && this.loaded.close()
              if (data.status === 0) {
                this.$message.success(data.message)
                this.getData.call(this, '/admins/allScores', {page: this.page, count: this.count})
              } else {
                this.$message.error(data.message)
              }
            }, err => this.$err(err)
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      computeIndex(index) {
        return (this.page - 1) * this.count + index + 1
      },
      pageChange(page) {
        this.getData.call(this, '/admins/allScores', {page, count: this.count})
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getData.call(this, '/admins/allScores', {page: 1, count})
      }
    },
  }
</script>