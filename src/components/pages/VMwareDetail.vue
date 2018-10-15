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
                    <el-dropdown-item command="restore"
                                      >恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button v-if="false" size="mini"
                           type="primary"
                           @click="detailsEditModal = true"
                           >编辑</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     label-position="left"
                     label-width="120px"
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
                  <el-form-item label="所属物理主机：">
                    <div>{{ details.vmHostName }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作系统：">
                    <div>{{ details.host.osName }}</div>
                  </el-form-item>
                  <el-form-item label="设备IP：">
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
                @restoreplan:refresh="refreshSingleRestorePlan"
                @restoreplan:delete="deleteRestorePlan"
                @select-restore-plan="selectRestorePlan"
                @select-backup-plan="selectBackupPlan"
                @switchpane="switchPane"
                @restoreinfo:refresh="updateRestorePlanAndRecords"
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
    <restore-plan-create-modal type="vm"
                               :database="details"
                               :visible.sync="restorePlanCreateModalVisible"
                               :btn-loading="btnLoading"
                               @confirm="addRestorePlan"></restore-plan-create-modal>
    <restore-plan-update-modal type="vm"
                               :database="details"
                               :visible.sync="restorePlanUpdateModalVisible"
                               :btn-loading="btnLoading"
                               :restore-plan="selectedRestorePlan"
                               @confirm="updateRestorePlan"
                               @cancel="selectedRestorePlanId = -1"></restore-plan-update-modal>
    <virtual-update-modal type="vm"
                           :visible.sync="detailsEditModal"
                           :item-info="details"
                           :btn-loading="btnLoading"
                           @confirm="updateDetails"></virtual-update-modal>
    <single-restore-create-modal type="vm"
                                 :id="selectedBackupResultId"
                                 :database="details"
                                 :visible.sync="singleRestoreCreateModalVisible"
                                 :btn-loading="btnLoading"
                                 @confirm="addSingleRestorePlan"></single-restore-create-modal>
  </section>
</template>
<script>
import throttle from 'lodash/throttle';
import VirtualUpdateModal from '@/components/modal/VirtualUpdateModal';
import { detailPageMixin } from '../mixins/detailPageMixins';

import {
  fetchOne,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createVirtualBackupPlan,
  updateVirtualBackupPlan,
  deleteVirtualBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
  fetchRestoreOperation,
  createMultipleVirtualBackupPlan
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
          })
      }),
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
          })
      }),
    };
  },
  computed: {
    // isVM() {
    //   const path = this.$route.path;
    //   return this.$route.path.substring(4, path.lastIndexOf('/'))==='virtual'
    // }
    // vmType(){
    //   const path = this.$route.path;
    //   return this.$route.path.substring(4, path.lastIndexOf('/'))==='virtual' ? 'VMware : 
    // }
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
          const path = this.$route.path;
          if(this.$route.path.substring(4, path.lastIndexOf('/'))==='virtual')
            this.$router.push({ name: 'VmwareList' });
          else
            this.$router.push({ name: 'HWwareList' });
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
    RefreshTime() {
      fetchBackupPlans(this.id)
        .then(res => {
          const { data: plans } = res.data;
          this.backupPlans = plans;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchRestorePlans(this.id).then(res => {
        const { data: plans } = res.data;
        this.restorePlans = plans;
      });
    },
    addBackupPlan(plan) {
      this.btnLoading = true;
      // createVirtualBackupPlan({ id: this.id, plan })
      const data = Object.assign( {}, plan, {vmList: [this.id]});
      createMultipleVirtualBackupPlan(data)
        .then(res => {
          console.log(res)
          const {  message } = res.data;
          // 刷新情况下可能会出现两个添加后的计划
          // if (this.backupPlans.findIndex(plan => plan.id === backupPlan.id) === -1) {
          //   this.backupPlans.unshift(backupPlan)
          // }
          fetchBackupPlans(this.id)
          .then(res => {
            const { data: plans } = res.data;
            this.backupPlans = plans;
          })
          .catch(error => {
            this.$message.error(error);
          });
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
      deleteVirtualBackupPlan(planId).then(() => {
        this.backupPlans.splice(
          this.backupPlans.findIndex(plan => plan.id === planId),
          1
        );
        this.$message.success('删除成功');
      }).catch( error => {
        this.$message.error( error)
      });
    },
    addRestorePlan(restorePlan) {
      this.btnLoading = true;
      createRestorePlan(restorePlan)
        .then(res => {
          const { data: restorePlan, message } = res.data;
          // 刷新情况下可能会出现两个添加后的计划
          if (this.restorePlans.findIndex(plan => plan.id === restorePlan.id) === -1) {
            this.restorePlans.unshift(restorePlan)
          }
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
      this.btnLoading = true;
      createSingleRestorePlan(plan)
        .then(res => {
          const { data: restorePlan, message } = res.data;
          this.restorePlans.unshift(restorePlan);
          this.singleRestoreCreateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    updateDetails(data) {
      this.btnLoading = true;
      modifyOne(data)
        .then(res => {
          const { data: virtual, message } = res.data;
          // FIXME: mock数据保持id一致，生产环境必须删除下面一行
          virtual.id = this.details.id;
          this.details = virtual;
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
      this.btnLoading = true;
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
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
  },
  components: {
    VirtualUpdateModal,
  },
};
</script>
<style>
.el-col .el-form-item {
  display: block;
}
</style>

