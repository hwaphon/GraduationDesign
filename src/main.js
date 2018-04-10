// 程序的入口，引入程序需要的第三方库文件，如fontawesome，axios等
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import store from './store'
import axios from 'axios'
import $ from 'jquery'
import 'RGBaster'

Vue.use(ElementUI)
Vue.config.productionTip = false
// 设置axios为Vue的全局属性，在Vue文件中以this.http的形式访问
Vue.prototype.http = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
