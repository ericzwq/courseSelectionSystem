<template>
  <my-layout :formCollapse="formCollapse">
    <el-form slot="form" :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form">
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
      <el-form-item class="form_btn">
        <el-button type="default" @click="search">查询</el-button>
        <el-button type="default" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="text" @click="formCollapse = !formCollapse">
          {{formCollapse ? '查看更多' : '收起'}}
          <i :class="[formCollapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top']"></i>
        </el-button>
      </el-form-item>
    </el-form>
    <template slot="tableBtn">
      <el-button type="primary" plain size="mini" @click="exportScore(false)" :disabled="disabled">导出</el-button>
      <qr-button :searchData="searchForm"></qr-button>
      <el-button type="primary" plain size="mini" @click="exportScore(true)">导出全部</el-button>
    </template>
    <template slot-scope="scope" slot="tableLayout">
      <my-table @getData="getTable" ref="table" :tableData="tableData" :height="scope.height" :totalCount="totalCount"
                @selection-change="selectChange">
        <template slot="tableHead">
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" :index="computeIndex" label="序号" width="60" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseName" label="课程名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseId" label="课程号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherName" label="教师名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherId" label="教师号" show-overflow-tooltip></el-table-column>
          <el-table-column
              label="分数" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.score === -1 ? '暂无' : scope.row.score}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="classTime" label="开课时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="{row}">
              <el-button size="mini" type="danger" plain v-if="new Date(row.classTime).getTime() > Date.now()"
                         @click="unselect(row.courseId)">退选
              </el-button>
              <el-button size="mini" disabled plain v-else>无</el-button>
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
  import qrButton from "@/components/common/qrButton.vue";
  export default {
    name: 'selectedCourses',
    data() {
      return {
        searchForm: {
          courseName: '',
          teacherName: '',
          scoreCode: ''
        },
        scoreOptions,
        tableData: [],
        totalCount: 0,
        page: 1,
        count: 10,
        tableObj: {},
        disabled: true,
        multipleSelection: [],
        formCollapse: false,
      }
    },
    mounted() {
      this.tableObj = this.$refs['table']
    },
    methods: {
      getTable(page, count) {
        this.page = page
        this.count = count
        this.getTableData.call(this, '/students/myScores', this.searchForm)
      },
      // 退选
      unselect(courseId) {
        this.$confirm('确定取消选择此课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/students/deleteCourse', {
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
      // 导出
      exportScore(all) {
        this.exporting = true
        let scoreIds = []
        this.multipleSelection.forEach(i => scoreIds.push(i.scoreId))
        this.loading()
        this.axios.post('/students/exportScore', {
          scoreIds, all: all ? 1 : 0, page: this.page, count: this.count
        }, {responseType: 'blob'}).then(r => {
          this.exporting = false
          downloadFile(r.data, '我的成绩')
          this.$message.success('导出成功')
          this.loaded.close()
        })
      },
      selectChange(val) {
        this.multipleSelection = val
        if (val.length > 0) this.disabled = false
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
    components:{
      qrButton
    }
  }
</script>
