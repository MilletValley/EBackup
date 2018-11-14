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
               :before-leave="beforeTabLeave">
        <el-tab-pane label="数据库备份"
                     name="databaseBackup">
          <el-table :data="databaseBackup"
                    ref="databaseBackup"
                    style="width: 100%">
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             align="center"
                             show-overflow-tooltip
                             min-width="100"></el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="ddvType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             :filter-method="filterHandle"
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
                             show-overflow-tooltip
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
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
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
          <el-table :data="databaseRestore"
                    ref="databaseRestore"
                    style="width: 100%">
            <el-table-column label="名称"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="ddvType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             :filter-method="filterHandle"
                             min-width="120"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="180"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
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
          <el-table :data="initconnNum"
                    ref="initconnNum"
                    style="width: 100%">
            <el-table-column label="实例名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbTakeOverRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.instanceName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="primaryHostIp"
                             label="主机IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="主库状态"
                             align="center"
                             min-width="100"
                             :filters="dbStateFilter"
                             :filter-method="filterHandle">
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
                             :filters="dbStateFilter"
                             :filter-method="filterHandle"
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
                             :filters="dbLinkStateFilter"
                             :filter-method="filterHandle"
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
          <el-table :data="filehostBackup"
                    ref="filehostBackup"
                    style="width: 100%">
            <el-table-column label="名称"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="实例名"
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
                             show-overflow-tooltip
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
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
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
          <el-table :data="filehostRestore"
                    ref="filehostRestore"
                    style="width: 100%">
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
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
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
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
          <el-table :data="vmBackup"
                    ref="vmBackup"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="所属物理主机"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="ddvType"
                             :formatter="vmType"
                             :filters="vmTypeFilter"
                             :filter-method="filterHandle"
                             label="虚拟机类型"
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
                             show-overflow-tooltip
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
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
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
        <el-tab-pane label="虚拟机恢复"
                     name="vmRestore">
          <el-table :data="vmRestore"
                    ref="vmRestore"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="所属物理主机"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column prop="ddvType"
                             :formatter="vmType"
                             :filters="vmTypeFilter"
                             :filter-method="filterHandle"
                             label="虚拟机类型"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>           
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
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
      </el-tabs>
    </div>
  </section>
</template>
<script>
import { fetchAll } from '../../api/home';
import baseMixin from '../mixins/baseMixins';
import DashboardTab from '../mixins/DashboardTabMixins';
import echartsLiquidfill from 'echarts-liquidfill';
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
    calcPercent(success, fail) {
      return ((success/(success+fail))*100).toFixed(2);
    },
    drawLine() {
      let barChart = echarts.init(document.getElementById('barChart'));
      let restoreTotal = echarts.init(document.getElementById('restoreTotal'));
      let backupTotal = echarts.init(document.getElementById('backupTotal'));
      let initConn = echarts.init(document.getElementById('initConn'));
      let backupOption = {
        title: {
          top: '55%',
          left: 'center',
          text: '',
          textStyle: {
            color: '#333',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 14
          },
          subtext: '备份成功所占比例',
          subtextStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        legend: {
          orient: 'vertical',
          right: 'left',
          data: ['成功', '失败']
        },
        color: ['#27ca27', '#aaa'],
        tooltip: {
          trigger: 'item',
          formatter: function(res) {
            if (res.componentSubType == 'liquidFill') {
              return res.seriesName + ': ' + (res.value * 10000 / 100).toFixed(2) + '%';
            } else {
              return '<span class="ii" style="background:' + res.color + ' "></span>' + res.name +': '+ res.data.value + ' (' + res.percent + '%)<br/> ' +
                     '<p>oracle: '+res.data.explain.oracle+'</p>'+
                     '<p>sqlserver: '+res.data.explain.sqlserver+'</p>'+
                     '<p>文件: '+res.data.explain.filehost+'</p>'+
                     '<p>虚拟机: '+res.data.explain.vm+'</p>'
            }
          }
        },
        series: [
          {
            type: 'liquidFill',
            itemStyle: {
              normal: {
                opacity: 0.4,
                shadowColor: 'blue'
              }
            },
            radius: '60%',
            name: '备份成功',
            data: [{
              value: (this.calcPercent(this.total.totalBackupNumSuccess, this.total.totalBackupNumFail))/100,
              itemStyle: {
                normal: {
                  color: '#53d5ff',
                  opacity: 0.6
                }
              }
            }],
            background: '#fff',
            color: ['#53d5ff'],
            center: ['50%', '50%'],
            backgroundStyle: {
                color: '#fff'
            },
            // label: {
            //   normal: {
            //     formatter: '',
            //     textStyle: {
            //         fontSize: 12
            //     }
            //   }
            // },
            outline: {
              itemStyle: {
                borderColor: '#86c5ff',
                borderWidth: 0
              },
              borderDistance: 0
            }
          },
          {
            type: 'pie',
            radius: ['60%', '70%'],
            hoverAnimation: false, ////设置饼图默认的展开样式
            // label: {
            //   show: true,
            //   normal: {
            //     show: false,
            //     position: 'center'
            //   },
            // },
            labelLine: {
              normal: {
                show: true
              }
            },
            itemStyle: { // 此配置
              normal: {
                borderWidth: 2,
                borderColor: '#ffffff',
              },
              emphasis: {
                  borderWidth: 0,
                  shadowBlur: 2,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: [
            {
              value: this.total.totalBackupNumSuccess,
              name: '成功',
              label: {
                normal: {
                  formatter: '{b} : {c}'+'\n'+'{d}%'
                }
              },
              explain: {
                'oracle': this.total.oracleBackupNumSuccess,
                'sqlserver': this.total.sqlserverBackupNumSuccess,
                'filehost': this.total.fileBackupNumSuccess,
                'vm': this.total.vmBackupNumSuccess
              }
            },
            {
              value: this.total.totalBackupNumFail,
              name: '失败',
              label: {
                normal: {
                  formatter: '{b} : {c}'+'\n'+'{d}%'
                }
              },
              explain: {
                'oracle': this.total.oracleBackupNumFail,
                'sqlserver': this.total.sqlserverBackupNumFail,
                'filehost': this.total.fileBackupNumFail,
                'vm': this.total.vmBackupNumFail
              }
            }]
          }
        ]
      }
      let restoreOption = {
        title: {
          top: '55%',
          left: 'center',
          text: '',
          textStyle: {
            color: '#333',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 14
          },
          subtext: '恢复成功所占比例',
          subtextStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        legend: {
          orient: 'vertical',
          right: 'left',
          data: ['成功', '失败']
        },
        color: ['#27ca27', '#aaa'],
        tooltip: {
          trigger: 'item',
          formatter: function(res) {
            if (res.componentSubType == 'liquidFill') {
              return res.seriesName + ': ' + (res.value * 10000 / 100).toFixed(2) + '%';
            } else {
              return '<span class="ii" style="background:' + res.color + ' "></span>' + res.name +': '+ res.data.value + ' (' + res.percent + '%)<br/> ' +
                     '<p>oracle: '+res.data.explain.oracle+'</p>'+
                     '<p>sqlserver: '+res.data.explain.sqlserver+'</p>'+
                     '<p>文件: '+res.data.explain.filehost+'</p>'+
                     '<p>虚拟机: '+res.data.explain.vm+'</p>'
            }
          }
        },
        series: [{
          type: 'liquidFill',
          itemStyle: {
            normal: {
              opacity: 0.4,
              shadowColor: 'blue'
            }
          },
          radius: '60%',
          name: '恢复成功',
          data: [{
            value: (this.calcPercent(this.total.totalRestoreNumSuccess, this.total.totalRestoreNumFail))/100,
            itemStyle: {
              normal: {
                color: '#53d5ff',
                opacity: 0.6
              }
            }
          }],
          background: '#fff',
          color: ['#53d5ff'],
          center: ['50%', '50%'],
          backgroundStyle: {
              color: '#fff'
          },
          // label: {
          //   normal: {
          //     formatter: '',
          //     textStyle: {
          //         fontSize: 12
          //     }
          //   }
          // },
          outline: {
            itemStyle: {
              borderColor: '#86c5ff',
              borderWidth: 0
            },
            borderDistance: 0
          }
          },
          {
            type: 'pie',
            radius: ['60%', '70%'],
            hoverAnimation: false, ////设置饼图默认的展开样式
            // label: {
            //   show: true,
            //   normal: {
            //     show: false,
            //     position: 'center'
            //   },
            // },
            labelLine: {
              normal: {
                show: true
              }
            },
            itemStyle: { // 此配置
              normal: {
                borderWidth: 2,
                borderColor: '#ffffff',
              },
              emphasis: {
                  borderWidth: 0,
                  shadowBlur: 2,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: [
            {
              value: this.total.totalRestoreNumSuccess,
              name: '成功',
              dataType: 1,
              label: {
                normal: {
                  formatter: '{b} : {c}'+'\n'+'{d}%'
                }
              },
              explain: {
                'oracle': this.total.oracleRestoreNumSuccess,
                'sqlserver': this.total.sqlserverRestoreNumSuccess,
                'filehost': this.total.fileRestoreNumSuccess,
                'vm': this.total.vmRestoreNumSuccess
              }
            },
            {
              value: this.total.totalRestoreNumFail,
              name: '失败',
              label: {
                normal: {
                  formatter: '{b} : {c}'+'\n'+'{d}%'
                }
              },
              explain: {
                'oracle': this.total.oracleRestoreNumFail,
                'sqlserver': this.total.sqlserverRestoreNumFail,
                'filehost': this.total.fileRestoreNumFail,
                'vm': this.total.vmRestoreNumFail
              }
            }]
          }
        ]
      }
      let initConnOption = {
        title: {
          top: '55%',
          left: 'center',
          text: '',
          textStyle: {
            color: '#333',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 14
          },
          subtext: '接管成功所占比例',
          subtextStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        legend: {
          orient: 'vertical',
          right: 'left',
          data: ['成功', '失败']
        },
        color: ['#27ca27', '#aaa'],
        tooltip: {
          trigger: 'item',
          formatter: function(res) {
            if (res.componentSubType == 'liquidFill') {
              return res.seriesName + ': ' + (res.value * 10000 / 100).toFixed(2) + '%';
            } else {
              return '<span class="ii" style="background:' + res.color + ' "></span>' + res.name +': '+ res.data.value + ' (' + res.percent + '%)<br/> '
            }
          }
        },
        series: [{
          type: 'liquidFill',
          itemStyle: {
            normal: {
              opacity: 0.4,
              shadowColor: 'blue'
            }
          },
          radius: '60%',
          name: '接管成功',
          data: [{
            value: (this.calcPercent(this.total.initConnNumSuccess, this.total.initConnNumFail))/100,
            itemStyle: {
              normal: {
                color: '#53d5ff',
                opacity: 0.6
              }
            }
          }],
          background: '#fff',
          color: ['#53d5ff'],
          center: ['50%', '50%'],
          backgroundStyle: {
              color: '#fff'
          },
          // label: {
          //   normal: {
          //     formatter: '',
          //     textStyle: {
          //         fontSize: 12
          //     }
          //   }
          // },
          outline: {
            itemStyle: {
              borderColor: '#86c5ff',
              borderWidth: 0
            },
            borderDistance: 0
          }
          },
          {
            type: 'pie',
            radius: ['60%', '70%'],
            hoverAnimation: false, ////设置饼图默认的展开样式
            // label: {
            //   show: true,
            //   normal: {
            //     show: false,
            //     position: 'center'
            //   },
            // },
            labelLine: {
              normal: {
                show: true
              }
            },
            itemStyle: { // 此配置
              normal: {
                borderWidth: 2,
                borderColor: '#ffffff',
              },
              emphasis: {
                  borderWidth: 0,
                  shadowBlur: 2,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: [
            {
              value: this.total.initConnNumSuccess,
              name: '成功',
              label: {
                normal: {
                  formatter: '{b} : {c}'+'\n'+'{d}%'
                }
              },
            },
            {
              value: this.total.initConnNumFail,
              name: '失败',
              label: {
                normal: {
                  formatter: '{b} : {c}'+'\n'+'{d}%'
                }
              },
            }]
          }
        ]
      }
      backupTotal.setOption(backupOption),
      restoreTotal.setOption(restoreOption),
      initConn.setOption(initConnOption),
      backupTotal.on('click', params => {
        // const success = backupOption.series[1].data[0].name;
        // const error = backupOption.series[1].data[1].name;
        if(params.name.includes('成功')) {
          alert('备份成功');
        } else if(params.name.includes('失败')) {
          alert('备份失败');
        } else {
        }
      }),
      restoreTotal.on('click', params => {
        // console.log(params)
      }),
      initConn.on('click', params => {
        // console.log(params)
      }),
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
<style lang="scss" module>
@import '../../style/common.scss';
$success-color: rgba(145, 199, 174, 1);
$error-color: rgba(212, 130, 101, 1);
</style>
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
