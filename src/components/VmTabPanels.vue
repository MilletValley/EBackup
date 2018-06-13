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
        </template>

      </el-tab-pane>
      <el-tab-pane label="备份集"
                   name="results">
      <backup-result-list :type="type"
                          :data="results"></backup-result-list>
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
import BackupResultList from '@/components/BackupResultList';
import AddBackupPlan from '@/components/AddBackupPlan';
import UpdateBackupPlan from '@/components/UpdateBackupPlan';
import { applyFilterMethods } from '../utils/common';

export default {
  name: 'VmTabPanels',
  props: {
    id: {
      type: Number,
    },
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'windows', 'linux', 'vm', ''].includes(value);
      },
    },
    backupPlans: {
      type: Array,
    },
    results: {
      type: Array,
    },
  },
  data() {
    return {
      activeTab: 'plans', // 激活的tab页
      selectedBackupPlanIndex: -1,
      backupPlanUpdateModalVisible: false,
      // 备份计划筛选条件
      planFilterForm: {
        hiddenCompletePlan: false,
        planType: 'backup',
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
    isFileBackupResult() {
      return this.type === 'windows' || this.type === 'linux';
    },
  },
  methods: {
    switchPane({ name }) {
      this.$emit('switchpane', name);
    },
    backupPlanUpdated(data) {
      this.$emit('backupplan:update', this.selectedBackupPlanIndex, data);
    },
    // 选择一个备份计划 点击计划编辑按钮时调用
    selectBackupPlan(planIndex) {
      this.backupPlanUpdateModalVisible = true;
      this.selectedBackupPlanIndex = planIndex;
    },
    // 删除一个备份计划
    backupPlanDeleted(planId) {
      this.$emit('backupplan:delete', planId);
      // this.backupPlans.splice(planIndex, 1);
    },
    backupPlanRefresh(backupplanId) {
      this.$emit('backupplan:refresh', backupplanId);
    },
  },
  components: {
    IIcon,
    DatabaseUpdateModal,
    BackupCard,
    BackupResultList,
    AddBackupPlan,
    UpdateBackupPlan,
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
