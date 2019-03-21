import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Profile from '@/components/pages/Profile';
import NoFound from '@/components/pages/NoFound';
import ServerError from '@/components/pages/ServerError';
import MoreState from '@/components/pages/MoreState';

import homeRouter from './home';
import takeoverRouter from './takeover';
import fileHostRouter from './fileHost';
import databaseRouter from './database';
import vmRouter from './virtuals';
import systemRouter from './system';
import applicationServiceRouter from './applicationservice';
// import overviewRouter from './overview';

Vue.use(Router);

export const basicRouters = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'dashboard',
        meta: {
          title: '主页',
          activeName: 'dashboard',
          icon: 'dashboard',
        },
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
      },
      {
        path: 'morestate',
        name: 'morestate',
        component: MoreState,
      },
    ],
  },
  ...homeRouter,
];

export default new Router({
  routes: basicRouters,
});

export const asyncRouters = [
  ...takeoverRouter,
  ...fileHostRouter,
  ...databaseRouter,
  ...vmRouter,
  ...applicationServiceRouter,
  ...systemRouter,
  // ...overviewRouter,
  {
    path: '/error',
    component: Layout,
    children: [
      {
        path: 'servererror',
        component: ServerError,
      },
      {
        path: '/*',
        component: NoFound,
        meta: {
          isMenu: false,
        },
      },
    ],
  },
];
