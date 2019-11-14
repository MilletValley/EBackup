<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="vmware"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.vmName}}</h1>
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
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     :element-loading-background="themeColor.loadingBackGround"
                     label-position="left"
                     label-width="130px"
                     inline
                     size="small"
                     class="item-info">
              <el-row class="margin-right5">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="操作系统：">
                      <div>{{ details.host.osName }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="类型：">
                      <div>{{ details.type | vmTypeFilter }}</div>
                    </el-form-item>
                   </el-col>
                </el-row>
                <el-row v-if="vmType !== 4">
                  <el-col :span="8">
                    <el-form-item label="所属设备IP：">
                      <div>{{ details.host.hostIp }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所属物理主机IP：">
                      <div>{{ details.vmHostName }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="details.server">
                  <el-col :span="8">
                    <el-form-item label="虚拟机主机IP：">
                      <div>{{ details.server.serverIp }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="虚拟机主机类型：" v-if="vmType !== 4">
                      <div>{{ details.server.serverType | serverTypeFilter }}</div>
                    </el-form-item>
                    <el-form-item label="主控IP：" v-if="vmType === 4">
                      <div>{{ details.host.hostIp }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <tab-panels @switchpane="switchPane" :planFilterForm="planFilterForm" :tab.sync="tab">
      <template slot="backupCard">
        <backup-card :id="plan.id"
                     :vm-type="vmType"
                     v-for="plan in filteredBackupPlans"
                     :key="plan.id"
                     :backupPlan="plan"
                     @refresh="refreshSingleBackupPlan"
                     @deletePlan="deleteBackupPlan"
                     @updatePlan="selectBackupPlan(plan.id)"
                     @show-backup-result="showBackupResult"></backup-card>
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
                            :vm-type="vmType"
                            :operation-id.sync="operationId"
                            @single-restore-btn-click="initSingleRestoreModal"
                            @delete-result="deleteOneResult"
                            @multiply-delete-results="multiplyDeleteResults"
                            @update-operation-id="updateOperationId"
                            @result-migration="resultMigration"></backup-result-list>
      </template>
      <template slot="restoreRecord">
        <restore-records :restore-plan="restorePlans"
                         :records="restoreRecords"
                         :vm-type="vmType"
                         @restoreinfo:refresh="updateRestorePlanAndRecords"></restore-records>
      </template>
    </tab-panels>
    <multiply-delete-results-modal :btn-loading="btnLoading"
                                   :results="readyDeleteResults"
                                   @confirm="multiplyDeleteResultsConfirm"
                                   :visible.sync="multiplyDeleteResultsModalVisible"></multiply-delete-results-modal>
    <backup-plan-modal :btn-loading="btnLoading"
                       :visible.sync="backupPlanModalVisible"
                       @confirm="vmCallback"
                       :action="action"
                       :backup-plan="selectedBackupPlan">
    </backup-plan-modal>

    <restore-plan-modal :btn-loading="btnLoading"
                        :details="details"
                        :vm-type="vmType"
                        :serverData="serverData"
                        :visible.sync="restorePlanModalVisible"
                        @confirm="restoreConfirmCallback"
                        :action="restoreAction"
                        :restore-plan="selectedRestorePlan">
    </restore-plan-modal>
    <single-restore-modal :btn-loading="btnLoading"
                          :details="details"
                          :vm-type="vmType"
                          :serverData="serverData"
                          :result-id="selectedBackupResultId"
                          :results="results"
                          :visible.sync="singleRestoreCreateModalVisible"
                          @confirm="singleConfirmCallback"></single-restore-modal>
    <a-cloud-single-restore-plan-modal :btn-loading="btnLoading"
                                       :details="details"
                                       :result-id="selectedBackupResultId"
                                       :visible.sync="aCloudSingleRestoreCreateModalVisible"
                                       @confirm="aCloudSingleConfirmCallback"></a-cloud-single-restore-plan-modal>
    <a-cloud-restore-plan-modal :btn-loading="btnLoading"
                                :details="details"
                                :vm-type="vmType"
                                :results="results"
                                :visible.sync="aCloudRestorePlanModalVisible"
                                @confirm="aCloudRestoreConfirmCallback"
                                :action="restoreAction"
                                :restore-plan="selectedRestorePlan"></a-cloud-restore-plan-modal>
  </section>
</template>
<script>
import { detailPageMixin } from '@/components/mixins/dbDetailsPageMixin';
import BackupPlanModal from '@/components/pages/virtual/BackupPlanModal';
import RestorePlanModal from '@/components/pages/virtual/RestorePlanModal';
import SingleRestoreModal from '@/components/pages/virtual/SingleRestoreModal';
import multiplyDeleteResultsModal from '@/components/pages/virtual/multiplyDeleteResultsModal';
import BackupCard from '@/components/pages/virtual/BackupCard';
import BackupResultList from '@/components/pages/virtual/BackupResultList';
import RestoreCard from '@/components/pages/virtual/RestoreCard';
import RestoreRecords from '@/components/pages/virtual/RestoreRecords';
import { virtualHostServerTypeMapping, virtualMapping, vmTypeMapping } from '@/utils/constant';
import ACloudRestorePlanModal from '@/components/pages/virtual/ACloudRestorePlanModal';
import ACloudSingleRestorePlanModal from '@/components/pages/virtual/ACloudSingleRestorePlanModal';
import { createACloudRestorePlan, modifyACloudRestorePlan, createACloudSingleRestorePlan } from '@/api/virtuals';

import {
  updateVirtualBackupPlan,
  createMultipleVirtualBackupPlan,
  deleteVirtualBackupPlan,
  fetchAll,
  resultMigrationCloud,
  multiplyDeleteResults
} from '@/api/virtuals';
import { fetchServerList } from '@/api/host';

export default {
  name: 'VirtualDetail',
  mixins: [detailPageMixin],
  components: {
    BackupPlanModal,
    RestorePlanModal,
    SingleRestoreModal,
    BackupCard,
    BackupResultList,
    RestoreCard,
    RestoreRecords,
    ACloudRestorePlanModal,
    ACloudSingleRestorePlanModal,
    multiplyDeleteResultsModal
  },
  data() {
    return {
      type: 'virtual',
      tab: 'plans',
      serverDatas: [],
      virtuals: [],
      aCloudRestorePlanModalVisible: false,
      aCloudSingleRestoreCreateModalVisible: false,
      multiplyDeleteResultsModalVisible: false,
      operationId: -1, // 根据备份计划id显示备份集
      readyDeleteResults: []
    };
  },
  computed: {
    vmType() {
      return Number(Object.keys(virtualMapping).find(type =>
        this.$route.name.toLowerCase().includes(virtualMapping[type].toLowerCase())
      ));
    },
    serverData() {
      return this.serverDatas.filter( e => {
        if(this.details && this.details.host){
          return e.hostId === this.details.host.id && e.serverType !== 1 && this.details.type === e.vmType;
        }
        return false;
      })
    }
  },
  filters: {
    serverTypeFilter(data) {
      return virtualHostServerTypeMapping[data];
    },
    vmTypeFilter(type) {
      return vmTypeMapping[type];
    }
  },
  created() {
    this.fetchVirtualList();
  },
  watch: {
    tab(newValue, oldValue) {
      if(oldValue === 'results') {
        this.operationId = -1;
      }
    }
  },
  methods: {
    vmCallback(data, type) {
      if (type === 'update') {
        this.updateBackupPlan(data.id, data);
      } else {
        this.addBackupPlan(data);
      }
    },
    resultMigration(id) {
      resultMigrationCloud(id)
        .then(res => {
          const { message } = res.message;
          this.$message.success(message);
          this.getBackupResults();
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    multiplyDeleteResults(results) {
      this.readyDeleteResults = results;
      this.multiplyDeleteResultsModalVisible = true;
    },
    multiplyDeleteResultsConfirm(results) {
      const ids = results.map(result => result.id);
      this.btnLoading = true;
      multiplyDeleteResults(ids)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.getBackupResults();
          this.multiplyDeleteResultsModalVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    showBackupResult(id) {
      this.tab = 'results';
      this.operationId = id;
    },
    updateOperationId(id) {
      this.operationId = id;
    },
    fetchServer(){
      fetchServerList().then(res => {
        const { data } = res.data;
        this.serverDatas = Array.isArray(data) ? data : [];
      }).catch( error => {
        this.$message.error(error);
      })
    },
    fetchVirtualList() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.virtuals = Array.isArray(data) ? data : [];
        });
    },
    addPlanBtnClick(command) {
      if (command === 'backup') {
        this.backupPlanModalVisible = true;
        this.action = 'create';
      } else if (command === 'restore') {
        if (this.vmType === 4) {
          this.aCloudRestorePlanModalVisible = true;
        } else {
          this.restorePlanModalVisible = true;
        }
        this.restoreAction = 'create';
      }
    },
    selectRestorePlan(restorePlanId) {
      this.selectedRestorePlan = this.restorePlans.find(plan => plan.id === restorePlanId);
      this.restoreAction = 'update';
      if (this.vmType === 4) {
        this.aCloudRestorePlanModalVisible = true;
      } else {
        this.restorePlanModalVisible = true;
      }
    },
    initSingleRestoreModal(id) {
      this.selectedBackupResultId = id;
      if (this.vmType === 4) {
        this.aCloudSingleRestoreCreateModalVisible = true;
      } else {
        this.singleRestoreCreateModalVisible = true;
      }
    },
    addBackupPlan(plan) {
      this.btnLoading = true;
      const virtual = this.virtuals.find(v => Number(this.id) === v.id);
      const data = Object.assign({}, plan, { vmList: [virtual] });
      createMultipleVirtualBackupPlan(data)
        .then(res => {
          const { message } = res.data;
          this.getBackupPlanList();
          this.backupPlanModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
          return false;
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    deleteBackupPlan(planId, delBackupResults) {
      deleteVirtualBackupPlan(planId, delBackupResults).then(() => {
        this.backupPlans.splice(
          this.backupPlans.findIndex(plan => plan.id === planId),
          1
        );
        this.$message.success('删除成功');
      }).catch(error => {
        this.$message.error(error);
      });
    },
    updateBackupPlan(id, plan) {
      this.btnLoading = true;
      updateVirtualBackupPlan({ id, plan })
        .then(res => {
          const { message } = res.data;
          this.getBackupPlanList();
          this.backupPlanModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    aCloudRestoreConfirmCallback(formData, action) {
      this.btnLoading = true;
      (action === 'create' ? createACloudRestorePlan(this.id, formData) : modifyACloudRestorePlan(formData))
        .then(res => {
          const { message } = res.data;
          this.aCloudRestorePlanModalVisible = false;
          this.$message.success(message);
          this.getRestorePlans();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    aCloudSingleConfirmCallback(id, formData) {
      this.btnLoading = true;
      createACloudSingleRestorePlan(id, formData)
        .then(res => {
          const { message } = res.data;
          this.aCloudSingleRestoreCreateModalVisible = false;
          this.$message.success(message);
          this.getRestorePlans();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    }
  },
};
</script>
<style>
.el-col .el-form-item {
  display: block;
}
</style>
<style scoped>
.margin-right5 {
  margin-right: 5px;
}
</style>

