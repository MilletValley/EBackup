<template>
  <section>
    <template>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-title">数据备份</span>
            </div>
            <div class="text item">
              <div id="backupTotal" :style="{width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-title">恢复演练</span>
            </div>
            <div class="text item">
              <div id="restoreTotal" :style="{width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="card-title">一键接管</span>
            </div>
            <div class="text item">
              <div id="initConn" :style="{width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-card class="box-card" style="width: 100%">
          <div slot="header" class="clearfix">
            <span class="card-title">备份恢复</span>
          </div>
          <div class="text item">
            <div id="barChart" :style="{width: '100%', height: '300%', margin: '0 auto'}"></div>
          </div>
        </el-card>
      </el-row>
    </template>
    <el-row>
      <span class="title">设备状态</span>
    </el-row>
    <div style="position:relative">
      <el-button type="info"
                 size="small"
                 plain
                 style="position: absolute; top:3px; right:3px; z-index: 10"
                 @click="$router.push({
                 path: 'morestate',
                 query: { activeName: activeName }})">MORE</el-button>
      <el-tabs type="border-card"
               v-model="activeName"
               @tab-click="tabClick"
               :before-leave="beforeTabLeave">
        <el-tab-pane label="数据库备份"
                     name="databaseBackup">
          <el-table :data="filterTableData"
                    @filter-change="stateFilterChange"
                    ref="databaseBackup"
                    style="width: 100%">
            <el-table-column prop="ascription"
                             label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             align="center"
                             show-overflow-tooltip
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterState"
                             column-key="databaseBackupState"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据库恢复"
                     name="databaseRestore">
          <el-table :data="filterTableData"
                    @filter-change="stateFilterChange"
                    ref="databaseRestore"
                    style="width: 100%">
            <el-table-column prop="ascription"
                             label="名称"
                             align="center"
                             show-overflow-tooltip
                             min-width="180"></el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>            
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="恢复结果"
                             prop="restoreState"
                             :filters="filterState"
                             column-key="databaseRestoreState"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="一键接管"
                     name="initconnNum">
          <el-table :data="filterTableData"
                    ref="initconnNum"
                    @filter-change="stateFilterChange"
                    style="width: 100%">
            <el-table-column prop="instanceName"
                             label="实例名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="primaryHostIp"
                             label="主机IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="主库状态"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="stateTagType(scope.row.primaryState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.row.primaryState) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="viceHostIp"
                             label="备库IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备库状态"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="stateTagType(scope.row.viceState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.row.viceState) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="连接状态"
                             prop="overState"
                             :filters="takeoverFilterState"
                             column-key="initconnNumState"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="linkTagType(scope.row.overState)"
                        size="mini">
                  {{ linkTypeConverter(scope.row.overState) }}
                </el-tag>
              </template>              
            </el-table-column>
            <el-table-column label="初始化完成时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.initFinishTime }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件备份"
                     name="filehostBackup">
          <el-table :data="filterTableData"
                    @filter-change="stateFilterChange"
                    ref="filehostBackup"
                    style="width: 100%">
            <el-table-column prop="ascription"
                             label="名称"
                             align="center"
                             show-overflow-tooltip
                             min-width="100"></el-table-column>
            <el-table-column prop="name"
                             label="主机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterState"
                             column-key="filehostBackupState"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件恢复"
                     name="filehostRestore">
          <el-table :data="filterTableData"
                    @filter-change="stateFilterChange"
                    ref="filehostRestore"
                    style="width: 100%">
            <el-table-column prop="ascription"
                             label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>           
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="恢复结果"
                             prop="restoreState"
                             :filters="filterState"
                             column-key="filehostRestoreState"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟机备份"
                     name="vmBackup">
          <el-table :data="filterTableData"
                    @filter-change="stateFilterChange"
                    ref="vmBackup"
                    style="width: 100%">
            <el-table-column prop="ascription"
                             label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="name"
                             label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterState"
                             column-key="vmBackupState"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import { fetchAll } from '../../api/home';
import { backupStrategyMapping, databaseTypeMapping } from '../../utils/constant';
import baseMixin from '../mixins/baseMixins';
import DashboardTab from '../mixins/DashboardTabMixins'
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/component/legend");
export default {
  name: 'Dashboard',
  mixins: [baseMixin, DashboardTab],
  created() {
    this.fetchData();
    this.fetchTabData();
    this.activeName = 'databaseBackup'
  },
  data() {
    return {
      total: {},
    };
  },
  computed: {
    labelNum() {
      return {
        normal: {
          show: true,
          position: 'top',
          textStyle: {
            color: 'black'
          }
        }
      }
    },
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.total = data;
          this.drawLine();
        })
        .catch(error => {
          error => Promise.reject(error);
        });
    },
    tabClick() {
      this.filterTableData = this.currentTableData;
    },
    drawLine() {
      let barChart = echarts.init(document.getElementById('barChart'));
      let restoreTotal = echarts.init(document.getElementById('restoreTotal'));
      let backupTotal = echarts.init(document.getElementById('backupTotal'));
      let initConn = echarts.init(document.getElementById('initConn'));
      restoreTotal.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a}{b} : {c} ({d}%)"
        },
        series : [
          {
            name: '恢复',
            type: 'pie',
            radius: '80%',
            center: ['50%','50%'],
            data:[
              {
                value:this.total.totalRestoreNumSuccess,
                name:'成功',
                itemStyle: {
                  color: '#27ca27'
                }
              },
              {
                value:this.total.totalRestoreNumFail,
                name:'失败',
                itemStyle: {
                  color: '#ca2727'
                }
              }
            ],
            label:{
              normal:{
                show:true,
                position:'inner',
                formatter:'{c}\n',
                length: 20,
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 32,
                }
              }
            },
            labelLine: {
            normal: {
                show: false
            }
        },
          }
        ]
      })
      backupTotal.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a}{b} : {c} ({d}%)"
        },
        series : [
          {
            name: '备份',
            type: 'pie',
            radius: '80%',
            center: ['50%','50%'],
            data:[
              {
                value:this.total.totalBackupNumSuccess,
                name:'成功',
                itemStyle: {
                  color: '#27ca27'
                }
              },
              {
                value:this.total.totalBackupNumFail,
                name:'失败',
                itemStyle: {
                  color: '#ca2727'
                }
              }
            ],
            label: {
              normal:{
                show:true,
                position:'inner',
                formatter:'{c}\n',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 32
                }
              }
            }
          }
        ]
      })
      initConn.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a}{b} : {c} ({d}%)"
        },
        series : [
          {
            name: '一键接管',
            type: 'pie',
            radius: '80%',
            center: ['50%','50%'],
            data:[
              {
                value:this.total.initConnNumSuccess,
                name:'正常',
                itemStyle: {
                  color: '#27ca27'
                }
              },
              {
                value:this.total.initConnNumFail,
                name:'异常',
                itemStyle: {
                  color: '#ca2727'
                }
              }
            ],
            label: {
              normal:{
                show:true,
                position:'inner',
                formatter:'{c}\n',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 32
                }
              }
            }
          }
        ]
      })
      barChart.setOption({
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '备份成功', '备份失败', '恢复成功', '恢复失败'],
            ['oracle', this.total.oracleBackupNumSuccess, this.total.oracleBackupNumFail, this.total.oracleRestoreNumSuccess, this.total.oracleRestoreNumFail],
            ['sqlserver', this.total.sqlserverBackupNumSuccess, this.total.sqlserverBackupNumFail, this.total.sqlserverRestoreNumSuccess, this.total.sqlserverRestoreNumFail],
            ['文件', this.total.fileBackupNumSuccess, this.total.fileBackupNumFail, this.total.fileRestoreNumSuccess, this.total.fileRestoreNumFail],
            ['虚拟机', this.total.vmBackupNumSuccess, this.total.vmBackupNumFail, this.total.vmRestoreNumSuccess, this.total.vmRestoreNumFail],
          ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
            {
              type: 'bar',
              label: this.labelNum,
            },
            {
              type: 'bar',
              label: this.labelNum,
            },
            {
              type: 'bar',
              label: this.labelNum,
            },
            {
              type: 'bar',
              label: this.labelNum,
            },
        ]
      });
      window.addEventListener("resize", function () {
        barChart.resize();
        restoreTotal.resize();
        backupTotal.resize();
        initConn.resize();
     });
     }
   },
};
</script>
<style scoped>
.title {
  font-weight: 400;
  color: #606266;
  padding-top: 0.5em;
  display: inline-block;
}

.text {
    font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  height: 420px;
}

#barChart div {
  margin: 0 auto
}

.card-title {
  display: block;
  text-align: center;
  font-weight: 700;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
