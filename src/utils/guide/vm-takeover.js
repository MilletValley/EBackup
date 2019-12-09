const baseVirtual = {
  hostId: 365,
  id: 15877,
  serverId: 548,
  type: 1,
  bootState: 1,
  vmHostName: '145.170.32.150',
  vmPath: '145.170.32.8\\武汉四通信息服务有限公司数据中心\\武汉四通信息服务有限公司集群\\jy_windows2008_filebackup1_41',
  ip: '8.8.8.8',
  state: 0 // 自定义：0-正常，1-异常
};

const sourceVirtual = {
  vmName: 'cs_win_rac_90_xx',
  ...baseVirtual
};

const targetVirtual = {
  vmName: 'cs_win_rac_90_xx_replica',
  ...baseVirtual
};

const createLink = {
  serverName: '145.170.32.8',
  savePath: 'SATA',
  syncTimeStrategy: 2,
  syncTimeInterval: 1,
  syncRunTime: '',
  weekDays: [],
  ...sourceVirtual
};

const latestOperationInfo = {};

const virtualLink = {
  sourceVirtual,
  targetVirtual: {
    ip: baseVirtual.ip
  },
  id: 234,
  createTime: '2019/10/09 15:00:00',
  state: 0,
  linkMessage: '',
  strategyConfig: {
    syncTimeStrategy: createLink.syncTimeStrategy,
    syncRunTime: createLink.syncRunTime,
    weekDays: createLink.weekDays,
    syncTimeInterval: createLink.syncTimeInterval,
    nextSyncTime: ''
  },
  // syncTime: '2019/10/09 15:00:00',
  // syncState: 0,
  currentSyncStatus: 0
};

const strategyFormData = {
  syncTimeStrategy: 3,
  minuteInterval: 1,
  hourInterval: 1,
  weekDays: [],
  syncRunTime: '12:00'
};

export {
  sourceVirtual,
  targetVirtual,
  createLink,
  virtualLink,
  latestOperationInfo,
  strategyFormData
};
