<template>
  <div>
    <el-upload
        style="width: 100%"
        class="file-upload"
        ref="fileList"
        :action="action"
        :accept="acceptType"
        multiple
        :http-request="request"
        :file-list="fileList"
        :limit="limit"
        :on-exceed="exceed"
        :on-change="fileChange"
        :on-success="successUpload"
        :on-error="errorUpload"
        :on-remove="removeFiles"
        :on-preview="handleMaxPic"
        :list-type="listType"
        :auto-upload="false"
    >
      <el-button v-if="listType === 'text'" slot="trigger" size="small" type="info">选取文件</el-button>
      <el-button v-if="listType === 'text'" style="margin-left: 10px;" size="small" type="primary" :plain="false"
                 @click="submitUpload">上传到服务器
      </el-button>
      <div v-if="listType === 'text'" slot="tip" class="el-upload__tip" style="color:#888888;">
        图片：只能上传jpg／png文件，且不超过500kb；视频：只能上传mp4／avi文件，且不超过500M；文档：只能上传docx／xlsx／pdf文件，且不超过2M，文件名不得超过50字符
      </div>
      <i v-if="listType === 'picture-card'" class="el-icon-plus"></i>
    </el-upload>
    <image-viewer
        :z-index="zIndex"
        v-if="dialogVisible"
        :on-close="closeViewer"
        :url-list="dialogUrls"
        :start="imgStart"
    ></image-viewer>
  </div>
</template>
<script>
  import imageViewer from '@/components/common/image-viewer.vue'

  export default {
    name: 'fileUpload',
    props: {
      clearFiles: {
        type: Boolean,
        default: false
      },
      acceptType: {
        type: String,
        default: ''
      },
      listType: {
        type: String,
        default: 'text'
      },
      limit: {
        type: Number,
        default: 50
      },
      list: {
        type: Array,
        default: () => []
      },
      zIndex: {
        type: Number,
        default: 2000
      },
      scoreId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        action: 'http://localhost:3000/api/teachers/upScoreDetail',
        fileList: this.list || [],
        config: {
          useCdnDomain: false,
          disableStatisticsReport: false,
          retryCount: 6,
          region: null
        },
        dialogVisible: false,
        dialogUrls: [],
        tempDialogUrls: [],
        imgStart: 0
      }
    },
    created() {
    },
    components: {
      imageViewer
    },
    watch: {
      clearFiles(newVal) {
        if (newVal) {
          this.$refs['fileList'].clearFiles()
        }
      }
    },
    methods: {
      // 提交fileList
      submitUpload() {
        this.$refs['fileList'].submit()
      },
      request(obj) {
        const {file} = obj
        let formData = new FormData()
        formData.append('file', file)
        return this.axios.post('/teachers/upScoreDetail/' + this.scoreId, formData, {
          onUploadProgress: e => { // axios获取上传进度
            let percent = e.loaded / e.total * 100 || 0
            obj.onProgress({percent}) // 进度条
          }
        }).then(r => {
          obj.onSuccess(r)
        })
      },
      // 文件状态改变时的钩子 限制文件大小
      fileChange(file, fileList) {
        let size = file.size / 1024
        let type = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
        if (this.listType === 'text') { // 资料上传模块
          if ((type === 'png' || type === 'jpg') && size > 500) {
            this.$message({
              type: 'warning',
              message: '图片大小超出最大限制500kb'
            })
          } else if ((type === 'mp4' || type === 'avi') && size > 512000) {
            this.$message({
              type: 'warning',
              message: '视频大小超出最大限制500M'
            })
          } else if ((type === 'docx' || type === 'xlsx' || type === 'pdf') && size > 2048) {
            this.$message({
              type: 'warning',
              message: '文档大小超出最大限制2M'
            })
          } else if (type !== 'png' && type !== 'jpg' && type !== 'mp4' && type !== 'avi' && type !== 'docx' && type !== 'xlsx' && type !== 'pdf') {
            this.$message({
              type: 'warning',
              message: '不支持该格式文件'
            })
          } else {
            return
          }
        }
        fileList.pop()
      },
      // 文件超出个数限制时的钩子
      exceed() {
        this.$message.error(`最多支持上传${this.limit}个文件`)
      },
      // 上传服务器成功
      successUpload(response, file, fileList) {
        if (!response || response.data.status !== 0) return
        this.$emit('uploadFiles')
      },
      // 上传服务器失败
      errorUpload(_, file) {
        this.$message({
          type: 'error',
          message: '部分文件上传失败， 请重新选择'
        })
      },
      // 文件列表移除文件时的钩子
      removeFiles(file, fileList) {
        if (file.status === 'success') {
          this.tempDialogUrls = fileList
          this.$emit('deleteFiles')
        }
      },
      // 图片预览
      handleMaxPic(file) {
        if (this.listType === 'picture-card') {
          let fileUrl = file.response ? this.baseUrl + file.response['key'] : file.url
          if (this.tempDialogUrls.length > 0) { // 当前页有通过上传新增图片
            this.dialogUrls = this.tempDialogUrls.map((temp, index) => {
              let url = temp.response ? this.baseUrl + temp.response['key'] : temp.url
              if (url === fileUrl) this.imgStart = index
              return url
            })
          } else {
            this.imgStart = this.list.indexOf(fileUrl)
            this.dialogUrls = this.list
          }
          this.dialogVisible = true
        }
      },
      // 关闭图片预览
      closeViewer() {
        this.dialogVisible = false
      }
    }
  }
</script>
