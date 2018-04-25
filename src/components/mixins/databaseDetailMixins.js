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
    };
  },
  created() {
    this.fetchData();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData();
    next();
  },
};

export default databaseDetailMixin;
