import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './network/index.js'
import myLayout from "./components/common/myLayout.vue";
import myTable from "./components/common/myTable.vue";
// import elementUi from 'element-ui'
import {
  Table,
  TableColumn,
  MessageBox,
  Message,
  Form,
  FormItem,
  Input,
  Button,
  Card,
  Loading,
  Pagination,
  RadioGroup,
  Radio,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Avatar,
  Select,
  Option,
  Dialog,
  Upload,
  Tooltip,
  DatePicker,
  Breadcrumb,
  BreadcrumbItem
} from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.axios = axios
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Avatar)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Tooltip)
Vue.use(DatePicker)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$loading = Loading.service;

Vue.component('myLayout', myLayout)
Vue.component('myTable', myTable)

Vue.prototype.loading = function () {
  this.__proto__.loaded = Loading.service({/*Vue.prototype.loaded*/
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.3)'
  })
}
// Vue.prototype.$err = function (err, callback) {
//   console.log(err)
//   this.$message.error('系统繁忙,请稍后重试')
//   if (this.loaded) this.loaded.close()
//   callback && callback()
// }
Vue.prototype.getTableData = function (url, params, callback) {
  // this.loading()
  this.tableData.length = 0
  if (!params) params = {}
  this.axios.get(url, {params: {...params, page: this.page, count: this.count}}).then(r => {
    if (!r || !r.data || !r.data.data) {
      // return this.loaded && this.loaded.close()
      // return this.$message.error('系统繁忙，请刷新页面')
    }
    if (r.data.notLogin) {
      // this.loaded.close()
      return false
    }
    let data = r.data.data
    callback && callback(data)
    // this.tableData.push(...data[0])
    this.tableData = data[0]
    this.totalCount = data[1].totalCount
    if (data[2] && data[2].selectedCourseIds) this.selectedCourseIds = data[2].selectedCourseIds
    // this.loaded.close()
    return data
  }, /*() => this.loaded && this.loaded.close()*/)
}

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
