import Layout from '@/components/Layout';
import VMwareList from '@/components/pages/vm/VmwareList';
import VMwareDetail from '@/components/pages/vm/VMwareDetail';
import BackupPlanList from '@/components/pages/vm/BackupPlanList';
import ServerManager from '@/components/pages/ServerManager';

const vmRouter = [
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
        path: '',
        component: {
          render(c) {
            return c('router-view');
          }
        },
        meta: {
          title: 'veeam',
          roles: ['vm admin']
        },
        children: [
          {
            path: 'virtuals/collectManager',
            name: 'virtualCollectManager',
            component: ServerManager,
            meta: {
              title: '虚拟机主机管理',
              roles: [],
            },
          },
          {
            path: 'virtual',
            name: 'VMwareList',
            component: VMwareList,
            meta: {
              title: 'veem虚拟机列表',
              activeName: 'vmware',
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
            path: 'virtuals/backup',
            name: 'virtualBackup',
            component: BackupPlanList,
            meta: {
              title: '批量操作',
              roles: [],
            },
          },
          {
            path: 'virtual/:id',
            props: true,
            component: VMwareDetail,
            name: 'virtualDetail',
            meta: {
              activeName: 'vmware',
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
        ]
      },
      {
        path: '',
        component: {
          render(c) {
            return c('router-view');
          }
        },
        meta: {
          title: '华为虚拟机',
          roles: ['vm admin']
        },
        children: [
          {
            path: 'hwVirtuals/collectManager',
            name: 'hwVirtualCollectManager',
            component: ServerManager,
            meta: {
              title: '虚拟机主机管理',
              roles: []
            }
          },
          {
            path: 'hwVirtual',
            name: 'HWwareList',
            component: VMwareList,
            meta: {
              title: '华为虚拟机',
              activeName: 'HWware',
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
            path: 'hwVirtuals/backup',
            name: 'hwVirtualBackup',
            component: BackupPlanList,
            meta: {
              title: '批量操作',
              roles: [],
            },
          },
          {
            path: 'hwVirtual/:id',
            props: true,
            component: VMwareDetail,
            name: 'hwVirtualDetail',
            meta: {
              activeName: 'HWware',
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
        ]
      }
    ],
  }
];

export default vmRouter;
