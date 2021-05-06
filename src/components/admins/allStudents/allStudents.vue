<template>
  <my-layout :formCollapse="formCollapse">
    <el-form slot="form" :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form">
      <el-form-item label="学生名" prop="studentName">
        <el-input placeholder="请输入学生名" clearable v-model="searchForm.studentName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="学生号" prop="studentId">
        <el-input placeholder="请输入学生号" clearable v-model="searchForm.studentId"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input placeholder="请输入手机号" clearable v-model="searchForm.phone" @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input placeholder="请输入邮箱" clearable v-model="searchForm.email" @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchForm.status" placeholder="请选择">
          <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期" prop="date">
        <el-date-picker
            clearable
            v-model="date"
            @change="dateChange"
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
          <el-table-column prop="studentName" label="学生名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="studentId" label="学生号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sex" label="性别" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.status === 1 ? '已启用' : '已禁用' }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" :type="scope.row.status===1?'danger':'success'" plain
                         @click="updateStudentStatus(scope.row)">
                {{ scope.row.status === 1 ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </template>
        `
      </my-table>
    </template>
  </my-layout>
</template>

<script>

export default {
  name: 'allStudents',
  data() {
    return {
      searchForm: {
        studentName: '',
        studentId: '',
        phone: '',
        email: '',
        status: '',
        createdAtStart:'',
        createdAtEnd:''
      },
      date:[],
      ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100),
      tableData: [],
      totalCount: 0,
      selectedCourseId: '',
      page: 1,
      count: 10,
      tableObj: {},
      formCollapse: false,
      statusOptions: [
        {name: '请选择', value: ''},
        {name: '已启用', value: 1},
        {name: '已禁用', value: 0}
      ]
    }
  },
  mounted() {
    this.tableObj = this.$refs['table']
  },
  methods: {
    getTable(page, count) {
      this.page = page
      this.count = count
      this.getTableData.call(this, '/admins/allStudents', this.searchForm, data => {
          data[0].forEach(i=>{
            if(!i.phone) i.phone = '--'
            if(!i.email) i.email = '--'
          })
      })
    },
    updateStudentStatus(row) {
      this.$confirm(`此操作将${row.status === 1 ? '禁用' : '启用'}该用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/admins/updateStudentStatus', {
          id: row.studentId
        }).then(r => {
          let data = r.data
          this.loaded && this.loaded.close()
          if (data.status === 0) {
            this.$message.success(data.message)
            this.tableObj.refresh()
          }
        })
      })
    },
    dateChange(date){
      if (date && date.length) {
        this.searchForm.createdAtStart = date[0]
        this.searchForm.createdAtEnd = date[1]
      } else {
        this.searchForm.createdAtStart = ''
        this.searchForm.createdAtEnd = ''
      }
    },
    computeIndex(index) {
      return (this.page - 1) * this.count + index + 1
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.date = []
      this.dateChange()
    },
    search() {
      this.tableObj.search()
    }
  },
}
</script>
