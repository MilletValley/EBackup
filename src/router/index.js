import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Users from '@/components/pages/Users';
import Oracle from '@/components/pages/Oracle';
import SqlServer from '@/components/pages/SqlServer';
import NotFound from '@/components/pages/NotFound';
import OracleDetail from '@/components/pages/OracleDetail';
import VMware from '@/components/pages/Vmware';
import BackupPlans from '@/components/pages/BackupPlans';

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
        meta: {
          title: '主页',
          icon: 'dashboard',
        },
      },
    ],
  },
];

export default new Router({
  routes: basicRouters,
});

export const asyncRouters = [
  {
    path: '/db',
    component: Layout,
    meta: {
      title: '数据库',
      icon: 'database',
      roles: ['admin'],
    },
    children: [
      {
        path: 'oracle',
        component: Oracle,
        meta: {
          title: 'Oracle',
          roles: ['admin'],
        },
      },
      {
        path: 'sqlserver',
        component: SqlServer,
        meta: {
          title: 'SQL Server',
          roles: ['admin'],
        },
      },
      {
        path: 'oracle/:id',
        props: true,
        component: OracleDetail,
      },
      {
        path: 'backupplans',
        component: BackupPlans,
        meta: {
          title: 'Backup Plans',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/vm',
    component: Layout,
    meta: {
      title: '虚拟机',
      icon: 'vm',
      roles: ['admin'],
    },
    children: [
      {
        path: 'vmware',
        component: VMware,
        meta: {
          title: 'VMware',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/settings',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'setting',
      roles: ['admin'],
    },
    children: [
      {
        path: 'users',
        component: Users,
        meta: {
          title: '用户管理',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '*',
    component: NotFound,
    meta: {
      isMenu: false,
    },
  },
];
