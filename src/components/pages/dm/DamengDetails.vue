<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="mysql"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.name}}</h1>
              </el-col>
              <el-col :span="12"
                      :offset="4"
                      class="action">
                <el-dropdown size="mini"
                             trigger="click"
                             placement="bottom"
                             @command="addPlanBtnClick">
                  <el-button size="mini"
                             plain>添加计划
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="backup">备份计划</el-dropdown-item>
                    <el-dropdown-item command="restore">恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button size="mini"
                           type="primary"
                           @click="detailsEditModal = true">编辑</el-button> -->
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     label-position="left"
                     label-width="130px"
                     size="small"
                     class="item-info">
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="数据库名：">
                    <span>{{ details.dbName }}</span>
                  </el-form-item>
                  <el-form-item label="端口号：">
                    <span>{{ details.dbPort }}</span>
                  </el-form-item>
                  <el-form-item label="数据库连接状态：">
                    <el-tag :type="databaseStateStyle(details.state)"
                            size="mini">{{ details.state | databaseStateFilter }}</el-tag>
                  </el-form-item>
                  <el-form-item label="数据库版本：">
                    <span>{{ details.dbVersion }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属设备：">
                    <span>{{ details.host.name }}</span>
                  </el-form-item>
                  <el-form-item label="设备IP：">
                    <span>{{ details.host.hostIp }}</span>
                  </el-form-item>
                  <el-form-item label="操作系统：">
                    <span>{{ details.host.osName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <tab-panels @switchpane="switchPane" :planFilterForm="planFilterForm">
      <template slot="backupCard">
        <backup-card :id="plan.id"
                     v-for="plan in filteredBackupPlans"
                     :key="plan.id"
                     :backupPlan="plan"
                     @refresh="refreshSingleBackupPlan"
                     @deletePlan="deleteBackupPlan"
                     @updatePlan="selectBackupPlan(plan.id)"></backup-card>
      </template>
      <template slot="restoreCard">
        <restore-card :id="plan.id"
                        v-for="plan in filteredRestorePlans"
                        :key="plan.id"
                        :restore-plan="plan"
                        @refresh="refreshSingleRestorePlan"
                        @deletePlan="deleteRestorePlan"
                        @updatePlan="selectRestorePlan(plan.id)"></restore-card>
      </template>
      <template slot="backupResult">
        <backup-result-list :data="results"
                            @single-restore-btn-click="initSingleRestoreModal"></backup-result-list>
      </template>
      <template slot="restoreRecord">
        <restore-records :restore-plan="restorePlans"
                         :records="restoreRecords"
                         @restoreinfo:refresh="updateRestorePlanAndRecords"></restore-records>
      </template>
    </tab-panels>
    <dm-backup-plan-modal   :btn-loading="btnLoading"
                            :visible.sync="backupPlanModalVisible"
                            @confirm="confirmCallback"
                            :action="action"
                            :backup-plan="selectedBackupPlan">
    </dm-backup-plan-modal>

    <dm-restore-plan-modal   :btn-loading="btnLoading"
                            :visible.sync="restorePlanModalVisible"
                            @confirm="restoreConfirmCallback"
                            :action="restoreAction"
                            :restore-plan="selectedRestorePlan">
    </dm-restore-plan-modal>
    <dm-single-restore-modal   :btn-loading="btnLoading"
                            :result-id="selectedBackupResultId"
                            :visible.sync="singleRestoreCreateModalVisible"
                            @confirm="singleConfirmCallback">
    </dm-single-restore-modal>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import throttle from 'lodash/throttle';
import { applyFilterMethods } from '@/utils/common';
import { detailPageMixin } from '@/components/mixins/dbDetailsPageMixin';
import DmBackupPlanModal from '@/components/pages/dm/DmBackupPlanModal';
import DmRestorePlanModal from '@/components/pages/dm/DmRestorePlanModal';
import DmSingleRestoreModal from '@/components/pages/dm/DmSingleRestoreModal';
import BackupCard from '@/components/pages/dm/BackupCard';
import BackupResultList from '@/components/pages/dm/BackupResultList';
import RestoreCard from '@/components/pages/dm/RestoreCard';
import RestoreRecords from '@/components/pages/dm/RestoreRecords';

export default {
  name: 'DmDetail',
  mixins: [detailPageMixin],
  components: {
    DmBackupPlanModal,
    DmRestorePlanModal,
    DmSingleRestoreModal,
    BackupCard,
    BackupResultList,
    RestoreCard,
    RestoreRecords
  },
  data(){
    return {
      type: 'dm',
      action: 'create',
      restoreAction: 'create',
      planFilterForm: {
        hiddenCompletePlan: false,
        planType: 'backup',
      },
    }
  },
  computed: {
    // 筛选后得备份计划
    filteredBackupPlans() {
      if (this.planFilterForm.planType !== 'backup') {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.backupPlans, filterMethods).sort((a,b) => dayjs(b.createTime) - dayjs(a.createTime));
    },
    filteredRestorePlans() {
      if (this.planFilterForm.planType !== 'restore') {
        return [];
      }
      const filterMethods = [];
      if (this.planFilterForm.hiddenCompletePlan) {
        filterMethods.push(plan => plan.state !== 2);
      }
      return applyFilterMethods(this.restorePlans, filterMethods).sort((a,b) => dayjs(b.createTime) - dayjs(a.createTime));
    },
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
.roleIconHeader {
  padding: 5px;
  margin: -5px 5px;
  vertical-align: -0.2em;
}
.roleIconOppsition {
  vertical-align: -0.2em;
  padding: 3px;
  margin: -3px 0 -3px 1px;
}
.switchIcon {
  width: 1.7em;
  height: 1.7em;
  vertical-align: -0.5em;
}
.databaseLink {
  composes: link;
  font-size: 1.2em;
  // color: rgb(170, 84, 27);
}
.linkInfo {
  text-align: right;
}
.moreLink {
  composes: link;
  font-size: 0.9em;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
