<template>
  <el-table
      :data="tableData"
      stripe
      style="width: 100%">
    <el-table-column
        prop="index"
        label="序号"
        width="180">
    </el-table-column>
    <el-table-column
        prop="name"
        label="课程名"
        width="180">
    </el-table-column>
    <el-table-column
        prop="teacher"
        label="教师名">
    </el-table-column>
    <el-table-column
        prop="score"
        label="分数">
      <template slot-scope="scope">
        <span>{{scope.row.score===-1?'暂无':scope.row.score}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

  export default {
    name: 'myScores',
    mounted() {

    },
    methods: {
    },
    data() {
      return {
        tableData: [{
          index: 1,
          name: '王小虎',
          teacher: '地方',
          score: 99,
        }, {
          index: 2,
          name: '王小虎2',
          teacher: '地方',
          score: 98,
        }, {
          index: 3,
          name: '王小虎3',
          teacher: '地方',
          score: -1,
        }, {
          index: 4,
          name: '王小虎4',
          teacher: '地方',
          score: 59,
        }]
      }
    }
  }
</script>