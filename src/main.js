import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import './assets/css/global.css'

// import {Button} from 'element-ui'
// import {Form,FormItem} from 'element-ui'
// import {Input} from 'element-ui'
// import Message from 'element-ui'

import {Button,Form,FormItem,Input,Message} from 'element-ui'

Vue.use(ElementUI);
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message

Vue.prototype.axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1：8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
