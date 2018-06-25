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
              prop="backupType"
              label="备份策略"
              :formatter="backupItem"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupPath"
              :formatter="backupPath"
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
              label="归属名"
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
              label="归属名"
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
              prop="backupType"
              label="备份策略"
              :formatter="backupItem"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupPath"
              :formatter="backupPath"
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
              label="归属名"
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
              label="归属名"
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
              prop="backupType"
              label="备份策略"
              :formatter="backupItem"
              align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="backupPath"
              :formatter="backupPath"
              label="备份存储路径"
              align="center"
              min-width="180"
              fixed="right">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </template>
    <h4 style="margin: 15px; margin-left: 0;">设备信息</h4>
    <template>
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        style="width: 100%; ">
        <el-table-column
          prop="type"
          label="类型"
          align="center"
          min-width="120"
          fixed>
        </el-table-column>
        <el-table-column
          prop="osName"
          label="操作系统"
          align="center"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          align="center"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="user"
          label="账号"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          align="center"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="case"
          label="实例名"
          align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="登录名"
          align="center"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="loginPass"
          label="登录密码"
          align="center"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="defaultPass"
          label="模板默认密码"
          align="center"
          min-width="120"
          fixed="right">
        </el-table-column>
      </el-table>
    </template>
  </section>
</template>
<script>
import { fetchAll, fetchBackup, fetchRestore, fetchInitconn } from '../../api/home';
import { backupStrategyMapping } from '../../utils/constant';
import { linkStateMapping } from '../../utils/constant';
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
      tableData: [{
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '145.170.23.221',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '备份环境',
        case: '.',
        loginName: 'sa',
        loginPass: 'P@ssw0rd',
        defaultPass: 'Server@2008',
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '一键接管',
        case: '',
        loginName: '',
        loginPass: '',
        defaultPass: '',
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '易备无实例',
        case: '',
        loginName: '',
        loginPass: '',
        defaultPass: '',
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '145.170.23.223',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '恢复环境',
        case: '.',
        loginName: 'sa',
        loginPass: 'P@ssw0rd',
        defaultPass: 'Server@2008',
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '145.170.23.224',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
        case: '.',
        loginName: 'sa',
        loginPass: 'P@ssw0rd',
        defaultPass: 'Server@2008',
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '145.170.23.225',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
        case: '.',
        loginName: 'sa',
        loginPass: 'P@ssw0rd',
        defaultPass: 'Server@2008',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.226',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '备份环境',
        case: 'orcl',
        loginName: 'sys',
        loginPass: 'oracle',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.203',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '一键接管',
        case: 'orcl/orcltwo',
        loginName: 'sys',
        loginPass: 'oracle',
        defaultPass: '',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.205',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '易备无实例',
        case: '无',
        loginName: 'sys',
        loginPass: 'oracle',
        defaultPass: '',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.227',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '恢复环境',
        case: 'orcl',
        loginName: 'sys',
        loginPass: 'oracle',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.228',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
        case: 'orcl',
        loginName: 'sys',
        loginPass: 'oracle',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.229',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
        case: 'orcl',
        loginName: 'sys',
        loginPass: 'oracle',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.230',
        user: 'root',
        password: '123456',
        remark: '模拟生产',
        case: 'testdb',
        loginName: 'sys',
        loginPass: 'sys',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.202',
        user: 'root',
        password: '123456',
        remark: '一键接管',
        case: 'testdb/orcltwol',
        loginName: 'sys',
        loginPass: 'sys',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.204',
        user: 'root',
        password: '123456',
        remark: '易备无实例',
        case: '无',
        loginName: 'sys',
        loginPass: 'sys',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.231',
        user: 'root',
        password: '123456',
        remark: '恢复环境',
        case: 'testdb',
        loginName: 'sys',
        loginPass: 'sys',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.232',
        user: 'root',
        password: '123456',
        remark: '接管环境',
        case: 'testdb',
        loginName: 'sys',
        loginPass: 'sys',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.233',
        user: 'root',
        password: '123456',
        remark: '接管环境',
        case: 'testdb',
        loginName: 'sys',
        loginPass: 'sys',
      }, {
        type: '文件备份系统',
        osName: 'Windows2008',
        ip: '145.170.23.236',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '备份环境',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '文件备份系统',
        osName: 'Windows2008',
        ip: '145.170.23.237',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '恢复环境',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '文件备份系统',
        osName: 'Windows2010',
        ip: '145.170.23.238',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '共享',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '文件备份系统',
        osName: 'Linux Redhat6',
        ip: '145.170.23.241',
        user: 'root',
        password: '123456',
        remark: '备份环境',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '文件备份系统',
        osName: 'Linux Redhat6',
        ip: '145.170.23.242',
        user: 'root',
        password: '123456',
        remark: '恢复环境',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '开发部署',
        osName: 'Windows2008',
        ip: '145.170.23.239',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '数据库',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '开发部署',
        osName: 'Windows2008',
        ip: '145.170.23.240',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '服务端',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '开发部署',
        osName: 'Linux Redhat6',
        ip: '145.170.23.243',
        user: 'root',
        password: '123456',
        remark: '前端',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '共计',
        osName: '30',
        ip: '',
        user: '',
        password: '',
        remark: '',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '临时IP',
        osName: 'Windows2008',
        ip: '145.170.23.80',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '临时IP',
        osName: 'Windows2008',
        ip: '145.170.23.81',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '',
        case: '',
        loginName: '',
        loginPass: '',
      }, {
        type: '临时IP',
        osName: 'Linux Redhat6',
        ip: '145.170.23.82',
        user: 'root',
        password: '123456',
        remark: '',
        case: '',
        loginName: '',
        loginPass: '',
      },
      ]
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 6,
            colspan: 1
          };
        } else if(rowIndex === 6){
          return {
            rowspan: 12,
            colspan: 1
          };
        } else if(rowIndex === 18){
          return {
            rowspan: 5,
            colspan: 1
          };
        } else if(rowIndex === 23){
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if(rowIndex === 26){
          return {
            rowspan: 1,
            colspan: 1
          };
        } else if(rowIndex === 27){
          return {
            rowspan: 3,
            colspan: 1
          };
        }
         else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
       else if(columnIndex===1){
         if(rowIndex === 26){
          return {
            rowspan: 1,
            colspan: 5
          };
        }
      }
    },
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
      return data.filter(function(item) {
        return item.type === type;
      }).sort(function(a, b) {
        return Date.parse(b.endTime)-Date.parse(a.endTime);
      }).slice(0,5)
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
      return linkStateMapping[data.primaryState];
    },
    judgeVice(data) {
      return linkStateMapping[data.viceState];
    },
    judgeOver(data) {
      return linkStateMapping[data.overState];
    },
    backupPath(data) {
      return data.backupPath===null?'无':data.backupPath;
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
            name: '备份',
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
            name: '恢复',
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
