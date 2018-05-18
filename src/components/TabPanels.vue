<template>
  <el-tabs v-model="activeTab"
           @tab-click="switchPane">
    <el-tab-pane label="操作计划"
                 name="plans">
      <el-form inline
               :model="backupPlanFilterForm"
               class="filter-form">
        <el-form-item label="隐藏已完成计划">
          <el-switch v-model="planFilterForm.hiddenCompletePlan"></el-switch>
        </el-form-item>
      </el-form>
      <backup-card :id="plan.id"
                   type="sqlserver"
                   v-for="(plan, index) in filteredBackupPlans"
                   :key="plan.id"
                   :backupPlan="plan"
                   @deletePlan="deleteBackupPlan(index)"
                   @updatePlan="selectBackupPlan(index)"></backup-card>
      <restore-card :id="plan.id"
                    type="sqlserver"
                    v-for="(plan, index) in restorePlans"
                    :key="plan.id"
                    :restorePlan="plan"
                    @deletePlan="deleteRestorePlan(index)"
                    @updatePlan="selectRestorePlan(index)"></restore-card>
    </el-tab-pane>
    <el-tab-pane label="备份集"
                 name="results">
      <el-form inline
               :model="resultFilterForm"
               class="filter-form"
               style="text-align: right;">
        <el-form-item>
          <el-button size="medium"
                     type="text"
                     @click="updateResults()">刷新</el-button>
        </el-form-item>
      </el-form>
      <backup-result-list type="sqlserver"
                          :data="results"
                          @add-restore="addSingleRestore"></backup-result-list>
    </el-tab-pane>
    <el-tab-pane label="恢复记录"
                 name="restore">
      <restore-records :plans="ongoingRestorePlan"
                       :records="restoreRecords"></restore-records>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import throttle from 'lodash/throttle';
import IIcon from '@/components/IIcon';
import SpanToggle from '@/components/SpanToggle';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import BackupCard from '@/components/BackupCard';
import RestoreCard from '@/components/RestoreCard';
import BackupResultList from '@/components/BackupResultList';
import RestoreRecords from '@/components/RestoreRecords';
import AddBackupPlan from '@/components/AddBackupPlan';
import UpdateBackupPlan from '@/components/UpdateBackupPlan';
import RestorePlanCreateModal from '@/components/modal/RestorePlanCreateModal';
import RestorePlanUpdateModal from '@/components/modal/RestorePlanUpdateModal';
import { applyFilterMethods } from '../../utils/common';

export default {
  name: 'TabPanels',
  data() {
    return {
      activeTab: 'plans', // 激活的tab页
      backupPlans: [],
      selectedBackupPlanIndex: -1,
      restorePlans: [], // 恢复计划
      selectedRestorePlanIndex: -1,
      restoreRecords: [], // 恢复记录
      results: [], // 备份集
      backupPlanCreateModalVisible: false,
      backupPlanUpdateModalVisible: false,
      restorePlanCreateModalVisible: false,
      restorePlanUpdateModalVisible: false,
      backupPlanFilterForm: {
        // 备份计划筛选条件
        hiddenCompletePlan: false,
      },
      restorePlanFilterForm: {
        // 恢复计划筛选条件
        hiddenCompletePlan: false,
      },
      bakupResultFilterForm: {}, //备份集筛选条件
    };
  },
  computed: {
    // 选择的备份计划 for update
    selectedBackupPlan() {
      return this.selectedBackupPlanIndex === -1
        ? {}
        : this.backupPlans[this.selectedPlanIndex];
    },
    // 选择的恢复计划 for update
    selectedRestorePlan() {
      return this.selectedRestorePlanIndex === -1
        ? {}
        : this.restorePlans[this.selectedRestorePlanIndex];
    },
    // 筛选后得备份计划
    filteredBackupPlans() {
      const filterMethods = [];
      if (this.backupPlanFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.backupPlans, filterMethods);
    },
    // 正在进行中的恢复计划
    ongoingRestorePlan() {
      return this.restorePlans.filter(plan => plan.state === 1);
    },
    created() {
      // fetch data
    },
    beforeRouteUpdate(to, from, next) {
      // fetch data
      next();
    },
  },
  methods: {
    switchPane({ name }) {
      if (name === 'results') {
        // this.updateResults();
      }
    },
    // 添加备份计划后的cb
    backupPlanAdded(data) {
      this.backupPlans.unshift(data);
    },
    // 更新备份计划后的cb
    backupPlanUpdated(data) {
      this.backupPlans.splice(this.selectedBackupPlanIndex, 1, data);
    },
    // 选择一个备份计划 点击计划编辑按钮时调用
    selectBackupPlan(planIndex) {
      this.backupPlanUpdateModalVisible = true;
      this.selectedBackupPlanIndex = planIndex;
    },
    // 选择一个恢复计划 点击计划编辑按钮时调用
    selectRestorePlan(planIndex) {
      this.restorePlanUpdateModalVisible = true;
      this.selectedRestorePlanIndex = planIndex;
    },
    // 删除一个备份计划
    deleteBackupPlan(planIndex) {
      this.backupPlans.splice(planIndex, 1);
    },
    // 添加一个单次恢复后得cb
    singleRestoreAdded(restorePlan) {
      this.restorePlans.push(restorePlan);
    },
    // 添加恢复计划后
    restorePlanAdded(plan) {
      this.restorePlans.unshift(plan);
    },
    // 删除一个恢复计划
    deleteRestorePlan(index) {
      this.restorePlans.splice(index, 1);
    },
    // 更新恢复计划后的cb
    restorePlanUpdated(plan) {
      this.restorePlans.splice(this.selectedRestorePlanIndex, 1, plan);
      this.selectedRestorePlanIndex = -1;
    },
  },
  components: {
    IIcon,
    DatabaseUpdateModal,
    SpanToggle,
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
</script>
<style>
</style>
