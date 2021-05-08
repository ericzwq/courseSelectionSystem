<template>
  <div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%">
      <el-table-column
          type="index"
          :index="computeIndex"
          label="序号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="studentName"
          label="姓名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="stuId"
          label="学号">
      </el-table-column>
      <el-table-column
          prop="courseName"
          label="课程名">
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
          <el-button size="mini" type="primary" plain v-if="scope.row.score===-1" @click="addScore(scope.row)">添加</el-button>
          <el-button size="mini" plain v-else disabled>无</el-button>
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
    name: 'stuScores',
    data() {
      return {
        tableData: [],
        totalCount: 0,
        page: 1,
        count: 10
      }
    },
    created() {
      this.getData.call(this, '/teachers/stuScores', {page: this.page, count: this.count})
    },
    methods: {
      addScore(row) {
        this.$prompt('请输入分数(添加后不可修改)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]+$/,
          inputErrorMessage: '格式不正确',
          inputValidator: function (v) {
            if (v < 0 || v > 150) {
              return '分数超过限制'
            }
          }
        }).then(({value}) => {
          this.$message({
            type: 'success',
            message: '分数是: ' + value
          });
          this.loading()
          this.axios.post('/teachers/addScore', {
            stuId: row.stuId,
            courseId: row.courseId,
            score: parseInt(value)
          }).then(r => {
            row.score = parseInt(value)
            this.loaded.close()
          }, err => this.$err(err))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      pageChange(page) {
        this.getData.call(this, '/teachers/stuScores', {page, count: this.count})
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getData.call(this, '/teachers/stuScores', {page: 1, count})
      },
      computeIndex(index) {
        return (this.page - 1) * this.count + index + 1
      },
    },
  }
</script>