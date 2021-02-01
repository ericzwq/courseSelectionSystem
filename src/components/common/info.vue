<template>
  <el-card class="box-card">
    <div slot="header" class="clearFix">
      <span>个人信息</span>
    </div>
    <div class="text item"><span>姓名：</span><span>{{name}}</span></div>
    <div class="text item"><span>身份：</span><span>{{level}}</span></div>
    <div class="text item"><span>性别：</span><span>{{sex}}</span></div>
    <div class="text item"><span>账号：</span><span>{{username}}</span></div>
    <div class="text item"><span>手机号：</span><span>{{phone}}</span></div>
    <div class="text item"><span>邮箱：</span><span>{{email}}</span></div>
    <div class="text item"><span>编号：</span><span>{{id}}</span></div>
    <!--    <div class="text item">{{'姓名: ' + name }}</div>-->
    <!--    <div class="text item">{{'身份: ' + level }}</div>-->
    <!--    <div class="text item">{{'性别: ' + sex }}</div>-->
    <!--    <div class="text item">{{'账号: ' + username }}</div>-->
    <!--    <div class="text item">{{'手机号: ' + phone }}</div>-->
    <!--    <div class="text item">{{'邮箱: ' + email }}</div>-->
    <!--    <div class="text item">{{'编号: ' + id }}</div>-->
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
        email: sessionStorage.getItem('email'),
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
<style lang="less">
  .text {
    font-size: 14px;
  }

  .item {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #EBEEF5;

    span:nth-of-type(1) {
      display: inline-block;
      width: 80px;
    }
  }

  .item:nth-of-type(2n) {
    background: #fafafa;
  }

  .clearFix:before,
  .clearFix:after {
    display: table;
    content: "";
  }

  .clearFix:after {
    clear: both
  }

  .box-card {
    width: 320px;
  }
</style>
