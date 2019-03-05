<template>
    <div>
      <el-row style="margin-bottom:10px;">
          <el-col :span="12" style="text-align:left;">
              <el-button type="primary" @click="isSelect = !isSelect" size="small"
                  >{{isSelect ? '返回' : '已选虚拟机'}}</el-button>
          </el-col>
          <el-col :span="12" style="text-align:right;">
              <slot name="other"></slot>
          </el-col>
      </el-row>
      <el-table v-show="!isSelect" :data="serverTableData" ref="serverTable" :size="customSize">
          <el-table-column type="expand">
              <template slot-scope="props">
                <template v-if="props.row.serverType === 1">
                  <el-card v-for="hostList in props.row.hostList"
                           :key="hostList.id"
                           style="margin-top: 5px; margin-bottom: 5px">
                    <div slot="header">
                      <el-row>
                        <el-col :span="6" style="text-align: center">主机名：{{ hostList.serverName }}</el-col>
                        <el-col :span="6" style="text-align: center">所属设备：{{ hostList.hostName }}</el-col>
                        <el-col :span="6" style="text-align: center">主机IP：{{ hostList.serverIp }}</el-col>
                        <el-col :span="6" style="text-align: center">主机类型：{{ vmHostServerTypeMapping[hostList.serverType] }}</el-col>
                      </el-row>
                    </div>
                    <mutil-table :tableData="hostList.vmList"
                                :ref="hostList.id"
                                :refTable="hostList.serverName" 
                                :selectData.sync="selectData"
                                :curSelectData="curSelectData"
                                :size="customSize"
                                :showDelete="showDelete"
                                @refresh="refreshOneServer(hostList)"></mutil-table>
                  </el-card>
                </template>
                <template v-else>
                  <mutil-table :tableData="props.row.vmList"
                               :ref="props.row.id"
                               :refTable="props.row.serverName" 
                               :selectData.sync="selectData" 
                               :curSelectData="curSelectData"
                               :size="customSize"
                               :showDelete="showDelete"
                               @refresh="refreshOneServer(props.row)"></mutil-table>
                </template>
              </template>
          </el-table-column>
          <el-table-column label="主机名" prop="serverName" align="left"
                      min-width="100">
          </el-table-column>
          <el-table-column prop="hostName" align="left"
                          min-width="100"
                          label="所属设备">
          </el-table-column>
          <el-table-column prop="serverIp" align="left"
                          label="主机IP地址"
                          min-width="100">
          </el-table-column>
          <el-table-column v-if="false" prop="createDate" align="left"
                          label="创建时间"
                          min-width="150">
          </el-table-column>
          <el-table-column prop="serverType" 
              label="主机类型"
              :formatter="serverTypeFormat"
              min-width="100"
              align="left"></el-table-column>
          <el-table-column label="操作"
                          width="150"
                          header-align="center"
                          align="center">
              <template slot-scope="scope">
                  <el-tooltip 
                          content="重新扫描"
                          placement="top"
                          effect="light">
                      <el-button type="primary"
                                  :icon="scope.row.icon"
                                  circle
                                  :disabled="scope.row.disabled"
                                  size="mini"
                                  :class="$style.miniCricleIconBtn"
                                  @click="refresh(scope)"></el-button>
                  </el-tooltip>
                  <el-tooltip 
                          content="删除"
                          placement="top"
                          effect="light">
                      <el-button type="danger" v-if="showDelete"
                                  :icon="scope.row.delBtnIcon"
                                  :disabled="scope.row.disabled"
                                  circle
                                  size="mini"
                                  :class="$style.miniCricleIconBtn"
                                  @click="deleteServer(scope)"></el-button>
                  </el-tooltip>
              </template>
          </el-table-column>
      </el-table>
      <mutil-table v-show="isSelect" :tableData="selectData" refTable="selectTable" :selectData.sync="selectData" :curSelectData="curSelectData" :size="customSize" :showDelete="false"></mutil-table>
    </div>
    
</template>
<script>
import { addServer, fetchServerList, deleteServer } from '@/api/host';
import {
  createMultipleVirtualBackupPlan,
  rescan,
  getVMByserverId,
} from '@/api/virtuals';
import MutilTable from '@/components/modal/MutilTable';
import { vmHostServerTypeMapping } from '@/utils/constant';
export default {
  props: {
    tableData: {
      type: Array
    },
    currentSelect: {
      type: Array
    },
    showSelect: {
      type: Boolean
    },
    curSelectData: {
      type: Array,
      default: () => []
    },
    size: {
      type: String
    },
    showDelete: {
      type: Boolean
    }
  },
  components: {
    MutilTable,
  },
  data() {
    return {
      vmHostServerTypeMapping
    };
  },
  computed: {
    customSize() {
      return this.size ? this.size : '-';
    },
    serverTableData() {
      if (!Array.isArray(this.tableData)) {
        // this.currentSelect = [];
        return [];
      }
     return this.tableData.map(e => {
        e.disabled = false;
        e.icon = 'el-icon-refresh';
        e.delBtnIcon = 'el-icon-delete';
        return e;
      });
      // this.currentSelect = [];
    },
    selectData: {
      get() {
        return this.currentSelect;
      },
      set(value) {
        this.$emit('update:currentSelect', value);
      },
    },
    isSelect: {
      get() {
        return this.showSelect;
      },
      set(value) {
        this.$emit('update:showSelect', value);
      },
    }
  },
  methods: {
    serverTypeFormat(row, column, cellValue, index) {
      return vmHostServerTypeMapping[cellValue];
    },
    // 刷新单个主机下的虚拟机列表
    refreshOneServer(row) {
      getVMByserverId(row.id).then(res => {
        const ids = row.vmList.map(i => i.id);
        this.selectData = this.selectData.filter(e => {
          if (ids.includes(e.id) && !this.curSelectData.some(n => n.id === e.id)) {
            return false;
          }
          return true;
        });
        const { data } = res.data;
        row.vmList = data;
      }).catch(error => {
        this.$message.error(error);
      });
    },
    refresh(scope) {
      scope.row.disabled = true;
      scope.row.icon = 'el-icon-loading';
      const type = scope.row.serverType;
      const time = type === 3 && scope.row.vmList.length === 0  ? 30000 : 0;
      setTimeout(() => {
        rescan(scope.row)
          .then(res => {
            this.refreshOneServer(scope.row);
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            scope.row.disabled = false;
            scope.row.icon = 'el-icon-refresh';
          });
      }, time);
    },
    deleteServer(data) {
      this.$emit('delete', data);
    }
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style>
</style>


