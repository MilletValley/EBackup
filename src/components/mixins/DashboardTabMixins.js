import { fmtSizeFn } from '@/utils/common';
import {
  linkStateMapping,
  databaseStateMapping,
  backupResultMapping,
  restoreResultMapping,
  dbTypeMapping,
  dbDetailRouterMapping,
  dbTakeOverRouterMapping,
  vmDetailRouterMapping,
  vmTypeMapping,
} from '../../utils/constant';
import { fetchBackup, fetchRestore, fetchInitconn } from '../../api/home';

const DashboardTab = {
  data() {
    return {
      databaseBackup: [],
      databaseRestore: [],
      initconnNum: [],
      filehostBackup: [],
      filehostRestore: [],
      vmBackup: [],
      vmRestore: [],
      activeName: ''
    };
  },
  computed: {
    // 备份结果
    filterBackupStateFilter() {
      return this.mappingConvertToFilters(backupResultMapping);
    },
    // 数据库类型
    dbTypeFilter() {
      return this.mappingConvertToFilters(dbTypeMapping);
    },
    // 恢复结果
    filterRestoreStateFilter() {
      return this.mappingConvertToFilters(restoreResultMapping);
    },
    // 数据库状态
    dbStateFilter() {
      return this.mappingConvertToFilters(databaseStateMapping);
    },
    // 数据库连接状态
    dbLinkStateFilter() {
      return this.mappingConvertToFilters(linkStateMapping);
    },
    // 虚拟机类型
    vmTypeFilter() {
      return this.mappingConvertToFilters(vmTypeMapping);
    },
  },
  methods: {
    fetchTabData() {
      fetchBackup()
        .then(res => {
          const { data } = res.data;
          this.databaseBackup = this.filterArray(data, 1);
          this.filehostBackup = this.filterArray(data, 2);
          this.vmBackup = this.filterArray(data, 3);
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchRestore()
        .then(res => {
          const { data } = res.data;
          this.databaseRestore = this.filterArray(data, 1);
          this.filehostRestore = this.filterArray(data, 2);
          this.vmRestore = this.filterArray(data, 3);
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchInitconn()
        .then(res => {
          const { data } = res.data;
          const initconnData = data.sort((a, b) => Date.parse(b.initFinishTime) - Date.parse(a.initFinishTime));
          this.initconnNum = this.$route.name === 'dashboard' ? initconnData.slice(0, 5) : initconnData;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    filterArray(data, type) {
      // 首页返回结果前五个元素，设备详情页返回所有结果
      if (data.length > 0) {
        const dataBySortAndType = data.filter(item => item.type === type).sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime));
        if (this.$route.name === 'dashboard') {
          return dataBySortAndType.slice(0, 5);
        }
        return dataBySortAndType;
      }
      return [];
    },
    // 映射对象转数组对象
    mappingConvertToFilters(mapping) {
      // eslint-disable-next-line
      return Object.keys(mapping).map(key => {
        return {
          text: mapping[key],
          value: Number(key)
        };
      });
    },
    filterHandle(value, row, column) {
      // eslint-disable-next-line
      const property = column['property'];
      return row[property] === value;
    },
    dbType(row) {
      return dbTypeMapping[row.ddvType];
    },
    dbDetailRouter(row) {
      return dbDetailRouterMapping[row.ddvType];
    },
    dbTakeOverRouter(row) {
      return dbTakeOverRouterMapping[row.ddvType];
    },
    vmDetailRouter(row) {
      return vmDetailRouterMapping[row.ddvType];
    },
    vmType(row) {
      return vmTypeMapping[row.ddvType];
    },
    beforeTabLeave(newName, oldName) {
      this.$refs[oldName].clearFilter();
    },
    databaseTypeConverter(state) { // 主备库状态
      return databaseStateMapping[state];
    },
    linkTypeConverter(state) { // 连接状态
      return linkStateMapping[state];
    },
    sizeFormatter(row, column, cellValue) {
      const size = fmtSizeFn(cellValue);
      return size || '-';
    },
    stateTagType(state) { // 主备库el-tag类型
      switch (Number(state)) {
        case 1:
          return 'success';
        case 2:
        case 4:
          return 'danger';
        case 3:
          return 'warning';
        default:
          return '';
      }
    },
    linkTagType(state) {
      switch (Number(state)) {
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case 3:
          return 'danger';
        case 4:
          return 'danger';
        case 5:
          return 'info';
        default:
          return '';
      }
    },
  }
};
export default DashboardTab;
