<template>
  <section>
    <header class="detail-header">
      <div class="db-content">
        <!-- <div style="width: 50px; float: left;">
          <i-icon name="oracle"></i-icon>
        </div> -->
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
        <db-update-modal db-type="oracle" :visible.sync="dbEditModal" :database-info="oracle" @confirm="updateOracle"></db-update-modal>
      </div>
    </header>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="操作计划" name="plans">
        <main>
          <el-card class="backup-card" v-if="backupOperation.id && backupConfig.id">
            <div slot="header" class="clearfix">
              <span>{{backupOperation.name}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="planDeleteBtnClick">删除</el-button>
              <el-button style="float: right; padding: 3px 3px" type="text">编辑</el-button>
            </div>

            <el-row type="flex">
              <el-col :span="18">
                <el-form inline label-width="100px" size="mini">
                  <el-form-item label="计划开始时间" style="width: 100%">
                    <span>{{ backupConfig.startTime }}</span>
                  </el-form-item>
                  <el-form-item label="备份策略" style="width: 40%">
                    <span>{{ backupStrategy }}</span>
                  </el-form-item>
                  <el-form-item label="时间策略" style="width: 40%">
                    <span>{{ timeStrateg }}</span>
                  </el-form-item>
                  <el-form-item label="星期" v-if="backupConfig.timeStrategy === 2" style="width: 100%">
                    <div>
                      <el-tag v-for="point in weekPoints" :key="point" size="small">{{point}}</el-tag>
                    </div>
                  </el-form-item>
                  <el-form-item label="日期" v-if="backupConfig.timeStrategy === 3" style="width: 100%">
                    <div>
                      <el-tag v-for="point in backupConfig.datePoints" :key="point" size="small">{{point}}</el-tag>
                    </div>
                  </el-form-item>
                  <el-form-item label="时间" v-if="[1,2,3].indexOf(backupConfig.timeStrategy) >= 0" style="width: 100%">
                    <div>
                      <el-tag v-for="point in backupConfig.timePoints" :key="point" size="small">{{point}}</el-tag>
                    </div>
                  </el-form-item>
                  <el-form-item label="间隔" v-if="backupConfig.timeStrategy === 4" style="width: 100%">
                    <div>
                      <el-tag size="small">{{backupConfig.timeInterval}}小时</el-tag>
                    </div>
                  </el-form-item>
                  <el-form-item label="备份路径">
                    <span>{{ backupConfig.backupUrl }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="6" class="operation-info">
                <ul style="list-style: none">
                  <li>
                    <h5>当前状态</h5>
                    <div>{{operationState || '-'}}</div>
                  </li>
                  <li>
                    <h5>备份开始时间</h5>
                    <div>{{backupOperation.startTime || '备份未开始'}}</div>
                  </li>
                  <li>
                    <h5>已持续时间</h5>
                    <div v-if="backupOperation.consume">{{backupOperation.consume | durationFilter}}</div>
                    <div v-else>-</div>
                  </li>
                  <li>
                    <h5>已备份大小</h5>
                    <div>{{backupOperation.size || '-'}}</div>
                  </li>
                </ul>
              </el-col>
            </el-row>
          </el-card>
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
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import { deleteBackupPlan } from '../../api/database';
import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
} from '../../api/oracle';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
  backupResultMapping,
} from '../../utils/constant';

export default {
  name: 'OracleDetail',
  props: ['id'],
  data() {
    return {
      databaseInfoLoading: true, // 数据库信息loading
      activeTab: 'plans', // 激活的tab页
      oracle: {}, // 数据库信息
      backupConfig: {}, // 备份配置数据
      backupOperation: {}, // 备份操作数据
      results: [], // 备份集
      dbEditModal: false,
    };
  },
  computed: {
    backupStrategy() {
      return backupStrategyMapping[this.backupConfig.backupStrategy];
    },
    timeStrateg() {
      return timeStrategyMapping[this.backupConfig.timeStrategy];
    },
    weekPoints() {
      return this.backupConfig.weekPoints.map(p => weekMapping[p]);
    },
    operationState() {
      return operationStateMapping[this.backupOperation.state];
    },
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
              const { config, ...operation } = plans[0];
              this.backupOperation = operation;
              this.backupConfig = config;
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
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    planDeleteBtnClick() {
      this.$confirm('即将删除该备份计划，是否继续？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          deleteBackupPlan(this.id).then(() => {
            this.backupConfig = {};
            this.backupOperation = {};
            this.$message({
              type: 'success',
              message: '删除成功',
            });
          });
        })
        .catch(() => {});
    },
    dbEditBtnClick() {
      this.dbEditModal = true;
    },
    updateOracle(db) {
      this.oracle = db;
    },
  },
  filters: {
    durationFilter(value) {
      const duration = moment.duration(value, 's');
      const h = duration.get('h');
      const m = duration.get('m');
      const s = duration.get('s');
      return `${h ? h + '小时' : ''} ${m ? m + '分' : ''} ${
        s ? s + '秒' : ''
      } `;
    },
  },
  components: {
    'i-icon': IIcon,
    'db-update-modal': DatabaseUpdateModal,
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
.backup-card {
  margin-top: 15px;
}
.operation-info h5 {
  font-weight: 400;
  color: #888888;
  margin: 4px 0;
  text-align: right;
}
.operation-info div {
  margin-left: 5px;
  text-align: right;
}
.operation-info ul {
  list-style: none;
  margin: 0;
}
.operation-info li {
  margin: 10px 0;
}
/* 标签之间的间隔在for循环下消失了 */
.el-tag {
  margin: 0 2px;
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
