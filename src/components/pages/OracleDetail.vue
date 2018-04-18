<template>
  <section>
    <header class="detail-header">
      <div class="db-content">
        <el-row type="flex" align="middle">
          <el-col :span="8" class="title">
            <h1>数据库名称标识</h1>
          </el-col>
          <el-col :span="8" :offset="16" class="action">
            <el-button-group>
              <el-button size="mini">操作1</el-button>
              <el-button size="mini">操作2</el-button>
            </el-button-group>
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
        <!-- <el-row type="flex">
          <el-col :span="8">
            <div class="info">
              <h4>Oracle版本：</h4>
              <span>{{oracle.dbVersion}}</span>
            </div>
            <div class="info">
              <h4>数据库实例：</h4>
              <span>{{oracle.instanceName}}</span>
            </div>
            <div class="info">
              <h4>归档模式：</h4>
              <span>ARCHIVELOG</span>
            </div>
            <div class="info">
              <h4>数据库账号：</h4>
              <span>{{oracle.loginName}}</span>
            </div>
            <div class="info">
              <h4>数据库密码：</h4>
              <span>{{oracle.password}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info">
              <h4>主机名：</h4>
              <span>{{oracle.hostName}}</span>
            </div>
            <div class="info">
              <h4>操作系统：</h4>
              <span>{{oracle.osName}}</span>
            </div>
            <div class="info">
              <h4>主机IP：</h4>
              <span>{{oracle.hostIp}}</span>
            </div>
            <div class="info">
              <h4>所属系统：</h4>
              <span>{{oracle.application}}</span>
            </div>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row> -->
      </div>
    </header>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="操作计划" name="plans">
        <main>
          <el-card class="backup-card">
            <div slot="header" class="clearfix">
              <span>备份配置001</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <el-row type="flex">
              <el-col :span="18">
                <div class="info" style="margin-bottom: 15px">
                  <h4>计划开始时间:</h4>
                  <span>{{backupConfig.startTime}}</span>
                </div>
                <el-row type="flex">
                  <!-- <el-col :span="8">
                
              </el-col> -->
                  <el-col :span="10">
                    <div class="info">
                      <h4>备份策略:</h4>
                      <span>{{backupStrategy}}</span>
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div class="info">
                      <h4>时间策略:</h4>
                      <span>{{timeStrateg}}</span>
                    </div>
                  </el-col>
                </el-row>
                <div v-if="backupConfig.timeStrategy === 0" class="single points">
                  <h4>星期：</h4>
                  <div>
                    <el-tag>2018-04-21 14:00</el-tag>
                  </div>
                </div>
                <div v-if="backupConfig.timeStrategy === 2" class="weeks points">
                  <h4>星期：</h4>
                  <div>
                    <el-tag v-for="point in weekPoints" :key="point" size="small">{{point}}</el-tag>
                  </div>
                </div>
                <div v-if="backupConfig.timeStrategy === 3" class="days points">
                  <h4>日期：</h4>
                  <div>
                    <el-tag v-for="point in backupConfig.datePoints" :key="point" size="small">{{point}}</el-tag>
                  </div>
                </div>
                <div v-if="[1,2,3].indexOf(backupConfig.timeStrategy) >= 0" class="times points">
                  <h4>时间：</h4>
                  <div>
                    <el-tag v-for="point in backupConfig.timePoints" :key="point" size="small">{{point}}</el-tag>
                  </div>
                </div>
                <div v-if="backupConfig.timeStrategy === 4" class="interval points">
                  <h4>间隔：</h4>
                  <div>
                    <el-tag>{{backupConfig.timeInterval}}</el-tag>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" class="operation-info">
                <ul style="list-style: none">
                  <li>
                    <h5>当前状态</h5>
                    <div>{{operationState}}</div>
                  </li>
                  <li>
                    <h5>备份开始时间</h5>
                    <div>{{backupOperation.startTime}}</div>
                  </li>
                  <li>
                    <h5>已持续时间</h5>
                    <div>{{backupOperation.consume}}</div>
                  </li>
                  <li>
                    <h5>已备份大小</h5>
                    <div>{{backupOperation.size}}</div>
                  </li>
                </ul>

              </el-col>
            </el-row>
          </el-card>
        </main>
      </el-tab-pane>
      <el-tab-pane label="备份集" name="results">
        <el-table :data="results" style="width: 100%; margin-top: 15px">
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
                  <span>{{ scope.row.state }}</span>
                </el-form-item>
                <el-form-item label="持续时间">
                  <span>{{ scope.row.consume }}</span>
                </el-form-item>
              </el-form>
            </template>

          </el-table-column>
          <el-table-column label="文件名" prop="fileName" width="180px" align="center"></el-table-column>
          <el-table-column label="开始时间" prop="startTime" min-width="200px" align="center"></el-table-column>
          <el-table-column label="结束时间" prop="endTime" min-width="200px" align="center"></el-table-column>
          <el-table-column label="大小" prop="size" width="70px" :formatter="sizeFormatter" align="center"></el-table-column>
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
} from '../../utils/constant';
export default {
  name: 'OracleDetail',
  props: ['id'],
  data() {
    return {
      databaseInfoLoading: true,
      activeTab: 'plans',
      oracle: {},
      backupConfig: {},
      backupOperation: {},
      results: [],
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
    sizeFormatter(row, column, cellValue) {
      return (cellValue / 1024).toFixed(2) + 'M';
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
h4 {
  font-weight: 400;
  margin: 5px;
  width: 100px;
  display: inline-block;
}
.el-tabs {
  margin-top: -39px;
}
.backup-card {
  margin-top: 15px;
}
.backup-card h4 {
  width: 110px;
  text-align: center;
}
.points {
  margin-top: 15px;
}
.points div {
  display: inline-block;
}
.operation-info h5 {
  font-weight: 400;
  color: #888888;
  margin: 5px 0;
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
  margin: 5px 0;
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
