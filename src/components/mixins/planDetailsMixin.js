import {
  weekMapping,
  vmHostServerTypeMapping
} from '@/utils/constant';
import { fmtSizeFn } from '@/utils/common';

const typeMapping = {
  1: '数据库',
  2: '文件',
  3: '虚拟机',
};
const vmTypeMapping = {
  1: 'vmware',
  2: 'hw'
};
const dbTypeMapping = {
  1: 'sqlserver',
  2: 'oracle',
  3: 'mysql',
  4: 'db2',
  5: 'dm'
};

const routerNameMapping = {
  windows: 'filehostDetail',
  linux: 'filehostDetail',
  vmware: 'virtualDetail',
  hw: 'hwVirtualDetail',
  oracle: 'oracleDetail',
  sqlserver: 'sqlserverDetail',
  mysql: 'mysqlDetail',
  db2: 'db2Detail',
  dm: 'damengDetail'
};
const commonTypeMapping = {
  windows: 'Windows',
  linux: 'Linnux',
  vmware: 'VMware',
  hw: '华为虚拟机',
  oracle: 'Oracle',
  sqlserver: 'SQL Server',
  mysql: 'MySql',
  db2: 'DB2',
  dm: '达梦数据库'
};
const planDetailsMixin = {
  data() {
    return {
      infoLoading: false,
      details: {},
      fmtSizeFn
    };
  },
  computed: {
    config() {
      return this.details.config ? this.details.config : {};
    },
    machine() {
      return this.details.machine ? this.details.machine : {};
    },
    timeStrategy() {
      const type = this.details.config ? this.details.config.timeStrategy : 0;
      // return timeStrategyMapping[type];
      return type;
    },
    weekPoints() {
      return this.config.weekPoints.map(p => weekMapping[p]);
    },
    datePoints() {
      return this.config.datePoints.sort((a, b) => Number(a) - Number(b));
    },
    timePoints() {
      return this.config.timePoints.sort((a, b) => this.hoursFmt(a) - this.hoursFmt(b));
    },
    machineType() {
      const type = this.details.machineType;
      return type ? typeMapping[type] : '';
    },
    target() {
      const machineType = this.details.machineType;
      const type = this.details.machine ? this.details.machine.type : 1;
      let target = '';
      switch (machineType) {
        case 1:
          target = dbTypeMapping[type];
          break;
        case 2:
          target = this.details.machine && this.details.machine.osName ? this.details.machine.osName.toLowerCase() : 'windows';
          break;
        case 3:
          target = vmTypeMapping[type];
          break;
        default:
      }
      return target;
    },
    linkObject() {
      const name = routerNameMapping[this.target];
      const id = this.machine.id;
      return { name, params: { id: String(id) } };
    }
  },
  mounted() {
    this.fetchData(this.$route.query.id, this.$route.query.type);
  },
  filters: {
    commonTypeFilter(val) {
      return commonTypeMapping[val];
    }
  },
  methods: {
    hoursFmt(hour) {
      const arr = hour.split(':');
      const a = Number(arr[0]);
      const b = Number(arr[1]);
      if (isNaN(a) || isNaN(b)) {
        return 0;
      }
      return a * 60 + b;
    },
    serverTypeFilter(val) {
      return vmHostServerTypeMapping[val];
    }
  }
};

// eslint-disable-next-line
export { planDetailsMixin };