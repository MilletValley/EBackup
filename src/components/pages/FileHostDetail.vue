<template>
  <section>
    <header class="detail-header">
      <div class="detail-panel">
        <el-row type="flex" justify="end">
          <el-col :span="1">
            <i-icon :name="systemType"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex" align="middle">
              <el-col :span="8" class="title">
                <h1>{{details.hostName}}</h1>
              </el-col>
              <el-col :span="12" :offset="12" class="action">
                <el-dropdown size="mini" trigger="click" placement="bottom" @command="addPlanBtnClick">
                  <el-button size="mini" plain>添加计划
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 文件系统备份计划 可以多次添加 -->
                    <el-dropdown-item command="backup">备份计划</el-dropdown-item>
                    <el-dropdown-item command="restore">恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button size="mini" type="primary" @click="detailsEditModal = true">编辑</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading" label-position="left" label-width="100px" inline size="small" class="detail-form">
              <el-form-item label="操作系统：">
                <span>{{ details.osName }}</span>
              </el-form-item>
              <el-form-item label="主机IP：">
                <span>{{ details.hostIp }}</span>
              </el-form-item>
              <el-form-item label="服务器账号：">
                <span>{{ details.loginName }}</span>
              </el-form-item>
              <el-form-item label="服务器密码：">
                <!-- <span-toggle :value="oracle.password"></span-toggle> -->
                <span>●●●●●●●●</span>
              </el-form-item>
              <el-form-item label="所属系统：">
                <span>{{ details.application }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <file-host-update-modal host-type="windows" :visible.sync="detailsEditModal" @confirm="details = arguments[0]" :file-host-info="details"></file-host-update-modal>
      </div>
    </header>
    <el-tabs v-model="activeTab" @tab-click="switchPane">
      <el-tab-pane label="操作计划" name="plans">
        <el-form inline :model="planFilterForm" class="filter-form">
          <el-form-item label="隐藏已完成计划">
            <el-switch v-model="planFilterForm.hiddenCompletePlan"></el-switch>
          </el-form-item>
        </el-form>
        <backup-card :id="plan.id" :type="systemType" v-for="(plan, index) in filteredBackupPlans" :key="plan.id" :backupPlan="plan" @deletePlan="deleteBackupPlan(index)" @updatePlan="selectPlan(index)"></backup-card>
      </el-tab-pane>
      <el-tab-pane label="备份集" name="results">
        <el-form inline :model="resultFilterForm" class="filter-form" style="text-align: right;">
          <el-form-item>
            <el-button size="medium" type="text" @click="updateResults()">刷新</el-button>
          </el-form-item>
        </el-form>
        <backup-result-list :data="results" type="filehost"></backup-result-list>
      </el-tab-pane>
    </el-tabs>
    <add-backup-plan :type="systemType" :id="Number(id)" :visible.sync="planCreateModal" @confirm="addBackupPlan"></add-backup-plan>
    <update-backup-plan :type="systemType" :id="Number(id)" :visible.sync="planUpdateModal" :backup-plan="selectedPlan" @confirm="updateBackupPlan"></update-backup-plan>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import SpanToggle from '@/components/SpanToggle';
import FileHostUpdateModal from '@/components/modal/FileHostUpdateModal';
import BackupCard from '@/components/BackupCard';
import BackupResultList from '@/components/BackupResultList';
import AddBackupPlan from '@/components/AddBackupPlan';
import UpdateBackupPlan from '@/components/UpdateBackupPlan';
import { fileHostDetailMixin } from '../mixins/detailPageMixins';
import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
} from '../../api/fileHost';

export default {
  name: 'FileHostDetail',
  mixins: [fileHostDetailMixin],
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
    },
    switchPane({ name }) {
      if (name === 'results') {
        this.updateResults();
      }
    },
  },
  computed: {
    systemType() {
      return this.details && this.details.osName
        ? this.details.osName.toLowerCase()
        : '';
    },
  },
  components: {
    IIcon,
    FileHostUpdateModal,
    SpanToggle,
    BackupCard,
    BackupResultList,
    AddBackupPlan,
    UpdateBackupPlan,
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
.detail-panel {
  margin-left: 20px;
}
.action {
  text-align: right;
}
.detail-form .el-form-item {
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
