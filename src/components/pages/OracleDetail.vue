<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="oracle"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1 :class="details.role === 1 ? $style.primaryLink : $style.viceLink">{{details.name}}
                  <i-icon v-if="details.role !== 0"
                          :name="roleIconName(this.details.role)"
                          :class="$style.roleIconHeader"></i-icon>
                </h1>
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
                     size="small"
                     class="item-info">
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="Oracle版本：">
                    <span>{{ details.dbVersion }}</span>
                  </el-form-item>
                  <el-form-item label="实例名：">
                    <span>{{ details.instanceName }}</span>
                  </el-form-item>
                  <el-form-item label="数据库账号：">
                    <span>{{ details.loginName }}</span>
                  </el-form-item>
                  <el-form-item label="数据库密码：">
                    <span>●●●●●●●●</span>
                  </el-form-item>
                  <el-form-item label="数据库状态：">
                    <el-tag :type="databaseStateStyle(details.state)"
                            size="mini">{{ details.state | databaseStateFilter }}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="主机名：">
                    <span>{{ details.host.name }}</span>
                  </el-form-item>
                  <el-form-item label="操作系统：">
                    <span>{{ details.host.osName }}</span>
                  </el-form-item>
                  <el-form-item label="所属设备：">
                    <span>{{ details.host.name }}</span>
                  </el-form-item>
                  <el-form-item label="设备IP：">
                    <span>{{ details.host.hostIp }}</span>
                  </el-form-item>
                  <el-form-item label="所属系统：">
                    <span>{{ details.application }}</span>
                  </el-form-item>
                </el-col>
                <template v-if="!!link.id">
                  <el-col :span="8"
                          :class="$style.linkInfo">
                    <h4 style="margin: 10px 0 7px;">连接信息</h4>
                    <el-form-item>
                      <i-icon :name="`switch-${link.state}`"
                              :class="$style.switchIcon"></i-icon>
                      <span>{{ link.state | linkStateFilter }}</span>
                    </el-form-item>
                    <el-form-item>
                      <i-icon :name="roleIconName(link.oppsiteDatabase && link.oppsiteDatabase.role)"
                              :class="$style.roleIconOppsition"></i-icon>
                      <router-link :to="`/db/oracle/${ link.oppsiteDatabase && link.oppsiteDatabase.id}`"
                                   :class="link.oppsiteDatabase.role === 1 ? $style.primaryLink : $style.viceLink">
                        {{ link.oppsiteDatabase && link.oppsiteDatabase.name }}
                      </router-link>
                    </el-form-item>

                  </el-col>
                  <router-link :to="`/db/oracle/takeover/${link.id}`"
                               :class="$style.moreLink">查看更多</router-link>
                </template>

              </el-row>

            </el-form>

          </el-col>
        </el-row>

      </div>
    </header>
    <tab-panels :id="Number(id)"
                type="oracle"
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
    <!-- <add-backup-plan type="oracle"
                     :id="Number(id)"
                     :visible.sync="backupPlanCreateModalVisible"
                     @confirm="addBackupPlan"></add-backup-plan> -->
    <backup-plan-create-modal type="oracle"
                              :visible.sync="backupPlanCreateModalVisible"
                              @confirm="addBackupPlan"></backup-plan-create-modal>
    <restore-plan-create-modal type="oracle"
                               :database="details"
                               :visible.sync="restorePlanCreateModalVisible"
                               :btn-loading="btnLoading"
                               :selection-hosts="availableHostsWithOralce"
                               @confirm="addRestorePlan"></restore-plan-create-modal>
    <restore-plan-update-modal type="oracle"
                               :database="details"
                               :visible.sync="restorePlanUpdateModalVisible"
                               :btn-loading="btnLoading"
                               :restore-plan="selectedRestorePlan"
                               @confirm="updateRestorePlan"></restore-plan-update-modal>
    <database-update-modal type="oracle"
                           :visible.sync="detailsEditModal"
                           :item-info="details"
                           :btn-loading="btnLoading"
                           @confirm="updateDetails"></database-update-modal>
    <single-restore-create-modal type="oracle"
                                 :id="selectedBackupResultId"
                                 :visible.sync="singleRestoreCreateModalVisible"
                                 :selection-hosts="availableHostsWithOralce"
                                 @confirm="addSingleRestorePlan"></single-restore-create-modal>
  </section>
</template>
<script>
import throttle from 'lodash/throttle';
import { detailPageMixin } from '../mixins/detailPageMixins';
import backupPlanCreateModal from '@/components/modal/BackupPlanCreateModal';

import {
  modifyOne,
  fetchOne,
  fetchBackupPlans,
  createBackupPlan,
  fetchBackupResults,
  fetchRestorePlans,
  fetchRestoreRecords,
  fetchBackupOperation,
  fetchRestoreOperation,
  deleteRestorePlan,
  deleteOracleBackupPlan,
  createSingleRestorePlan,
  createRestorePlan,
  updateRestorePlan,
  fetchLink,
} from '../../api/oracle';

export default {
  name: 'OracleDetail',
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
      selectedBackupPlanId: -1,
      // TODO: 暂时使用一个data变量存储选择的计划id，也许有更优雅的实现方式
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
      // selectedRestorePlanId: -1,
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
    availableHostsWithOralce() {
      return this.$store.getters.hostsWithOracle;
    },
  },
  methods: {
    fetchData() {
      fetchOne(this.id)
        .then(res => {
          const { data: db } = res.data;
          this.details = db;
          if (this.details.role && this.details.role !== 0) {
            fetchLink(this.id).then(res => {
              const { data: link } = res.data;
              const { id, state, errMsg, tempPort } = link;
              this.link = { id, state, errMsg, tempPort };
              if (this.details.role === 1) {
                this.link.oppsiteDatabase = link.viceDatabase;
              } else if (this.details.role === 2) {
                this.link.oppsiteDatabase = link.primaryDatabase;
              }
            });
          }
        })
        .catch(error => {
          this.$message.error(error);
          this.$router.push({ name: 'oracleList' });
        })
        .then(() => {
          this.infoLoading = false;
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
    // 添加备份计划
    addBackupPlan(plan) {
      this.btnLoading = true;
      createBackupPlan({ id: this.id, plan })
        .then(res => {
          const { data: backupPlan, message } = res.data;
          this.backupPlans.unshift(backupPlan);
          this.backupPlanCreateModalVisible = false;
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
          this.restorePlans.splice(
            this.restorePlans.findIndex(plan => plan.id === planId),
            1
          );
          this.$message.success('删除成功');
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    deleteBackupPlan(planId) {
      deleteOracleBackupPlan(planId).then(() => {
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
          const { data: restorePlan, message } = res.data;
          this.restorePlans.unshift(restorePlan);
          this.restorePlanCreateModalVisible = false;
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
    addSingleRestorePlan(plan) {
      createSingleRestorePlan(plan)
        .then(res => {
          const { data: restorePlan, message } = res.data;
          this.restorePlans.unshift(restorePlan);
          this.singleRestoreCreateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    updateDetails(data) {
      this.btnLoading = true;
      modifyOne(data)
        .then(res => {
          const { data: oracle, message } = res.data;
          // FIXME: mock数据保持id一致，生产环境必须删除下面一行
          oracle.id = this.details.id;
          this.details = oracle;
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
    databaseStateStyle(value) {
      switch (value) {
        case 0:
          return 'info';
        case 1:
          return 'success';
        case 2:
          return 'danger';
      }
    },
  },
  components: { backupPlanCreateModal },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
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
