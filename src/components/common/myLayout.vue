<template>
  <div>
    <slot name="form"></slot>
    <slot name="tableBtn"></slot>
    <slot name="tableLayout" :height="tableHeight"></slot>
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'myLayout',
  data() {
    return {
      page: 1,
      count: 10,
      tableHeight: null,
      lineNum: 0,
    }
  },
  props: ['formCollapse'],
  methods: {
    computeLayout() {
      let slots = this.$slots
      // 计算搜索按钮位置
      let form = slots['form']
      if (form) {
        let form = this.$slots.form[0].child
        let inputs = form.$children
        if (inputs.length > 0) {
          let inputWidth = inputs[0].$el.clientWidth + 10 // +margin
          let inputCount = form.$children.filter(i => i.$el.style.display !== 'none').length - 1 // 显示的输入框总数
          let formWidth = form.$el.clientWidth
          // let btn = form.$children[inputCount].$el
          let btn = form.$children.find(i => i.$el.classList.contains('form_btn'))
          let lineNum = Math.floor(formWidth / inputWidth) //每行最多输入框数
          this.lineNum = lineNum
          let lastLineNum = inputCount % lineNum //最后一行放几个
          if (btn && btn.$el) btn.$el.style.marginLeft = (lineNum - lastLineNum - 1) * inputWidth + 100 + 'px' // 100 为label宽度
        }
      }
      // 计算表格高度
      let winHeight = document.documentElement.clientHeight
      let headerHeight = 50
      let tableBtn = slots['tableBtn']
      let formHeight = form ? form[0].child.$el.clientHeight : 0
      let tableBtnHeight = tableBtn ? tableBtn[0].child.$el.clientHeight : 0
      this.tableHeight = winHeight - headerHeight - formHeight - tableBtnHeight - 80 + 'px'
    },
    toggleBtnDisplay(v) {
      // 计算输入框收起,展开
      let form = this.$slots['form']
      if (!form || !form[0].child) return
      let inputs = this.$slots.form[0].child.$children
      let inputCount = inputs.length - 1 // 输入框总数
      for (let i = v ? this.lineNum : 0; i < inputCount + 1; i++) {
        if (inputs[i].$el.classList.contains('form_btn')) continue
        inputs[i].$el.style.display = v ? 'none' : 'inline-block'
      }
      this.computeLayout()
    }
  },
  mounted() {
    this.computeLayout()
  },
  updated() {
    this.toggleBtnDisplay(this.formCollapse)
    document.body.onresize = () => {
      this.computeLayout()
    }
  },
  // watch: {
  //   formCollapse(newV) {
  // this.toggleBtnDisplay(newV)
  // this.computeLayout()
  // }
  // }
}
</script>
<style lang="less">
.search_form {

  .el-form-item {
    width: 300px;

    .el-form-item__content {
      .el-date-editor {
        width: 200px;
        padding: 3px 3px 3px 10px;

        .el-range-separator {
          line-height: 19px;
          width: auto;
        }

        .el-range-input {
          width: 47%;
        }
      }

      .el-input, .el-select {
        width: 200px;
      }
    }

    .el-form-item__label {
      font-size: 12px;
      width: 100px;
    }
  }

  .el-form-item:last-of-type { /*.search_btn*/
    width: 200px;
  }
}

.el-pagination {
  text-align: right;
  margin-top: 16px;
}
</style>
