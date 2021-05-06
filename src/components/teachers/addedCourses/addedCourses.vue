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
          <el-table-column prop="classroom" label="教室" show-overflow-tooltip></el-table-column>
          <el-table-column prop="selectedCount" label="已选人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="maxCount" label="人数上限" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classTime" label="开课日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="updateCourse(scope.row)" type="primary" size="mini" plain class="updateScore"
                         v-if="new Date(scope.row.classTime).getTime() > Date.now()">编辑
              </el-button>
              <el-button disabled size="mini" plain v-else>无</el-button>
            </template>
          </el-table-column>
        </template>
      </my-table>
      <el-dialog class="init-dialog" title="添加成绩详情" width="450px" :close-on-click-modal="false"
                 :visible.sync="dialogVisible" @close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="ruleForm.courseName"></el-input>
          </el-form-item>
          <el-form-item label="教室" prop="classroom">
            <el-input v-model="ruleForm.classroom"></el-input>
          </el-form-item>
          <el-form-item label="人数上限" prop="maxCount">
            <el-input v-model="ruleForm.maxCount"></el-input>
          </el-form-item>
          <div style="text-align: right">
            <el-button type="default" size="small" @click="handleClose">取消</el-button>
            <el-button type="primary" size="small" @click="handleSave">确定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </template>
  </my-layout>
</template>
<script>
export default {
  name: 'addedCourses',
  data() {
    return {
      searchForm: {
        courseName: '',
        courseId: '',
        classroom: '',
        selectedCount: ''
      },
      date: [],
      date2: [],
      tableData: [],
      totalCount: 0,
      page: 1,
      count: 10,
      tableObj: {},
      formCollapse: false,
      dialogVisible: false,
      ruleForm: {
        courseName: '',
        classroom: '',
        maxCount: '',
        courseId: ''
      },
      rules: {
        courseName: [
          {required: true, message: '请输入课程名称', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur'},
        ],
        classroom: [
          {required: true, message: '请输入教室', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        maxCount: [
          {required: true, message: '请输入人数上限', trigger: 'blur'},
          {
            validator: (r, v, cb) => {
              if (!/^[1-9]\d{0,2}$/.test(v)) return cb(new Error('请输入3位及3位以下正整数'))
              cb()
              // if (!/^\d+$/.test(v)) {
              //   cb(new Error('请输入正整数'))
              // } else if (v > 999 || v < 0) {
              //   cb(new Error('请输入1-3位的数字'))
              // } else {
              //   cb()
              // }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.tableObj = this.$refs['table']
  },
  methods: {
    getTable(page, count) {
      this.page = page
      this.count = count
      let params = Object.assign({}, this.searchForm)
      let {date,date2} = this
      if (date && date.length) {
        params.createdAtStart = date[0]
        params.createdAtEnd = date[1]
      }
      if (date2 && date2.length) {
        params.classTimeStart = date2[0]
        params.classTimeEnd = date2[1]
      }
      this.getTableData.call(this, '/teachers/addedCourses', params)
    },
    handleSave() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.axios.post('/teachers/updateCourse', {
            ...this.ruleForm
          }).then(r => {
            let data = r.data
            if (data.status === 0) this.$message.success(data.message)
            this.tableObj.refresh()
            this.dialogVisible = false
          })
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.$refs['ruleForm'].clearValidate()
    },
    updateCourse(row) {
      let ruleForm = this.ruleForm
      ruleForm.courseName = row.courseName
      ruleForm.classroom = row.classroom
      ruleForm.maxCount = row.maxCount
      ruleForm.courseId = row.courseId
      this.dialogVisible = true
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
    },
    submitForm(formName) {
      let res
      this.$refs[formName].validate((valid) => {
        if (valid) {
          res = true
        } else {
          console.log('error submit!!');
          res = false
          return false;
        }
      });
      return res
    }
  },
}
</script>
