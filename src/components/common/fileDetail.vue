<template>
  <div class="">
    <div class="file-name" @click="getFile">{{file.fileName}}</div>
    <!-- 图片放大 -->
    <image-viewer
        :z-index="2000"
        v-if="showPic"
        :on-close="() => showPic = false"
        :url-list="picUrl"
        :start="0"
    >
    </image-viewer>
    <el-dialog :visible.sync="showVideo">
      <video ref="video" controls preload="meta" width="600" :src="videoUrl"/>
    </el-dialog>
  </div>
</template>

<script>
  import imageViewer from '../../components/common/image-viewer'
  import {fileURL} from '../../network/index'
  export default {
    name: 'fileDetail',
    components: {
      imageViewer
    },
    props: ['file'],
    data () {
      return {
        fileURL,
        showPic: false,
        picUrl: [],
        showVideo: false,
        videoUrl: ''
      }
    },
    methods: {
      isVideo (filename) {
        return /mp4|MP4|avi|AVI/.test(filename)
      },
      isPicture (filename) {
        return /jpg|JPG|png|PNG/.test(filename)
      },
      isFile (filename) {
        return /docx|DOCX|xlsx|XLSX|pdf|PDF/.test(filename)
      },
      getFile () {
        const { fileName, url } = this.file
        if (this.isVideo(fileName)) {
          this.videoUrl = [this.fileURL + url]
          this.showVideo = true
        }
        if (this.isPicture(fileName)) {
          this.showPic = true
          this.picUrl = [this.fileURL + url]
        }
        if (this.isFile(fileName)) {
          let el = document.createElement('a')
          el.setAttribute('href', this.fileURL + url)
          document.body.appendChild(el)
          el.click()
          document.body.removeChild(el)
        }
      }
    },
    watch: {
      showVideo (val) {
        if (val === false) {
          this.$refs.video.pause()
        }
      }
    }
  }
</script>

<style lang="less" scope>
  .file-name {
    color: blue;
    cursor: pointer;
  }

  video {
    width: 100%;
    max-height: 600px;
  }
</style>
