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
    // 单切源IP
    simpleSwitchOriginIp(hostLink) {
      if (this.osIsWindows(hostLink.viceHost.osName)) { // Windows下
        // 第一次单切
        if (!this.hasSimpleSwitch(hostLink.simpleSwitch)) {
          return hostLink.viceHost.hostIp;
        }
        // 非第一次单切
        if (hostLink.simpleSwitch.state === 2) { // 记录中切换成功
          return hostLink.simpleSwitch.targetIp;
        }
        return hostLink.simpleSwitch.originIp;
        // eslint-disable-next-line
      } else { // Linux下, 源IP是服务IP
        if (hostLink.serviceIpMark === 1) {
          return hostLink.primaryHost.serviceIp;
        }
        return hostLink.viceHost.serviceIp;
      }
    },
    // 单切目的IP
    simpleSwitchTargetIp(hostLink) {
      if (this.osIsWindows(hostLink.viceHost.osName)) { // Windows下
        // 第一次单切
        if (!this.hasSimpleSwitch(hostLink.simpleSwitch)) {
          return hostLink.primaryHost.hostIp;
        }
        // 非第一次单切
        if (hostLink.simpleSwitch.state === 2) { // 记录中切换成功
          return hostLink.simpleSwitch.originIp;
        }
        return hostLink.simpleSwitch.targetIp;
        // eslint-disable-next-line
      } else { // Linux下，目的IP是生产设备物理IP或易备设备物理IP
        if (hostLink.serviceIpMark === 1) {
          return hostLink.viceHost.hostIp;
        }
        return hostLink.primaryHost.hostIp;
      }
    },
    // 易备设备是否在Windows下，用于区分显示IP切换方向：
    // 1.源=>目标
    // 2.服务IP=>生产/易备设备
    osIsWindows(osName) {
      return osName === 'Windows';
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
