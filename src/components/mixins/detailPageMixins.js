import throttle from 'lodash/throttle';
import IIcon from '@/components/IIcon';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import AddBackupPlan from '@/components/AddBackupPlan';
import TabPanels from '@/components/TabPanels';
import VmTabPanels from '@/components/VmTabPanels';
import RestorePlanUpdateModal from '@/components/modal/RestorePlanUpdateModal';
import SingleRestoreCreateModal from '@/components/modal/SingleRestoreCreateModal';
import RestorePlanCreateModal from '@/components/modal/RestorePlanCreateModal';
import backupPlanCreateModal from '@/components/modal/BackupPlanCreateModal';

import {
  databaseRoleMapping,
  linkStateMapping,
  databaseStateMapping,
} from '../../utils/constant';

const detailPageMixin = {
  props: ['id'],
  data() {
    return {
      infoLoading: true, // 信息loading
      details: {
        host: {},
      },
      link: {},
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
    role() {
      if (!this.details || !this.detilas.role) return databaseRoleMapping[0];
      return databaseRoleMapping[this.details.role];
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
    // 更新恢复计划
    // updateRestorePlan(updateIndex, plan) {
    //   this.restorePlans.splice(updateIndex, 1, plan);
    // },
    initSingleRestoreModal(id) {
      this.selectedBackupResultId = id;
      this.singleRestoreCreateModalVisible = true;
    },
    selectRestorePlan(restorePlanId) {
      this.selectedRestorePlanId = restorePlanId;
      this.restorePlanUpdateModalVisible = true;
    },
    roleIconName(role) {
      switch (role) {
        case 1:
          return 'zhu';
        case 2:
          return 'bei';
        default:
          return '';
      }
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
    backupPlanCreateModal,
  },
  filters: {
    linkStateFilter(value) {
      return linkStateMapping[value];
    },
    databaseStateFilter(value) {
      return databaseStateMapping[value];
    },
    databaseRoleFilter(value) {
      return databaseRoleMapping[value].substr(0, 1);
    },
  },
};

// eslint-disable-next-line
export { detailPageMixin };
