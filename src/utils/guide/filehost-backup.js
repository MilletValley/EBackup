const filehost = {
  hostName: 'WIN-FILE-F1',
  hostAlias: '145.170.32.64',
  hostIp: '145.170.32.64',
  osName: 'Windows',
  loginName: 'administrator',
  password: '123456'
};

const targetFileHost = {
  createTime: '2019-09-25 13:27:27',
  hostAlias: '145.170.32.65',
  hostIp: '145.170.32.65',
  hostName: 'WIN-FILE-F2',
  loginName: 'administrator',
  osName: 'Windows',
  password: 'P@ssw0rd'
};

const backupPlan = {
  backupFiles: [{
    backupSize: 0,
    consume: 0,
    errorMsg: '',
    id: 422,
    isAlert: '0',
    percentage: 0,
    pointPath: 'K:\\WIN-FILE-F1\\422',
    progress: 0,
    sourceFileName: 'test',
    sourcePath: 'C:\\test',
    sourceSize: 1313168,
    startTime: '2019-09-25 15:25:00',
    state: 0,
    targetPath: '\\145.170.33.134\\backup\\WCG\\file\\WIN-FILE-F1\\422'
  }],
  backupSize: 0,
  backupType: 1,
  bwlimit: 0,
  unit: 'Kbps',
  config: {
    backupStrategy: 1,
    datePoints: [],
    singleTime: '',
    timeInterval: 60,
    timePoints: [{ key: '13:45', value: '13:45' }],
    timeStrategy: 3,
    weekPoints: []
  },
  createTime: '2019-09-25 11:27:31',
  startTime: '2019-09-25 13:26:00',
  percentage: 0,
  progress: 0,
  size: 1313168,
  state: 0,
  excludeFiles: ['*.png'],
  name: '备份计划'
};

const singleRestorePlan = {
  excludeFiles: [],
  percentage: 0,
  planName: '恢复计划',
  progress: 0,
  restorePath: [{
    consume: 0,
    errorMsg: '',
    pointPath: 'K:\\WIN-FILE-F1\\422',
    progress: 0,
    sourceFileName: 'C:\\test',
    sourcePath: '\\145.170.33.134\\backup\\WCG\\file\\WIN-FILE-F1\\422',
    sourceSize: 1313168,
    startTime: '2019-09-25 13:38:16',
    state: 0,
    targetPath: 'D',
    percentage: 0,
    id: 524
  }],
  restoreType: 1,
  size: 1313168,
  startTime: '2019-09-25 13:41:52',
  state: 0,
  targetFileHost,
  targetPath: 'D',
  loginName: 'administrator',
  password: 'P@ssw0rd'
};

const result = {
  backupFiles: [{
    consume: 5,
    id: 1,
    endTime: '2019-09-25 13:25:06',
    errorMsg: '成功',
    fileName: 'test',
    identifier: '',
    pointPath: 'K:\\WIN-FILE-F1\\422',
    size: 1313168,
    sourcePath: 'C:\\test',
    sourceSize: 0,
    startTime: '2019-09-25 13:25:00',
    state: 0,
    targetPath: '\\\\145.170.33.134\\backup\\WCG\\file\\WIN-FILE-F1\\422'
  }],
  backupType: 1,
  createTime: '2019-09-25 11:27:31',
  excludeFiles: ['*.png'],
  name: '备份计划',
  startTime: '2019-09-25 13:26:00'
};

const record = {
  filePaths: [{
    consume: 5,
    endTime: '2019-09-25 13:38:17',
    id: 182,
    message: '成功',
    pointPath: 'K:\\WIN-FILE-F1\\422',
    sourceFileName: 'C:\\test',
    sourcePath: '\\\\145.170.33.134\\backup\\WCG\\file\\WIN-FILE-F1\\422',
    sourceSize: 1313168,
    startTime: '',
    state: 0,
    targetPath: 'D'
  }],
  host: targetFileHost,
  id: 182,
  planName: '恢复计划',
  restoreType: 1,
  startTime: '2019-09-25 13:41:52'
};

const detail = {
  ...filehost
};

export {
  filehost,
  targetFileHost,
  detail,
  backupPlan,
  singleRestorePlan,
  result,
  record
};
