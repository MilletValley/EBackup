import throttle from 'lodash/throttle';
import IIcon from '@/components/IIcon';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import AddBackupPlan from '@/components/AddBackupPlan';
import TabPanels from '@/components/TabPanels';
import VmTabPanels from '@/components/VmTabPanels';
import RestorePlanUpdateModal from '@/components/modal/RestorePlanUpdateModal';
import SingleRestoreCreateModal from '@/components/modal/SingleRestoreCreateModal';
import RestorePlanCreateModal from '@/components/modal/RestorePlanCreateModal';

const detailPageMixin = {
  props: ['id'],
  data() {
    return {
      infoLoading: true, // 信息loading
      details: {
        host: {},
      },
      detailsEditModal: false,
      btnLoading: false,
      backupPlans: [],
      restorePlans: [], // 恢复计划
      restoreRecords: [], // 恢复记录
      results: [], // 备份集
      backupPlanCreateModalVisible: false,
      restorePlanCreateModalVisible: false,
      restorePlanUpdateModalVisible: false,
      selectedRestorePlanId: -1,
      selectedBackupResultId: -1,
      singleRestoreCreateModalVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData();
    next();
  },
  computed: {
    selectedRestorePlan() {
      return this.selectedRestorePlanId === -1
        ? {}
        : this.restorePlans.find(
          plan => plan.id === this.selectedRestorePlanId
        );
    },
  },
  methods: {
    switchPane(name) {
      if (name === 'results') {
        this.updateResults();
      }
    },
    // 节流函数 5s只触发一次
    throttleMethod(fn) {
      return throttle(fn, 5000, { leading: true, trailing: false });
    },
    // dropdown
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
    // 添加一个单次恢复
    // addRestorePlan(restorePlan) {
    //   this.restorePlans.unshift(restorePlan);
    // },
    // 更新恢复计划
    updateRestorePlan(updateIndex, plan) {
      this.restorePlans.splice(updateIndex, 1, plan);
    },
    initSingleRestoreModal(id) {
      this.selectedBackupResultId = id;
      this.singleRestoreCreateModalVisible = true;
    },
    selectRestorePlan(restorePlanId) {
      this.selectedRestorePlanId = restorePlanId;
      this.restorePlanUpdateModalVisible = true;
    },
  },
  components: {
    IIcon,
    DatabaseUpdateModal,
    AddBackupPlan,
    RestorePlanCreateModal,
    TabPanels,
    VmTabPanels,
    SingleRestoreCreateModal,
    RestorePlanUpdateModal,
  },
};

// eslint-disable-next-line
export { detailPageMixin };
