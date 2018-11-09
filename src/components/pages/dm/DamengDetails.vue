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
    <tab-panels :id="Number(id)"
                type="mysql"
                :backup-plans="backupPlans"
                :restore-plans="restorePlans"
                :results="results"
                @single-restore-btn-click="initSingleRestoreModal"
                @backupplan:refresh="refreshSingleBackupPlan"
                @backupplan:update="updateBackupPlan"
                @backupplan:delete="deleteBackupPlan"
                @restoreplan:refresh="refreshSingleRestorePlan"
                @restoreplan:delete="deleteRestorePlan"
                @select-restore-plan="selectRestorePlan"
                @select-backup-plan="selectBackupPlan"
                @switchpane="switchPane"
                @restoreinfo:refresh="updateRestorePlanAndRecords"
                :restoreRecords="restoreRecords"></tab-panels>
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
import throttle from 'lodash/throttle';
import { detailPageMixin } from '@/components/mixins/dbDetailsPageMixin';
import DmBackupPlanModal from '@/components/pages/dm/DmBackupPlanModal';
import DmRestorePlanModal from '@/components/pages/dm/DmRestorePlanModal';
import DmSingleRestoreModal from '@/components/pages/dm/DmSingleRestoreModal';

export default {
  name: 'DmDetail',
  mixins: [detailPageMixin],
  components: {
    DmBackupPlanModal,
    DmRestorePlanModal,
    DmSingleRestoreModal
  },
  data(){
    return {
      type: 'dm',
      action: 'create',
      restoreAction: 'create'
    }
  }
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
