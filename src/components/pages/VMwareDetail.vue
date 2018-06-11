<template>
  <section>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="vmware"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
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
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     label-position="left"
                     label-width="100px"
                     inline
                     size="small"
                     class="item-info">
              <el-form-item label="账号：">
                <span>{{ details.host.loginName }}</span>
              </el-form-item>
              <el-form-item label="密码：">
                <span>●●●●●●●●</span>
              </el-form-item>
              <el-form-item label="主机名：">
                <span>{{ details.host.name }}</span>
              </el-form-item>
              <el-form-item label="操作系统：">
                <span>{{ details.host.osName }}</span>
              </el-form-item>
              <el-form-item label="主机IP：">
                <span>{{ details.host.hostIp }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <vm-tab-panels :id="Number(id)"
                type="vm"
                :backup-plans="backupPlans"
                :results="results"
                @backupplan:refresh="refreshSingleBackupPlan"
                @backupplan:update="updateBackupPlan"
                @backupplan:delete="deleteBackupPlan"
                @switchpane="switchPane"></vm-tab-panels>
    <add-backup-plan type="vm"
                     :id="Number(id)"
                     :visible.sync="backupPlanCreateModalVisible"
                     @confirm="addBackupPlan"></add-backup-plan>
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
          this.infoLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
          this.$router.push({ name: 'VmwareList' });
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
