// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import moment from 'moment';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import store from './store/index';
import router from './router';
import { userToken } from './utils/storage';
import types from './store/type';
import './utils/icon-svg';

Vue.use(ElementUI);
Vue.config.productionTip = false;

moment.locale('zh-cn');

router.beforeEach((to, from, next) => {
  if (store.state.base.token) {
    if (to.path === '/login') {
      next('/');
    } else {
      next();
    }
  } else if (userToken.get()) {
    const token = userToken.get();
    store.dispatch('loginByToken', { token }).then(accessedRouters => {
      store.commit(types.SET_TOKEN, { token });
      router.addRoutes(accessedRouters);
      // store.commit(types.SET_ROUTERS, accessedRouters);
      next(to);
    });
  } else if (to.path === '/login') {
    next();
  } else {
    next('/login');
  }
});

router.afterEach(to => {
  if (to.meta.breadcrumb) {
    store.commit(types.SET_BREADCRUMB, to.meta.breadcrumb);
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
