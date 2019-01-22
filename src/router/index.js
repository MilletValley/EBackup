import { Message } from 'element-ui';
import { userToken } from '../utils/storage';
import types from '../store/type';
import store from '../store/index';

import {
  basicRouters as pcBasicRouters,
  asyncRouters as pcAsyncRouters,
  router as pcRouter
} from './pc';
import {
  basicRouters as mobileBasicRouters,
  asyncRouters as mobileAsyncRouters,
  router as mobileRouter
} from './mobile';

/* eslint-disable */
let curRouter = pcRouter;
let curAsyncRouters = pcAsyncRouters;
let curBasicRouters = pcBasicRouters;
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
  curRouter = mobileRouter;
  curAsyncRouters = mobileAsyncRouters;
  curBasicRouters = mobileBasicRouters;
}
curRouter.beforeEach((to, from, next) => {
  if (store.state.base.token) {
    if (to.path === '/login') {
      next('/');
    } else {
      next();
    }
  } else if (userToken.get()) {
    const token = userToken.get();
    store
      .dispatch('loginByToken', { token })
      .then(accessedRouters => {
        store.commit(types.SET_TOKEN, { token });
        curRouter.addRoutes(accessedRouters);
        next({ ...to, replace: true });
      })
      .catch(error => {
        Message.error(error);
        store.commit(types.CLEAR_TOKEN);
        userToken.remove();
        next('/login');
      });
  } else if (to.path === '/login') {
    next();
  } else {
    next('/login');
  }
});
curRouter.afterEach(to => {
  store.commit(types.SET_BREADCRUMB, to.meta.breadcrumb);
});
export {
  curBasicRouters as basicRouters,
  curAsyncRouters as asyncRouters,
  curRouter as router
};
