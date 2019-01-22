// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import VueWorker from 'vue-worker';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import 'babel-polyfill';
import App from './App';
import store from './store/index';
import { router } from './router/index';
import './utils/icon-svg';
import global from './utils/global';

Vue.use(ElementUI);
Vue.use(global);
Vue.use(VueWorker);
Vue.config.productionTip = false;

dayjs.locale('zh-cn');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
