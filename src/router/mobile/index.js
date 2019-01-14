import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Layout from '@/components/mobile/Layout';
import Dashboard from '@/components/mobile/Dashboard';
import Profile from '@/components/pages/Profile';
// import NotFound from '@/components/pages/NotFound';
import NoFound from '@/components/pages/NoFound';
import ServerError from '@/components/pages/ServerError';
import InputIp from '@/components/pages/InputIp';
// import Overview from '@/components/pages/Overview';
// import BackupRecoverView from '@/components/pages/BackupRecoverView';
// import TakeOverView from '@/components/pages/TakeOverView';
import MoreState from '@/components/mobile/MoreState';
import BackupState from '@/components/mobile/BackupState';
import RestoreState from '@/components/mobile/RestoreState';
import TakeoverState from '@/components/mobile/TakeoverState';

import homeRouter from './home';
import takeoverRouter from './takeover';
import fileHostRouter from './fileHost';
import databaseRouter from './database';
import vmRouter from './virtuals';
import systemRouter from './system';

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
        path: 'backupState',
        name: 'backupState',
        component: BackupState,
      },
      {
        path: 'restoreState',
        name: 'restoreState',
        component: RestoreState,
      },
      {
        path: 'takeoverState',
        name: 'takeoverState',
        component: TakeoverState,
      },
      {
        path: 'morestate',
        name: 'morestate',
        component: MoreState,
      },
    ],
  },
  {
    path: '/inputip',
    component: InputIp,
  },
  ...homeRouter,
];

export default new Router({
  routes: basicRouters,
});

export const asyncRouters = [...takeoverRouter, ...fileHostRouter, ...databaseRouter, ...vmRouter, ...systemRouter,
  // {
  //   path: '/file',
  //   component: Layout,
  //   meta: {
  //     title: '文件系统',
  //     icon: 'file',
  //     roles: ['file admin'],
  //   },
  //   children: [
  //     {
  //       path: 'windows',
  //       component: FileHostList,
  //       meta: {
  //         title: 'Windows系统',
  //         roles: ['file admin'],
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/demonstrate',
  //   component: Layout,
  //   meta: {
  //     title: '演示',
  //     icon: 'demonstrate',
  //     roles: ['view admin'],
  //   },
  //   children: [
  //     {
  //       path: 'overview',
  //       name: 'overview',
  //       component: Overview,
  //       meta: {
  //         title: '总览',
  //         roles: ['view admin'],
  //       },
  //     },
  //     {
  //       path: 'backuprecoverview',
  //       name: 'backuprecoverview',
  //       component: BackupRecoverView,
  //       meta: {
  //         title: '备份恢复',
  //         roles: ['view admin'],
  //       },
  //     },
  //     {
  //       path: 'takeoverview',
  //       name: 'takeoverview',
  //       component: TakeOverView,
  //       meta: {
  //         title: '一键接管',
  //         roles: ['view admin'],
  //       },
  //     },
  //   ]
  // },

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
