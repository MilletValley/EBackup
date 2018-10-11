import {
  databaseStateMapping,
  databaseRoleMapping,
  linkStateMapping,
  switchStateMapping,
  switchManualMapping,
  switchTypeMapping,
  serviceIpMarkMapping,
} from '../../utils/constant';

const takeoverMixin = {
  methods: {
    // 数据库连接状态与tag类型的映射
    databaseLinkStateStyle(value) {
      switch (value) {
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case 3:
        case 4:
          return 'danger';
        case 5:
          return 'info';
        default:
          return '';
      }
    },
    databaseStateStyle(value) {
      switch (value) {
        case 0:
          return 'info';
        case 1:
          return 'success';
        case 2:
          return 'danger';
        default:
          return '';
      }
    },
    switchStateStyle(value) {
      switch (value) {
        case 1:
          return 'info';
        case 2:
          return 'success';
        case 3:
          return 'danger';
        default:
          return '';
      }
    },
    // 是否进行过单切
    hasSimpleSwitch(simpleSwitch) {
      return Object.keys(simpleSwitch).length > 0;
    },
    switchManualFormatter(row, column, cellValue) {
      return switchManualMapping[cellValue];
    },
    switchStateFormatter(row, column, cellValue) {
      return switchStateMapping[cellValue];
    },
    switchTypeFormatter(row, column, cellValue) {
      return switchTypeMapping[cellValue];
    },
  },
  filters: {
    databaseStateFilter(value) {
      return databaseStateMapping[value];
    },
    databaseRoleFilter(value = 0) {
      return databaseRoleMapping[value].substr(0, 1);
    },
    linkStateFilter(value) {
      return linkStateMapping[value];
    },
    switchStateFilter(value) {
      return switchStateMapping[value];
    },
    switchManualFilter(value) {
      return switchManualMapping[value];
    },
    serviceIpMarkFilter(value) {
      return serviceIpMarkMapping[value];
    },
  },
};

export default takeoverMixin;
