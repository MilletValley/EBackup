import {
  backupPlan as fileHostBackupPlan,
  singleRestorePlan as fileHostSingleRestorePlan,
  result as fileHostResult,
  record as fileHostRecord
} from '@/utils/guide/filehost-backup';
import {
  backupPlan as databaseBackupPlan,
  restorePlan as databaseRestorePlan,
  singleRestorePlan as databaseSingleRestorePlan,
  result as databaseResult,
  record as databaseRecord
} from '@/utils/guide/database-backup';
import {
  backupPlan as virtualBackupPlan,
  restorePlan as virtualRestorePlan,
  singleRestorePlan as virtualSingleRestorePlan,
  result as virtualResult,
  record as virtualRecord
} from '@/utils/guide/vm-backup';
import dayjs from 'dayjs';

const getBackupPlan = {
  database: databaseBackupPlan,
  filehost: fileHostBackupPlan,
  virtual: virtualBackupPlan
};

const getRestorePlan = {
  database: databaseRestorePlan,
  virtual: virtualRestorePlan
};

const getSingleRestorePlan = {
  database: databaseSingleRestorePlan,
  filehost: fileHostSingleRestorePlan,
  virtual: virtualSingleRestorePlan
};

const getResult = {
  database: databaseResult,
  filehost: fileHostResult,
  virtual: virtualResult
};

const getRecord = {
  sqlserver: databaseRecord,
  windows: fileHostRecord,
  virtual: virtualRecord
};

const detailMixin = {
  data() {
    return {
      backupPlanModalVisible: false,
      restorePlanModalVisible: false,
      singleRestoreCreateModalVisible: false,
      planFilterForm: {
        hiddenCompletePlan: false,
        planType: 'backup',
      },
      nextStep: '',
      stepType: '',
      waitingList: [],
      activeTab: 'plans',
      action: 'create',
      results: [],
      records: [],
      backupPlans: [],
      restorePlans: [],
      messageOffset: 80,
      startTime: '',
      endTime: '',
      forwardStepTime: ''
    };
  },
  watch: {
    backupPlans(list) {
      const onGoing = list.filter(plan => [0, 1].includes(plan.state));
      if (!onGoing.length && this.nextStep === 'waiting') {
        this.stepType = 'stop';
      }
    },
    restorePlans(list) {
      const onGoing = list.filter(plan => [0, 1].includes(plan.state));
      if (!onGoing.length && this.nextStep === 'waiting') {
        this.stepType = 'stop';
      }
    },
    stepType(val) {
      this.nextStep = this.steps[val][0];
    }
  },
  mounted() {
    if (this.operation === 'restore') {
      this.stepType = 'restorePlan';
      this.results.push(getResult[this.type]);
    } else {
      this.stepType = 'backupPlan';
    }
  },
  computed: {
    promptTextMapping() {
      return {
        createBackupPlan: '点击按钮添加备份计划',
        showResults: '已有备份计划执行成功，点击查看当前备份集',
        resultsToRestore: '点击查看当前备份集，开始立即恢复操作',
        createRestorePlan: '点击按钮添加恢复计划',
        createSingleRestorePlan: '展开一条备份记录，点击“恢复”按钮开始立即恢复',
        showBackupPlans: '点击查看创建的备份计划',
        showRestorePlans: '点击按钮查看创建的恢复计划',
        showPlans: '点击按钮查看创建的计划',
        showRecords: '存在恢复计划执行成功，点击查看恢复记录',
        waiting: `${this.operation === 'backup' ? '备份' : '恢复'}任务执行中，约5s完成，请稍候...`
      };
    },
    backupPlan() {
      return getBackupPlan[this.type];
    },
    restorePlan() {
      return getRestorePlan[this.type];
    },
    singleRestorePlan() {
      return getSingleRestorePlan[this.type];
    },
    result() {
      return getResult[this.type];
    },
    record() {
      return getRecord[this.type];
    },
    resultConfig() {
      const { startTime, endTime, ...config } = this.result;
      return config;
    },
    recordConfig() {
      const { startTime, endTime, ...config } = this.record;
      return config;
    },
    backupPlanFormData() {
      const { config, startTime, ...others } = this.backupPlan;
      const { singleTime, ...otherConfig } = config;
      return {
        startTime: this.startTime,
        singleTime: this.startTime,
        ...others,
        ...otherConfig
      };
    },
    restorePlanFormData() {
      if (this.restorePlan) {
        const { config, startTime, ...others } = this.restorePlan;
        const { singleTime, ...otherConfig } = config;
        return {
          startTime: this.startTime,
          singleTime: this.startTime,
          ...others,
          ...otherConfig
        };
      }
      return {};
    },
    singleRestorePlanFormData() {
      const { config, ...others } = this.singleRestorePlan;
      return { ...others, ...config };
    },
    filteredBackupPlans() {
      if (this.planFilterForm.planType !== 'backup') {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return this.applyFilterMethods(this.backupPlans, filterMethods);
    },
    filteredRestorePlans() {
      if (!['restore', 'tblRestore', 'logRestore'].includes(this.planFilterForm.planType)) {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return this.applyFilterMethods(this.restorePlans, filterMethods);
    },
    promptLeft() {
      switch (this.nextStep) {
        case 'showResults':
        case 'resultsToRestore':
          return '165px';
        case 'showPlans':
          return '85px';
        case 'showRestorePlans':
          return '295px';
        case 'showRecords':
          return '260px';
        case 'showFilters':
          return '-140px';
        default:
          return 0;
      }
    },
    promptTop() {
      switch (this.nextStep) {
        case 'showResults':
        case 'showPlans':
        case 'showRecords':
        case 'resultsToRestore':
          return '5px';
        case 'createSingleRestorePlan':
          return '190px';
        case 'showRestorePlans':
          return '55px';
        default:
          return 0;
      }
    },
    fingerLeft() {
      switch (this.nextStep) {
        case 'showResults':
        case 'resultsToRestore':
          return '125px';
        case 'showPlans':
          return '30px';
        case 'showRestorePlans':
          return '220px';
        case 'showRecords':
          return '210px';
        default:
          return 0;
      }
    },
    fingerTop() {
      switch (this.nextStep) {
        case 'showResults':
        case 'showPlans':
        case 'showRecords':
        case 'resultsToRestore':
          return '50px';
        case 'showRestorePlans':
          return '100px';
        default:
          return 0;
      }
    },
  },
  beforeDestroy() {
    const plans = [...this.backupPlans, ...this.restorePlans].filter(plan => plan.state === 1);
    this.backupPlans = [];
    this.restorePlans = [];
    plans.forEach(plan => {
      clearInterval(plan.timer);
    });
  },
  methods: {
    skipStep() {
      this.stepType = 'singleRestorePlan';
      this.scrollTabToTop();
    },
    forwardStep() {
      this.activeTab = 'plans';
      this.forwardStepTime = dayjs();
      this.planFilterForm.planType = 'backup';
      if (this.operation === 'backup') {
        this.stepType = 'backupPlan';
      } else {
        this.stepType = 'restorePlan';
      }
    },
    stepContinue() {
      const stepList = this.steps[this.stepType];
      const index = stepList.findIndex(step => step === this.nextStep);
      if (stepList[index + 1]) {
        this.nextStep = stepList[index + 1];
      }
      this.scrollTabToTop();
    },
    cancelStep() {
      this.stepType = 'stop';
      this.forwardStepTime = '';
    },
    filterResults() {
      this.stepContinue();
    },
    dialogOpened() {
      this.startTime = dayjs().add(5, 'second').format('YYYY-MM-DD HH:mm:ss');
      this.endTime = dayjs().add(10, 'second').format('YYYY-MM-DD HH:mm:ss');
    },
    applyFilterMethods(originData, methods) {
      return methods.reduce((a, b) => a.filter(b), originData);
    },
    promptText(key) {
      return this.promptTextMapping[key];
    },
    switchPlan() {
      this.stepContinue();
      // 切换操作计划后，持续时间重新计时
      const plans = [...this.backupPlans, ...this.restorePlans].filter(plan => plan.state === 1);
      plans.forEach(plan => {
        plan.consume = plan.consumeTime;
      });
    },
    createBackupPlan() {
      this.backupPlanModalVisible = true;
      this.action = 'create';
    },
    selectBackupPlan() {
      this.backupPlanModalVisible = true;
      this.action = 'update';
    },
    createRestorePlan() {
      this.restorePlanModalVisible = true;
      this.action = 'create';
    },
    selectRestorePlan() {
      this.restorePlanModalVisible = true;
      this.action = 'update';
    },
    deleteBackupPlan(id) {
      const plan = this.backupPlans.filter(item => item.id === id);
      clearInterval(plan.timer);
      this.backupPlans = this.backupPlans.filter(item => item.id !== id);
      this.$message({
        type: 'success',
        message: '删除成功',
        offset: this.messageOffset
      });
    },
    deleteRestorePlan(id) {
      const plan = this.restorePlans.filter(item => item.id === id);
      clearInterval(plan.timer);
      this.restorePlans = this.restorePlans.filter(item => item.id !== id);
      this.$message({
        type: 'success',
        message: '删除成功',
        offset: this.messageOffset
      });
    },
    initSingleRestoreModal() {
      this.singleRestoreCreateModalVisible = true;
    },
    createPlanBtnClick(command) {
      if (command === 'backup') {
        this.createBackupPlan();
      } else if (command === 'restore') {
        if (this.results.length) {
          this.createRestorePlan();
        } else {
          this.$message({
            type: 'error',
            message: '暂无备份集，无法进行恢复',
            offset: this.messageOffset
          });
        }
      }
    },
    switchPane() {
      this.stepContinue();
    },
    scrollTabToTop() {
      this.$nextTick(() => {
        const ele = document.querySelector('.card-mask');
        if (ele) {
          ele.scrollIntoView({ block: 'start' });
          document.body.scrollTop -= 61;
          document.documentElement.scrollTop -= 61;
        }
      });
    }
  }
};

const pageMixin = {
  methods: {
    toGuide() {
      this.$router.push({ name: 'guide' });
    },
  }
};

export {
  detailMixin,
  pageMixin,
};
