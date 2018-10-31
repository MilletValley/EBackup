<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon :name="systemType"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.hostName}}</h1>
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
                    <!-- 文件系统备份计划 可以多次添加 -->
                    <el-dropdown-item command="backup">备份计划</el-dropdown-item>
                    <el-dropdown-item disabled
                                      command="restore">恢复计划</el-dropdown-item>
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
                  <el-form-item label="操作系统：">
                    <span>{{ details.osName }}</span>
                  </el-form-item>
                  <el-form-item label="服务器账号：">
                    <span>{{ details.loginName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="主机IP：">
                    <span>{{ details.hostIp }}</span>
                  </el-form-item>
                  <el-form-item label="服务器密码：">
                    <!-- <span-toggle :value="filehost.password"></span-toggle> -->
                    <span>●●●●●●●●</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="所属系统：">
                <span>{{ details.application }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </header>
    <tab-panels :id="Number(id)"
                :type="systemType"
                :backup-plans="backupPlans"
                :restore-plans="restorePlans"
                :results="results"
                @single-restore-btn-click="initSingleRestoreModal"
                @backupplan:refresh="refreshSingleBackupPlan"
                @backupplan:update="updateBackupPlan"
                @backupplan:delete="deleteBackupPlan"
                @select-backup-plan="selectBackupPlan"
                @switchpane="switchPane"
                @restoreinfo:refresh="updateRestorePlanAndRecords"
                :restoreRecords="restoreRecords"></tab-panels>
    <backup-plan-create-modal :type="systemType"
                              :visible.sync="backupPlanCreateModalVisible"
                              :btn-loading="btnLoading"
                              @confirm="addBackupPlan"></backup-plan-create-modal>
    <backup-plan-update-modal :type="systemType"
                              :visible.sync="backupPlanUpdateModalVisible"
                              :btn-loading="btnLoading"
                              :backup-plan="selectedBackupPlan"
                              @confirm="updateBackupPlan"
                              @cancel="selectedBackupPlanId = -1"></backup-plan-update-modal>
    <file-host-update-modal type="filehost"
                            :visible.sync="detailsEditModal"
                            :btn-loading="btnLoading"
                            @confirm="updateDetails"
                            :item-info="details"></file-host-update-modal>
    <single-restore-create-modal :type="systemType"
                                 v-if="systemType"
                                 :id="selectedBackupResultId"
                                 :visible.sync="singleRestoreCreateModalVisible"
                                 :btn-loading="btnLoading"
                                 :tree-data="treeData"
                                 :file-host-origin-path="fileHostOriginPath"
                                 :selection-hosts="availableHostsForRestore"
                                 @confirm="addSingleRestorePlan"></single-restore-create-modal>
  </section>
</template>
<script>
import FileHostUpdateModal from '@/components/modal/FileHostUpdateModal';
import { detailPageMixin } from '../mixins/detailPageMixins';
import {
  modifyOne,
  fetchOne,
  fetchAll,
  fetchBackupPlans,
  fetchBackupResults,
  fetchOriginPath,
  createBackupPlan,
  updateBackupPlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  fetchBackupOperation,
  deleteBackupPlan,
  createSingleRestorePlan,
} from '../../api/fileHost';

export default {
  name: 'FileHostDetail',
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
      throttleRefreshBackup: this.throttleMethod(() => {
        fetchBackupOperation(this.selectedBackupPlanId)
          .then(response => {
            const { data } = response.data;
            const { state, startTime, consume, size, process } = data;
            Object.assign(
              this.backupPlans.find(
                plan => plan.id === this.selectedBackupPlanId
              ),
              {
                state,
                startTime,
                consume,
                size,
                process
              }
            );
          })
          .catch(error => {
            this.$message.error(error);
          });
      }),
      filteredInfos: [],
      fileHostOriginPath: []
    };
  },
  methods: {
    fetchData() {
      fetchAll() // 获取文件列表信息
        .then(res => {
          const { data: infos } = res.data;
          this.filteredInfos = infos.filter(info => info.osName==='Linux');
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchOne(this.id)
        .then(res => {
          const { data: db } = res.data;
          this.details = db;
          this.infoLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
          this.$router.push({ name: 'fileHostList' });
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
    // 单次恢复的源恢复路径请求
    fetchFileHostOriginPath(id) {
      fetchOriginPath(id)
        .then(res => {
          const { data: fileHostPath } = res.data;
          this.fileHostOriginPath = fileHostPath;
        })
        .catch(error => {
          this.$message.error(error);
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
    // 添加备份计划
    addBackupPlan(plan) {
      this.btnLoading = true;
      createBackupPlan({ id: this.id, plan })
        .then(res => {
          const { data: backupPlan, message } = res.data;
          // 刷新情况下可能会出现两个添加后的计划
          if (this.backupPlans.findIndex(plan => plan.id === backupPlan.id) === -1) {
            this.backupPlans.unshift(backupPlan)
          }
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
      updateBackupPlan({ id, plan })
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
    // 刷新单次备份计划
    refreshSingleBackupPlan(planId) {
      this.selectedBackupPlanId = planId;
      this.throttleRefreshBackup();
    },
    deleteBackupPlan(planId) {
      deleteBackupPlan(planId).then(() => {
        this.backupPlans.splice(
          this.backupPlans.findIndex(plan => plan.id === planId),
          1
        );
        this.$message.success('删除成功');
      });
    },
    // 单次恢复
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
          const { data: filehost, message } = res.data;
          // FIXME: mock数据保持id一致，生产环境必须删除下面一行
          filehost.id = this.details.id;
          this.details = filehost;
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
  },
  computed: {
    systemType() {
      return this.details && this.details.osName
        ? this.details.osName.toLowerCase()
        : 'windows';
    },
    availableHostsForRestore() { // 单次立即恢复模态框中的可选设备
      // return this.filteredInfos.filter(host => host.osName === 'Linux')
      return this.filteredInfos
    },
    treeData() { // 数组转树状结构对象, 用于生成单次立即恢复模态框中的源路径树状图
      let tree = this.fileHostOriginPath.filter(father => {
        let branchArr = this.fileHostOriginPath.filter(child => {
          return father.id === child.parentId && child.id !== child.parentId
        })
        if(branchArr.length>0) {
          father.children = branchArr;
        }
        return father.id === father.parentId
      })
      return tree
    }
  },
  components: {
    FileHostUpdateModal,
  },
};
</script>
