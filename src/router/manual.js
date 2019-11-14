import Guide from '@/components/Guide';
import DataBaseTakeOver from '@/components/pages/manual/DataBaseTakeOver';
import FileSystemDeletion from '@/components/pages/manual/filesystem/FileSystemDeletion';
import AddDataBase from '@/components/pages/manual/databaseprotection/AddDataBase';
import AddManagement from '@/components/pages/manual/virtual/AddManagement';
import AddApplication from '@/components/pages/manual/applicationprotection/AddApplication';
import InspectionTask from '@/components/pages/manual/inspection/InspectionTask';
import EquipmentManage from '@/components/pages/manual/systemmanager/EquipmentManage';
import DeploymentManage from '@/components/pages/manual/autodeployment/DeploymentManage';
import Nopermissions from '@/components/pages/manual/NoPermissions';

const router = [
  {
    path: '/guide',
    name: 'guide',
    component: Guide,
    children: [
      {
        path: '/noPermissions',
        name: 'noPermissions',
        component: Nopermissions
      },
      {
        path: '/dataDaseTakeOver',
        name: 'dataDaseTakeOver',
        component: DataBaseTakeOver,
        meta: {
          // roles: ['oracle dba', 'sql server dba', 'mysql dba', 'insql dba', 'vm admin', 'application admin'],
          roles: [],
          name: '一键接管',
          icon: 'el-icon-sort',
          children: [
            {
              route: 'dataDaseTakeOver',
              aId: 'dataDaseTakeOver',
              name: '数据库',
              roles: []
            },
            {
              route: 'dataDaseTakeOver',
              aId: 'virtualTakeOver',
              name: '虚拟机',
              roles: []
            },
            {
              route: 'dataDaseTakeOver',
              aId: 'applicationTakeOver',
              name: '应用服务器',
              roles: []
            },
            {
              route: 'dataDaseTakeOver',
              aId: 'disasterDrills',
              name: '灾备演练',
              roles: []
            }
          ]
        }
      },
      {
        path: '/fileSystemDeletion',
        name: 'fileSystemDeletion',
        component: FileSystemDeletion,
        meta: {
          // roles: ['file admin'],
          roles: [],
          name: '文件系统数据保护',
          icon: 'el-icon-document',
          children: [
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemDeletion',
              name: '编辑服务器',
              roles: []
            },
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemBackup',
              name: '备份',
              roles: []
            },
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemRecover',
              name: '恢复',
              roles: []
            },
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemTermination',
              name: '终止计划',
              roles: []
            }
          ]
        }
      },
      {
        path: '/addDataBase',
        name: 'addDataBase',
        component: AddDataBase,
        meta: {
          roles: [],
          name: '数据库数据保护',
          icon: 'el-icon-coin',
          children: [
            {
              route: 'addDataBase',
              aId: 'addDataBase',
              name: '添加数据库',
              roles: []
            },
            {
              route: 'addDataBase',
              aId: 'modifyDataBase',
              name: '编辑数据库',
              roles: []
            },
            {
              route: 'addDataBase',
              aId: 'dataBaseBackup',
              name: '备份',
              roles: []
            },
            {
              route: 'addDataBase',
              aId: 'dataBaseRecover',
              name: '恢复',
              roles: []
            },
            {
              route: 'addDataBase',
              aId: 'takeOverDataBase',
              name: '一键接管',
              roles: []
            },
            {
              route: 'addDataBase',
              aId: 'dataBaseMonitor',
              name: '监控',
              roles: []
            },
          ]
        }
      },
      {
        path: '/addManagement',
        name: 'addManagement',
        component: AddManagement,
        meta: {
          // roles: ['vm admin'],
          roles: [],
          name: '虚拟机数据保护',
          icon: 'el-icon-collection',
          children: [
            {
              route: 'addManagement',
              aId: 'addManagement',
              name: '添加虚拟机管理设备',
              roles: []
            },
            {
              route: 'addManagement',
              aId: 'virtualMonitor',
              name: '虚拟机主机管理',
              roles: []
            },
            {
              route: 'addManagement',
              aId: 'virtualBackUp',
              name: '备份',
              roles: []
            },
            {
              route: 'addManagement',
              aId: 'virtualRecover',
              name: '恢复',
              roles: []
            },
            {
              route: 'addManagement',
              aId: 'takeOverVirtual',
              name: '一键接管',
              roles: []
            },
            {
              route: 'addManagement',
              aId: 'virtualStart',
              name: '虚拟机启动',
              roles: []
            },
          ]
        }
      },
      {
        path: '/addApplication',
        name: 'addApplication',
        component: AddApplication,
        meta: {
          // roles: ['application admin'],
          roles: [],
          name: '应用服务器保护',
          icon: 'el-icon-suitcase',
          children: [
            {
              route: 'addApplication',
              aId: 'addApplication',
              name: '添加应用服务器',
              roles: []
            },
            {
              route: 'addApplication',
              aId: 'applicationDeletion',
              name: '编辑应用服务器',
              roles: []
            },
            {
              route: 'addApplication',
              aId: 'takeOverApplication',
              name: '一键接管',
              roles: []
            },
          ]
        }
      },
      {
        path: '/inspectionTask',
        name: 'inspectionTask',
        component: InspectionTask,
        meta: {
          roles: ['admin'],
          name: '智能巡检',
          icon: 'el-icon-odometer',
          children: [
            {
              route: 'inspectionTask',
              aId: 'inspectionTask',
              name: '巡检任务',
              roles: ['admin']
            },
            {
              route: 'inspectionTask',
              aId: 'model',
              name: '模板',
              roles: ['admin']
            },
            {
              route: 'inspectionTask',
              aId: 'parameter',
              name: '参数配置',
              roles: ['admin']
            },
          ]
        }
      },
      {
        path: '/equipmentManage',
        name: 'equipmentManage',
        component: EquipmentManage,
        meta: {
          roles: [],
          name: '系统管理',
          icon: 'el-icon-setting',
          children: [
            {
              route: 'equipmentManage',
              aId: 'equipmentManage',
              name: '设备管理',
              roles: []
            },
            {
              route: 'equipmentManage',
              aId: 'configurationManage',
              name: '配置管理',
              roles: ['admin']
            },
            {
              route: 'equipmentManage',
              aId: 'roleManage',
              name: '权限管理',
              roles: ['admin']
            }
          ]
        }
      },
      {
        path: '/deploymentManage',
        name: 'deploymentManage',
        component: DeploymentManage,
        meta: {
          roles: ['admin'],
          name: '自动化部署',
          icon: 'el-icon-help',
          children: [
            {
              route: 'deploymentManage',
              aId: 'deploymentManage',
              name: '部署管理',
              roles: ['admin']
            },
            {
              route: 'deploymentManage',
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
