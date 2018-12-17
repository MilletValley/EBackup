import Layout from '@/components/Layout';
import ServerManager from '@/components/pages/ServerManager';
import DeviceManager from '@/components/pages/DeviceManager';
import DeviceDetails from '@/components/pages/DeviceDetails';
import SystemParam from '@/components/pages/SystemParam';
import EmailManager from '@/components/pages/EmailManager';
import StrategyManager from '@/components/pages/StrategyManager';
import KeepStrategy from '@/components/pages/keepStrategy/KeepStrategy';
import Users from '@/components/pages/Users';

const router = [
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
        path: 'keepstrategy',
        component: KeepStrategy,
        meta: {
          title: '保留策略',
          roles: []
        }
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
  }
];

export default router;
