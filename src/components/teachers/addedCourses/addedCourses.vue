<template>
  <my-layout :formCollapse="formCollapse">
    <el-form slot="form" :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form">
      <el-form-item label="课程名" prop="courseName">
        <el-input placeholder="请输入课程名" clearable v-model="searchForm.courseName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="课程号" prop="courseId">
        <el-input placeholder="请输入课程名" clearable v-model="searchForm.courseId"
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
          <el-table-column type="index" :index="computeIndex" label="序号" width="60" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseName" label="课程名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseId" label="课程号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classroom" label="教室" show-overflow-tooltip></el-table-column>
          <el-table-column prop="selectedCount" label="已选人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="maxCount" label="人数上限" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="updateCourse(scope.row)" size="mini" type="primary" plain class="updateScore">编辑
              </el-button>
            </template>
          </el-table-column>
        </template>
      </my-table>
    </template>
  </my-layout>
</template>
<script>
  import updateCourses from "./updateCoursesBox.vue";

  export default {
    name: 'addedCourses',
    data() {
      return {
        searchForm: {
          courseName: '',
          courseId:'',
          classroom: '',
          selectedCount: ''
        },
        ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100),
        tableData: [],
        totalCount: 0,
        page: 1,
        count: 10,
        id: sessionStorage.getItem('id'),
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
        this.searchForm.id = this.id
        this.getTableData.call(this, '/teachers/addedCourses', this.searchForm)
      },
      updateCourse(row) {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h(updateCourses, {
            ref: this.ruleFormIndex,
            props: {courseName: row.courseName, classroom: row.classroom, maxCount: row.maxCount}
          }),
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
                this.axios.post('/teachers/updateCourse', {
                  courseName: formData.courseName,
                  classroom: formData.classroom,
                  maxCount: formData.maxCount,
                  courseId: row.courseId,
                  id: this.id
                }).then(r => {
                  let data = r.data
                  done();
                  instance.confirmButtonLoading = false;
                  if (data.status === 0) {
                    this.$message.success(data.message)
                    this.tableObj.refresh()
                  }
                  // for (let k in form) {
                  //   form[k] = ''
                  // }
                })
              }
            } else {
              done();
              ruleForm.resetForm('ruleForm')
            }
          },
        })
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
