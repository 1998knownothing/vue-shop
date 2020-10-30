// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/css/reset.css'

Vue.use(ElementUI);


Vue.config.productionTip = false

//axios本身不是插件,以下用法为 使得axios封装成插件 Vue.use 加载插件
import MyServerHttp from '@/plugins/http.js'
Vue.use(MyServerHttp)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //render:(h)=>(App)  === 下列代码作用
  components: { App },
  template: '<App/>'
})
