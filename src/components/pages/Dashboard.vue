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
        style="width: 100%; ">
        <el-table-column
          prop="use"
          label="用途"
          align="center">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP"
          align="center">
        </el-table-column>
        <el-table-column
          prop="user"
          label="用户名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="password"
          label="密码"
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
        use: 'windows-Orcale测试服务器',
        ip: '145.170.23.57',
        user: 'administrator',
        password: 'P@ssw0rd',
      }, {
        use: 'windows-Orcale测试服务器',
        ip: '145.170.23.127',
        user: 'administrator',
        password: 'P@ssw0rd',
      }, {
        use: 'windows-Sqlservcer代理端服务器',
        ip: '145.170.23.106',
        user: 'administrator',
        password: 'P@ssw0rd',
      }, {
        use: 'windows文件测试服务器',
        ip: '145.170.23.130',
        user: 'administrator',
        password: 'P@ssw0rd',
      }, {
        use: 'linux-oracle测试服务器',
        ip: '145.170.23.137',
        user: 'root',
        password: '123456',
      }, {
        use: 'linux-oracle测试服务器',
        ip: '145.170.23.141',
        user: 'root',
        password: '123456',
      }, {
        use: 'linux-oracle测试服务器',
        ip: '145.170.23.142',
        user: 'root',
        password: '123456',
      }, {
        use: 'linux-oracle测试服务器',
        ip: '145.170.23.145',
        user: 'root',
        password: '123456',
      }, {
        use: 'windows文件备份测试服务器',
        ip: '145.170.23.190',
        user: 'administrator',
        password: 'P@ssw0rd',
      }, {
        use: 'windows文件备份测试服务器',
        ip: '145.170.23.191',
        user: 'administrator',
        password: 'P@ssw0rd',
      }, {
        use: 'windows文件备份测试服务器',
        ip: '145.170.23.192',
        user: 'administrator',
        password: 'P@ssw0rd',
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
