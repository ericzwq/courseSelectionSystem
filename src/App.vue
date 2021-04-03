<template>
  <router-view/>
</template>
<script>
export default {
  name: 'App',
  created() {
    // this.$bk-router.addRoutes([{path: '/ad', component: () => import('@/components/common/setting.vue')}])
    // console.log(this)
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
  color: #409EFF;
}

#nprogress .bar {
  background: #409EFF !important; /*nprogress自定义颜色*/
}
</style>
