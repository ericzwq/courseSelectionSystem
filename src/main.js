import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './network/index.js'
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
  DropdownMenu
} from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import da from "element-ui/src/locale/lang/da";
import ca from "element-ui/src/locale/lang/ca";
// console.log(bcryptjs.compareSync('11',s2))
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
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$loading = Loading.service;

Vue.prototype.loading = function () {
  this.__proto__.loaded = Loading.service({/*Vue.prototype.loaded*/
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
Vue.prototype.$err = function (err, callback) {
  console.log(err)
  this.$message.error('系统繁忙,请稍后重试')
  if (this.loaded) this.loaded.close()
  callback && callback()
}
Vue.prototype.getData = function (url, params, callback) {
  this.loading()
  this.tableData.length = 0
  if (!params) {
    params = {}
    params.page = this.page
    params.count = this.count
  }
  if (!params.page) params.page = this.page
  if (!params.count) params.count = this.count
  this.page = params.page//保证显示的分页索引一致
  let fullUrl = url + '?'
  for (let k in params) {
    fullUrl += k + '=' + params[k] + '&'
  }
  this.axios.get(fullUrl.substr(0, fullUrl.length - 1)).then(r => {
    console.log(r)
    if (!r || !r.data) {
      this.loaded && this.loaded.close()
      return this.$message.error('系统繁忙，请刷新页面')
    }
    if (r.data.notLogin) {
      this.loaded.close()
      return false
    }
    let data = r.data.data
    this.tableData.push(...data[0])
    this.totalCount = data[1].totalCount
    callback && callback(data)
    this.loaded.close()
  }, err => this.$err(err))
}

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
