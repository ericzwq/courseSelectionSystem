<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>
    <div class="text item">{{'姓名: ' + name }}</div>
    <div class="text item">{{'身份: ' + level }}</div>
    <div class="text item">{{'性别: ' + sex }}</div>
    <div class="text item">{{'账号: ' + username }}</div>
    <div class="text item">{{'手机号: ' + phone }}</div>
    <div class="text item">{{'编号: ' + id }}</div>
  </el-card>
</template>
<script>
  export default {
    name: 'info',
    data() {
      return {
        name: sessionStorage.getItem('name'),
        sex: sessionStorage.getItem('sex'),
        username: sessionStorage.getItem('username'),
        phone: sessionStorage.getItem('phone'),
        id: sessionStorage.getItem('id'),
        level: sessionStorage.getItem('level')
      }
    },
    created() {
      this.level = this.level === 'admins' ? '管理员' : this.level === 'teachers' ? '教师' : this.level === 'students' ? '学生' : ''
      if (!this.level) this.$router.push('/login')
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
