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
      <el-form-item label="创建日期" prop="date">
        <el-date-picker
            clearable
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开课日期" prop="date">
        <el-date-picker
            clearable
            v-model="date2"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="form_btn">
        <el-button type="default" @click="search">查询</el-button>
        <el-button type="default" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="text" @click="formCollapse = !formCollapse">
          {{ formCollapse ? '查看更多' : '收起' }}
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
          <el-table-column prop="classTime" label="开课日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
        </template>
      </my-table>
    </template>
  </my-layout>
</template>

<script>
export default {
  name: 'allCourses',
  data() {
    return {
      searchForm: {
        courseName: '',
        courseId: '',
        teacherName: '',
        classroom: ''
      },
      date: [],
      date2: [],
      tableData: [],
      totalCount: 0,
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
      let {date, date2} = this, params = Object.assign({}, this.searchForm)
      if (date && date.length) {
        params.createdAtStart = date[0]
        params.createdAtEnd = date[1]
      }
      if (date2 && date2.length) {
        params.classTimeStart = date2[0]
        params.classTimeEnd = date2[1]
      }
      this.getTableData.call(this, '/teachers/allCourses', params)
    },
    computeIndex(index) {
      return (this.page - 1) * this.count + index + 1
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.date = []
      this.date2 = []
    },
    search() {
      this.tableObj.search()
    }
  },
}
</script>
