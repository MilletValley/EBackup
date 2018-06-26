const operationStateMapping = {
  0: '未开始',
  1: '进行中',
  2: '已结束',
};

const backupResultMapping = {
  0: '成功',
  1: '失败',
};

const backupStrategyMapping = {
  0: '全备',
  1: '全备+增备',
  2: '全备+日志备份',
};

const timeStrategyMapping = {
  0: '单次执行',
  1: '按分钟循环',
  2: '按小时循环',
  3: '按天循环',
  4: '按周循环',
  5: '按月循环',
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
  2: 'Linux',
};

// 使用类别
const useTypeMapping = {
  1: 'oracle',
  2: 'sqlserver',
  3: '文件',
  4: '虚拟机',
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

export {
  operationStateMapping,
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  backupResultMapping,
  restoreTimeStrategyMapping,
  recoveringStrategyMapping,
  databaseStateMapping,
  hostTypeMapping,
  sysTypeMapping,
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
};
