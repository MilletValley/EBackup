import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Profile from '@/components/pages/Profile';
import Users from '@/components/pages/Users';
import OracleList from '@/components/pages/OracleList';
import TakeOver from '@/components/pages/TakeOver';
import SqlServerList from '@/components/pages/SqlServerList';
// import NotFound from '@/components/pages/NotFound';
import OracleDetail from '@/components/pages/OracleDetail';
import SqlServerDetail from '@/components/pages/SqlServerDetail';
import VMwareList from '@/components/pages/VmwareList';
import VMwareDetail from '@/components/pages/VMwareDetail';
import FileHostList from '@/components/pages/FileHostList';
import FileHostDetail from '@/components/pages/FileHostDetail';
import NoFound from '@/components/pages/NoFound';
import ServerError from '@/components/pages/ServerError';
import InputIp from '@/components/pages/InputIp';
import DeviceManager from '@/components/pages/DeviceManager';
import SystemParam from '@/components/pages/SystemParam';
import DatabaseLinkDetail from '@/components/pages/DatabaseLinkDetail';
// import Overview from '@/components/pages/Overview';
// import BackupRecoverView from '@/components/pages/BackupRecoverView';
// import TakeOverView from '@/components/pages/TakeOverView';
import MoreState from '@/components/MoreState';

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
  {
    path: '/inputip',
    component: InputIp,
  },
];

export default new Router({
  routes: basicRouters,
});

export const asyncRouters = [
  {
    path: '/to',
    component: Layout,
    meta: {
      title: '一键接管',
      icon: 'takeover',
      roles: ['oracle dba', 'sqlserver dba'],
    },
    children: [
      {
        path: 'oracle/takeover',
        name: 'oracleTakeOverView',
        component: TakeOver,
        meta: {
          title: '总览',
          roles: ['oracle dba', 'sqlserver dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/takeover',
        name: 'sqlserverTakeOverView',
        component: TakeOver,
        meta: {
          roles: ['sqlserver dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer接管',
              path: '',
            },
          ],
        },
      },
    ],
  },
  {
    path: '/filehost',
    component: Layout,
    meta: {
      title: '文件系统',
      icon: 'file',
      roles: ['file admin'],
    },
    children: [
      {
        path: '',
        name: 'fileHostList',
        component: FileHostList,
        meta: {
          title: '服务器列表',
          roles: ['file admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '文件服务器列表',
              path: '/filehost',
            },
          ],
        },
      },
      {
        path: ':id',
        component: FileHostDetail,
        props: true,
        meta: {
          roles: ['file admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '文件服务器列表',
              path: '/filehost',
            },
            {
              name: '服务器详情',
              path: '',
            },
          ],
        },
      },
    ],
  },
  {
    path: '/db',
    component: Layout,
    meta: {
      title: '数据库',
      icon: 'database',
      roles: ['oracle dba', 'sqlserver dba'],
    },
    children: [
      {
        path: 'oracle/takeover',
        name: 'oracleTakeOver',
        component: TakeOver,
        meta: {
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '/db/oracle',
            },
            {
              name: 'Oracle一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle/takeover/:id',
        name: 'oracleLinkDetail',
        props: true,
        component: DatabaseLinkDetail,
        meta: {
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '/db/oracle',
            },
            {
              name: 'Oracle一键接管',
              path: '/db/oracle/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/takeover',
        name: 'sqlserverTakeOver',
        component: TakeOver,
        meta: {
          roles: ['sqlserver dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '/db/sqlserver',
            },
            {
              name: 'SQLServer一键接管',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/takeover/:id',
        name: 'sqlserverLinkDetail',
        props: true,
        component: DatabaseLinkDetail,
        meta: {
          roles: ['sqlserver dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '/db/sqlserver',
            },
            {
              name: 'SQLServer一键接管',
              path: '/db/sqlserver/takeover',
            },
            {
              name: '连接详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle',
        name: 'oracleList',
        component: OracleList,
        meta: {
          title: 'Oracle',
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver',
        name: 'sqlserverList',
        component: SqlServerList,
        meta: {
          title: 'SQL Server',
          roles: ['sqlserver dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle/:id',
        props: true,
        component: OracleDetail,
        meta: {
          roles: ['oracle dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'Oracle列表',
              path: '/db/oracle',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'sqlserver/:id',
        props: true,
        component: SqlServerDetail,
        meta: {
          role: 'sqlserver dba',
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'SQLServer列表',
              path: '/db/sqlserver',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
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
      roles: ['vm admin'],
    },
    children: [
      {
        path: 'virtual',
        name: 'VMwareList',
        component: VMwareList,
        meta: {
          title: 'VMware',
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '虚拟机列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'virtual/:id',
        props: true,
        component: VMwareDetail,
        meta: {
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '虚拟机列表',
              path: '/vm/virtual',
            },
            {
              name: '虚拟机详情',
              path: '',
            },
          ],
        },
      },
    ],
  },
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
  {
    path: '/settings',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'setting',
      roles: [],
    },
    children: [
      {
        path: 'devicemanager',
        name: 'deviceManager',
        component: DeviceManager,
        meta: {
          title: '设备管理',
          roles: [],
        },
      },
      {
        path: 'systemparam',
        component: SystemParam,
        meta: {
          title: '参数管理',
          roles: [],
        },
      },
      {
        path: 'users',
        component: Users,
        meta: {
          title: '用户管理',
          roles: [],
        },
      },
    ],
  },
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
