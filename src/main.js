// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import Layout from '@/components/layout'
import VueResource from 'vue-resource'
import {singer,musicmin} from "./utils/zrUtil";
import store from './store'
import axios from 'axios'

import _ from 'lodash'
Vue.prototype._ = _

Vue.use(ElementUI)
Vue.use(VueResource)
Vue.filter("singer",singer);
Vue.filter("musicmin",musicmin);
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<Layout/>',
  components: { Layout }
})
