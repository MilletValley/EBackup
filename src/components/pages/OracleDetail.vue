<template>
  <section>
    <header class="detail-header">
      <div class="db-content">
        <el-row type="flex" justify="end">
          <el-col :span="1">
            <i-icon name="oracle"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex" align="middle">
              <el-col :span="8" class="title">
                <h1>{{dbInfo.name}}</h1>
              </el-col>
              <el-col :span="12" :offset="12" class="action">
                <el-button-group>
                  <el-button size="mini">操作1</el-button>
                  <el-button size="mini">操作2</el-button>
                </el-button-group>
                <el-button size="mini" type="primary" @click="dbEditModal = true">编辑</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="databaseInfoLoading" label-position="left" label-width="100px" inline size="small" class="database-info">
              <el-form-item label="Oracle版本">
                <span>{{ dbInfo.dbVersion }}</span>
              </el-form-item>
              <el-form-item label="数据库实例">
                <span>{{ dbInfo.instanceName }}</span>
              </el-form-item>
              <el-form-item label="归档模式：">
                <span>ARCHIVELOG</span>
              </el-form-item>
              <el-form-item label="数据库账号：">
                <span>{{ dbInfo.loginName }}</span>
              </el-form-item>
              <el-form-item label="数据库密码：">
                <!-- <span-toggle :value="oracle.password"></span-toggle> -->
                <span>{{ dbInfo.password }}</span>
              </el-form-item>
              <el-form-item label="主机名：">
                <span>{{ dbInfo.hostName }}</span>
              </el-form-item>
              <el-form-item label="操作系统：">
                <span>{{ dbInfo.osName }}</span>
              </el-form-item>
              <el-form-item label="主机IP：">
                <span>{{ dbInfo.hostIp }}</span>
              </el-form-item>
              <el-form-item label="所属系统：">
                <span>{{ dbInfo.application }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <database-update-modal db-type="oracle" :visible.sync="dbEditModal" :database-info="dbInfo" @confirm="dbInfo = arguments[0]"></database-update-modal>
      </div>
    </header>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="操作计划" name="plans">
        <main>
          <backup-card :id="id" :backupPlan="backupPlan" @deletePlan="this.backupPlan = {}"></backup-card>
        </main>
      </el-tab-pane>
      <el-tab-pane label="备份集" name="results">
        <backup-result-list :data="results"></backup-result-list>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import SpanToggle from '@/components/SpanToggle';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import BackupCard from '@/components/BackupCard';
import BackupResultList from '@/components/BackupResultList';
import { deleteBackupPlan } from '../../api/database';
import databaseDetailMixin from '../mixins/databaseDetailMixins';
import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
} from '../../api/oracle';
import { backupResultMapping } from '../../utils/constant';

export default {
  name: 'OracleDetail',
  mixins: [databaseDetailMixin],
  methods: {
    fetchData() {
      fetchOne(this.id)
        .then(res => {
          const { data: db } = res.data;
          this.dbInfo = db;
          this.databaseInfoLoading = false;
        })
        .then(() => {
          fetchBackupPlans(this.id).then(res => {
            const { data: plans } = res.data;
            if (plans.length > 0) {
              this.backupPlan = plans[0];
            }
          });
        })
        .then(() => {
          fetchBackupResults(this.id).then(res => {
            const { data: result } = res.data;
            this.results = result;
          });
        });
    },
  },
  components: {
    IIcon,
    DatabaseUpdateModal,
    SpanToggle,
    BackupCard,
    BackupResultList,
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
</style>
