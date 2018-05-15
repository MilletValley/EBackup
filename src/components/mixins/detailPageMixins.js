import throttle from 'lodash/throttle';
import { applyFilterMethods } from '../../utils/common';

const baseMixin = {
  props: ['id'],
  data() {
    return {
      infoLoading: true, // 信息loading
      activeTab: 'plans', // 激活的tab页
      details: {}, // 对象详情信息
      // backupPlan: {}, // 备份计划 { config, ...operation }
      backupPlans: [],
      selectedPlanIndex: -1,
      restorePlans: [], // 恢复计划
      restoreRecords: [], // 恢复记录
      results: [], // 备份集
      detailsEditModal: false,
      planCreateModal: false,
      planUpdateModal: false,
      planFilterForm: {
        hiddenCompletePlan: false,
      },
      resultFilterForm: {},
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
      return this.selectedPlanIndex === -1
        ? {}
        : this.backupPlans[this.selectedPlanIndex];
    },
    filteredBackupPlans() {
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.backupPlans, filterMethods);
    },
    // 正在进行中的恢复计划
    ongoingRestorePlan() {
      return this.restorePlans.filter(plan => plan.state === 0);
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
      this.backupPlans.splice(this.selectedPlanIndex, 1, data);
      this.selectedPlanIndex = -1;
    },
    // 选择一个备份计划 点击计划编辑按钮时绑定
    selectPlan(planIndex) {
      this.planUpdateModal = true;
      this.selectedPlanIndex = planIndex;
    },
    // 删除一个备份计划
    deleteBackupPlan(planIndex) {
      this.backupPlans.splice(planIndex, 1);
      // this.backupPlans.splice(this.backupPlans.findIndex(plan => plan.id === planId), 1);
    },
    throttleMethod(func) {
      return throttle(
        () => {
          func(this.id)
            .then(res => {
              const { data: result } = res.data;
              this.results = result;
            })
            .catch(error => {
              this.$message.error(error);
            });
        },
        5000,
        { leading: true, trailing: false }
      );
    },
    addSingleRestore(restorePlan) {
      this.restorePlans.push(restorePlan);
    },
  },
};

const databaseDetailMixin = Object.assign({}, baseMixin);

const fileHostDetailMixin = Object.assign({}, baseMixin);

export { databaseDetailMixin, fileHostDetailMixin };
