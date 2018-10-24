<template>
  <section>
    <el-row>
      <span class="title">设备详情</span>
      <el-button type="primary"
                 size="small"
                 style="float:right"
                 @click="$router.push({name: 'dashboard'})">返回</el-button>
    </el-row>
    <template>
      <el-tabs type="border-card"
               v-model="activeName"
               @tab-click="handleClick"
               :before-leave="beforeTabLeave">
        <el-tab-pane label="数据库备份"
                     name="databaseBackup">
          <el-table :data="filterTableData|filterByPage(currentPage, pagesize)"
                    @filter-change="stateFilterChange"
                    ref="databaseBackup"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
            </el-table-column>
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
        <el-tab-pane label="数据库恢复" name="databaseRestore">
          <el-table :data="filterTableData|filterByPage(currentPage, pagesize)"
                    @filter-change="stateFilterChange"
                    ref="databaseRestore"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
            </el-table-column>
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
          <el-table :data="filterTableData|filterByPage(currentPage, pagesize)"
                    ref="initconnNum"
                    @filter-change="stateFilterChange"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
            </el-table-column>
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
        <el-tab-pane label="文件备份" name="filehostBackup">
          <el-table :data="filterTableData|filterByPage(currentPage, pagesize)"
                    @filter-change="stateFilterChange"
                    ref="filehostBackup"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
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
        <el-tab-pane label="文件恢复" name="filehostRestore">
          <el-table :data="filterTableData|filterByPage(currentPage, pagesize)"
                    @filter-change="stateFilterChange"
                    ref="filehostRestore"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pagesize}}
              </template>
            </el-table-column>
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
            <el-table-column prop="restoreState"
                             label="恢复结果"
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
        <el-tab-pane label="虚拟机备份" name="vmBackup">
          <el-table :data="filterTableData|filterByPage(currentPage, pagesize)"
                    @filter-change="stateFilterChange"
                    ref="vmBackup"
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
        <div class="block" style="text-align: right">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         :page-sizes="[10, 15, 20]"
                         :page-size="pagesize"
                         background
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="filterTableData.length">
          </el-pagination>
        </div>
      </el-tabs>
    </template>
  </section>
</template>
<script>
import { fetchAll, fetchBackup, fetchRestore, fetchInitconn } from '../../api/home';
import { backupStrategyMapping } from '../../utils/constant';
import DashboardTab from '../mixins/DashboardTabMixins';
import baseMixin from '../mixins/baseMixins';
export default {
  name: 'MoreState',
  mixins: [baseMixin, DashboardTab],
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
      activeName: '',
    }
  },
  created() {
    this.fetchData();
    this.activeName = this.$route.query.activeName;
  },
  methods: {
    fetchData() {
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
          })
        })
        .catch(error => {
          error => Promise.reject(error);
        })
        .then(() => {
          this.filterTableData = this.currentTableData;
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
      this.filterTableData = this.currentTableData;
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
}
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
