<template>
  <section>
    <h4>设备数量</h4>
    <template>
      <div style="overflow: hidden">
        <el-card class="box-card" style="float: left">
        <div slot="header" class="clearfix">
          <span>服务器</span>
        </div>
        <div class="text item">
          <div id="bieChart" :style="{width: '90%', height: '300px', margin: '0 auto'}"></div>
        </div>
      </el-card>
      <el-card class="box-card" style="float: right; position: relative">
        <div slot="header" class="clearfix">
          <span>一键接管</span>
        </div>
        <div class="text item" style="text-align: center; position: absolute; top: 50%; right: 50%; transform: translate(50%, -50%)">
          <span style="font-size: 26px; color: #6ab0b8">{{total.initConectNum}}</span>
        </div>
      </el-card>
      </div>
      <el-card class="box-card" style="width: 100%">
        <div slot="header" class="clearfix">
          <span>备份恢复</span>
        </div>
        <div class="text item">
          <div id="barChart" :style="{width: '100%', height: '300px', margin: '0 auto'}"></div>
        </div>
      </el-card>
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
import fetchAll from '../../api/total';
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/component/legend");
export default {
  name: 'Dashboard',
  created() {
    this.fetchData();
  },
  data() {
    return {
      total: {},
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
    },
    drawLine() {
       let barChart = echarts.init(document.getElementById('barChart'));
      let bieChart = echarts.init(document.getElementById('bieChart'))
      bieChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['oracle','sqlserver','文件服务器']
        },
        series : [
          {
            name: '服务器数量',
            type: 'pie',
            radius: '55%',
            data:[
              {value:this.total.oracleNum, name:'oracle'},
              {value:this.total.sqlserverNum, name:'sqlserver'},
              {value:this.total.fileNum, name:'文件服务器'},
            ],
            label: {formatter: "{b} : {c} ({d}%)"}
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
     }
   },
};
</script>
<style>
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
    width: 50%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 420px;
    display: inline-block;
  }
</style>
