import Guide from '@/components/Guide';
import DataBaseTakeOver from '@/components/pages/manual/DataBaseTakeOver';
import FileSystemDeletion from '@/components/pages/manual/filesystem/FileSystemDeletion';
import AddDataBase from '@/components/pages/manual/databaseprotection/AddDataBase';
import AddManagement from '@/components/pages/manual/virtual/AddManagement';
import AddApplication from '@/components/pages/manual/applicationprotection/AddApplication';
import InspectionTask from '@/components/pages/manual/inspection/InspectionTask';
import EquipmentManage from '@/components/pages/manual/systemmanager/EquipmentManage';
import DeploymentManage from '@/components/pages/manual/autodeployment/DeploymentManage';

const router = [
  {
    path: '/guide',
    name: 'guide',
    component: Guide,
    children: [
      {
        path: '/takeover',
        name: 'takeoverManual',
        component: DataBaseTakeOver,
        meta: {
          // roles: ['oracle dba', 'sql server dba', 'mysql dba', 'insql dba', 'vm admin', 'application admin'],
          roles: [],
          name: '一键接管',
          icon: 'el-icon-sort',
          children: [
            {
              aId: 'dataDaseTakeOver',
              name: '数据库',
              roles: []
            },
            {
              aId: 'virtualTakeOver',
              name: '虚拟机',
              roles: []
            },
            {
              aId: 'applicationTakeOver',
              name: '应用服务器',
              roles: []
            },
            {
              aId: 'disasterDrills',
              name: '灾备演练',
              roles: []
            }
          ]
        }
      },
      {
        path: '/fileSystem',
        name: 'fileSystemManual',
        component: FileSystemDeletion,
        meta: {
          // roles: ['file admin'],
          roles: [],
          name: '文件系统数据保护',
          icon: 'el-icon-document',
          children: [
            {
              aId: 'fileSystemDeletion',
              name: '编辑服务器',
              roles: []
            },
            {
              aId: 'fileSystemBackup',
              name: '备份',
              roles: []
            },
            {
              aId: 'fileSystemRecover',
              name: '恢复',
              roles: []
            },
            {
              aId: 'fileSystemTermination',
              name: '终止计划',
              roles: []
            }
          ]
        }
      },
      {
        path: '/database',
        name: 'databaseManual',
        component: AddDataBase,
        meta: {
          roles: [],
          name: '数据库数据保护',
          icon: 'el-icon-coin',
          children: [
            {
              aId: 'addDataBase',
              name: '添加数据库',
              roles: []
            },
            {
              aId: 'modifyDataBase',
              name: '编辑数据库',
              roles: []
            },
            {
              aId: 'dataBaseBackup',
              name: '备份',
              roles: []
            },
            {
              aId: 'dataBaseRecover',
              name: '恢复',
              roles: []
            },
            {
              aId: 'takeOverDataBase',
              name: '一键接管',
              roles: []
            },
            {
              aId: 'dataBaseMonitor',
              name: '监控',
              roles: []
            },
          ]
        }
      },
      {
        path: '/management',
        name: 'addManagementManual',
        component: AddManagement,
        meta: {
          // roles: ['vm admin'],
          roles: [],
          name: '虚拟机数据保护',
          icon: 'el-icon-collection',
          children: [
            {
              aId: 'addManagement',
              name: '添加虚拟机管理设备',
              roles: []
            },
            {
              aId: 'virtualMonitor',
              name: '虚拟机主机管理',
              roles: []
            },
            {
              aId: 'virtualBackUp',
              name: '备份',
              roles: []
            },
            {
              aId: 'virtualRecover',
              name: '恢复',
              roles: []
            },
            {
              aId: 'takeOverVirtual',
              name: '一键接管',
              roles: []
            },
            {
              aId: 'virtualStart',
              name: '虚拟机启动',
              roles: []
            },
          ]
        }
      },
      {
        path: '/application',
        name: 'applicationManual',
        component: AddApplication,
        meta: {
          // roles: ['application admin'],
          roles: [],
          name: '应用服务器保护',
          icon: 'el-icon-suitcase',
          children: [
            {
              aId: 'addApplication',
              name: '添加应用服务器',
              roles: []
            },
            {
              aId: 'applicationDeletion',
              name: '编辑应用服务器',
              roles: []
            },
            {
              aId: 'takeOverApplication',
              name: '一键接管',
              roles: []
            },
          ]
        }
      },
      {
        path: '/inspectionTask',
        name: 'inspectionTaskManual',
        component: InspectionTask,
        meta: {
          roles: ['admin'],
          name: '智能巡检',
          icon: 'el-icon-odometer',
          children: [
            {
              aId: 'inspectionTask',
              name: '巡检任务',
              roles: ['admin']
            },
            {
              aId: 'model',
              name: '模板',
              roles: ['admin']
            },
            {
              aId: 'parameter',
              name: '参数配置',
              roles: ['admin']
            },
          ]
        }
      },
      {
        path: '/equipmentManage',
        name: 'equipmentManageManual',
        component: EquipmentManage,
        meta: {
          roles: [],
          name: '系统管理',
          icon: 'el-icon-setting',
          children: [
            {
              aId: 'equipmentManage',
              name: '设备管理',
              roles: []
            },
            {
              aId: 'configurationManage',
              name: '配置管理',
              roles: ['admin']
            },
            {
              aId: 'roleManage',
              name: '权限管理',
              roles: ['admin']
            }
          ]
        }
      },
      {
        path: '/deploymentManage',
        name: 'deploymentManageManual',
        component: DeploymentManage,
        meta: {
          roles: ['admin'],
          name: '自动化部署',
          icon: 'el-icon-help',
          children: [
            {
              aId: 'deploymentManage',
              name: '部署管理',
              roles: ['admin']
            },
            {
              aId: 'repository',
              name: '版本库',
              roles: ['admin']
            }
          ]
        }
      },
    ],
  },
];
export default router;
