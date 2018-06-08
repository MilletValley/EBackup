<template>
  <section>
    <el-tabs :class="$style.tabs"
             v-model="activeTab"
             @tab-click="switchPane">
      <el-tab-pane label="操作计划"
                   name="plans">
        <el-form inline
                 size="small"
                 :model="planFilterForm"
                 :class="$style.filterForm">
          <el-form-item :class="$style.filterFormItem">
            <el-radio border
                      v-model="planFilterForm.planType"
                      label="backup">备份计划</el-radio>
            <el-radio border
                      :disabled="isFileBackupResult"
                      v-model="planFilterForm.planType"
                      label="restore">恢复计划</el-radio>
          </el-form-item>
          <el-form-item :class="$style.filterFormItem"
                        label="隐藏已完成计划">
            <el-switch v-model="planFilterForm.hiddenCompletePlan"></el-switch>
          </el-form-item>

        </el-form>
        <backup-card :id="plan.id"
                     :type="type"
                     v-for="(plan, index) in filteredBackupPlans"
                     :key="plan.id"
                     :backupPlan="plan"
                     @refresh="backupPlanRefresh"
                     @deletePlan="backupPlanDeleted"
                     @updatePlan="selectBackupPlan(index)"></backup-card>
        <template v-if="!isFileBackupResult">
          <restore-card :id="plan.id"
                        :type="type"
                        v-for="plan in filteredRestorePlans"
                        :key="plan.id"
                        :restore-plan="plan"
                        @refresh="restorePlanRefresh"
                        @deletePlan="restorePlanDeleted"
                        @updatePlan="selectRestorePlan(plan.id)"></restore-card>
        </template>

      </el-tab-pane>
      <el-tab-pane label="备份集"
                   name="results">
        <el-form inline
                 :model="restorePlanFilterForm"
                 :class="$style.filteFrorm"
                 style="text-align: right;">
          <el-form-item :class="$style.filterFormItem">
            <!-- <el-button size="medium"
                       type="text"
                       @click="this.$emit('result:refresh')">刷新</el-button> -->
          </el-form-item>
        </el-form>
        <backup-result-list :type="type"
                            :data="results"
                            @single-restore-btn-click="singleRestoreBtnClick"></backup-result-list>
      </el-tab-pane>
      <el-tab-pane label="恢复记录"
                   name="restore">
        <restore-records :type="type"
                         :plans="ongoingRestorePlan"
                         :records="restoreRecords"
                         @restoreinfo:refresh="$emit('restoreinfo:refresh')"></restore-records>
      </el-tab-pane>
    </el-tabs>
    <update-backup-plan :type="type"
                        :id="id"
                        :visible.sync="backupPlanUpdateModalVisible"
                        :backup-plan="selectedBackupPlan"
                        @confirm="backupPlanUpdated"></update-backup-plan>
  </section>

</template>
<script>
import throttle from 'lodash/throttle';
import IIcon from '@/components/IIcon';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import BackupCard from '@/components/BackupCard';
import RestoreCard from '@/components/RestoreCard';
import BackupResultList from '@/components/BackupResultList';
import RestoreRecords from '@/components/RestoreRecords';
import AddBackupPlan from '@/components/AddBackupPlan';
import UpdateBackupPlan from '@/components/UpdateBackupPlan';
import RestorePlanUpdateModal from '@/components/modal/RestorePlanUpdateModal';
import { applyFilterMethods } from '../utils/common';

export default {
  name: 'TabPanels',
  props: {
    id: {
      type: Number,
    },
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'windows', 'linux', ''].includes(value);
      },
    },
    backupPlans: {
      type: Array,
    },
    restorePlans: {
      type: Array,
    },
    results: {
      type: Array,
    },
    restoreRecords: {
      type: Array,
    },
  },
  data() {
    return {
      activeTab: 'plans', // 激活的tab页
      selectedBackupPlanIndex: -1,
      selectedRestorePlanIndex: -1,
      backupPlanUpdateModalVisible: false,
      restorePlanUpdateModalVisible: false,
      // 备份计划筛选条件
      planFilterForm: {
        hiddenCompletePlan: false,
        planType: 'backup',
      },
      // 恢复计划筛选条件
      restorePlanFilterForm: {
        hiddenCompletePlan: false,
      },
      //备份集筛选条件
      bakupResultFilterForm: {},
    };
  },
  computed: {
    // 选择的备份计划 for update
    selectedBackupPlan() {
      return this.selectedBackupPlanIndex === -1
        ? {}
        : this.backupPlans[this.selectedBackupPlanIndex];
    },
    // 选择的恢复计划 for update
    // selectedRestorePlan() {
    //   return this.selectedRestorePlanIndex === -1
    //     ? {}
    //     : this.restorePlans[this.selectedRestorePlanIndex];
    // },
    // 筛选后得备份计划
    filteredBackupPlans() {
      if (this.planFilterForm.planType !== 'backup') {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.backupPlans, filterMethods);
    },
    filteredRestorePlans() {
      if (this.planFilterForm.planType !== 'restore') {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.restorePlans, filterMethods);
    },
    // 正在进行中的恢复计划
    ongoingRestorePlan() {
      return this.restorePlans.filter(plan => plan.state === 1);
    },
    isFileBackupResult() {
      return this.type === 'windows' || this.type === 'linux';
    },
  },
  methods: {
    switchPane({ name }) {
      this.$emit('switchpane', name);
    },
    // 添加备份计划后的cb
    // backupPlanAdded(data) {
    //   this.$emit('addBackupPlan', data);
    //   this.backupPlans.unshift(data);
    // },
    // 更新备份计划后的cb
    backupPlanUpdated(data) {
      this.$emit('backupplan:update', this.selectedBackupPlanIndex, data);
      // this.selectedBackupPlanIndex = -1;
      // this.backupPlans.splice(this.selectedBackupPlanIndex, 1, data);
    },
    // 选择一个备份计划 点击计划编辑按钮时调用
    selectBackupPlan(planIndex) {
      this.backupPlanUpdateModalVisible = true;
      this.selectedBackupPlanIndex = planIndex;
    },
    // 选择一个恢复计划 点击计划编辑按钮时调用
    selectRestorePlan(planId) {
      // this.restorePlanUpdateModalVisible = true;
      // this.selectedRestorePlanIndex = planId;
      this.$emit('select-restore-plan', planId);
    },
    // 删除一个备份计划
    backupPlanDeleted(planId) {
      this.$emit('backupplan:delete', planId);
      // this.backupPlans.splice(planIndex, 1);
    },
    // 添加一个单次恢复后得cb
    singleRestoreAdded(restorePlan) {
      this.$emit('restoreplan:add', restorePlan);
      // this.restorePlans.unshift(restorePlan);
    },
    // 添加恢复计划后
    // restorePlanAdded(plan) {
    //   this.$emit('restoreplan:add', restorePlan);
    //   this.restorePlans.unshift(plan);
    // },
    // 删除一个恢复计划
    // restorePlanDeleted(deleteIndex) {
    //   this.$emit('restoreplan:delete', deleteIndex);
    // },
    restorePlanDeleted(planId) {
      this.$emit('restoreplan:delete', planId);
    },
    // 更新恢复计划后的cb
    // restorePlanUpdated(plan) {
    //   this.$emit('restoreplan:update', this.selectedRestorePlanIndex, plan);
    //   this.selectedRestorePlanIndex = -1;
    // },
    // 刷新单个备份计划
    backupPlanRefresh(backupplanId) {
      this.$emit('backupplan:refresh', backupplanId);
    },
    restorePlanRefresh(planId) {
      this.$emit('restoreplan:refresh', planId);
    },
    // 备份集中点击恢复按钮
    singleRestoreBtnClick(id) {
      this.$emit('single-restore-btn-click', id);
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
  },
};
</script>
<style module>
.tabs {
  margin-top: -39px;
}
.filterForm {
  padding-left: 20px;
}
.filterFormItem {
  margin-bottom: 0;
}
</style>