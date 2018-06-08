<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="sqlserver"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.name}}</h1>
              </el-col>
              <el-col :span="12"
                      :offset="12"
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
                <el-button size="mini"
                           type="primary"
                           @click="detailsEditModal = true">编辑</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     label-position="left"
                     label-width="100px"
                     inline
                     size="small"
                     class="item-info">
              <el-form-item label="数据库版本：">
                <span>{{ details.dbVersion }}</span>
              </el-form-item>
              <el-form-item label="数据库：">
                <span>{{ details.instanceName }}</span>
              </el-form-item>
              <el-form-item label="数据库账号：">
                <span>{{ details.loginName }}</span>
              </el-form-item>
              <el-form-item label="数据库密码：">
                <!-- <span-toggle :value="sqlserver.password"></span-toggle> -->
                <span>●●●●●●●●</span>
              </el-form-item>
              <el-form-item label="主机名：">
                <span>{{ details.hostName }}</span>
              </el-form-item>
              <el-form-item label="操作系统：">
                <span>{{ details.osName }}</span>
              </el-form-item>·
              <el-form-item label="主机IP：">
                <span>{{ details.hostIp }}</span>
              </el-form-item>
              <el-form-item label="所属系统：">
                <span>{{ details.application }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <tab-panels :id="Number(id)"
                type="sqlserver"
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
                @switchpane="switchPane"
                @restoreinfo:refresh="updateRestorePlanAndRecords"
                :restoreRecords="restoreRecords"></tab-panels>
    <add-backup-plan type="sqlserver"
                     :id="Number(id)"
                     :visible.sync="backupPlanCreateModalVisible"
                     @confirm="addBackupPlan"></add-backup-plan>
    <restore-plan-create-modal type="sqlserver"
                               :database="details"
                               :visible.sync="restorePlanCreateModalVisible"
                               :selection-hosts="availableHostsWithSqlServer"
                               @confirm="addRestorePlan"></restore-plan-create-modal>
    <restore-plan-update-modal type="sqlserver"
                               :database="details"
                               :visible.sync="restorePlanUpdateModalVisible"
                               :btn-loading="btnLoading"
                               :restore-plan="selectedRestorePlan"
                               @confirm="updateRestorePlan"></restore-plan-update-modal>
    <database-update-modal type="sqlserver"
                           :visible.sync="detailsEditModal"
                           :item-info="details"
                           :btn-loading="btnLoading"
                           @confirm="updateDetails"></database-update-modal>
    <single-restore-create-modal type="sqlserver"
                                 :id="selectedBackupResultId"
                                 :visible.sync="singleRestoreCreateModalVisible"
                                 :selection-hosts="availableHostsWithSqlServer"
                                 @confirm="addSingleRestorePlan"></single-restore-create-modal>
  </section>
</template>
<script>
import { detailPageMixin } from '../mixins/detailPageMixins';

import {
  modifyOne,
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
  fetchRestorePlans,
  fetchRestoreRecords,
  fetchBackupOperation,
  fetchRestoreOperation,
  deleteRestorePlan,
  deleteSqlServerBackupPlan,
  createSingleRestorePlan,
  createRestorePlan,
  updateRestorePlan,
} from '../../api/sqlserver';

export default {
  name: 'SqlServerDetail',
  mixins: [detailPageMixin],
  data() {
    return {
      updateResults: this.throttleMethod(() => {
        fetchBackupResults(this.id)
          .then(res => {
            const { data: result } = res.data;
            this.results = result;
          })
          .catch(error => {
            this.$message.error(error);
          });
      }),
      updateRestorePlanAndRecords: this.throttleMethod(() => {
        fetchRestorePlans(this.id)
          .then(res => {
            const { data: restorePlans } = res.data;
            this.restorePlans = restorePlans;
          })
          .catch(error => {
            this.$message.error(error);
          });
        fetchRestoreRecords(this.id)
          .then(res => {
            const { data: restoreRecords } = res.data;
            this.restoreRecords = restoreRecords;
          })
          .catch(error => {
            this.$message.error(error);
          });
      }),
      // selectedBackupPlanId: -1,
      throttleRefreshBackup: this.throttleMethod(() => {
        fetchBackupOperation(this.selectedBackupPlanId)
          .then(response => {
            const { data } = response.data;
            const { state, startTime, consume, size } = data;
            Object.assign(
              this.backupPlans.find(
                plan => plan.id === this.selectedBackupPlanId
              ),
              {
                state,
                startTime,
                consume,
                size,
              }
            );
          })
          .catch(error => {
            this.$message.error(error);
          });
      }),
      selectedRestorePlanId: -1,
      throttleRefreshRestore: this.throttleMethod(() => {
        fetchRestoreOperation(this.selectedRestorePlanId)
          .then(response => {
            const { data } = response.data;
            const { state, startTime, consume } = data;
            Object.assign(
              this.restorePlans.find(
                plan => plan.id === this.selectedRestorePlanId
              ),
              {
                state,
                startTime,
                consume,
              }
            );
          })
          .catch(error => {
            this.$message.error(error);
          });
      }),
    };
  },
  computed: {
    availableHostsWithSqlServer() {
      return this.$store.getters.hostsWithSqlServer;
    },
  },
  methods: {
    fetchData() {
      fetchOne(this.id)
        .then(res => {
          const { data: db } = res.data;
          this.details = db;
          this.infoLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
          this.$router.push({ name: 'sqlserverList' });
        });
      fetchBackupPlans(this.id)
        .then(res => {
          const { data: plans } = res.data;
          this.backupPlans = plans;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchBackupResults(this.id)
        .then(res => {
          const { data: result } = res.data;
          this.results = result;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchRestorePlans(this.id).then(res => {
        const { data: plans } = res.data;
        this.restorePlans = plans;
      });
      fetchRestoreRecords(this.id).then(res => {
        const { data: records } = res.data;
        this.restoreRecords = records;
      });
    },
    // 刷新单个备份计划
    refreshSingleBackupPlan(planId) {
      this.selectedBackupPlanId = planId;
      this.throttleRefreshBackup();
    },
    // 刷新单个恢复计划
    refreshSingleRestorePlan(planId) {
      this.selectedRestorePlanId = planId;
      this.throttleRefreshRestore();
    },
    deleteRestorePlan(planId) {
      deleteRestorePlan(planId)
        .then(() => {
          this.$message.success('删除成功');
          this.restorePlans.splice(
            this.restorePlans.findIndex(plan => plan.id === planId),
            1
          );
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    deleteBackupPlan(planId) {
      deleteSqlServerBackupPlan(planId).then(() => {
        this.backupPlans.splice(
          this.backupPlans.findIndex(plan => plan.id === planId),
          1
        );
        this.$message.success('删除成功');
      });
    },
    addRestorePlan(restorePlan) {
      this.btnLoading = true;
      createRestorePlan(restorePlan)
        .then(res => {
          const { data: restorePlan } = res.data;
          this.restorePlans.unshift(restorePlan);
          this.restorePlanCreateModalVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
          return false;
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    // 单次恢复
    addSingleRestorePlan(restorePlan) {
      createSingleRestorePlan(restorePlan)
        .then(res => {
          const { data: restorePlan } = res.data;
          this.singleRestoreCreateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        });
      this.restorePlans.unshift(restorePlan);
    },
    updateDetails(data) {
      this.btnLoading = true;
      modifyOne(data)
        .then(res => {
          const { data: sqlserver, message } = res.data;
          // FIXME: mock数据保持id一致，生产环境必须删除下面一行
          sqlserver.id = this.details.id;
          this.details = sqlserver;
          this.detailsEditModal = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    // 更新恢复计划
    updateRestorePlan(data) {
      updateRestorePlan(data)
        .then(res => {
          const { data: plan, message } = res.data;
          // FIXME: 修改ID
          plan.id = this.selectedRestorePlanId;
          this.restorePlans.splice(
            this.restorePlans.findIndex(p => p.id === plan.id),
            1,
            plan
          );
          this.restorePlanUpdateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
};
</script>
