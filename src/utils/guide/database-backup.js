const primaryHost = {
  hostIp: '145.170.32.1',
  hostType: 1,
  databaseType: 1,
  storeType: 1,
  name: 'oracle-host',
  osName: 'Windows',
  serverIp: '145.170.32.111'
};
const viceHost = {
  hostIp: '145.170.32.103',
  hostType: 2,
  databaseType: 1,
  storeType: 1,
  name: 'oracle-host备',
  osName: 'Windows',
  serverIp: '145.170.32.119'
};
const primaryDatabase = {
  name: 'test12c',
  hostIp: '145.170.32.1',
  instanceName: 'orcl',
  dbPort: '1521',
  loginName: 'sys',
  password: 'oracle'
};
const detail = {
  ...primaryDatabase,
  state: 1,
  host: {
    ...primaryHost
  }
};
const backupPlan = {
  consume: 0,
  name: '备份计划',
  sourceSize: 176160768,
  size: 0,
  startTime: '2019-09-12 15:17:00',
  state: 0,
  config: {
    backupStrategy: 1,
    dataPoints: [],
    singleTime: '2019-09-12 15:17:00',
    startTime: '',
    timePoints: [],
    timeStrategy: 0,
    weekPoints: []
  }
};
const restorePlan = {
  name: '计划恢复',
  state: 0,
  startTime: '2019-09-18 00:00:00',
  config: {
    database: { ...this.detail },
    datePoints: [],
    dbPort: 1521,
    detailInfo: 'orcl',
    hostIp: '145.170.32.103',
    loginName: 'sys',
    password: 'oracle',
    singleTime: '2019-09-18 00:00:00',
    timePoints: [],
    timeStrategy: 1,
    weekPoints: []
  }
};
const singleRestorePlan = {
  consume: 0,
  name: '20190916175122',
  startTime: '2019-09-16 17:51:50',
  state: 0,
  config: {
    database: { ...this.detail },
    datePoints: [],
    dbPort: 1521,
    detailInfo: 'orcl',
    hostIp: '145.170.32.103',
    loginName: 'sys',
    password: 'oracle',
    singleTime: '2019-09-16 17:53:27',
    startTime: '2019-09-16 17:53:27',
    timePoints: [],
    timeStrategy: 1,
    weekPoints: []
  }
};
const result = {
  consume: '5',
  endTime: '2019-09-12 15:17:05',
  errorMsg: '',
  fileName: 'SPFILE_CONTROL_CC-20190912-00',
  identifier: '',
  path: '\\145.170.33.134\\BACKUP\\WCG\\ORACLE\\SPFILE_CONTROL_CC-20190912-00',
  size: '3.81G',
  startTime: '2019-09-12 15:17:00',
  state: 0
};
// const restorePlanRecord = {
//   detailInfo: 'orcl',
//   endTime: '2019-09-18 00:00:05',
//   errorMsg: '',
//   hostIp: '145.170.32.103',
//   startTime: '2019-09-18 00:00:00',
//   state: 0,
//   backupResult: {
//     consume: '5',
//     endTime: '2019-09-12 15:17:05',
//     errorMsg: '',
//     fileName: 'SPFILE_CONTROL_CC-20190912-02',
//     identifier: '',
//     path: '\\145.170.33.134\\BACKUP\\WCG\\ORACLE\\14640\\1864\\SPFILE_CONTROL_CC-20190912-00',
//     size: '16.76M',
//     startTime: '2019-09-12 15:17:00',
//     state: 0
//   }
// };
// const singleRestorePlanRecord = {
//   detailInfo: 'orcl',
//   endTime: '2019-09-19 00:00:05',
//   errorMsg: '',
//   hostIp: '145.170.32.103',
//   startTime: '2019-09-19 00:00:00',
//   state: 0,
//   backupResult: {
//     consume: '5',
//     endTime: '2019-09-12 15:17:05',
//     errorMsg: '',
//     fileName: 'SPFILE_CONTROL_CC-20190912-02',
//     identifier: '',
//     path: '\\145.170.33.134\\BACKUP\\WCG\\ORACLE\\14640\\1864\\SPFILE_CONTROL_CC-20190912-00',
//     size: '16.76M',
//     startTime: '2019-09-12 15:17:00',
//     state: 0
//   }
// };
const record = {
  detailInfo: 'orcl',
  endTime: '2019-09-18 00:00:05',
  errorMsg: '',
  hostIp: '145.170.32.103',
  startTime: '2019-09-18 00:00:00',
  state: 0,
  backupResult: {
    consume: '5',
    endTime: '2019-09-12 15:17:05',
    errorMsg: '',
    fileName: 'SPFILE_CONTROL_CC-20190912-02',
    identifier: '',
    path: '\\145.170.33.134\\BACKUP\\WCG\\ORACLE\\14640\\1864\\SPFILE_CONTROL_CC-20190912-00',
    size: '16.76M',
    startTime: '2019-09-12 15:17:00',
    state: 0
  }
};

export {
  primaryHost,
  viceHost,
  primaryDatabase,
  detail,
  backupPlan,
  restorePlan,
  singleRestorePlan,
  result,
  record
};
