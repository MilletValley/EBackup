import Layout from '@/components/Layout';
import TakeOver from '@/components/pages/TakeOver';
import OracleList from '@/components/pages/oracle/OracleList';
import OracleDetail from '@/components/pages/oracle/OracleDetail';
import SqlServerList from '@/components/pages/sqlserver/SqlServerList';
import SqlServerDetail from '@/components/pages/sqlserver/SqlServerDetail';
import MySqlList from '@/components/pages/mysql/MySqlList';
import MySqlDetail from '@/components/pages/mysql/MySqlDetail';
import DB2List from '@/components/pages/db2/DB2List';
import DB2Detail from '@/components/pages/db2/DB2Details';
import DamengList from '@/components/pages/dm/DamengList';
import DamengDetails from '@/components/pages/dm/DamengDetails';
import DatabaseLinkDetail from '@/components/pages/DatabaseLinkDetail';

const router = [
  {
    path: '/db',
    component: Layout,
    meta: {
      title: '数据库',
      icon: 'database',
      roles: ['oracle dba', 'sql server dba', 'mysql dba', 'db2 dba', 'dm dba'],
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
          activeName: 'oracle',
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
          activeName: 'sqlserver',
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
          activeName: 'mysql',
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
          activeName: 'db2',
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
        path: 'dm',
        name: 'DamengList',
        component: DamengList,
        meta: {
          title: '达梦',
          activeName: 'dm',
          roles: ['dm dba'],
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
        path: 'dm/:id',
        props: true,
        component: DamengDetails,
        name: 'damengDetail',
        meta: {
          activeName: 'dameng',
          roles: ['dm dba'],
          breadcrumb: [
            {
              name: '首页',
              path: '/',
            },
            {
              name: '达梦数据库列表',
              path: '/db/dm',
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
          activeName: 'oracle',
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
          activeName: 'sqlserver',
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
          activeName: 'mysql',
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
          activeName: 'db2',
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
  }
];

export default router;
