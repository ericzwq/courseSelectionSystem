<template>
  <my-layout :formCollapse="formCollapse">
    <el-form slot="form" :inline="true" size="mini" ref="searchForm" :model="searchForm" class="search_form"
             v-if="!isStu">
      <el-form-item label="学生名" prop="studentName">
        <el-input placeholder="请输入学生名" clearable v-model.trim="searchForm.studentName"
                  @keydown.enter.native="getChartData"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input placeholder="请输入学号" clearable v-model.trim="searchForm.studentId"
                  @keydown.enter.native="getChartData"></el-input>
      </el-form-item>
      <el-form-item label="课程名" class="search-item" prop="courseName">
        <el-input placeholder="请输入课程名" clearable v-model.trim="searchForm.courseName"
                  @keydown.enter.native="getChartData"></el-input>
      </el-form-item>
      <el-form-item label="课程号" prop="courseId">
        <el-input placeholder="请输入课程号" clearable v-model.trim="searchForm.courseId"
                  @keydown.enter.native="getChartData"></el-input>
      </el-form-item>
      <el-form-item label="教师名" prop="teacherName">
        <el-input placeholder="请输入教师名" clearable v-model.trim="searchForm.teacherName"
                  @keydown.enter.native="getChartData"></el-input>
      </el-form-item>
      <el-form-item label="教师号" prop="teacherId">
        <el-input placeholder="请输入教师号" clearable v-model.trim="searchForm.teacherId"
                  @keydown.enter.native="getChartData"></el-input>
      </el-form-item>
      <el-form-item class="form_btn">
        <el-button type="default" @click="getChartData">查询</el-button>
        <el-button type="default" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="text" @click="formCollapse = !formCollapse">
          {{ formCollapse ? '查看更多' : '收起' }}
          <i :class="[formCollapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top']"></i>
        </el-button>
      </el-form-item>
    </el-form>
    <div id="echarts" style="width: 600px;height: 400px"></div>
  </my-layout>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "index",
  data() {
    return {
      formCollapse: false,
      searchForm: {
        studentName: '',
        studentId: '',
        courseName: '',
        courseId: '',
        teacherName: '',
        teacherId: ''
      },
      chartObj: null,
      chartData: {},
      isStu: true,
      url: '/students/getGradeDistributions'
    }
  },
  created() {
    if (sessionStorage.getItem('level') !== 'students') {
      this.isStu = false
      this.url = '/getAllGradeDistributions'
    }
  },
  mounted() {
    let myChart = echarts.init(document.getElementById('echarts'))
    this.chartObj = myChart
    // 绘制图表
    myChart.setOption({
      title: {
        text: '我的成绩分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          // data: this.formatChartData(this.chartData),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
    this.getChartData() // 先初始化再获取数据
  },
  methods: {
    getChartData() {
      this.axios.get(this.url, {params: {...this.searchForm}}).then(r => {
        let data = r.data
        if (data.status !== 0) return
        this.chartData = r.data.data
        this.refreshChart()
      })
    },
    refreshChart() {
      this.chartObj.setOption({series: [{data: this.formatChartData(this.chartData),}]})
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formatChartData(chartData) {
      let data = []
      let chartDataNames = ['≥90分', '≤80<90分', '≤70<80分', '≤60<70分', '≤0<60分', '暂无成绩']
      let sum = 0
      for (let i = 0, len = chartData.length; i < len; i++) {
        let value = chartData[i]['level' + i]
        sum += value
        data = data.concat({value, name: chartDataNames[i]})
      }
      if (sum === 0) {
        data = []
        this.$message.warning('无数据')
      }
      return data
    }
  }
}
</script>

<style scoped>

</style>
