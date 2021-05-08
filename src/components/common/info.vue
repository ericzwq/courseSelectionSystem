<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>
    <div class="text item">{{'姓名: ' + name }}</div>
    <div class="text item">{{'账号: ' + username }}</div>
    <div class="text item">{{'手机号: ' + phone }}</div>
  </el-card>
</template>
<script>
  export default {
    name:'info',
    data(){
      return {
        name:sessionStorage.getItem('name'),
        username:sessionStorage.getItem('username'),
        phone:sessionStorage.getItem('phone'),
      }
    }
  }
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>