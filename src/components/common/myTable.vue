<template>
  <div>
    <el-table
        :data="tableData"
        stripe
        ref="table"
        :height="height"
        @selection-change="selectChange"
        style="width: 100%;font-size: 12px">
      <slot name="tableHead"></slot>
    </el-table>
    <el-pagination
        background
        ref="pagination"
        layout="total,sizes,prev, pager, next,jumper"
        :current-page="page"
        @current-change="pageChange"
        @size-change="countChange"
        :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "myTable",
    data() {
      return {
        page: 1,
        count: 10,
        tableHeight: null
      }
    },
    props: ['totalCount', 'tableData', 'height'],
    created() {
      this.getTable()
    },
    methods: {
      refresh() {
        if (this.page < 1) this.page = 1
        this.getTable()
      },
      search() {
        // this.page = 1
        // this.count = 10
        this.getTable()
      },
      getTable() {
        this.$emit('getData', this.page, this.count)
      },
      selectChange(val){
        this.$emit('selection-change',val)
      },
      computeIndex(index) {
        return (this.page - 1) * this.count + index + 1
      },
      pageChange(page) {
        this.page = page
        this.getTable()
      },
      countChange(count) {
        this.count = count
        this.page = 1
        this.getTable()
      },
    },
    watch: {
      totalCount(val) {
        if (this.tableData.length <= 0 && this.page > 1 && val > 0) { //没数据则请求上一页
          this.page = Math.ceil(this.totalCount / this.count)
          this.$emit('getData', this.page, this.count)
        }
      }
    }
  }
</script>
