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
        path: '/dataDaseTakeOver',
        name: 'dataDaseTakeOver',
        component: DataBaseTakeOver,
        meta: {
          roles: ['oracle dba', 'sql server dba', 'mysql dba', 'insql dba', 'vm admin', 'application admin'],
          name: '一键接管',
          icon: 'el-icon-sort',
          child: [
            {
              route: 'dataDaseTakeOver',
              aId: 'dataDaseTakeOver',
              name: '数据库'
            },
            {
              route: 'dataDaseTakeOver',
              aId: 'virtualTakeOver',
              name: '虚拟机'
            },
            {
              route: 'dataDaseTakeOver',
              aId: 'applicationTakeOver',
              name: '应用服务器'
            },
            {
              route: 'dataDaseTakeOver',
              aId: 'disasterDrills',
              name: '灾备演练'
            }
          ]
        }
      },
      {
        path: '/fileSystemDeletion',
        name: 'fileSystemDeletion',
        component: FileSystemDeletion,
        meta: {
          roles: ['file admin'],
          name: '文件系统数据保护',
          icon: 'el-icon-document',
          child: [
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemDeletion',
              name: '增删改服务器'
            },
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemBackup',
              name: '备份'
            },
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemRecover',
              name: '恢复'
            },
            {
              route: 'fileSystemDeletion',
              aId: 'fileSystemTermination',
              name: '终止计划'
            }
          ]
        }
      },
      {
        path: '/addDataBase',
        name: 'addDataBase',
        component: AddDataBase,
        meta: {
          roles: ['oracle dba', 'sql server dba', 'mysql dba', 'db2 dba',
            'dm dba', 'sybase dba', 'cache dba', 'insql dba', 'informix dba', 'postgresql dba'],
          name: '数据库数据保护',
          icon: 'el-icon-coin',
          child: [
            {
              route: 'addDataBase',
              aId: 'addDataBase',
              name: '添加数据库'
            },
            {
              route: 'addDataBase',
              aId: 'modifyDataBase',
              name: '编辑数据库'
            },
            {
              route: 'addDataBase',
              aId: 'dataBaseBackup',
              name: '备份'
            },
            {
              route: 'addDataBase',
              aId: 'dataBaseRecover',
              name: '恢复'
            },
            {
              route: 'addDataBase',
              aId: 'takeOverDataBase',
              name: '一键接管'
            },
            {
              route: 'addDataBase',
              aId: 'dataBaseMonitor',
              name: '监控'
            },
          ]
        }
      },
      {
        path: '/addManagement',
        name: 'addManagement',
        component: AddManagement,
        meta: {
          roles: ['vm admin'],
          name: '虚拟机数据保护',
          icon: 'el-icon-collection',
          child: [
            {
              route: 'addManagement',
              aId: 'addManagement',
              name: '添加虚拟机管理设备'
            },
            {
              route: 'addManagement',
              aId: 'virtualMonitor',
              name: '虚拟机主机管理'
            },
            {
              route: 'addManagement',
              aId: 'virtualBackUp',
              name: '备份'
            },
            {
              route: 'addManagement',
              aId: 'virtualRecover',
              name: '恢复'
            },
            {
              route: 'addManagement',
              aId: 'takeOverVirtual',
              name: '一键接管'
            },
            {
              route: 'addManagement',
              aId: 'virtualStart',
              name: '虚拟机启动'
            },
          ]
        }
      },
      {
        path: '/addApplication',
        name: 'addApplication',
        component: AddApplication,
        meta: {
          roles: ['application admin'],
          name: '应用服务器保护',
          icon: 'el-icon-suitcase',
          child: [
            {
              route: 'addApplication',
              aId: 'addApplication',
              name: '添加应用服务器'
            },
            {
              route: 'addApplication',
              aId: 'applicationDeletion',
              name: '删改应用服务器'
            },
            {
              route: 'addApplication',
              aId: 'takeOverApplication',
              name: '一键接管'
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
          child: [
            {
              route: 'inspectionTask',
              aId: 'inspectionTask',
              name: '巡检任务'
            },
            {
              route: 'inspectionTask',
              aId: 'model',
              name: '模板'
            },
            {
              route: 'inspectionTask',
              aId: 'parameter',
              name: '参数配置'
            },
          ]
        }
      },
      {
        path: '/equipmentManage',
        name: 'equipmentManage',
        component: EquipmentManage,
        meta: {
          roles: ['admin'],
          name: '系统管理',
          icon: 'el-icon-setting',
          child: [
            {
              route: 'equipmentManage',
              aId: 'equipmentManage',
              name: '设备管理'
            },
            {
              route: 'equipmentManage',
              aId: 'configurationManage',
              name: '配置管理'
            },
            {
              route: 'equipmentManage',
              aId: 'roleManage',
              name: '权限管理'
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
          child: [
            {
              route: 'deploymentManage',
              aId: 'deploymentManage',
              name: '部署管理'
            },
            {
              route: 'deploymentManage',
              aId: 'repository',
              name: '版本库'
            }
          ]
        }
      },
    ],
  },
];
export default router;
