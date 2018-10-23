import { linkStateMapping, databaseStateMapping } from '../../utils/constant';

const DashboardTab = {
  data() {
    return {
      filterState: [
        { text: '成功', value: 0 },
        { text: '失败', value: 1 }
      ],
      takeoverFilterState: [
        { text: '正在初始化', value: 1 },
        { text: '正常', value: 2 },
        { text: '异常不可接管', value: 3 },
        { text: '异常可接管', value: 4 },
        { text: '待修复', value: 5 }
      ],
      backupStateInfo: ['filehostBackupState', 'databaseBackupState', 'vmBackupState'],
      restoreStateInfo: ['databaseRestoreState', 'filehostRestoreState'],
      takeoverStateInfo: ['initconnNumState'],
      filterTableData: []
    };
  },
  computed: {
    currentTableData() {
      switch (this.activeName) {
        case 'databaseBackup':
          return this.databaseBackup;
        case 'databaseRestore':
          return this.databaseRestore;
        case 'initconnNum':
          return this.initconnNum;
        case 'filehostBackup':
          return this.filehostBackup;
        case 'filehostRestore':
          return this.filehostRestore;
        case 'vmBackup':
          return this.vmBackup;
        default:
          return [];
      }
    }
  },
  filters: {
    filterByPage(data, currentPage, pagesize) {
      if (!data) {
        return [];
      }
      return data.slice((currentPage - 1) * pagesize, currentPage * pagesize);
    }
  },
  methods: {
    tabClick() {
      this.filterTableData = this.currentTableData;
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
    stateFilterChange(filter) {
      this.currentPage = 1;
      const filterKey = Object.keys(filter)[0];
      if (filterKey && filter[filterKey].length === 0) { // 重置
        this.filterTableData = this.currentTableData;
      } else { // 筛选
        // 数据库备份、文件备份、虚拟机备份的columnKey名
        // eslint-disable-next-line
        if (this.backupStateInfo.includes(filterKey)) {
          this.filterTableData = this.currentTableData.filter(
            db => filter[filterKey].includes(Number(db.backupState))
          );
        } else if (this.restoreStateInfo.includes(filterKey)) { // 数据库恢复、文件恢复
          this.filterTableData = this.currentTableData.filter(
            db => filter[filterKey].includes(Number(db.restoreState))
          );
        } else if (this.takeoverStateInfo.includes(filterKey)) { // 一键接管
          this.filterTableData = this.currentTableData.filter(
            db => filter[filterKey].includes(Number(db.overState))
          );
        }
      }
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
