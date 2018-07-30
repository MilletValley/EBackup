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
              <el-col :span="20"
                      class="title">
                <h1>{{details.vmName}}</h1>
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
                    <el-dropdown-item command="restore"
                                      disabled>恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button size="mini"
                           type="primary"
                           @click="detailsEditModal = true"
                           disabled>编辑</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     label-position="left"
                     label-width="100px"
                     inline
                     size="small"
                     class="item-info">
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="虚拟机账号：">
                    <div>{{ details.host.loginName }}</div>
                  </el-form-item>
                  <el-form-item label="虚拟机密码：">
                    <div>●●●●●●●●</div>
                  </el-form-item>
                  <el-form-item label="主机名：">
                    <div>{{ details.host.name }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作系统：">
                    <div>{{ details.host.osName }}</div>
                  </el-form-item>
                  <el-form-item label="主机IP：">
                    <div>{{ details.host.hostIp }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <tab-panels :id="Number(id)"
                type="vm"
                :backup-plans="backupPlans"
                :restore-plans="restorePlans"
                :results="results"
                @single-restore-btn-click="initSingleRestoreModal"
                @backupplan:refresh="refreshSingleBackupPlan"
                @backupplan:update="updateBackupPlan"
                @backupplan:delete="deleteBackupPlan"
                @select-backup-plan="selectBackupPlan"
                @switchpane="switchPane"
                :restoreRecords="restoreRecords"></tab-panels>
    <backup-plan-create-modal type="vm"
                     :visible.sync="backupPlanCreateModalVisible"
                     :btn-loading="btnLoading"
                     @confirm="addBackupPlan"></backup-plan-create-modal>
    <backup-plan-update-modal type="vm"
                              :visible.sync="backupPlanUpdateModalVisible"
                              :btn-loading="btnLoading"
                              :backup-plan="selectedBackupPlan"
                              @confirm="updateBackupPlan"
                              @cancel="selectedBackupPlanId = -1"></backup-plan-update-modal>
  </section>
</template>
<script>
import throttle from 'lodash/throttle';
import { detailPageMixin } from '../mixins/detailPageMixins';

import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
  createVirtualBackupPlan,
  updateVirtualBackupPlan,
  deleteVirtualBackupPlan,
  fetchBackupOperation,
} from '../../api/virtuals';

export default {
  name: 'VMwareDetail',
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
    };
  },
  methods: {
    fetchData() {
      fetchOne(this.id)
        .then(res => {
          const { data: vm } = res.data;
          this.details = vm;
        })
        .catch(error => {
          this.$message.error(error);
          this.$router.push({ name: 'VmwareList' });
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

    },
    addBackupPlan(plan) {
      this.btnLoading = true;
      createVirtualBackupPlan({ id: this.id, plan })
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
    updateBackupPlan(id, plan) {
      this.btnLoading = true;
      updateVirtualBackupPlan({ id, plan })
        .then(res => {
          const { data: plan, message } = res.data;
          // FIXME: 修改ID
          plan.id = this.selectedBackupPlanId;
          this.backupPlans.splice(
            this.backupPlans.findIndex(p => p.id === plan.id),
            1,
            plan
          );
          this.backupPlanUpdateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
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
    deleteBackupPlan(planId) {
      deleteVirtualBackupPlan(planId).then(() => {
        this.backupPlans.splice(
          this.backupPlans.findIndex(plan => plan.id === planId),
          1
        );
        this.$message.success('删除成功');
      });
    },
  },
};
</script>
<style>
.el-col .el-form-item {
  display: block;
}
</style>

