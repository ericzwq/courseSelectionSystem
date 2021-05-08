<template>
  <div class="s-container">
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
          prop="score"
          label="分数">
        <template slot-scope="scope">
          <span>{{scope.row.score===-1?'暂无':scope.row.score}}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain v-if="scope.row.score===-1" @click="unselect(scope.row.courseId)">退选</el-button>
          <el-button size="mini" disabled plain v-else>无</el-button>
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
    name: 'selectedCourses',
    data() {
      return {
        id: sessionStorage.getItem('id'),
        tableData: [],
        totalCount: 0,
        page: 1,
        count: 10,
      }
    },
    created() {
      this.getData.call(this, '/students/selectedCourses', {
        page: this.page,
        count: this.count,
        id: this.id
      })
    },
    methods: {
      unselect(courseId) {
        this.$confirm('确定取消选择此课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/students/deleteCourse', {
            id: this.id,
            courseId
          }).then(r => {
            let data = r.data
            if (data.status === 0) {
              this.$message.success(data.message)
              this.getData.call(this, '/students/selectedCourses', {
                page: this.page,
                count: this.count,
                id: this.id
              })
            } else {
              this.$message.error(data.message)
            }
          }, err => this.$err(err))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      computeIndex(index) {
        return (this.page - 1) * this.count + index + 1
      },
      pageChange(page) {
        this.getData.call(this, '/students/selectedCourses', {page, count: this.count, id: this.id})
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getData.call(this, '/students/selectedCourses', {page: 1, count, id: this.id})
      }
    }
  }
</script>