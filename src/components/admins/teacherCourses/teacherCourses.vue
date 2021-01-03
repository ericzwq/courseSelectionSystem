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
          <el-table-column prop="teacherName" label="教师名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherId" label="教师号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classroom" label="教室" show-overflow-tooltip></el-table-column>
          <el-table-column prop="selectedCount" label="已选人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="maxCount" label="人数上限" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column width="150" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="updateCourse(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" plain @click="deleteCourse(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </template>
      </my-table>
    </template>
  </my-layout>
</template>

<script>
  import updateTeacherCourses from "./updateTeacherCoursesBox.vue"

  export default {
    name: 'teacherCourses',
    data() {
      return {
        searchForm: {
          courseName: '',
          courseId:'',
          teacherName: '',
          classroom: ''
        },
        ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100),
        tableData: [],
        totalCount: 0,
        selectedCourseId: '',
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
        this.getTableData.call(this, '/admins/teacherCourses', this.searchForm)
      },
      updateCourse(row) {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h(updateTeacherCourses, {
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
                  // for (let k in form) {
                  //   form[k] = ''
                  // }
                  if (data.status === 0) {
                    this.$message.success(data.message)
                    this.tableObj.refresh()
                  } else {
                    this.$message.error(data.message)
                  }
                }, err => {
                  done();
                  instance.confirmButtonLoading = false;
                })
              }
            } else {
              done();
              ruleForm.resetForm('ruleForm')
            }
          }
        })
      },
      deleteCourse(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/admins/deleteCourse', {courseId: row.courseId}).then(r => {
            let data = r.data
            this.loaded && this.loaded.close()
            if (data.status === 0) {
              this.$message.success(data.message)
              if (this.tableData.length <= 1) this.tableObj.page = this.tableObj.page - 1
              this.tableObj.refresh()
            }
          })
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
    }
  }
</script>
<!--<style lang="less">-->
<!--  .search_form {-->
<!--    /*width: 35vw;*/-->

<!--    .search-item {-->
<!--      width: 25vw;-->
<!--      min-width: 300px;-->

<!--      .el-form-item__content {-->
<!--        /*width: 15vw;*/-->
<!--        width: 200px;-->
<!--      }-->

<!--      .el-form-item__label {-->
<!--        font-size: 13px;-->
<!--        /*width: 10vw;*/-->
<!--        width: 100px;-->
<!--      }-->
<!--    }-->

<!--    .search_btn {-->
<!--      /*width: 25vw;*/-->
<!--      min-width: 200px;-->
<!--    }-->
<!--  }-->
<!--</style>-->

<!--<div>-->
<!--  <el-form :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form">-->
<!--    <el-form-item label="课程名" class="search-item" prop="courseName">-->
<!--      <el-input placeholder="课程名" clearable v-model="searchForm.courseName"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="教师名" class="search-item" prop="teacherName">-->
<!--      <el-input placeholder="教师名" clearable v-model="searchForm.teacherName"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="教室" class="search-item" prop="classroom">-->
<!--      <el-input placeholder="教室" clearable v-model="searchForm.classroom"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item class="search_btn" style="margin-left: 0" ref="btn">-->
<!--      <el-button type="primary" @click="search">查询</el-button>-->
<!--      <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>-->
<!--    </el-form-item>-->
<!--  </el-form>-->
<!--  <el-table-->
<!--      :data="tableData"-->
<!--      stripe-->
<!--      ref="table"-->
<!--      :height="tableHeight"-->
<!--      style="width: 100%">-->
<!--    <el-table-column type="index" :index="computeIndex" label="序号" width="180"></el-table-column>-->
<!--    <el-table-column prop="courseName" label="课程名" width="180"></el-table-column>-->
<!--    <el-table-column prop="teacherName" label="教师名"></el-table-column>-->
<!--    <el-table-column prop="classroom" label="教室"></el-table-column>-->
<!--    <el-table-column prop="selectedCount" label="已选人数"></el-table-column>-->
<!--    <el-table-column prop="maxCount" label="人数上限"></el-table-column>-->
<!--    <el-table-column width="150" fixed="right" label="操作">-->
<!--      <template slot-scope="scope">-->
<!--        <el-button size="mini" type="primary" plain @click="updateCourse(scope.row)">编辑</el-button>-->
<!--        <el-button size="mini" type="danger" plain @click="deleteCourse(scope.row)">删除</el-button>-->
<!--      </template>-->
<!--    </el-table-column>-->
<!--  </el-table>-->
<!--  <el-pagination-->
<!--      style="text-align: right;margin-top: 16px"-->
<!--      background-->
<!--      ref="pagination"-->
<!--      layout="sizes,prev, pager, next,jumper"-->
<!--      :current-page="page"-->
<!--      @current-change="pageChange"-->
<!--      @size-change="countChange"-->
<!--      :total="totalCount">-->
<!--  </el-pagination>-->
<!--</div>-->
