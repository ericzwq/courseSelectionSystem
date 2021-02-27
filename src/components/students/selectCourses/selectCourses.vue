<template>
  <my-layout :formCollapse="formCollapse">
    <el-form slot="form" :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form">
      <el-form-item label="课程名" prop="courseName">
        <el-input placeholder="请输入课程名" clearable v-model="searchForm.courseName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="课程号" prop="courseId">
        <el-input placeholder="请输入课程号" clearable v-model="searchForm.courseId"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="教师名" prop="teacherName">
        <el-input placeholder="请输入教师名" clearable v-model="searchForm.teacherName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="教室" prop="classroom">
        <el-input placeholder="请输入教室" clearable v-model="searchForm.classroom"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="已选人数" prop="selectedCount">
        <el-input placeholder="请输入已选人数" clearable v-model="searchForm.selectedCount"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="人数上限" prop="maxCount">
        <el-input placeholder="请输入人数上限" clearable v-model="searchForm.maxCount"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item class="form_btn">
        <el-button type="default" @click="search">查询</el-button>
        <el-button type="default" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="text" @click="formCollapse = !formCollapse">
          {{formCollapse ? '查看更多' : '收起'}}
          <i :class="[formCollapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top']"></i>
        </el-button>
      </el-form-item>
    </el-form>
    <template slot-scope="scope" slot="tableLayout">
      <my-table @getData="getTable" ref="table" :tableData="tableData" :height="scope.height" :totalCount="totalCount">
        <template slot="tableHead">
          <el-table-column type="index" :index="computeIndex" label="序号" width="60"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseName" label="课程名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseId" label="课程号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherName" label="教师名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherId" label="教师号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classroom" label="教室" show-overflow-tooltip></el-table-column>
          <el-table-column prop="selectedCount" label="已选人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="maxCount" label="人数上限" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classTime" label="开课时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column
              label="操作" fixed="right">
            <template slot-scope="{row}">
              <el-button size="mini" disabled plain v-if="selectedCourseIds.some(i=>i === row.courseId )">已选
              </el-button>
              <el-button size="mini" type="danger" disabled plain
                         v-else-if="new Date(row.classTime).getTime() <= Date.now() || row.selectedCount >= row.maxCount">
                不可选
              </el-button>
              <el-button size="mini" type="primary" plain v-else @click="select(row.courseId)">选择
              </el-button>
            </template>
          </el-table-column>
        </template>
      </my-table>
    </template>
  </my-layout>
</template>
<script>
  export default {
    name: 'selectCourses',
    data() {
      return {
        searchForm: {
          courseName: '',
          courseId: '',
          teacherName: '',
          classroom: '',
          selectedCount: '',
          maxCount: ''
        },
        tableData: [],
        totalCount: 0,
        selectedCourseIds: [],
        page: 1,
        count: 10,
        tableObj: {},
        formCollapse: false
      }
    },
    mounted() {
      this.tableObj = this.$refs['table']
    },
    methods: {
      getTable(page, count) {
        this.page = page
        this.count = count
        this.getTableData.call(this, '/students/allCourses', this.searchForm)
      },
      select(courseId) {
        this.$confirm('确定选择此课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.loading()
          this.axios.post('/students/selectCourse', {
            courseId
          }).then(r => {
            let data = r.data
            if (data.status === 0) {
              this.$message.success(data.message)
            }
            this.tableObj.refresh()
          })
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
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      search() {
        this.tableObj.search()
      }
    },
  }
</script>
