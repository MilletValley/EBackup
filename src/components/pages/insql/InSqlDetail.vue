<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="insql"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    justify="middle">
              <el-col :span="8">
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
                     label-width="100px"
                     size="small"
                     class="item-info">
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="数据库名：">
                    <span>{{ details.instanceName }}</span>
                  </el-form-item>
                  <el-form-item label="端口号：">
                    <span>{{ details.dbPort }}</span>
                  </el-form-item>
                  <el-form-item label="数据库状态：">
                    <el-tag :type="databaseStateStyle(details.state)"
                            size="mini">{{ details.state | databaseStateFilter }}</el-tag>
                  </el-form-item>
                  <el-form-item label="所属系统：">
                    <span>{{ details.application }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主机名：">
                    <span>{{ details.host.name }}</span>
                  </el-form-item>
                  <el-form-item label="操作系统：">
                    <span>{{ judgeOsName(details.host) }}</span>
                  </el-form-item>
                  <el-form-item label="所属设备：">
                    <span>{{ details.host.name }}</span>
                  </el-form-item>
                  <el-form-item label="设备IP：">
                    <span>{{ details.host.hostIp }}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="数据库版本：">
                    <span>{{ details.dbVersion }}</span>
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
    <backup-plan-modal  :btn-loading="btnLoading"
                        :visible.sync="backupPlanModalVisible"
                        @confirm="confirmCallback"
                        :action="action"
                        :backup-plan="selectedBackupPlan">
    </backup-plan-modal>

    <restore-plan-modal :btn-loading="btnLoading"
                        :details="details"
                        :visible.sync="restorePlanModalVisible"
                        @confirm="restoreConfirmCallback"
                        :action="restoreAction"
                        :restore-plan="selectedRestorePlan">
    </restore-plan-modal>
    <single-restore-modal :btn-loading="btnLoading"
                          :details="details"
                          :result-id="selectedBackupResultId"
                          :visible.sync="singleRestoreCreateModalVisible"
                          @confirm="singleConfirmCallback">
    </single-restore-modal>
    
  </section>
</template>
<script>
import { windowsTypeMapping } from '@/utils/constant';
import { detailPageMixin } from '@/components/mixins/dbDetailsPageMixin';
import BackupPlanModal from '@/components/pages/insql/BackupPlanModal';
import RestorePlanModal from '@/components/pages/insql/RestorePlanModal';
import SingleRestoreModal from '@/components/pages/insql/SingleRestoreModal';
import BackupCard from '@/components/pages/insql/BackupCard';
import BackupResultList from '@/components/pages/insql/BackupResultList';
import RestoreCard from '@/components/pages/insql/RestoreCard';
import RestoreRecords from '@/components/pages/insql/RestoreRecords';

export default {
  name: 'InSqlDetail',
  mixins: [detailPageMixin],
  components: {
    BackupPlanModal,
    RestorePlanModal,
    SingleRestoreModal,
    BackupCard,
    BackupResultList,
    RestoreCard,
    RestoreRecords
  },
  data() {
    return {
      type: 'insql',
    };
  },
  methods: {
    judgeOsName(data){
      let str = data.osName;
      if(data.osName === 'Windows' && data.databaseType === 11 && windowsTypeMapping[data.windowsType]){
        str += (' ' + windowsTypeMapping[data.windowsType]);
      }
      return str;
    },
  },
};
</script>