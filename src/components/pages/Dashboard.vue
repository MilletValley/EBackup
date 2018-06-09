<template>
  <section>
    <h4>设备数量</h4>
    <template>
      <el-collapse>
        <el-collapse-item title="服务器" name="1">
          <div id="bieChart" :style="{width: '900px', height: '300px', margin: '0 auto'}"></div>
        </el-collapse-item>
        <el-collapse-item title="备份恢复" name="2">
          <div id="barChart" :style="{width: '800px', height: '300px', margin: '0 auto'}"></div>
        </el-collapse-item>
        <el-collapse-item title="一键接管" name="3">
          <div style="text-align: center">数量：{{total.initConectNum}}</div>
        </el-collapse-item>
      </el-collapse>
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
          align="center">
        </el-table-column>
        <el-table-column
          prop="osName"
          label="操作系统"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          align="center">
        </el-table-column>
        <el-table-column
          prop="user"
          label="账号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center">
        </el-table-column>
      </el-table>
    </template>
  </section>
</template>
<script>
import fetchAll from '../../api/total';
import echarts from 'echarts';
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
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '145.170.23.223',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '恢复环境',
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '145.170.23.224',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
      }, {
        type: 'SQLServer',
        osName: 'Windows2008',
        ip: '145.170.23.225',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.226',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '备份环境',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.227',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '恢复环境',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.228',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
      }, {
        type: 'Oracle',
        osName: 'Windows2008',
        ip: '145.170.23.229',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '接管环境',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.230',
        user: 'root',
        password: '123456',
        remark: '模拟生产',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.231',
        user: 'root',
        password: '123456',
        remark: '恢复环境',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.232',
        user: 'root',
        password: '123456',
        remark: '接管环境',
      }, {
        type: 'Oracle',
        osName: 'Linux Redhat6',
        ip: '145.170.23.233',
        user: 'root',
        password: '123456',
        remark: '接管环境',
      }, {
        type: '文件备份系统',
        osName: 'Windows2008',
        ip: '145.170.23.236',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '备份环境',
      }, {
        type: '文件备份系统',
        osName: 'Windows2008',
        ip: '145.170.23.237',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '恢复环境',
      }, {
        type: '文件备份系统',
        osName: 'Windows2010',
        ip: '145.170.23.238',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '共享',
      }, {
        type: '文件备份系统',
        osName: 'Linux Redhat6',
        ip: '145.170.23.241',
        user: 'root',
        password: '123456',
        remark: '备份环境',
      }, {
        type: '文件备份系统',
        osName: 'Linux Redhat6',
        ip: '145.170.23.242',
        user: 'root',
        password: '123456',
        remark: '恢复环境',
      }, {
        type: '开发部署',
        osName: 'Windows2008',
        ip: '145.170.23.239',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '数据库',
      }, {
        type: '开发部署',
        osName: 'Windows2008',
        ip: '145.170.23.240',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '服务端',
      }, {
        type: '开发部署',
        osName: 'Linux Redhat6',
        ip: '145.170.23.243',
        user: 'root',
        password: '123456',
        remark: '前端',
      }, {
        type: '临时IP',
        osName: 'Windows2008',
        ip: '145.170.23.80',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '',
      }, {
        type: '临时IP',
        osName: 'Windows2008',
        ip: '145.170.23.81',
        user: 'administrator',
        password: 'P@ssw0rd',
        remark: '',
      }, {
        type: '临时IP',
        osName: 'Linux Redhat6',
        ip: '145.170.23.82',
        user: 'root',
        password: '123456',
        remark: '',
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
            rowspan: 4,
            colspan: 1
          };
        } else if(rowIndex === 4){
          return {
            rowspan: 8,
            colspan: 1
          };
        } else if(rowIndex === 12){
          return {
            rowspan: 5,
            colspan: 1
          };
        } else if(rowIndex === 17){
          return {
            rowspan: 3,
            colspan: 1
          };
        } else if(rowIndex === 20){
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
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
.el-collapse .el-collapse-item__header {
  padding-left: 40px;
  color: #409eff;
  text-align: left;
}
</style>
