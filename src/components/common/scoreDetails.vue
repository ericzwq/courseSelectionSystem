<template>
  <my-layout :formCollapse="formCollapse">
    <el-form slot="form" :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form">
      <el-form-item label="文件名" prop="fileName">
        <el-input placeholder="请输入文件名" clearable v-model="searchForm.fileName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="学生名" prop="studentName" v-if="level!=='students'">
        <el-input placeholder="请输入学生名" clearable v-model="searchForm.studentName"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentId" v-if="level!=='students'">
        <el-input placeholder="请输入学号" clearable v-model="searchForm.studentId"
                  @keydown.enter.native="search"></el-input>
      </el-form-item>
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
      <el-form-item label="学生分类" prop="studentCategory" v-if="level === 'teachers'">
        <el-select v-model="searchForm.studentCategory" placeholder="请选择">
          <el-option
              v-for="item in studentCategoryOptions"
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
    <template slot-scope="scope" slot="tableLayout">
      <my-table @getData="getTable" ref="table" :tableData="tableData" :height="scope.height" :totalCount="totalCount">
        <template slot="tableHead">
          <el-table-column type="index" :index="computeIndex" label="序号" width="60"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="文件名称" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <file-detail :file="scope.row"/>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="文件大小" show-overflow-tooltip></el-table-column>
          <el-table-column prop="studentName" label="学生名" v-if="level !== 'students'"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="studentId" label="学号" v-if="level !== 'students'"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseName" label="课程名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="courseId" label="课程号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherName" label="教师名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="teacherId" label="教师号" show-overflow-tooltip></el-table-column>
          <el-table-column label="分数" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.score===-1?'暂无':scope.row.score}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updatedBy" label="修改人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updatedAt" label="修改时间" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作" v-if="level!=='students'">
            <template slot-scope="scope">
              <el-button @click="deleteScoreDetail(scope.row)"
                         v-if="(level==='teachers' && id===scope.row.teacherId)||level==='admins'" size="mini"
                         type="danger" plain class="updateScore">删除
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
  import fileDetail from "./fileDetail.vue";

  export default {
    name: 'scoreDetails',
    data() {
      return {
        searchForm: {
          fileName: '',
          studentName: '',
          studentId: '',
          courseName: '',
          courseId: '',
          teacherName: '',
          scoreCode: '',
          studentCategory: 2
        },
        scoreOptions: [
          {name: '请选择', value: ''},
          {name: '特优(90以上)', value: 1},
          {name: '优(80-89)', value: 2},
          {name: '良(70-79)', value: 3},
          {name: '及格(60-69)', value: 4},
          {name: '不及格(60以下)', value: 5}
        ],
        studentCategoryOptions: [
          // {name: '请选择', value: ''},
          {name: '全部学生', value: 1},
          {name: '我的学生', value: 2},
        ],
        tableData: [],
        totalCount: 0,
        page: 1,
        count: 10,
        id: parseInt(sessionStorage.getItem('id')),
        tableObj: {},
        multipleSelection: [],
        importDialogVisible: false,
        addDialogVisible: false,
        level: '',
        formCollapse: false
      }
    },
    created() {
      if (location.hash.includes('/students/')) {
        this.level = 'students'
        delete this.searchForm.studentName
        delete this.searchForm.studentId
        delete this.searchForm.studentCategory
      } else if (location.hash.includes('/teachers/')) {
        this.level = 'teachers'
      } else if (location.hash.includes('/admin')) {
        this.level = 'admins'
        delete this.searchForm.studentCategory
      } else {
        this.$router.push('/login')
      }
    },
    mounted() {
      this.tableObj = this.$refs['table']
    },
    methods: {
      getTable(page, count) {
        this.page = page
        this.count = count
        this.getTableData.call(this, '/scoreDetails', this.searchForm, (data) => {
          data[0].forEach(i => {
            let kb = i.size / 1024 + ''
            let dot = kb.indexOf('.')
            i.size = kb.substring(0, dot + 3) + 'kb'
          })
        })
      },
      deleteScoreDetail(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/deleteScoreDetail', {materialId: row.materialId}).then(r => {
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
    },
    components: {
      fileDetail
    }
  }
</script>
