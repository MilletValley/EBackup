const operationStateMapping = {
  0: '未开始',
  1: '进行中',
  2: '已结束',
  3: '失败'
};

const backupResultMapping = {
  0: '成功',
  1: '失败',
};

const restoreResultMapping = {
  0: '成功',
  1: '失败'
};

const backupStrategyMapping = {
  0: '全备',
  1: '全备+增备',
  2: '全备+日志备份',
};

// 文件备份策略

const filehostBackupStrategyMapping = {
  1: '全备+增备',
  2: '增量不删减'
};

const logStrategyMapping = {
  1: '备份日志',
  2: '不备份日志'
};

const timeStrategyMapping = {
  0: '单次',
  1: '按分钟循环',
  2: '按小时循环',
  3: '按天循环',
  4: '按周循环',
  5: '按月循环',
  6: '立即'
};

const weekMapping = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日',
};

const filehostBackupTypeMapping = {
  1: '文件备份',
  2: '盘符备份',
  3: '系统备份'
};

const filehostRestoreTypeMapping = {
  1: '文件恢复',
  2: '盘符恢复'
};

const restoreTimeStrategyMapping = {
  1: '单次执行',
  2: '按周循环',
  3: '按月循环',
};

const recoveringStrategyMapping = {
  1: '覆盖',
  2: '创建副本',
  3: '跳过',
};
// 由于设计不清 将 0:未知 修改为 3:未知 @0619
// 0626 添加监听异常状态
const databaseStateMapping = {
  3: '未知',
  1: '正常',
  2: '异常',
  4: '监听异常',
};
const databaseRoleMapping = {
  0: '无连接',
  1: '主库',
  2: '备库',
};

// 设备类型
const hostTypeMapping = {
  1: '生产环境',
  2: '易备环境',
};

// 系统类别
const sysTypeMapping = {
  // 0: '通用',
  1: 'Windows',
  2: 'Linux'
};

// Windows系统版本
const windowsTypeMapping = {
  1: '2003',
  2: '2008及以上'
};
const pathTypeMapping = {
  1: '共享文件夹路径',
  2: 'NFS路径'
};
// 使用类别
const useTypeMapping = {
  1: 'oracle',
  2: 'sqlserver',
  3: '文件',
  4: '虚拟机',
  5: 'mysql',
  6: 'db2',
  7: '达梦数据库'
};

const systemStateMapping = {
  0: '启用',
  1: '禁用',
};

// 设备包含的数据库类型
const databaseTypeMapping = {
  1: 'oracle',
  2: 'sqlserver',
  4: '虚拟机',
  5: 'mysql',
  6: 'db2',
  7: '达梦数据库'
};

// 数据库连接状态
const linkStateMapping = {
  1: '正在初始化',
  2: '正常',
  3: '异常不可接管',
  4: '异常可接管',
  5: '待修复',
};

// 是否切换IP
const switchIpMapping = {
  1: '切换IP',
  2: '保持IP',
};

// 切换操作状态
const switchStateMapping = {
  1: '切换中',
  2: '成功',
  3: '失败',
};

const switchManualMapping = {
  1: '手动',
  2: '自动',
};

const switchTypeMapping = {
  1: '切换实例',
  2: '切换IP',
  3: '解除连接',
};

const serviceIpMarkMapping = {
  1: '生产环境',
  2: '易备环境',
};

const vmHostServerTypeMapping = {
  1: 'vCenter',
  2: '物理主机',
  3: 'FusionSphere'
};

const backupTypeMapping = {
  1: '全备',
  2: '增备',
  3: '日志备份'
};

const yesOrNoMapping = {
  1: '是',
  2: '否'
};

// 首页备份恢复表格的信息(不含虚拟机)
const dbTypeMapping = {
  1: 'sqlserver',
  2: 'oracle',
  3: 'mysql',
  4: 'db2',
  5: '达梦'
};
// 首页数据库详情路由(不含虚拟机)
const dbDetailRouterMapping = {
  1: 'sqlserverDetail',
  2: 'oracleDetail',
  3: 'mysqlDetail',
  4: 'db2Detail',
  5: 'damengDetail'
};
// 首页数据库一键接管
const dbTakeOverRouterMapping = {
  1: 'sqlserverLinkDetail',
  2: 'oracleLinkDetail'
};

// 首页虚拟机详情路由
const vmDetailRouterMapping = {
  1: 'virtualDetail',
  2: 'hwVirtualDetail'
};

const vmTypeMapping = {
  1: 'VMware',
  2: '华为虚拟机'
};
export {
  operationStateMapping,
  backupStrategyMapping,
  filehostBackupStrategyMapping,
  filehostBackupTypeMapping,
  filehostRestoreTypeMapping,
  logStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  backupResultMapping,
  restoreResultMapping,
  restoreTimeStrategyMapping,
  recoveringStrategyMapping,
  databaseStateMapping,
  hostTypeMapping,
  sysTypeMapping,
  windowsTypeMapping,
  pathTypeMapping,
  useTypeMapping,
  systemStateMapping,
  databaseTypeMapping,
  databaseRoleMapping,
  linkStateMapping,
  switchStateMapping,
  switchIpMapping,
  switchManualMapping,
  switchTypeMapping,
  serviceIpMarkMapping,
  vmHostServerTypeMapping,
  backupTypeMapping,
  dbTypeMapping,
  dbDetailRouterMapping,
  dbTakeOverRouterMapping,
  vmDetailRouterMapping,
  vmTypeMapping,
  yesOrNoMapping
};
