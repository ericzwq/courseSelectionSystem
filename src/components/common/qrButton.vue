<template>
  <el-button type="primary" plain size="mini" class="qr_export" ref="qr_export">
    <slot>导出全部至手机</slot>
  </el-button>
</template>

<script>
  export default {
    name: "qrButton",
    props: ['searchData'],
    mounted() {
      let img = document.createElement('img')
      img.classList.add('qr_img')
      let qrExport = this.$refs['qr_export'].$el
      let imgFlag = false
      let imgTime = 0, timer, timer2, url, isLoading = false, isOut = true
      qrExport.append(img)
      qrExport.addEventListener('mouseover', () => {
        isOut = false
        if (imgFlag) return clearTimeout(timer)
        timer = setTimeout(() => {
          if ((Date.now() > imgTime + 1000 * 60 * 10 || !url) && !isLoading) { // 10分钟获取一次
            isLoading = true
            this.axios.get('/qrExportScore', {
              params: {
                ...this.searchData
              }, responseType: 'blob'
            }).then(r => {
              isLoading = false
              imgTime = Date.now()
              url = URL.createObjectURL(new Blob([r.data]))
              img.src = url
            })
          }
          if (!isOut){
            img.alt = '二维码加载失败'
            img.style.display = 'block'
            imgFlag = true
          }
        }, 200)
      })
      qrExport.addEventListener('mouseout', () => {
          img.style.display = 'none'
          imgFlag = false
          isOut = true
      })
    }
  }
</script>

<style lang="less">
  .qr_export {
    position: relative;

    .qr_img {
      position: absolute;
      top: 40px;
      left: 0;
      width: 200px;
      height: 200px;
      display: none;
      z-index: 1000;
    }
  }
</style>
