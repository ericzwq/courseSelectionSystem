<template>
  <my-layout :formCollapse="formCollapse">
    <el-form slot="form" :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form">
      <el-form-item label="学生名" prop="studentName">
        <el-input placeholder="请输入学生名" clearable v-model="searchForm.studentName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input placeholder="请输入学号" clearable v-model="searchForm.studentId"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="课程名" class="search-item" prop="courseName">
        <el-input placeholder="请输入课程名" clearable v-model="searchForm.courseName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="教师名" prop="teacherName">
        <el-input placeholder="请输入教师名" clearable v-model="searchForm.teacherName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="分数" prop="scoreCode">
        <el-select v-model="searchForm.scoreCode" placeholder="请选择">
          <el-option
              v-for="item in scoreOptions"
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
      <el-form-item label="开课日期" prop="date">
        <el-date-picker
            clearable
            v-model="date2"
            @change="dateChange2"
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
    <template slot="tableBtn">
      <el-button type="primary" plain size="mini" @click="exportScore(false)" :disabled="exportDisabled">导出</el-button>
      <qr-button :searchData="searchForm"></qr-button>
      <el-button type="primary" plain size="mini" @click="exportScore(true)">导出全部</el-button>
    </template>
    <template slot-scope="scope" slot="tableLayout">
      <my-table @getData="getTable" ref="table" :tableData="tableData" :height="scope.height" :totalCount="totalCount"
                @selection-change="selectChange">
        <template slot="tableHead">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" :index="computeIndex" label="序号" width="60"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="studentName" label="学生名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="studentId" label="学号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseName" label="课程名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseId" label="课程号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherName" label="教师名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherId" label="教师号" show-overflow-tooltip></el-table-column>
          <el-table-column
              label="分数" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.score === -1 ? '暂无' : scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="classTime" label="开课日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作">
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="updateScore(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </template>
      </my-table>
    </template>
  </my-layout>
</template>
<script>
import {downloadFile} from "@/utils/tools.js";
import {scoreOptions} from '@/utils/dictionary.js'
import qrButton from "@/components/common/qrButton.vue";

export default {
  name: 'allCourses',
  data() {
    return {
      searchForm: {
        studentName: '',
        studentId: '',
        courseName: '',
        teacherName: '',
        scoreCode: '',
        createdAtStart: '',
        createdAtEnd: '',
        classTimeStart: '',
        classTimeEnd: ''
      },
      date: [],
      date2: [],
      scoreOptions,
      ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100),
      tableData: [],
      totalCount: 0,
      selectedCourseId: '',
      page: 1,
      count: 10,
      tableObj: {},
      exportDisabled: true,
      multipleSelection: [],
      formCollapse: false
    }
  },
  mounted() {
    this.tableObj = this.$refs['table']
  },
  methods: {
    exportScore(all) {
      let scoreIds = []
      this.multipleSelection.forEach(i => scoreIds.push(i.scoreId))
      this.loading()
      let params = Object.assign({}, this.searchForm, {
        scoreIds,
        all: all ? 1 : 0,
        page: this.page,
        count: this.count
      })
      this.axios.post('/exportStudentScores', params, {responseType: 'blob'}).then(r => {
        downloadFile(r.data, '学生成绩')
        this.$message.success('导出成功')
        this.loaded.close()
      })
    },
    selectChange(val) {
      this.multipleSelection = val
      if (val.length > 0) this.exportDisabled = false
    },
    getTable(page, count) {
      this.page = page
      this.count = count
      this.getTableData.call(this, '/admins/allScores', this.searchForm)
    },
    updateScore(row) {
      this.$prompt('请输入分数', '提示', {
        inputValue: row.score > -1 ? row.score : '',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /^\d{1,3}.?\d$/,
        // inputErrorMessage: '格式不正确',
        inputValidator: function (v) {
          if (!v) return '请输入分数'
          if (v !== '-1') {
            if (!/^\d{1,3}(\.\d)?$/.test(v)) return '格式不正确'
            if (v < 0 || v > 100) {
              return '分数超过限制'
            }
          }
        }
      }).then(value => {
        this.loading()
        this.axios.post('/admins/updateScore', {
          score: value.value,
          studentId: row.studentId,
          courseId: row.courseId
        }).then(r => {
          let data = r.data
          this.loaded && this.loaded.close()
          if (data.status === 0) {
            this.$message.success(data.message)
            this.tableObj.refresh()
          }
        })
      });
    },
    dateChange(date) {
      if (date && date.length) {
        this.searchForm.createdAtStart = date[0]
        this.searchForm.createdAtEnd = date[1]
      } else {
        this.searchForm.createdAtStart = ''
        this.searchForm.createdAtEnd = ''
      }
    },
    dateChange2(date) {
      if (date && date.length) {
        this.searchForm.classTimeStart = date[0]
        this.searchForm.classTimeEnd = date[1]
      } else {
        this.searchForm.classTimeStart = ''
        this.searchForm.classTimeEnd = ''
      }
    },
    computeIndex(index) {
      return (this.page - 1) * this.count + index + 1
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.date = []
      this.date2 = []
      this.dateChange()
      this.dateChange2()
    },
    search() {
      this.tableObj.search()
    }
  },
  components: {
    qrButton
  }
}
</script>
