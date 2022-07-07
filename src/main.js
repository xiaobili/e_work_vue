// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { postRequest } from './utils/api'
import { getRequest } from './utils/api'
import { putRequest } from './utils/api'
import { deleteRequest } from './utils/api'
import { batchDeleteRequest } from './utils/api'
import { uploadRequest } from './utils/api'
import { downloadRequest } from './utils/dwonload'
import store from './store'
import { initMenu } from './utils/menus'
import 'font-awesome/css/font-awesome.min.css'

// 取消控制台警告
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.postRequest = postRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.batchDeleteRequest = batchDeleteRequest
Vue.prototype.uploadRequest = uploadRequest
Vue.prototype.downloadRequest = downloadRequest


// 前置钩子
router.beforeEach((to, from, next) => {
  // 判断是否登录
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store)
    // 判断用户信息是否存在
    if (!window.sessionStorage.getItem('user')) {
      getRequest('/admin/info').then(res => {
        // 将用户信息存储到Vuex中
        store.commit('setUser', res)
        next();
      })
    }
    next();
  } else {
    // 判断路径是否为登录页面
    if (to.path === '/') {
      next();
    } else {
      // 跳转到登录页面，并设置重定向路径
      next('/?redirect=' + to.path);
    }
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
