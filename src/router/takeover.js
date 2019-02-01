import Layout from '@/components/Layout';
import TakeOver from '@/components/pages/TakeOver';
import SwitchList from '@/components/pages/SwitchList';
import SwitchDetail from '@/components/pages/SwitchDetail';
import AppTakeOver from '@/components/pages/application/TakeOver';

const takeoverRouter = [
  {
    path: '/to',
    component: Layout,
    meta: {
      title: '一键接管',
      icon: 'takeover',
      roles: ['oracle dba', 'sql server dba', 'application admin'],
    },
    children: [
      {
        path: 'oracle/takeover',
        name: 'oracleTakeOverView',
        component: TakeOver,
        meta: {
          title: '总览',
          activeName: 'overview',
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
          activeName: 'overview',
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
        path: 'app/takeover',
        name: 'appTakeOverView',
        component: AppTakeOver,
        meta: {
          activeName: 'appOverview',
          roles: ['application admin'],
          title: '应用服务器',
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '应用服务器接管',
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
          activeName: 'drill',
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
          activeName: 'drill',
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
];

export default takeoverRouter;
