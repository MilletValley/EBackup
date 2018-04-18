const operationStateMapping = {
  1: '状态1',
  2: '状态2',
};

const backupStrategyMapping = {
  0: '全备',
  1: '全备+增备',
  2: '全备+日志备份',
};

const timeStrategyMapping = {
  0: '单次执行',
  1: '按天循环',
  2: '按周循环',
  3: '按月循环',
  4: '间隔执行',
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

export {
  operationStateMapping,
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
};
