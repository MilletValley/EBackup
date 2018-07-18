<template>
  <section>
    <el-row>
      <span class="title">设备详情</span>
      <el-button type="primary"
                 size="small"
                 style="float:right"
                 @click="$router.push({name: 'dashboard'})">返回</router-link></el-button>
    </el-row>
    <template>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="数据库备份" name="databaseBackup">
          <el-table :data="this.databaseBackup?
                           this.databaseBackup.slice((currentPage-1)*pagesize,currentPage*pagesize):
                           this.databaseBackup"
                    style="width: 100%">
            <el-table-column
              min-width="50"
              align="center"
              label="序号"
              fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
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
        <el-tab-pane label="数据库恢复" name="databaseRestore">
          <el-table
            :data="this.databaseRestore?
                   this.databaseRestore.slice((currentPage-1)*pagesize,currentPage*pagesize):
                   this.databaseRestore"
            style="width: 100%">
            <el-table-column
              min-width="50"
              align="center"
              label="序号"
              fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
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
        <el-tab-pane label="一键接管" name="initconnNum">
          <el-table
            :data="this.initconnNum?
                   this.initconnNum.slice((currentPage-1)*pagesize,currentPage*pagesize):
                   this.initconnNum"
            style="width: 100%">
            <el-table-column
              min-width="50"
              align="center"
              label="序号"
              fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
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
        <el-tab-pane label="文件备份" name="filehostBackup">
          <el-table :data="this.filehostBackup?
                           this.filehostBackup.slice((currentPage-1)*pagesize,currentPage*pagesize):
                           this.filehostBackup"
                    style="width: 100%">
            <el-table-column
              min-width="50"
              align="center"
              label="序号"
              fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
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
        <el-tab-pane label="文件恢复" name="filehostRestore">
          <el-table
            :data="this.filehostRestore?
                   this.filehostRestore.slice((currentPage-1)*pagesize,currentPage*pagesize):
                   this.filehostRestore"
            style="width: 100%">
            <el-table-column
              min-width="50"
              align="center"
              label="序号"
              fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
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
        <el-tab-pane label="虚拟机备份" name="vmBackup">
          <el-table :data="this.vmBackup?
                           this.vmBackup.slice((currentPage-1)*pagesize,currentPage*pagesize):
                           this.vmBackup"
                    style="width: 100%">
            <el-table-column
              min-width="50"
              align="center"
              label="序号"
              fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
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
        <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 15, 20]"
            :page-size="pagesize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalLength">
          </el-pagination>
        </div>
      </el-tabs>
    </template>
  </section>
</template>
<script>
import { fetchAll, fetchBackup, fetchRestore, fetchInitconn } from '../api/home';
import { backupStrategyMapping } from '../utils/constant';
import { linkStateMapping, databaseStateMapping } from '../utils/constant';
import baseMixin from './mixins/baseMixins';
export default {
  name: 'MoreState',
  data() {
    return {
      databaseBackup: [],
      databaseRestore: [],
      initconnNum: [],
      filehostBackup: [],
      filehostRestore: [],
      vmBackup: [],
      currentPage: 1,
      pagesize: 10,
      totalLength: 0,
      activeName: 'databaseBackup',
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
       fetchBackup()
      .then(res => {
        this.databaseBackup=this.filterArray(res.data.data,1);
        this.filehostBackup=this.filterArray(res.data.data,2);
        this.vmBackup=this.filterArray(res.data.data,3);
        this.totalLength = this.databaseBackup.length;
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
        })
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
      })
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
    handleClick(tab,event) {
      this.currentPage = 1;
      this.totalLength = this[tab.name].length;
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
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
.el-row {
  margin-bottom: 10px;
}
</style>
