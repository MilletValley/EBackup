const vmHost = {
  createTime: '2019-08-29 17:29:23',
  databaseType: 4,
  hostIp: '145.170.32.42',
  hostType: 1,
  id: 365,
  isRacMark: 1,
  loginName: 'administrator',
  name: 'VM',
  osName: 'Windows',
  password: 'P@ssw0rd',
  storagePath: 'C',
  storeType: 1
};

const serverHost = {
  createDate: '',
  hostId: 365,
  hostName: 'VM',
  id: 549,
  serverIp: '145.170.32.8',
  serverLoginName: 'administrator@vsphere.local',
  serverName: '145.170.32.8',
  serverPassword: 'A4CACB0541FC7B4161A978EE20357B2D',
  serverType: 2,
  state: 0,
  vmList: [],
  vmType: 1
};

const targetServerHost = {
  createDate: '',
  hostId: 365,
  hostName: 'VM',
  id: 548,
  serverIp: '145.170.33.8',
  serverName: '145.170.33.8',
  serverLoginName: 'administrator@vsphere.local',
  serverPassword: 'A4CACB0541FC7B4161A978EE20357B2D',
  serverType: 2,
  state: 0,
  vmList: [],
  vmType: 1
};

const detail = {
  host: {
    createTime: '2019-08-29 17:29:23',
    databaseType: 4,
    hostIp: '145.170.32.42',
    hostType: 1,
    id: 365,
    isRacMark: 1,
    loginName: 'administrator',
    name: 'VM',
    osName: 'Windows',
    password: 'P@ssw0rd',
    storagePath: 'C',
    storeType: 1
  },
  bootMode: 0,
  id: 15877,
  server: {
    createDate: '2019/09/16 15:01:16',
    hostId: 365,
    hostName: 'VM',
    id: 548,
    reserver1: 'b480d729-4594-45e5-a759-6216e2a35c88',
    reserver2: '546',
    serverIp: '145.170.33.150',
    serverName: '145.170.33.150',
    serverType: 2,
    state: 0,
    vmType: 1
  },
  serverId: 548,
  type: 1,
  vmHostName: '145.170.33.150',
  vmName: 'jy_windows2008_filebackup1_41',
  vmPath: '145.170.32.8\\武汉四通信息服务有限公司数据中心\\武汉四通信息服务有限公司集群\\jy_windows2008_filebackup1_41'
};

const virtuals = [
  {
    hostId: 365,
    id: 15877,
    serverId: 548,
    type: 1,
    bootState: 1,
    vmHostName: '145.170.33.150',
    vmName: 'jy_windows2008_filebackup1_41',
    vmPath: '145.170.32.8\\武汉四通信息服务有限公司数据中心\\武汉四通信息服务有限公司集群\\jy_windows2008_filebackup1_41'
  },
  {
    hostId: 365,
    id: 15878,
    server: null,
    serverId: 548,
    type: 1,
    bootState: 0,
    vmHostName: '145.170.33.150',
    vmName: 'jy-win-2008 -manager-V2.2-204',
    vmPath: '145.170.32.8\\武汉四通信息服务有限公司数据中心\\武汉四通信息服务有限公司集群\\jy-win-2008 -manager-V2.2-204'
  },
  {
    hostId: 365,
    id: 15901,
    server: null,
    serverId: 548,
    type: 1,
    bootState: 0,
    vmHostName: '145.170.33.150',
    vmName: 'ks-sqlserver-windows2008-221',
    vmPath: '145.170.32.8\\武汉四通信息服务有限公司数据中心\\武汉四通信息服务有限公司集群\\ks-sqlserver-windows2008-221'
  }
];

const backupPlan = {
  config: {
    backupStrategy: 1,
    datePoints: [],
    singleTime: '2019-09-25 11:00:00',
    startTime: '',
    timeInterval: 0,
    timePoints: [],
    timeStrategy: 0,
    weekPoints: []
  },
  consume: 0, //
  name: '备份计划',
  processSpeed: 0, //
  sourceSize: '15569256448',
  size: 0,
  startTime: '2019-09-25 11:00:00',
  state: 0, //
  vmList: null
};

const singleRestorePlan = {
  config: {
    datePoints: [],
    diskName: 'SATA-150',
    hostIp: '145.170.32.150',
    newName: '恢复虚拟机',
    oldName: 'cs-win2008-oracle11g-23',
    serverId: 549,
    singleTime: '2019-09-26 09:15:00',
    startTime: '2019-09-26 09:15:00',
    timePoints: [],
    timeStrategy: 1,
    weekPoints: []
  },
  consume: 0,
  name: '20190926091508',
  startTime: '2019-09-26 09:15:00',
  state: 0,
  vmId: 15710
};

const restorePlan = {
  config: {
    datePoints: [],
    diskName: 'SATA-150',
    hostIp: '145.170.32.150',
    newName: '恢复虚拟机',
    oldName: 'cs-win2008-oracle11g-23',
    serverId: 549,
    singleTime: '2019-09-30 10:35:00',
    startTime: '',
    timePoints: [],
    timeStrategy: 1,
    weekPoints: [],
    serverConfig: {}
  },
  consume: 0,
  name: '计划恢复',
  startTime: '2019-09-30 10:35:00',
  state: 0,
  vmId: 15710
};

const result = {
  consume: 6,
  endTime: '2019-09-25 11:00:06',
  errorMsg: '',
  fileName: 'cs-win2008-oracle11g-23D2019-09-25T110045.vbk',
  path: '\\\\145.170.33.134\\backup\\WCG\\vm\\cs-win2008-oracle11g-23\\',
  size: '14.5G',
  startTime: '2019-09-25 11:00:00',
  state: 0,
};

// const singleRestorePlanRecord = {
//   backupResult: {
//     backupType: 1,
//     consume: 6,
//     endTime: '2019-09-25 11:00:06',
//     errorMsg: '',
//     fileName: 'cs-win2008-oracle11g-23D2019-09-25T110045.vbk',
//     identifier: '',
//     path: '\\\\145.170.33.134\\backup\\WCG\\vm\\cs-win2008-oracle11g-23\\',
//     size: '14.5G',
//     startTime: '2019-09-25 11:00:00',
//     state: 0
//   },
//   diskName: 'SATA-150',
//   endTime: '2019-09-26 09:15:06',
//   errorMsg: '',
//   hostIp: '145.170.32.150',
//   newName: '恢复虚拟机',
//   oldName: 'cs-win2008-oracle11g-23',
//   startTime: '2019-09-26 09:15:00',
//   state: 0
// };

const record = {
  backupResult: {
    backupType: 1,
    consume: 6,
    endTime: '2019-09-25 11:00:06',
    errorMsg: '',
    fileName: 'cs-win2008-oracle11g-23D2019-09-25T110045.vbk',
    identifier: '',
    path: '\\\\145.170.33.134\\backup\\WCG\\vm\\cs-win2008-oracle11g-23\\',
    size: '14.5G',
    startTime: '2019-09-25 11:00:00',
    state: 0
  },
  diskName: 'SATA-150',
  endTime: '2019-09-30 10:35:06',
  errorMsg: '',
  hostIp: '145.170.32.150',
  newName: '恢复虚拟机',
  oldName: 'cs-win2008-oracle11g-23',
  startTime: '2019-09-30 10:35:00',
  state: 0
};

export {
  vmHost,
  serverHost,
  targetServerHost,
  detail,
  virtuals,
  backupPlan,
  restorePlan,
  singleRestorePlan,
  result,
  record
};
