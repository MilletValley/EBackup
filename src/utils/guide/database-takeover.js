const primaryHost = {
  createdTime: '2019-08-26 16:21:18',
  databaseType: 1,
  hostIp: '145.170.32.20',
  hostType: 1,
  id: 342,
  isRacMark: 1,
  loginName: 'administrator',
  name: '145.170.32.20主',
  oracleVersion: 2,
  osName: 'Windows',
  password: 'P@ssw0rd',
  serviceIp: '145.170.32.120',
  sharingPath: '',
  storagePath: 'C',
  storeType: 1,
  tempVip: '',
  vip: ''
};

const viceHost = {
  createdTime: '2019-08-14 15:34:32',
  databaseType: 1,
  hostIp: '145.170.32.14',
  hostType: 2,
  id: 331,
  isRacMark: 1,
  loginName: 'administrator',
  name: '145.170.32.14备',
  oracleVersion: 2,
  osName: 'Windows',
  password: 'P@ssw0rd',
  serviceIp: '145.170.32.121',
  sharingPath: '',
  storagePath: 'C',
  storeType: 1,
  tempVip: '',
  vip: ''
};

const primaryDatabase = {
  application: '',
  createTime: '2019-09-09 15:19:48',
  dbVersion: '',
  id: 14194,
  instanceName: 'orcl',
  loginName: 'sys',
  lsn: 'LSN3',
  name: 'orcl',
  password: '11A4BC68BBBA7695A476B954142ECFFF',
  role: 1,
  state: 1,
  dbPort: 1521
};

const viceDatabase = {
  application: '',
  createTime: '2019-09-11 14:45:06',
  dbVersion: '',
  id: 14197,
  instanceName: 'orcl',
  loginName: 'sys',
  lsn: 'LSN3',
  name: 'orcl易备库',
  password: '11A4BC68BBBA7695A476B954142ECFFF',
  role: 2,
  state: 1
};

const databaseLinkLatestSwitch = {
  consume: 0,
  content: '',
  endTimeTime: '',
  id: 0,
  linkId: 0,
  manual: 1,
  name: '',
  state: 0,
  switchIp: '',
  switchTime: '2019-09-11 16:23:13',
  type: 0
};

const databaseLink = {
  errMsg: '正在初始化，请等待',
  failOverState: 0,
  id: 1,
  initTime: 360,
  latestSwitch: databaseLinkLatestSwitch,
  primaryDatabase,
  state: 1,
  tempPort: '1523',
  viceDatabase
};

const hostLinkLatestSwitch = {
  consume: 0,
  content: '',
  endTime: '',
  id: 0,
  linkId: 0,
  manual: 1,
  name: '',
  state: 0,
  switchIp: '',
  switchTime: '2019-09-11 10:45:00',
  type: 0
};

const simpleSwitch = {
  message: '',
  originIp: '',
  state: 1,
  switchTime: '2019-09-11 14:56:50',
  targetIp: ''
};

export {
  primaryDatabase,
  viceDatabase,
  primaryHost,
  viceHost,
  databaseLink,
  hostLinkLatestSwitch,
  databaseLinkLatestSwitch,
  simpleSwitch
};
