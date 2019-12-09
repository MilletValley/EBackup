import Guide from '@/components/pages/guide/Guide';
import DatabaseBackup from '@/components/pages/guide/DatabaseBackup';
import DatabaseRestore from '@/components/pages/guide/DatabaseRestore';
import DatabaseTakeOver from '@/components/pages/guide/DatabaseTakeOver';
import VirtualBackup from '@/components/pages/guide/VirtualBackup';
import VirtualRestore from '@/components/pages/guide/VirtualRestore';
import VirtualTakeOver from '@/components/pages/guide/VirtualTakeOver';
import FileHostBackup from '@/components/pages/guide/FileHostBackup';
import FileHostRestore from '@/components/pages/guide/FileHostRestore';

const router = [
  {
    path: '/guide',
    name: 'guide',
    component: Guide,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
      ],
    }
  },
  {
    path: '/guide/databaseBackup',
    name: 'guideDatabaseBackup',
    component: DatabaseBackup,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '数据库备份',
          path: '/guide/databaseBackup'
        }
      ],
    }
  },
  {
    path: '/guide/databaseRestore',
    name: 'guideDatabaseRestore',
    component: DatabaseRestore,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '数据库恢复',
          path: '/guide/databaseRestore'
        }
      ],
    }
  },
  {
    path: '/guide/databaseTakeOver',
    name: 'guideDatabaseTakeOver',
    component: DatabaseTakeOver,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '数据库接管',
          path: '/guide/databaseTakeOver'
        }
      ],
    }
  },
  {
    path: '/guide/vmBackup',
    name: 'guideVMBackup',
    component: VirtualBackup,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '虚拟机备份',
          path: '/guide/vmBackup'
        }
      ],
    }
  },
  {
    path: '/guide/vmRestore',
    name: 'guideVMRestore',
    component: VirtualRestore,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '虚拟机恢复',
          path: '/guide/vmRestore'
        }
      ],
    }
  },
  {
    path: '/guide/vmTakeOver',
    name: 'guideVMTakeOver',
    component: VirtualTakeOver,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '虚拟机接管',
          path: '/guide/vmTakeOver'
        }
      ],
    }
  },
  {
    path: '/guide/filehostBackup',
    name: 'guideFilehostBackup',
    component: FileHostBackup,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '文件备份',
          path: '/guide/filehostBackup'
        }
      ],
    }
  },
  {
    path: '/guide/filehostRestore',
    name: 'guideFilehostRestore',
    component: FileHostRestore,
    meta: {
      breadcrumb: [
        {
          name: '首页',
          path: '/',
        },
        {
          name: '功能指引',
          path: '/guide',
        },
        {
          name: '文件恢复',
          path: '/guide/filehostRestore'
        }
      ],
    }
  }
];
export default router;
