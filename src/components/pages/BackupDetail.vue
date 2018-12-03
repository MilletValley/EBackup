<template>
  <section v-loading="infoLoading">
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="beifen"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.name}}</h1>
              </el-col>
            </el-row>
            <el-form label-position="right"
                     label-width="130px"
                     size="small"
                     class="item-info">
              <el-row class="margin-right5">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="计划创建时间：">
                      <div>{{ details.startTime }}</div>
                    </el-form-item>
                    <el-form-item label="备份策略：">
                      <div>{{ backupStrategy }}</div>
                    </el-form-item>
                    <el-form-item label="时间策略：">
                      <div>{{ timeStrategy | timeStrategyMapping }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="machineType ? `${machineType}名：` : ''">
                      <span>
                        <router-link :to="linkObject"
                                    :class="$style.link">
                          {{machine.name }}
                        </router-link>
                      </span>
                    </el-form-item>
                    <el-form-item :label="machineType ? `${machineType}类型：` : ''">
                      <el-tag size="small">{{target|commonTypeFilter}}</el-tag>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="时间：" v-if="timeStrategy === 0">
                  <div>{{ backupConfig.singleTime }}</div>
                </el-form-item>
                <el-form-item label="星期："  v-if="timeStrategy === 4">
                  <div>
                    <el-tag v-for="point in weekPoints"
                            :key="point"
                            size="small">{{point}}</el-tag>
                  </div>
                </el-form-item>
                <el-form-item label="日期：" v-if="timeStrategy === 5">
                  <div>
                    <el-tag :class="$style.infoTag"
                            v-for="point in backupConfig.datePoints"
                            :key="point"
                            size="small">{{point}}</el-tag>
                  </div>
                </el-form-item>
                <el-form-item label="时间："
                              v-if="[3,4,5].indexOf(timeStrategy) >= 0">
                  <div>
                    <el-tag :class="$style.infoTag"
                            v-for="point in backupConfig.timePoints"
                            :key="point"
                            size="small">{{point}}</el-tag>
                  </div>
                </el-form-item>
                <el-form-item label="间隔："
                              v-if="timeStrategy === 1|| timeStrategy === 2">
                  <div>
                    <el-tag :class="$style.infoTag"
                            size="small">{{backupConfig.timeInterval}}分钟</el-tag>
                  </div>
                </el-form-item>
                <el-form-item label="源文件路径："
                              v-if="['windows', 'linux'].includes(target)">
                  <span>{{ details.backupPath }}</span>
                </el-form-item>
                <el-form-item label="存储目标路径："
                              v-if="target === 'linux'">
                  <span>{{ details.pointTargetPath }}</span>
                </el-form-item>
                <el-form-item label="NFS目标路径："
                              v-if="target === 'linux'">
                  <span>{{ details.nfsTargetPath }}</span>
                </el-form-item>
                <el-form-item v-if="target === 'windows'"
                              label="是否备份系统：">
                  <span>{{ details.backupSystem === 'sys' ? '是' : '否' }}</span>
                </el-form-item>
                
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <el-tabs class="tabsClass">
        <el-tab-pane label="备份记录">
          <el-table :data="backupResult"
                    style="width: 100%; margin-top: 15px"
                    @expand-change="expandChange"
                    :default-sort="{ prop: 'endTime', order: 'descending' }">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form inline
                        label-width="100px"
                        size="small"
                        class="result-detail-form">
                  <el-form-item :class="$style.detailFormItem"
                                label="备份类型">
                    <span>{{scope.row.backupType |backupTypeFilter}}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="存储目标路径">
                    <span>{{ scope.row.path }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="开始时间">
                    <span>{{ scope.row.startTime }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                v-if="['windows', 'linux'].includes(target)"
                                label="源文件路径">
                    <span>{{ scope.row.fileResource }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'vmware', 'hw'].includes(target)"
                                label="文件名">
                    <span>{{ scope.row.fileName }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="结束时间">
                    <span>{{ scope.row.endTime }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="NFS目标路径"
                                v-if="target==='linux'">
                    <span>{{ scope.row.nfsTargetPath }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="文件标识符"
                                v-if="target==='windows'">
                    <span>{{ scope.row.identifier }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="大小">
                    <span>{{ scope.row.size }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="状态">
                    <span>
                      <el-tag size="mini"
                              :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
                    </span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                label="持续时间">
                    <span>{{ scope.row.consume | durationFilter }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.detailFormItem"
                                v-if="target === 'dm'"
                                label="备份日志">
                    <span>{{scope.row.logType |logTypeFilter}}</span>
                  </el-form-item>
                  <el-form-item label="错误信息"
                                v-if="scope.row.state === 1">
                    <span>{{ scope.row.errorMsg }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="文件标识符"
                            prop="identifier"
                            v-if="target==='windows'"
                            min-width="180px"
                            align="center"></el-table-column>
            <el-table-column label="源文件路径"
                            v-if="['windows', 'linux'].includes(target)"
                            prop="fileResource"
                            min-width="180px"
                            align="center"
                            header-align="center"></el-table-column>
            <el-table-column  label="备份文件名"
                              v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'vmware', 'hw'].includes(target)"
                              prop="fileName"
                              min-width="180px"
                              align="left"
                              header-align="center"></el-table-column>
            <el-table-column  label="备份类型"
                            prop="backupType"
                            min-width="100px"
                            align="center"
                            header-align="center">
              <template slot-scope="scope">
                <span>{{scope.row.backupType |backupTypeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始时间"
                            prop="startTime"
                            min-width="150px"
                            align="center"></el-table-column>
            <el-table-column label="结束时间"
                            prop="endTime"
                            min-width="150px"
                            :sortable="true"
                            align="center"></el-table-column>
            <el-table-column label="大小"
                            prop="size"
                            min-width="100px"
                            align="center"></el-table-column>
            <el-table-column label="状态"
                            prop="state"
                            min-width="70px"
                            align="center">
              <template slot-scope="scope">
                <i v-if="scope.row.state === 0"
                  class="el-icon-success"
                  :class="$style.successColor"></i>
                <i v-else
                  class="el-icon-error"
                  :class="$style.errorColor"></i>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        
    </el-tabs>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon.vue';
import { fetchBackupPlanDetail, cancelHighlight } from '@/api/home';
import baseMixin from '@/components/mixins/baseMixins';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
  backupTypeMapping,
  backupResultMapping,
  yesOrNoMapping
} from '@/utils/constant';

const typeMapping = {
  1: '数据库',
  2: '文件',
  3: '虚拟机',
};
const vmTypeMapping = {
  1: 'vmware',
  2: 'hw'
};
const dbTypeMapping = {
  1: 'sqlserver',
  2: 'oracle',
  3: 'mysql',
  4: 'db2',
  5: 'dm'
};

const routerNameMapping = {
  windows: 'filehostDetail',
  linux: 'filehostDetail',
  vmware: 'virtualDetail',
  hw: 'hwVirtualDetail',
  oracle: 'oracleDetail',
  sqlserver: 'sqlserverDetail',
  mysql: 'mysqlDetail',
  db2: 'db2Detail',
  dm: 'damengDetail'
};
const commonTypeMapping = {
  windows: 'Windows',
  linux: 'Linnux',
  vmware: 'VMware',
  hw: '华为虚拟机',
  oracle: 'Oracle',
  sqlserver: 'SQL Server',
  mysql: 'MySql',
  db2: 'DB2',
  dm: '达梦数据库'
};
export default {
  name: 'backup-detail',
  mixins: [baseMixin],
  components: {
    IIcon
  },
  data() {
    return {
      infoLoading: false,
      details: {},
    };
  },
  computed: {
    backupResult() {
      return this.details.backupResult ? this.details.backupResult : [];
    },
    backupConfig() {
      return this.details.config ? this.details.config : {};
    },
    machine() {
      return this.details.machine ? this.details.machine : {};
    },
    backupStrategy() {
      const type = this.details.config ? this.details.config.backupStrategy : 0;
      return backupStrategyMapping[type];
    },
    timeStrategy() {
      const type = this.details.config ? this.details.config.timeStrategy : 0;
      // return timeStrategyMapping[type];
      return type;
    },
    weekPoints() {
      return this.backupConfig.weekPoints.map(p => weekMapping[p]);
    },
    machineType() {
      const type = this.details.machineType;
      return type ? typeMapping[type] : '';
    },
    target() {
      const machineType = this.details.machineType;
      const type = this.details.machine ? this.details.machine.type : 1;
      let target = '';
      switch(machineType) {
        case 1:
          target = dbTypeMapping[type];
          break;
        case 2:
          target = this.details.machine && this.details.machine.osName ? this.details.machine.osName.toLowerCase() : 'windows';
          break;
        case 3:
          target = vmTypeMapping[type];
          break;
        default:
      }
      return target;
    },
    linkObject() {
      let name = routerNameMapping[this.target];
      let id = this.machine.id;
      return {name, params: { id: String(id)}};
    }
  },
  filters: {
    timeStrategyMapping(val) {
      return timeStrategyMapping[val];
    },
    backupTypeFilter(val) {
      return backupTypeMapping[val];
    },
    logTypeFilter(val) {
      return yesOrNoMapping[val];
    },
    commonTypeFilter(val) {
      return commonTypeMapping[val];
    }
  },
  mounted(){
    this.fetchData(this.$route.params.id);
  },
  methods: {
    fetchData(id) {
      this.infoLoading = true;
      fetchBackupPlanDetail(id).then(res => {
        const {data} = res.data;
        this.details = data;
      }).catch(error => {
        this.$message.error(error);
      }).then(() => {
        this.infoLoading = false;
      });
    },
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    expandChange(row, expandedRows){
      console.log(row, expandedRows, expandedRows.includes(row))
      // 展开失败的扩展表
      if(expandedRows.includes(row) && row.state === 1) {
        cancelHighlight(this.details.id, this.details.machineType).then(res => {
          console.log('ok')
        });
      }
    }
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
/* 标签之间的间隔在for循环下消失了 */
.infoTag {
  margin: 0 2px;
}
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  width: 30%;
  &:nth-child(2n) {
    width: 69%;
  }
}
</style>
<style>
.el-col .el-form-item {
  display: block;
}
</style>
<style scoped>
.margin-right5 {
  margin-right: 5px;
}
.tabsClass{
  margin-top: -39px;
}
</style>

