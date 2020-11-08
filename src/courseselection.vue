<template>
  <div class="t-container">
    <div class="t-slider" v-if="level === 'teachers'">
      <router-link to="/courseselection/teachers/allCourses" class="t-slider-item el-icon-chat-line-square">所有课程
      </router-link>
      <router-link to="/courseselection/teachers/stuScores" class="t-slider-item el-icon-s-data">学生成绩</router-link>
      <router-link to="/courseselection/teachers/addedCourses" class="t-slider-item el-icon-document-add">已发课程
      </router-link>
      <router-link to="/courseselection/updatePsw" class="t-slider-item el-icon-edit">修改密码</router-link>
      <router-link to="/courseselection/logout" class="t-slider-item el-icon-setting">设置</router-link>
    </div>
    <!--    <div class="t-slider" v-if="$router.route === 'students'">-->
    <div class="t-slider" v-if="level === 'students'">
      <router-link to="/courseselection/students/selectedCourses" class="t-slider-item el-icon-chat-line-square">已选课程
      </router-link>
      <router-link to="/courseselection/students/myScores" class="t-slider-item el-icon-document-add">我的成绩</router-link>
      <router-link to="/courseselection/students/selectCourses" class="t-slider-item el-icon-document-add">选择课程
      </router-link>
      <router-link to="/courseselection/updatePsw" class="t-slider-item el-icon-edit">修改密码</router-link>
      <router-link to="/courseselection/logout" class="t-slider-item el-icon-setting">设置</router-link>
    </div>
    <div class="t-slider" v-if="level === 'admins'">
      <router-link to="/courseselection/admins/teachersCourses" class="t-slider-item el-icon-chat-line-square">老师课程
      </router-link>
      <router-link to="/courseselection/admins/allScores" class="t-slider-item el-icon-chat-line-square">所有成绩
      </router-link>
      <router-link to="/courseselection/admins/allTeachers" class="t-slider-item el-icon-document-add">所有老师
      </router-link>
      <router-link to="/courseselection/admins/allStudents" class="t-slider-item el-icon-document-add">所有学生
      </router-link>
      <router-link to="/courseselection/updatePsw" class="t-slider-item el-icon-edit">修改密码</router-link>
      <router-link to="/courseselection/logout" class="t-slider-item el-icon-setting">设置</router-link>
    </div>
    <div class="t-right">
      <header>
        <b class="t-meta el-icon-s-operation">{{$route.meta.title}}</b>
        <el-button v-if="$route.meta.title==='所有课程'" type="primary" plain @click="add" class="addCourse">添加课程
        </el-button>
        <el-button v-if="$route.meta.title==='设置'" type="danger" plain @click="logout" class="addCourse">退出登录
        </el-button>
        <!--        <el-breadcrumb separator="/">-->
        <!--          <el-breadcrumb-item to="/teachers/index">首页</el-breadcrumb-item>-->
        <!--          <el-breadcrumb-item to="/teachers/addedCourses">所有课程</el-breadcrumb-item>-->
        <!--          <el-breadcrumb-item to="/teachers/stuScores">我的课程</el-breadcrumb-item>-->
        <!--          <el-breadcrumb-item to="/teachers/selectedCourses">记录成绩</el-breadcrumb-item>-->
        <!--        </el-breadcrumb>-->
      </header>
      <router-view class="t-main"/>
    </div>
  </div>
</template>
<script>
  import addCourseBox from "@/components/teachers/allCourses/addCourseBox.vue";

  export default {
    name: 'courseselection',
    created() {
    },
    data() {
      return {
        level: sessionStorage.getItem('level'),
        ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100)//不能有相同的ref，否则失效
      }
    },
    methods: {
      add() {
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h(addCourseBox, {ref: this.ruleFormIndex}),
          showCancelButton: true,
          showConfirmButton: true,
          beforeClose: (action, instance, done) => {
            let ruleForm = this.$refs[this.ruleFormIndex]
            let form = ruleForm.ruleForm
            let formData
            if (action === 'confirm') {
              if (ruleForm.submitForm('ruleForm')) {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '添加中...';
                formData = ruleForm.$data.ruleForm
                this.loading()
                this.axios.post('/teachers/addCourse', {
                  courseName: formData.courseName,
                  maxCount: formData.maxCount,
                  classroom: formData.classroom,
                  teacherId: sessionStorage.getItem('id'),
                  // token: sessionStorage.getItem('token')
                }).then(r => {
                  this.loaded && this.loaded.close()
                  done();
                  instance.confirmButtonLoading = false;
                  for (let k in form) {
                    form[k] = ''
                  }
                  if (r.data.notLogin) {
                    location.href = location.origin + '#/login'
                  } else {
                    this.getData.call(this.$children[6], '/teachers/allCourses')
                    this.$message.success('添加成功');
                  }
                }, err => {
                  this.$err(err)
                  done();
                  instance.confirmButtonLoading = false;
                  this.$message.error('添加失败');
                })
              }
            } else {
              done();
            }
          }
        })
      },
      logout() {
        this.$confirm('确定退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sessionStorage.clear()
          this.$message({
            type: 'success',
            message: '成功退出!3秒后跳转'
          });
          setTimeout(() => {
            this.$router.push('/login')
          }, 3000)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
  }
</style>
<style lang="less" scoped>
  .t-container {
    height: 100%;

    .t-slider {
      width: 15%;
      height: 100%;
      background: #363636;
      padding-top: 20px;
      float: left;

      .t-slider-item {
        text-align: center;
        height: 50px;
        line-height: 50px;
        display: block;
        color: grey;
      }

      .t-slider-item.now {
        color: white;
      }

      .t-slider-item:before {
        margin-right: 10px;
      }
    }

    .t-right {
      width: 85%;
      height: 100%;
      padding: 10px;
      overflow: hidden;

      header {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .t-meta {
          font-weight: bold;
        }

        .addCourse {
          float: right;
        }
      }

      .t-main {
      }
    }
  }
</style>
