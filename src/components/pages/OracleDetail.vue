<template>
  <section>
    <header class="detail-header">
      <div class="db-content">
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
                     class="database-info">
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
        <database-update-modal db-type="oracle"
                               :visible.sync="detailsEditModal"
                               :database-info="details"
                               @confirm="details = arguments[0]"></database-update-modal>
      </div>
    </header>
    <el-tabs v-model="activeTab"
             @tab-click="switchPane">
      <el-tab-pane label="操作计划"
                   name="plans">
        <el-form inline
                 :model="planFilterForm"
                 class="filter-form">
          <el-form-item label="隐藏已完成计划">
            <el-switch v-model="planFilterForm.hiddenCompletePlan"></el-switch>
          </el-form-item>
        </el-form>
        <backup-card :id="plan.id"
                     type="oracle"
                     v-for="(plan, index) in filteredBackupPlans"
                     :key="plan.id"
                     :backupPlan="plan"
                     @deletePlan="deleteBackupPlan(index)"
                     @updatePlan="selectBackupPlan(index)"></backup-card>
        <restore-card :id="plan.id"
                      type="oracle"
                      v-for="(plan, index) in restorePlans"
                      :key="plan.id"
                      :restorePlan="plan"
                      @deletePlan="deleteRestorePlan(index)"
                      @updatePlan="selectRestorePlan(index)"></restore-card>
      </el-tab-pane>
      <el-tab-pane label="备份集"
                   name="results">
        <el-form inline
                 :model="resultFilterForm"
                 class="filter-form"
                 style="text-align: right;">
          <el-form-item>
            <el-button size="medium"
                       type="text"
                       @click="updateResults()">刷新</el-button>
          </el-form-item>
        </el-form>
        <backup-result-list type="oracle"
                            :data="results"
                            @add-restore="addSingleRestore"></backup-result-list>
      </el-tab-pane>
      <el-tab-pane label="恢复记录"
                   name="restore">
        <restore-records type="oracle" :plans="ongoingRestorePlan"
                         :records="restoreRecords"></restore-records>
      </el-tab-pane>
    </el-tabs>
    <add-backup-plan type="oracle"
                     :id="Number(id)"
                     :visible.sync="planCreateModal"
                     @confirm="addBackupPlan"></add-backup-plan>
    <update-backup-plan type="oracle"
                        :id="Number(id)"
                        :visible.sync="planUpdateModal"
                        :backup-plan="selectedPlan"
                        @confirm="updateBackupPlan"></update-backup-plan>
    <restore-plan-create-modal type="oracle"
                               :id="Number(id)"
                               :visible.sync="restorePlanCreateModalVisible"
                               @confirm="restorePlanAdded"></restore-plan-create-modal>
    <restore-plan-update-modal type="oracle"
                               :id="Number(id)"
                               :visible.sync="restorePlanUpdateModalVisible"
                               :restore-plan="selectedRestorePlan"
                               @confirm="restorePlanUpdated"></restore-plan-update-modal>
  </section>
</template>
<script>
import { databaseDetailMixin } from '../mixins/detailPageMixins';

import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
  fetchRestorePlans,
  fetchRestoreRecords,
} from '../../api/oracle';

export default {
  name: 'OracleDetail',
  mixins: [databaseDetailMixin],
  data() {
    return {
      updateResults: this.throttleMethod(fetchBackupResults),
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
    switchPane({ name }) {
      if (name === 'results') {
        this.updateResults();
      }
    },
  },
};
</script>
<style scoped>
.detail-header {
  background-color: #ffffff;
  margin: -20px -20px 0 -20px;
  padding: 10px 10px 50px 10px;
}
.icon {
  position: relative;
  top: 17px;
  right: 0;
  font-size: 1.7em;
}
.db-content {
  margin-left: 20px;
}
.action {
  text-align: right;
}
.database-info .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 40%;
}
.el-tabs {
  margin-top: -39px;
}
.filter-form {
  /* background-color: #ffffff; */
  padding-left: 20px;
}
.filter-form .el-form-item {
  margin-bottom: 0;
}
</style>
