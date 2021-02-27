<template>
  <div class="t-container">
    <div class="t-slider">
      <el-avatar style="margin: 20px auto;display: block" size="large"
                 src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
      <router-link v-for="i in routers" :to="i.to" :class="i.class">{{ i.content }}</router-link>
    </div>
    <div class="t-right">
      <header>
        <!--        <b class="t-meta el-icon-s-operation">{{$route.meta.title}}</b>-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button v-if="$route.meta.title==='所有课程'" type="primary" size="small" plain @click="add" class="addCourse">
          添加课程
        </el-button>
        <el-button v-else-if="$route.meta.title==='设置'" type="danger" size="small" plain @click="logout"
                   class="addCourse">退出登录
        </el-button>
      </header>
      <router-view class="t-main"/>
    </div>
  </div>
</template>
<script>
import addCourseBox from "@/components/teachers/allCourses/addCourseBox.vue";

export default {
  name: 'courseselection',
  data() {
    return {
      level: sessionStorage.getItem('level'),
      ruleFormIndex: 'ruleForm' + Math.ceil(Math.random() * 100),//不能有相同的ref，否则失效
      routers: JSON.parse(sessionStorage.getItem('routers'))
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
                classTime: formData.classTime,
                // token: sessionStorage.getItem('token')
              }).then(r => {
                this.loaded && this.loaded.close()
                done();
                instance.confirmButtonLoading = false;
                // for (let k in form) {
                //   form[k] = ''
                // }
                if (r.data.notLogin) {
                  // location.href = location.origin + '#/login'
                  this.$router.push('/login')
                } else {
                  let table
                  for (let v of this.$children) {
                    if (v.$el.className === 't-main') {
                      table = v
                      break
                    }
                  }
                  table.$refs.table.refresh()
                  if (r.data.status === 0) {
                    this.$message.success('添加成功')
                    ruleForm.resetForm('ruleForm')
                  }
                }
              }, err => {
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
      })
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
  min-width: 840px;

  .t-slider {
    width: 200px;
    height: 100%;
    background: #000;
    padding-top: 20px;
    float: left;

    .t-slider-item {
      text-align: center;
      height: 50px;
      line-height: 50px;
      display: block;
      color: #fff;
    }

    .t-slider-item.now {
      color: #409EFF;
      background: #444;
    }

    .t-slider-item:before {
      margin-right: 10px;
    }
  }

  .t-right {
    height: 100%;
    padding: 10px;
    overflow: auto;

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
  }
}
</style>
