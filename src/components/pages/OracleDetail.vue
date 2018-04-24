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
                <h1>{{oracle.name}}</h1>
              </el-col>
              <el-col :span="12" :offset="12" class="action">
                <el-button-group>
                  <el-button size="mini">操作1</el-button>
                  <el-button size="mini">操作2</el-button>
                </el-button-group>
                <el-button size="mini" type="primary" @click="dbEditBtnClick">编辑</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="databaseInfoLoading" label-position="left" label-width="100px" inline size="small" class="database-info">
              <el-form-item label="Oracle版本">
                <span>{{ oracle.dbVersion }}</span>
              </el-form-item>
              <el-form-item label="数据库实例">
                <span>{{ oracle.instanceName }}</span>
              </el-form-item>
              <el-form-item label="归档模式：">
                <span>ARCHIVELOG</span>
              </el-form-item>
              <el-form-item label="数据库账号：">
                <span>{{ oracle.loginName }}</span>
              </el-form-item>
              <el-form-item label="数据库密码：">
                <!-- <span-toggle :value="oracle.password"></span-toggle> -->
                <span>{{ oracle.password }}</span>
              </el-form-item>
              <el-form-item label="主机名：">
                <span>{{ oracle.hostName }}</span>
              </el-form-item>
              <el-form-item label="操作系统：">
                <span>{{ oracle.osName }}</span>
              </el-form-item>
              <el-form-item label="主机IP：">
                <span>{{ oracle.hostIp }}</span>
              </el-form-item>
              <el-form-item label="所属系统：">
                <span>{{ oracle.application }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <database-update-modal db-type="oracle" :visible.sync="dbEditModal" :database-info="oracle" @confirm="updateOracle"></database-update-modal>
      </div>
    </header>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="操作计划" name="plans">
        <main>
          <backup-card :id="id" :backupPlan="backupPlan" @deletePlan="deletePlan"></backup-card>
        </main>
      </el-tab-pane>
      <el-tab-pane label="备份集" name="results">
        <el-table :data="results" style="width: 100%; margin-top: 15px" :default-sort="{ prop: 'startTime', order: 'descending' }">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form inline label-width="70px" size="small" class="result-detail-form">
                <el-form-item label="ID">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="备份路径">
                  <span>{{ scope.row.path }}</span>
                </el-form-item>
                <el-form-item label="文件名">
                  <span>{{ scope.row.fileName }}</span>
                </el-form-item>
                <el-form-item label="开始时间">
                  <span>{{ scope.row.startTime }}</span>
                </el-form-item>
                <el-form-item label="大小">
                  <span>{{ scope.row.size }}</span>
                </el-form-item>
                <el-form-item label="结束时间">
                  <span>{{ scope.row.endTime }}</span>
                </el-form-item>
                <el-form-item label="状态">
                  <span>{{ stateConverter(scope.row.state) }}</span>
                </el-form-item>
                <el-form-item label="持续时间">
                  <span>{{ scope.row.consume | durationFilter }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="文件名" prop="fileName" width="180px" align="center"></el-table-column>
          <el-table-column label="开始时间" prop="startTime" min-width="200px" align="center"></el-table-column>
          <el-table-column label="结束时间" prop="endTime" min-width="200px" align="center"></el-table-column>
          <el-table-column label="大小" prop="size" width="70px" align="center"></el-table-column>
          <el-table-column label="状态" prop="state" width="70px" align="center">
            <template slot-scope="scope">
              <i :class="{ 'el-icon-success': scope.row.state === 0, 'el-icon-error': scope.row.state === 1 }"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="small">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import moment from 'moment';
import IIcon from '@/components/IIcon';
import SpanToggle from '@/components/SpanToggle';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import BackupCard from '@/components/BackupCard';
import { deleteBackupPlan } from '../../api/database';
import backupMixin from '../mixins/backupMixins';
import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
} from '../../api/oracle';
import { backupResultMapping } from '../../utils/constant';

export default {
  name: 'OracleDetail',
  mixins: [backupMixin],
  props: ['id'],
  data() {
    return {
      databaseInfoLoading: true, // 数据库信息loading
      activeTab: 'plans', // 激活的tab页
      oracle: {}, // 数据库信息
      backupPlan: {}, // 备份计划 { config, ...operation }
      results: [], // 备份集
      dbEditModal: false,
    };
  },
  computed: {
    oracleEdit: {
      get() {
        return this.oracle;
      },
      set(value) {},
    },
  },
  created() {
    this.fetchData();
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchData();
    next();
  },
  methods: {
    fetchData() {
      fetchOne(this.id)
        .then(res => {
          const { data: db } = res.data;
          this.oracle = db;
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
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    deletePlan() {
      this.backupPlan = {};
    },
    // 点击数据库编辑按钮
    dbEditBtnClick() {
      this.dbEditModal = true;
    },
    // 更新Oracle回调
    updateOracle(db) {
      this.oracle = db;
    },
  },
  components: {
    IIcon,
    DatabaseUpdateModal,
    SpanToggle,
    BackupCard,
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
  top: 12px;
  right: 10px;
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
.result-detail-form .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}
.result-detail-form .el-form-item:nth-child(2n) {
  width: 40%;
}
.el-icon-success {
  color: rgb(39, 202, 39);
}
.el-icon-error {
  color: rgb(202, 39, 39);
}
</style>
