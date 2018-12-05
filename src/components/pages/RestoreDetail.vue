<template>
  <section v-loading="infoLoading">
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="huifushuju"
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
                    <el-form-item label="时间策略：">
                      <div>{{ timeStrategy | timeStrategyMapping }}</div>
                    </el-form-item>
                    <el-form-item label="时间："
                                  v-if="config.timeStrategy === 1"
                                  style="width: 100%">
                      <div>
                        <el-tag :class="$style.infoTag"
                                size="small">{{ config.singleTime }}</el-tag>
                      </div>
                    </el-form-item>
                    <el-form-item label="星期："
                                  v-if="config.timeStrategy === 2"
                                  style="width: 100%">
                      <div>
                        <el-tag :class="$style.infoTag"
                                v-for="point in config.weekPoints"
                                :key="point"
                                size="small">{{ point }}</el-tag>
                      </div>
                    </el-form-item>
                    <el-form-item label="日期："
                                  v-if="config.timeStrategy === 3"
                                  style="width: 100%">
                      <div>
                        <el-tag :class="$style.infoTag"
                                v-for="point in config.datePoints"
                                :key="point"
                                size="small">{{point}}</el-tag>
                      </div>
                    </el-form-item>
                    <el-form-item label="时间："
                                  v-if="[2, 3].includes(config.timeStrategy)"
                                  style="width: 100%">
                      <div>
                        <el-tag :class="$style.infoTag"
                                v-for="point in config.timePoints"
                                :key="point"
                                size="small">{{point}}</el-tag>
                      </div>
                    </el-form-item>
                    <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm'].includes(target)">
                      <el-form-item label="恢复设备IP：">
                        <span>{{ config.hostIp }}</span>
                      </el-form-item>
                      <el-form-item label="数据库名：">
                        <span>{{ config.dbName }}</span>
                      </el-form-item>
                      <el-form-item label="端口：">
                        <span>{{ config.dbPort }}</span>
                      </el-form-item>
                    </div>
                    <div>

                    </div>
                    <div v-if="['windows', 'linux'].includes(target)">
                      <el-form-item label="存储目标路径：">
                        <span>{{ details.detailInfo }}</span>
                      </el-form-item>
                      <el-form-item label="NFS源路径："
                                    v-if="target === 'linux'">
                        <span>{{ details.nfsSourcePath }}</span>
                      </el-form-item>
                      <el-form-item v-if="target === 'linux'"
                                    label="恢复方向：">
                        <span>{{ config.originDetailInfo}}</span>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <fieldset :class="$style.hostLinkInOs">
                    <legend style="font-size: 12px">
                      {{machineType ? `${machineType}详情` : ''}}
                    </legend>
                    <el-form-item :label="['windows', 'linux'].includes(target) ? '主机名：':'名称：'">
                      <span>
                        <router-link :to="linkObject"
                                    :class="$style.link">
                          {{machine.name }}
                        </router-link>
                      </span>
                    </el-form-item>
                    <el-form-item label="类型：">
                      <el-tag size="small">{{target|commonTypeFilter}}</el-tag>
                    </el-form-item>
                    <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm'].includes(target)">
                      <el-form-item  :label="['sqlserver', 'mysql', 'dm'].includes(target) ? '数据库名：':'实例名：'" >
                        <span>{{target === 'dm' ? machine.dbName : machine.instanceName}}</span>
                      </el-form-item>
                      <el-form-item label="端口号：">
                        <el-tag size="small">{{machine.dbPort}}</el-tag>
                      </el-form-item>
                    </div>
                    <div v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'vmware', 'hw'].includes(target)">
                      <el-form-item label="所属设备IP：">
                        <span>{{machine.host ? machine.host.hostIp : ''}}</span>
                      </el-form-item>
                      <el-form-item label="设备系统类型：">
                        <span>{{machine.host ? machine.host.hostSystem : ''}}</span>
                      </el-form-item>
                    </div>
                    <div v-if="['vmware', 'hw'].includes(target)">
                      <el-form-item label="虚拟机主机IP：">
                        <span>{{machine.vmHost ? machine.vmHost.serverIp : ''}}</span>
                      </el-form-item>
                      <el-form-item label="虚拟机主机类型：">
                        <span>{{machine.vmHost ? serverTypeFilter(machine.vmHost.serverType): ''}}</span>
                      </el-form-item>
                    </div>
                    </fieldset>
                  </el-col>
                </el-row>
              </el-row>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </header>
    <el-tabs class="tabsClass">
        <el-tab-pane label="恢复记录">
          <el-table :data="restoreResult"
                    style="width: 100%; margin-top: 15px"
                    @expand-change="expandChange"
                    :default-sort="{ prop: 'endTime', order: 'descending' }">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- <el-form inline
                        label-width="100px"
                        size="small"
                        class="result-detail-form">
                </el-form> -->
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
            <el-table-column prop="hostIp"
                            label="恢复设备IP"
                            v-if="['oracle', 'sqlserver', 'mysql', 'db2', 'dm'].includes(target)"
                            align="center"
                            min-width="150px">
            </el-table-column>
            <el-table-column prop="dbName"
                            label="数据库名"
                            v-if="['dm'].includes(target)"
                            align="center"
                            min-width="150px">
            </el-table-column>
            <el-table-column prop="detailInfo"
                            :label="target === 'oracle' ? '实例名':'数据库名'"
                            v-if="['oracle', 'sqlserver', 'mysql', 'db2'].includes(target)"
                            align="center"
                            min-width="150px">
            </el-table-column>
            <el-table-column prop="dbPort"
                            label="端口"
                            v-if="['dm'].includes(target)"
                            align="center"
                            min-width="50px"></el-table-column>
            <el-table-column prop="hostIp"
                            label="恢复主机IP"
                            v-if="['windows', 'linux', 'vmware', 'hw'].includes(target)"
                            align="center"
                            min-width="150px">
            </el-table-column>
            <el-table-column prop="newName"
                            label="新虚拟机名"
                            v-if="['vmware', 'hw'].includes(target)"
                            align="center"
                            min-width="200px">
            </el-table-column>
            <el-table-column prop="diskName"
                            label="恢复磁盘名"
                            v-if="target === 'vmware'"
                            align="center"
                            min-width="200px">
            </el-table-column>
            <el-table-column prop="detailInfo"
                              label="恢复目标路径"
                              v-if="['windows', 'linux'].includes(target)"
                              align="center"
                              min-width="150px"></el-table-column>
              <el-table-column v-if="target==='linux'"
                              prop="pointSourcePath"
                              label="恢复源路径"
                              align="center"
                              min-width="150px"></el-table-column>
              <el-table-column v-if="target==='linux'"
                              prop="nfsSourcePath"
                              label="恢复源NFS路径"
                              align="center"
                              min-width="150px"></el-table-column>
              <el-table-column prop="backupResult.size"
                              :formatter="sizeFmt"
                              v-if="['windows', 'linux'].includes(target)"
                              label="大小"
                              align="center"
                              min-width="70px">
              </el-table-column>
              <el-table-column prop="state"
                              label="状态"
                              align="center"
                              min-width="70px">
                <template slot-scope="scope">
                  <el-tooltip :disabled="scope.row.state === 0"
                              :content="scope.row.errorMsg"
                              placement="right"
                              effect="light">
                    <i v-if="scope.row.state === 0"
                      class="el-icon-success"
                      :class="$style.successColor"></i>
                    <i v-else
                      class="el-icon-error"
                      :class="$style.errorColor"></i>
                  </el-tooltip>
                </template>
              </el-table-column>
          </el-table>

        </el-tab-pane>
        
    </el-tabs>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon.vue';
import { fetchRestorePlanDetail, cancelRestoreHighlight } from '@/api/home';
import baseMixin from '@/components/mixins/baseMixins';
import {
  restoreTimeStrategyMapping,
  weekMapping,
  operationStateMapping,
  restoreResultMapping,
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
    restoreResult() {
      return this.details.restoreResult ? this.details.restoreResult : [];
    },
    config() {
      return this.details.config ? this.details.config : {};
    },
    machine() {
      return this.details.machine ? this.details.machine : {};
    },
    timeStrategy() {
      const type = this.details.config ? this.details.config.timeStrategy : 0;
      // return timeStrategyMapping[type];
      return type;
    },
    weekPoints() {
      return this.config.weekPoints.map(p => weekMapping[p]);
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
      return restoreTimeStrategyMapping[val];
    },
    commonTypeFilter(val) {
      return commonTypeMapping[val];
    }
  },
  mounted(){
    this.fetchData(this.$route.query.id, this.$route.query.type);
  },
  methods: {
    fetchData(id, type) {
      this.infoLoading = true;
      fetchRestorePlanDetail(id, type).then(res => {
        const {data} = res.data;
        this.details = data;
      }).catch(error => {
        this.$message.error(error);
      }).then(() => {
        this.infoLoading = false;
      });
    },
    // weekPointMaping(num) {
    //   return weekMapping[num];
    // },
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return restoreResultMapping[stateCode];
    },
    expandChange(row, expandedRows){
      console.log(row, expandedRows, expandedRows.includes(row))
      // 展开失败的扩展表
      if(expandedRows.includes(row) && row.state === 1) {
        cancelRestoreHighlight(this.details.id, this.details.machineType).then(res => {
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
$primary-color: #409eff;
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
.hostLinkInOs {
  border: 1px dotted $primary-color;
  border-radius: 5px;
  & legend {
    color: $primary-color
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

