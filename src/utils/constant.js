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

export {
  operationStateMapping,
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  backupResultMapping,
  restoreTimeStrategyMapping,
  recoveringStrategyMapping,
};
