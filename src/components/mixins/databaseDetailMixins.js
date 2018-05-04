const databaseDetailMixin = {
  props: ['id'],
  data() {
    return {
      databaseInfoLoading: true, // 数据库信息loading
      activeTab: 'plans', // 激活的tab页
      dbInfo: {}, // 数据库信息
      backupPlan: {}, // 备份计划 { config, ...operation }
      results: [], // 备份集
      dbEditModal: false,
      planCreateModal: false,
      planUpdateModal: false,
    };
  },
  computed: {
    hasBackupPlan() {
      return Object.keys(this.backupPlan).length !== 0;
    },
  },
  created() {
    this.fetchData();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData();
    next();
  },
  methods: {
    addPlanBtnClick(command) {
      if (command === 'backup') {
        this.planCreateModal = true;
      }
    },
    // 添加备份计划Modal确认后回调
    addBackupPlan(data) {
      this.backupPlan = data;
    },
    // 更新备份计划Modal确认后回调
    updateBackupPlan(data) {
      this.backupPlan = data;
    },
  },
};

export default databaseDetailMixin;
