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
      <el-form-item label="课程名" prop="courseName">
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
      <el-form-item label="学生分类" prop="studentCategory">
        <el-select v-model="searchForm.studentCategory" placeholder="请选择">
          <el-option
              v-for="item in studentCategoryOptions"
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
      <el-button type="primary" plain size="mini" @click="exportScore(true)">导出全部</el-button>
      <qr-button :searchData="searchForm"></qr-button>
      <el-button type="success" plain size="mini" @click="importScore">导入</el-button>
      <!--      <el-button type="primary" plain size="mini" @click="test">测试</el-button>-->
      <el-dialog class="init-dialog" title="导入" width="450px" :close-on-click-modal="false"
                 :visible.sync="importDialogVisible">
        <div style="width: 360px;margin: 0 auto;">
          <el-upload
              ref="myUpload"
              drag
              action="/"
              :multiple="false"
              :show-file-list="true"
              :file-list="fileList"
              :http-request="submitUpload"
              accept=".xls,.xlsx"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><em>点击上传文件</em></div>
            <div class="el-upload__tip" slot="tip">提示: 请严格按照xls、xlsx导入模版填写表格数据,若为导入模板只需更改分数即可,
              且一次导入的行数不可超过50个，否则可能导入失败
            </div>
          </el-upload>
          <el-button icon="el-icon-download" type="text" size="medium" @click="onTemplateDownload">
            模板下载(请先勾选需要录入分数的项目以方便填写)
          </el-button>
        </div>
      </el-dialog>
      <el-dialog class="init-dialog" title="添加成绩详情" width="450px" :close-on-click-modal="false"
                 :visible.sync="addDialogVisible" @close="handleClose">
        <el-form label-width="100px">
          <el-form-item label="文件上传" prop="uploadedFiles">
            <file-upload
                style="width: 100%;"
                acceptType="image/jpeg,image/png,
                            audio/mp4,video/mp4,video/x-msvideo,
                            application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                            application/pdf"
                :clearFiles="clearFiles"
                :scoreId="currentScoreId"
                :limit="20"
                @uploadFiles="onUploadFiles"
            ></file-upload>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </el-form>
      </el-dialog>
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
          <el-table-column label="分数" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.score === -1 ? '暂无' : scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="classTime" label="开课日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" width="100" label="操作">
            <template slot-scope="{row}">
              <el-button size="mini" type="primary" plain
                         v-if="row.score === -1 && id===row.teacherId && new Date(row.classTime).getTime() <= Date.now()"
                         @click="addScore(row)">添加分数
              </el-button>
              <el-button size="mini" v-else-if="row.score>-1 && id===row.teacherId" type="success" plain
                         @click="addDetail(row)">添加详情
              </el-button>
              <el-button size="mini" v-else type="default" plain disabled>无</el-button>
            </template>
          </el-table-column>
        </template>
      </my-table>
    </template>
  </my-layout>
</template>

<script>
import {downloadFile} from '@/utils/tools.js'
import {scoreOptions} from '@/utils/dictionary.js'
import fileUpload from "@/components/common/fileUpload.vue";
import qrButton from "@/components/common/qrButton.vue";

export default {
  name: 'stuScores',
  data() {
    return {
      searchForm: {
        studentName: '',
        studentId: '',
        courseName: '',
        teacherName: '',
        scoreCode: '',
        studentCategory: 2,
        createdAtStart: '',
        createdAtEnd: '',
        classTimeStart: '',
        classTimeEnd: ''
      },
      scoreOptions,
      studentCategoryOptions: [
        // {name: '请选择', value: ''},
        {name: '全部学生', value: 1},
        {name: '我的学生', value: 2},
      ],
      date: [],
      date2: [],
      tableData: [],
      totalCount: 0,
      page: 1,
      count: 10,
      id: parseInt(sessionStorage.getItem('id')),
      tableObj: {},
      exportDisabled: true,
      multipleSelection: [],
      importDialogVisible: false,
      addDialogVisible: false,
      fileList: [],
      rules: [
        {
          required: true, validator: (r, v, cb) => {
            if (!v) return cb(new Error('请输入分数'))
            if (!/^\d+$/.test(v)) return cb(new Error('请输入正整数'))
            if (v > 100) return cb(new Error('分数不能超过100'))
            cb()
          }, trigger: 'blur'
        }
      ],
      clearFiles: false,
      currentScoreId: '',
      formCollapse: false,
    }
  },
  mounted() {
    this.tableObj = this.$refs['table']
  },
  methods: {
    test() {
      // 添加用户类
      // let start = 1
      // for (let i = start; i < start + 500; i++) {
      //   this.axios.get('http://www.cheesestudio.cn:3000/test/insertTeachers', {params: {i}})
      // }
      // 添加课程
      // for (let i = 1; i <= 1000; i++) {
      //   this.axios.get('http://www.cheesestudio.cn:3000/test/addCourses', {params: {i: 990102030201 + Math.ceil(Math.random() * 200000)}})
      // }
      // 选课
      // for (let i = 1; i <= 1000; i++) {
      //   this.axios.get('http://www.cheesestudio.cn:3000/test/selectCourses', {params: {i: 200102030201 + Math.ceil(Math.random() * 1000000)}})
      // }
      // 导出
      // this.axios.get('http://localhost:3000/test/export')
    },
    submitUpload(obj) {  // 上传
      let {file} = obj
      let data = new FormData()
      data.append('file', file)
      this.loading()
      this.axios.post('/teachers/upScoreFile', data).then(r => {
        if (r.data.status === 0) this.$message.success('导入成功')
        // this.loaded.close()
        this.importDialogVisible = false
        this.$refs['myUpload'].clearFiles()
        this.tableObj.refresh()
      })
    },
    onTemplateDownload() { // 模板下载
      if (this.multipleSelection.length < 1) return this.$message.error('请先勾选相应的项目再下载模板')
      let scoreIds = []
      this.multipleSelection.forEach(i => scoreIds.push(i.scoreId))
      this.axios.post('/teachers/template', {scoreIds}, {responseType: 'blob'}).then(r => {
        if (r.headers['content-type'].toLowerCase().startsWith('application/json')) {
          return this.$message.error('获取文件失败')
        }
        downloadFile(r.data, '学生成绩模板')
      })
    },
    importScore() {
      this.importDialogVisible = true
    },
    getTable(page, count) {
      this.page = page
      this.count = count
      this.getTableData.call(this, '/teachers/stuScores', this.searchForm)
    },
    addScore(row) {
      this.$prompt('请输入分数(添加后不可修改)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /^\d{1,3}.?\d$/,
        // inputErrorMessage: '格式不正确',
        inputValidator: function (v) {
          if (!v) return '请输入分数'
          if (!/^\d{1,3}(\.\d)?$/.test(v)) return '格式不正确'
          if (v < 0 || v > 100) {
            return '分数超过限制'
          }
        }
      }).then(({value}) => {
        // this.loading()
        this.axios.post('/teachers/addScore', {
          studentId: row.studentId,
          courseId: row.courseId,
          score: value
        }).then(r => {
          // this.loaded.close()
          if (r.data.status === 0) {
            row.score = parseInt(value)
            this.$message.success('添加成功')
          }
          this.tableObj.refresh()
        })
      })
    },
    handleClose() {
      this.clearFiles = true
      this.$nextTick(() => this.clearFiles = false)
    },
    addDetail(row) {
      this.currentScoreId = row.scoreId
      this.addDialogVisible = true
    },
    exportScore(all) {
      let scoreIds = []
      if (!all) this.multipleSelection.forEach(i => scoreIds.push(i.scoreId))
      let params = Object.assign({}, this.searchForm, {all: all ? 1 : 0, page: this.page, count: this.count,scoreIds})
      this.axios.post('/exportStudentScores', params, {responseType: 'blob'}).then(r => {
        downloadFile(r.data, '学生成绩')
        this.$message.success('导出成功')
        // this.loaded.close()
      })
    },
    selectChange(val) {
      this.multipleSelection = val
      if (val.length > 0) this.exportDisabled = false
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
    },
    // 上传成功
    onUploadFiles() {
      // this.addDialogVisible = false
      this.$message.success('上传成功')
      // this.tableObj.refresh()
    }
  },
  components: {
    fileUpload,
    qrButton
  }
}
</script>
