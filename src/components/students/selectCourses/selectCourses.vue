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
          label="操作">
        <template slot-scope="scope">
          <el-button size="mini" disabled plain v-if="selectedCourseId.indexOf(scope.row.courseId + '')>-1">已选
          </el-button>
          <el-button size="mini" type="danger" disabled plain v-else-if="scope.row.selectedCount >= scope.row.maxCount">不可选
          </el-button>
          <el-button size="mini" type="primary" plain v-else @click="select(scope.row.courseId)">选择
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
    name: 'selectCourses',
    data() {
      return {
        tableData: [],
        totalCount: 0,
        selectedCourseId: '',
        page: 1,
        count: 10,
        id: sessionStorage.getItem('id')
      }
    },
    created() {
      this.getData.call(this, '/students/allCourses', {page: this.page, count: this.count}, (data) => {
        let selectedIds = data[2].selectedCourseId
        if (!selectedIds) return false
        this.selectedCourseId = selectedIds.split(',')
      })
    },
    methods: {
      select(courseId) {
        this.$confirm('确定选择此课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading()
          this.axios.post('/students/selectCourse', {
            courseId,
            id: this.id
          }).then(r => {
            let data = r.data
            if (data.status === 0) {
              this.$message.success(data.message)
              this.getData.call(this, '/students/allCourses', {page: this.page, count: this.count}, (data) => {
                this.selectedCourseId = data[2].selectedCourseId.split(',')
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
        this.getData.call(this, '/students/allCourses', {page, count: this.count})
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getData.call(this, '/students/allCourses', {page: 1, count})
      }
    },
  }
</script>