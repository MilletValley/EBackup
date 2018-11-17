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
import VMwareList from '@/components/pages/vm/VmwareList';
// import VMwareList from '@/components/pages/VmwareList';
// import VMwareDetail from '@/components/pages/VMwareDetail';
import VMwareDetail from '@/components/pages/vm/VMwareDetail';
// import FileHostList from '@/components/pages/FileHostList';
import FileHostList from '@/components/pages/fileHost/FileHostList';
import FileHostDetail from '@/components/pages/fileHost/FileHostDetail';
// import FileHostDetail from '@/components/pages/FileHostDetail';
import MySqlList from '@/components/pages/MySqlList';
import MySqlDetail from '@/components/pages/MySqlDetail';
import DB2List from '@/components/pages/DB2List';
import DB2Detail from '@/components/pages/DB2Detail';
import DamengList from '@/components/pages/dm/DamengList';
import DamengDetails from '@/components/pages/dm/DamengDetails';
import SwitchList from '@/components/pages/SwitchList';
import SwitchDetail from '@/components/pages/SwitchDetail';
import NoFound from '@/components/pages/NoFound';
import ServerError from '@/components/pages/ServerError';
import InputIp from '@/components/pages/InputIp';
import DeviceManager from '@/components/pages/DeviceManager';
import SystemParam from '@/components/pages/SystemParam';
import EmailManager from '@/components/pages/EmailManager';
import StrategyManager from '@/components/pages/StrategyManager';
import DatabaseLinkDetail from '@/components/pages/DatabaseLinkDetail';
// import Overview from '@/components/pages/Overview';
// import BackupRecoverView from '@/components/pages/BackupRecoverView';
// import TakeOverView from '@/components/pages/TakeOverView';
import MoreState from '@/components/pages/MoreState';
// import CollectManager from '@/components/pages/CollectManager';
import DeviceDetails from '@/components/pages/DeviceDetails';
// import BackupPlanList from '@/components/pages/BackupPlanList';
import BackupPlanList from '@/components/pages/vm/BackupPlanList';
import ServerManager from '@/components/pages/ServerManager';

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
      roles: ['oracle dba', 'sql server dba'],
    },
    children: [
      {
        path: 'oracle/takeover',
        name: 'oracleTakeOverView',
        component: TakeOver,
        meta: {
          title: '总览',
          roles: ['oracle dba', 'sql server dba'],
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
          roles: ['sql server dba'],
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
      {
        path: 'oracle/switchlist',
        name: 'oracleSwitchList',
        component: SwitchList,
        meta: {
          title: '灾备演练',
          roles: ['oracle dba', 'sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '批量切换计划',
              path: '',
            },
          ]
        }
      },
      {
        path: 'oracle/switchlist/:id',
        name: 'oracleSwitchDetail',
        component: SwitchDetail,
        meta: {
          roles: ['oracle dba', 'sql server dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '批量切换计划',
              path: '/to/oracle/switchlist',
            },
            {
              name: '切换详情',
              path: ''
            }
          ]
        }
      }
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
        name: 'filehostDetail',
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
      roles: ['oracle dba', 'sql server dba', 'mysql dba'],
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
          roles: ['sql server dba'],
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
          roles: ['sql server dba'],
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
          roles: ['sql server dba'],
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
        path: 'mysql',
        name: 'mysqlList',
        component: MySqlList,
        meta: {
          title: 'MySql',
          roles: ['mysql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'MySql列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'db2',
        name: 'db2List',
        component: DB2List,
        meta: {
          title: 'DB2',
          roles: ['db2 dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'DB2列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'dameng',
        name: 'DamengList',
        component: DamengList,
        meta: {
          title: '达梦',
          roles: ['dameng dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '达梦数据库列表',
              path: '',
            },
          ],
        },
      },
      {
        path: 'dameng/:id',
        props: true,
        component: DamengDetails,
        meta: {
          roles: ['dameng dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '达梦数据库列表',
              path: '/db/dameng',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'oracle/:id',
        props: true,
        component: OracleDetail,
        name: 'oracleDetail',
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
        name: 'sqlserverDetail',
        meta: {
          role: 'sql server dba',
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
      {
        path: 'mysql/:id',
        props: true,
        component: MySqlDetail,
        name: 'mysqlDetail',
        meta: {
          roles: ['mysql dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'MySql列表',
              path: '/db/mysql',
            },
            {
              name: '数据库详情',
              path: '',
            },
          ],
        },
      },
      {
        path: 'db2/:id',
        props: true,
        component: DB2Detail,
        name: 'db2Detail',
        meta: {
          roles: ['db2 dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: 'DB2列表',
              path: '/db/db2',
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
        path: 'hwVirtual',
        name: 'HWwareList',
        component: VMwareList,
        meta: {
          title: '华为虚拟机',
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
        path: 'backup',
        name: 'backup',
        component: BackupPlanList,
        meta: {
          title: '备份计划',
          roles: [],
        },
      },
      {
        path: 'virtual/:id',
        props: true,
        component: VMwareDetail,
        name: 'virtualDetail',
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
      {
        path: 'hwVirtual/:id',
        props: true,
        component: VMwareDetail,
        name: 'hwVirtualDetail',
        meta: {
          roles: ['vm admin'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '虚拟机列表',
              path: '/vm/hwVirtual',
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
        path: 'collectManager',
        name: 'collectManager',
        component: ServerManager,
        meta: {
          title: '虚拟机主机管理',
          roles: [],
        },
      },
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
        path: 'devicemanager/details/:id',
        name: 'deviceDetails',
        component: DeviceDetails,
        meta: {
          // title: '设备管理',
          roles: [],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '设备管理',
              path: '/settings/devicemanager',
            },
            {
              name: '设备详情',
              path: '',
            },
          ],
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
        path: 'emailmanager',
        component: EmailManager,
        meta: {
          title: '邮箱管理',
          roles: [],
        },
      },
      {
        path: 'strategymanager',
        component: StrategyManager,
        meta: {
          title: '策略管理',
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
