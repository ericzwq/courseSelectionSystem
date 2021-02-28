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
        <el-button type="text" @click="formCollapse=!formCollapse">
          {{ formCollapse ? '查看更多' : '收起' }}
          <i :class="[formCollapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top']"></i>
        </el-button>
      </el-form-item>
    </el-form>
    <template slot-scope="scope" slot="tableLayout">
      <div class="charts" ref="echarts" :style="{height:scope.height}" :data-h="scope.height"></div>
      <div class="charts" ref="echarts2"></div>
    </template>
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
      pieChart: null,
      barChart: null,
      chartData: {},
      isStu: true,
      title: '我的成绩分布',
      url: '/students/getGradeDistributions',
      chartsNames: ['≥90分', '≤80<90分', '≤70<80分', '≤60<70分', '≤0<60分', '暂无成绩']
    }
  },
  created() {
    if (sessionStorage.getItem('level') !== 'students') {
      this.isStu = false
      this.title = '学生成绩分布'
      this.url = '/getAllGradeDistributions'
    }
  },
  mounted() {
    this.$nextTick(() => {
      let $refs = this.$refs
      let echartsDom = $refs['echarts']
      // let height = echartsDom.clientHeight + 60
      let height = parseInt(echartsDom.getAttribute('data-h').slice(0, -2)) + 60
      let width = echartsDom.clientWidth
      echartsDom.style.height = height + 'px'
      let myChart = echarts.init(echartsDom, 'dark')
      this.pieChart = myChart
      // 绘制图表
      myChart.setOption({
        title: {
          text: this.title,
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
            data: [],
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
      myChart.resize({height, width})
      let echarts2Dom = $refs['echarts2']
      echarts2Dom.style.height = height + 'px'
      let myChart2 = echarts.init(echarts2Dom, 'dark');
      this.barChart = myChart2
      myChart2.setOption({
        color: 'blue',
        title: {
          text: this.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartsNames,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: []
          }
        ]
      })
      myChart2.resize({height, width})
      this.getChartData() // 先初始化再获取数据
    })
  },
  updated() {
    this.$nextTick(() => { // 主要处理更新后图表的宽度问题
      let w = document.documentElement.clientWidth
      let width = w <= 1230 ? (w - 220) * 0.9 : (w - 220) / 2 - 5
      let echartsDom = this.$refs['echarts']
      let echarts2Dom = this.$refs['echarts2']
      // let height = echartsDom.clientHeight + 60
      let height = parseInt(echartsDom.getAttribute('data-h').slice(0, -2)) + 60
      echartsDom.style.height = height + 'px'
      echarts2Dom.style.height = height + 'px'
      // let width = this.$refs['echarts'].clientWidth
      this.pieChart.resize({height, width})
      this.barChart.resize({height, width})
    })
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
      this.pieChart.setOption({series: [{data: this.formatChartData('pie')}]})
      this.barChart.setOption({series: [{data: this.formatChartData('bar')}]})
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formatChartData(type) {
      let data = []
      let chartData = this.chartData
      let chartDataNames = this.chartsNames
      let sum = 0
      for (let i = 0, len = chartData.length; i < len; i++) {
        let value = chartData[i]['level' + i]
        sum += value
        if (type === 'bar') {
          data = data.concat(value)
        } else if (type === 'pie') {
          data = data.concat({value, name: chartDataNames[i]})
        }
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

<style>
.charts {
  width: calc(50% - 5px);
  min-width: 500px;
  float: left;
}

.charts:last-of-type {
  margin-left: 10px;
}

@media screen and (max-width: 1230px) {
  /*宽度不够时*/
  /*多出来的20内边距+10左边距*/
  .charts {
    width: 90%;
    margin: 0 auto;
    float: none;
  }

  .charts:last-of-type {
    margin: 10px auto;
  }
}
</style>
