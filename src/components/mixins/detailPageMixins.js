import throttle from 'lodash/throttle';
import IIcon from '@/components/IIcon';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import BackupCard from '@/components/BackupCard';
import RestoreCard from '@/components/RestoreCard';
import BackupResultList from '@/components/BackupResultList';
import RestoreRecords from '@/components/RestoreRecords';
import AddBackupPlan from '@/components/AddBackupPlan';
import UpdateBackupPlan from '@/components/UpdateBackupPlan';
import TabPanels from '@/components/TabPanels';
import RestorePlanCreateModal from '@/components/modal/RestorePlanCreateModal';
import RestorePlanUpdateModal from '@/components/modal/RestorePlanUpdateModal';
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
      selectedRestorePlanIndex: -1,
      restorePlans: [], // 恢复计划
      restoreRecords: [], // 恢复记录
      results: [], // 备份集
      detailsEditModal: false,
      planCreateModal: false,
      planUpdateModal: false,
      restorePlanCreateModalVisible: false,
      restorePlanUpdateModalVisible: false,
      planFilterForm: {
        hiddenCompletePlan: false,
      },
      resultFilterForm: {},
    };
  },
  computed: {
    // 备份计划只能存在一个未开始(0) 或 进行中(1)
    // 05.16 讨论放开权限 可以任意时间添加计划
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
    selectedRestorePlan() {
      return this.selectedRestorePlanIndex === -1
        ? {}
        : this.restorePlans[this.selectedRestorePlanIndex];
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
      return this.restorePlans.filter(plan => plan.state === 1);
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
      } else if (command === 'restore') {
        this.restorePlanCreateModalVisible = true;
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
    selectBackupPlan(planIndex) {
      this.planUpdateModal = true;
      this.selectedPlanIndex = planIndex;
    },
    // 选择一个恢复计划 点击计划编辑按钮时绑定
    selectRestorePlan(planIndex) {
      this.restorePlanUpdateModalVisible = true;
      this.selectedRestorePlanIndex = planIndex;
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
    // 添加恢复计划后
    restorePlanAdded(plan) {
      this.restorePlans.push(plan);
    },
    deleteRestorePlan(index) {
      this.restorePlans.splice(index, 1);
    },
    restorePlanUpdated(plan) {
      this.restorePlans.splice(this.selectedRestorePlanIndex, 1, plan);
      this.selectedRestorePlanIndex = -1;
    },
  },
  components: {
    IIcon,
    DatabaseUpdateModal,
    BackupCard,
    RestoreCard,
    BackupResultList,
    AddBackupPlan,
    UpdateBackupPlan,
    RestoreRecords,
    RestorePlanCreateModal,
    RestorePlanUpdateModal,
  },
};

const databaseDetailMixin = Object.assign({}, baseMixin);

const fileHostDetailMixin = Object.assign({}, baseMixin);

const detailPageMixin = {
  props: ['id'],
  data() {
    return {
      infoLoading: true, // 信息loading
      details: {},
      detailsEditModal: false,
      backupPlans: [],
      restorePlans: [], // 恢复计划
      restoreRecords: [], // 恢复记录
      results: [], // 备份集
      backupPlanCreateModalVisible: false,
      restorePlanCreateModalVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData();
    next();
  },
  methods: {
    switchPane(name) {
      if (name === 'results') {
        this.updateResults();
      }
    },
    // 节流函数 5s只触发一次
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
    throttleUpdateRestore(getRestorePlans, getRestoreRecords) {
      return throttle(
        () => {
          getRestorePlans(this.id)
            .then(res => {
              const { data: restorePlans } = res.data;
              this.restorePlans = restorePlans;
            })
            .catch(error => {
              this.$message.error(error);
            });
          getRestoreRecords(this.id)
            .then(res => {
              const { data: restoreRecords } = res.data;
              this.restoreRecords = restoreRecords;
            })
            .catch(error => {
              this.$message.error(error);
            });
        },
        5000,
        { leading: true, trailing: false }
      );
    },
    addPlanBtnClick(command) {
      if (command === 'backup') {
        this.backupPlanCreateModalVisible = true;
      } else if (command === 'restore') {
        this.restorePlanCreateModalVisible = true;
      }
    },
    // 添加备份计划
    addBackupPlan(data) {
      this.backupPlans.unshift(data);
    },
    // 更新备份计划
    updateBackupPlan(updateIndex, plan) {
      this.backupPlans.splice(updateIndex, 1, plan);
    },
    // 添加恢复计划后
    restorePlanAdded(plan) {
      this.restorePlans.push(plan);
    },
    // 删除备份计划事件
    deleteBackupPlan(deleteIndex) {
      this.backupPlans.splice(deleteIndex, 1);
    },
    // 添加一个单次恢复
    addRestorePlan(restorePlan) {
      this.restorePlans.unshift(restorePlan);
    },
    // 删除一个恢复计划
    deleteRestorePlan(deleteIndex) {
      this.restorePlans.splice(deleteIndex, 1);
    },
    // 更新恢复计划
    updateRestorePlan(updateIndex, plan) {
      this.restorePlans.splice(updateIndex, 1, plan);
    },
  },
  components: {
    IIcon,
    DatabaseUpdateModal,
    AddBackupPlan,
    RestorePlanCreateModal,
    TabPanels,
  },
};

export { databaseDetailMixin, fileHostDetailMixin, detailPageMixin };
