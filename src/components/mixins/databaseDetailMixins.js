const databaseDetailMixin = {
  props: ['id'],
  data() {
    return {
      databaseInfoLoading: true, // 数据库信息loading
      activeTab: 'plans', // 激活的tab页
      dbInfo: {}, // 数据库信息
      backupPlan: {}, // 备份计划 { config, ...operation }
      backupPlans: [],
      selectedIndex: -1,
      results: [], // 备份集
      dbEditModal: false,
      planCreateModal: false,
      planUpdateModal: false,
    };
  },
  computed: {
    // 备份计划只能存在一个未开始(0) 或 进行中(1)
    backupAddBtnDisable() {
      return this.backupPlans.some(
        plan => plan.state === 0 || plan.state === 1
      );
      // return Object.keys(this.backupPlan).length !== 0;
    },
    selectedPlan() {
      return this.selectedIndex === -1
        ? {}
        : this.backupPlans[this.selectedIndex];
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
      // this.backupPlan = data;
      this.backupPlans.splice(0, 0, data);
    },
    // 更新备份计划Modal确认后回调
    updateBackupPlan(data) {
      // this.backupPlan = data;
      this.backupPlans.splice(this.selectedIndex, 1, data);
      this.selectedIndex = -1;
    },
    // 选择一个备份计划 点击计划编辑按钮时绑定
    selectPlan(planIndex) {
      this.planUpdateModal = true;
      this.selectedIndex = planIndex;
    },
    // 删除一个备份计划
    deleteBackupPlan(planIndex) {
      this.backupPlans.splice(planIndex, 1);
      // this.backupPlans.splice(this.backupPlans.findIndex(plan => plan.id === planId), 1);
    },
  },
};

export default databaseDetailMixin;
