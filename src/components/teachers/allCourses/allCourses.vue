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
          width="180"><!--prop="courseId"-->
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
        tableData: [],
        totalCount: 0,
        page: 1,
        count: 10,
      }
    },
    created() {
      this.getData.call(this, '/teachers/allCourses', {page: this.page, count: this.count})
    },
    methods: {
      computeIndex(index) {
        return (this.page - 1) * this.count + index + 1
      },
      pageChange(page) {
        this.getData.call(this, '/teachers/allCourses', {page, count: this.count})
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getData.call(this, '/teachers/allCourses', {page: 1, count})
      }
    },
  }
</script>