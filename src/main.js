import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//富文本编辑器的引入
import VueQuillEditor from 'vue-quill-editor'
//富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


import {Breadcrumb,Button,Form,FormItem,Input,Message,Header,Container,Aside,Main,Menu,Submenu,MenuItem,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane} from 'element-ui'

Vue.use(ElementUI);
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
//注册
Vue.component('tree-table',TreeTable)
//使用富文本编辑器
Vue.use(VueQuillEditor)

// axios.defaults.baseURL = 'http://127.0.0.1：8888/api/private/v1/'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//请求拦截器
axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('token');
    //console.log(config)
    return config;
})

//全局时间过滤器
Vue.filter('dateFormat',function(original){
  const dt = new Date(original)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// Vue.filter('dataFormat',function(original){
//   const dt = new DataCue(original)
//   const y = dt.getFullYear()
//   const m = dt.getMonth()+1 + ''
//   const d = dt.getDay() + ''
//   const hh = dt.getHours() + ''
//   const mm = dt.getMinutes() + ''
//   const ss = dt.getSeconds() + ''
// })

Vue.prototype.axios = axios;
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
