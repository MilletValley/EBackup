import { linkStateMapping, databaseStateMapping } from '../../utils/constant';
import { fetchBackup, fetchRestore, fetchInitconn } from '../../api/home';

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
      databaseBackup: [],
      databaseRestore: [],
      initconnNum: [],
      filehostBackup: [],
      filehostRestore: [],
      vmBackup: [],
      filterTableData: [],
      activeName: ''
    };
  },
  computed: {
    currentTableData() {
      // 当前显示的表格的值根据当前tab获取
      return this[this.activeName];
    }
  },
  watch: {
    currentTableData() {
      this.filterTableData = this.currentTableData;
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
      // 首页返回结果前五个元素，设备详情也返回所有结果
      if (data.length > 0) {
        const dataBySortAndType = data.filter(item => item.type === type).sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime));
        if (this.$route.name === 'dashboard') {
          return dataBySortAndType.slice(0, 5);
        }
        return dataBySortAndType;
      }
      return [];
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
