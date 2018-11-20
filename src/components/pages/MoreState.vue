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
                     v-if="showBackup"
                     name="databaseBackup">
          <el-table :data="processedTableData"
                    @filter-change="filterChange"
                    v-loading="infoLoading"
                    ref="databaseBackup"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'backup' }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="ddvType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             column-key="ddvType"
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
                             v-if="!checkType"
                             :filters="filterBackupStateFilter"
                             column-key="backupState"
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
                     v-if="showRestore"
                     name="databaseRestore">
          <el-table :data="processedTableData"
                    @filter-change="filterChange"
                    v-loading="infoLoading"
                    ref="databaseRestore"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'restore' }}"
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
                             column-key="ddvType"
                             min-width="120"></el-table-column>
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
                             v-if="!checkType"
                             :filters="filterRestoreStateFilter"
                             column-key="restoreState"
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
                     name="initconnNum"
                     v-if="showTakeOver">
          <el-table :data="processedTableData"
                    @filter-change="filterChange"
                    v-loading="infoLoading"
                    ref="initconnNum"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
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
                             prop="primaryState"
                             :filters="dbStateFilter"
                             column-key="primaryState">
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
                             prop="viceState"
                             :filters="dbStateFilter"
                             column-key="viceState"
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
                             column-key="overState"
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
                     name="filehostBackup"
                     v-if="showBackup">
          <el-table :data="processedTableData"
                    @filter-change="filterChange"
                    v-loading="infoLoading"
                    ref="filehostBackup"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id), type: 'backup' }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
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
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             :formatter="sizeFormatter"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             v-if="!checkType"
                             :filters="filterBackupStateFilter"
                             column-key="backupState"
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
                     name="filehostRestore"
                     v-if="showRestore">
          <el-table :data="processedTableData"
                    v-loading="infoLoading"
                    ref="filehostRestore"
                    @filter-change="filterChange"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id), type: 'restore' }}"
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
                             v-if="!checkType"
                             :filters="filterRestoreStateFilter"
                             column-key="restoreState"
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
                     name="vmBackup"
                     v-if="showBackup">
          <el-table :data="processedTableData"
                    v-loading="infoLoading"
                    @filter-change="filterChange"
                    ref="vmBackup"
                    style="width: 100%">
            <el-table-column min-width="50"
                             align="center"
                             label="序号"
                             fixed>
              <template slot-scope="scope">
                  {{scope.$index+1+(currentPage-1)*pageSize}}
              </template>
            </el-table-column>
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'backup' }}"
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
                             column-key="ddvType"
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
                             v-if="!checkType"
                             :filters="filterBackupStateFilter"
                             column-key="backupState"
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
                     name="vmRestore"
                     v-if="showRestore">
          <el-table :data="processedTableData"
                    v-loading="infoLoading"
                    @filter-change="filterChange"
                    ref="vmRestore"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'restore' }}"
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
                             column-key="ddvType"
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
                             v-if="!checkType"
                             :filters="filterRestoreStateFilter"
                             column-key="restoreState"
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
      <el-pagination style="text-align:right;margin-top:10px;"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="pageSize"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
    </el-pagination>
    </template>
  </section>
</template>
<script>
import { backupStrategyMapping } from '../../utils/constant';
import DashboardTab from '../mixins/DashboardTabMixins';
import baseMixin from '../mixins/baseMixins';
import { paginationMixin, filterMixin } from '../mixins/commonMixin'
export default {
  name: 'MoreState',
  mixins: [baseMixin, DashboardTab, paginationMixin, filterMixin],
  data() {
    const activeTab = {
      'backupSuccess': 'databaseBackup',
      'backupFail': 'databaseBackup',
      'restoreSuccess': 'databaseRestore',
      'restoreFail': 'databaseRestore',
      'initConnSuccess': 'initconnNum',
      'initConnFail': 'initconnNum'
    }
    return {
      checkType: '',
      activeTab,
      infoLoading: true,
      tableFilter: {}
    }
  },
  created() {
    this.fetchTabData();
    const query = this.$route.query;
    if(query.activeName) { // 首页设备详情入口
      this.activeName = this.$route.query.activeName;
    } else if(query.type) { // 首页饼图入口
      this.checkType = query.type;
      this.activeName = this.activeTab[this.checkType];
    }
  },
  computed: {
    tableData() {
      return this[this.activeName];
    },
    showBackup() {
      return !this.checkType||this.checkType.includes('backup');
    },
    showRestore() {
      return !this.checkType||this.checkType.includes('restore');
    },
    showTakeOver() {
      return !this.checkType||this.checkType.includes('initConn');
    }
  },
  methods: {
    filterChange(filters) {
      const tkey = Object.keys(filters)[0];
      this.tableFilter = {...this.tableFilter, [tkey]: filters[tkey]}
      this.filter = Object.assign({}, this.filter, this.tableFilter);
    },
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      } else {
        return item[i].includes(this.filter[i]);
      }
    },
    handleClick(tab,event) {
      this.currentPage = 1;
      this.filter = {};
      this.tableFilter = {};
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    beforeTabLeave(newName, oldName) {
      this.$refs[oldName].clearFilter();
    },
  }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
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
