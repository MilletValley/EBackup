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
    <h4>设备状态</h4>
    <template>
      <el-tabs type="border-card">
        <el-tab-pane label="数据库备份">
          <el-table
            :data="this.databaseBackup"
            style="width: 100%">
            <el-table-column
              type="index"
              min-width="50"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              prop="ascription"
              label="名称"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="数据库名"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="备份结束时间"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="timeConsuming"
              :formatter="timeConsuming"
              label="耗时"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupSize"
              label="备份集大小"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupState"
              label="状态"
              align="center"
              min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="backupPath"
              label="备份存储路径"
              align="center"
              min-width="180"
              fixed="right">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据库恢复">
          <el-table
            :data="this.databaseRestore"
            style="width: 100%">
            <el-table-column
              type="index"
              min-width="50"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              prop="ascription"
              label="名称"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="数据库名"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="恢复结束时间"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="timeConsuming"
              :formatter="timeConsuming"
              label="耗时"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="restoreState"
              label="恢复结果"
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
        <el-tab-pane label="一键接管">
          <el-table
            :data="this.initconnNum"
            style="width: 100%">
            <el-table-column
              type="index"
              min-width="50"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              prop="instanceName"
              label="实例名"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="primaryHostIp"
              label="主机IP"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="primaryState"
              label="主库状态"
              align="center"
              :formatter="judgePrimary"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="viceHostIp"
              label="备库IP"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="viceState"
              label="备库状态"
              align="center"
              min-width="100"
              :formatter="judgeVice">
            </el-table-column>
            <el-table-column
              prop="overState"
              label="连接状态"
              align="center"
              :formatter="judgeOver"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="initFinishTime"
              label="初始化完成时间"
              align="center"
              min-width="100">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件备份">
          <el-table
            :data="this.filehostBackup"
            style="width: 100%">
            <el-table-column
              type="index"
              min-width="50"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              prop="ascription"
              label="名称"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="实例名"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="备份结束时间"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="timeConsuming"
              :formatter="timeConsuming"
              label="耗时"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupSize"
              label="备份集大小"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupState"
              label="状态"
              align="center"
              min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="backupPath"
              label="备份存储路径"
              align="center"
              min-width="180"
              fixed="right">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件恢复">
          <el-table
            :data="this.filehostRestore"
            style="width: 100%">
            <el-table-column
              type="index"
              min-width="50"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              prop="ascription"
              label="名称"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="数据库名"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="恢复结束时间"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="timeConsuming"
              :formatter="timeConsuming"
              label="耗时"
              align="center"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="restoreState"
              label="恢复结果"
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
        <el-tab-pane label="虚拟机备份">
          <el-table
            :data="this.vmBackup"
            style="width: 100%">
            <el-table-column
              type="index"
              min-width="50"
              align="center"
              fixed>
            </el-table-column>
            <el-table-column
              prop="ascription"
              label="名称"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="虚拟机名"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="备份结束时间"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="timeConsuming"
              :formatter="timeConsuming"
              label="耗时"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupSize"
              label="备份集大小"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupState"
              label="状态"
              align="center"
              min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="backupPath"
              label="备份存储路径"
              align="center"
              min-width="180"
              fixed="right">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </template>
  </section>
</template>
<script>
import { fetchAll, fetchBackup, fetchRestore, fetchInitconn } from '../../api/home';
import { backupStrategyMapping } from '../../utils/constant';
import { linkStateMapping, databaseStateMapping } from '../../utils/constant';
import baseMixin from '../mixins/baseMixins';
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/component/legend");
export default {
  name: 'Dashboard',
  mixins: [baseMixin],
  created() {
    this.fetchData();
  },
  data() {
    return {
      total: {},
      databaseBackup: [],
      databaseRestore: [],
      initconnNum: [],
      filehostBackup: [],
      filehostRestore: [],
      vmBackup: [],
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
    }
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
      fetchBackup()
      .then(res => {
        this.databaseBackup=this.filterArray(res.data.data,1);
        this.filehostBackup=this.filterArray(res.data.data,2);
        this.vmBackup=this.filterArray(res.data.data,3);
      })
      .catch(error => {
        error => Promise.reject(error);
      });
      fetchRestore()
      .then(res => {
        this.databaseRestore=this.filterArray(res.data.data,1);
        this.filehostRestore=this.filterArray(res.data.data,2);
      })
      .catch(error => {
        error => Promise.reject(error);
      });
      fetchInitconn()
      .then(res => {
        this.initconnNum=res.data.data.sort(function(a, b) {
        return Date.parse(b.initFinishTime)-Date.parse(a.initFinishTime);
      }).slice(0,5)
      })
      .catch(error => {
        error => Promise.reject(error);
      });
    },
    filterArray(data, type) {
      data.map(function(item) {
        for(let i in item) {
          item[i]=(item[i]===null||item[i]==='null')?'':item[i];
        }
      });
      return data.filter(function(item) {
        return item.type === type;
      }).sort(function(a, b) {
        return Date.parse(b.endTime)-Date.parse(a.endTime);
      }).slice(0,5);
    },
    backupItem(data) {
      return backupStrategyMapping[data.backupType];
    },
    timeConsuming(data) {
      const hourSeconds = 60 * 60;
      const minuteSeconds = 60;
      const h = Math.floor(data.timeConsuming / hourSeconds);
      const m = Math.floor((data.timeConsuming % hourSeconds) / minuteSeconds);
      const s = data.timeConsuming % minuteSeconds;
      return `${h ? `${h}小时` : ''}${m ? `${m}分` : ''}${s ? `${s}秒` : ''} `;
    },
    judgePrimary(data) {
      return databaseStateMapping[data.primaryState];
    },
    judgeVice(data) {
      return databaseStateMapping[data.viceState];
    },
    judgeOver(data) {
      return linkStateMapping[data.overState];
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
h4 {
  font-weight: 400;
  color: #606266;
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
