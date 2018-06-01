<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="oracle"></i-icon>
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
              <el-form-item label="Oracle版本：">
                <span>{{ details.dbVersion }}</span>
              </el-form-item>
              <el-form-item label="实例名：">
                <span>{{ details.instanceName }}</span>
              </el-form-item>
              <!-- <el-form-item label="归档模式：">
                <span>ARCHIVELOG</span>
              </el-form-item> -->
              <el-form-item label="数据库账号：">
                <span>{{ details.loginName }}</span>
              </el-form-item>
              <el-form-item label="数据库密码：">
                <!-- <span-toggle :value="oracle.password"></span-toggle> -->
                <span>●●●●●●●●</span>
              </el-form-item>
              <el-form-item label="主机名：">
                <span>{{ details.hostName }}</span>
              </el-form-item>
              <el-form-item label="操作系统：">
                <span>{{ details.osName }}</span>
              </el-form-item>
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
                type="oracle"
                :backup-plans="backupPlans"
                :restore-plans="restorePlans"
                :results="results"
                @backupplan:refresh="refreshSingleBackupPlan"
                @backupplan:update="updateBackupPlan"
                @backupplan:delete="deleteBackupPlan"
                @restoreplan:refresh="refreshSingleRestorePlan"
                @restoreplan:add="addRestorePlan"
                @restoreplan:update="updateRestorePlan"
                @restoreplan:delete="deleteRestorePlan"
                @switchpane="switchPane"
                @restoreinfo:refresh="updateRestorePlanAndRecords"
                :restoreRecords="restoreRecords"></tab-panels>
    <add-backup-plan type="oracle"
                     :id="Number(id)"
                     :visible.sync="backupPlanCreateModalVisible"
                     @confirm="addBackupPlan"></add-backup-plan>
    <restore-plan-create-modal type="oracle"
                               :id="Number(id)"
                               :visible.sync="restorePlanCreateModalVisible"
                               @confirm="addRestorePlan"></restore-plan-create-modal>
    <database-update-modal type="oracle"
                           :visible.sync="detailsEditModal"
                           :item-info="details"
                           @confirm="details = arguments[0]"></database-update-modal>
  </section>
</template>
<script>
import throttle from 'lodash/throttle';
import { detailPageMixin } from '../mixins/detailPageMixins';

import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
  fetchRestorePlans,
  fetchRestoreRecords,
  fetchBackupOperation,
  fetchRestoreOperation,
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
          this.$router.push({ name: 'oracleList' });
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
  },
};
</script>
