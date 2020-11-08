<template>
  <router-view/>
</template>
<script>
  export default {
    name: 'App',
    created() {
      // this.$router.addRoutes([{path: '/ad', component: () => import('@/components/common/setting.vue')}])
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
  }
  #nprogress .bar {
    background: red !important; /*nprogress自定义颜色*/
  }
</style>
