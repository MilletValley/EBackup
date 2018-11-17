<template>
<div>
    <el-row style="margin-bottom:5px;">
        <el-col :span="6">
            <el-input  placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
            </el-input>
        </el-col>
    </el-row>
    
    <el-table :data="processedTableData" v-loading="loading" style="text-align:left;">
        <el-table-column label="虚拟机名称" align="left" min-width="100"
                    >
            <template slot-scope="scope">
                <router-link :to="scope.row.vm.type === 1 ? `/vm/virtual/${scope.row.vm.id}` : `/vm/hwVirtual/${scope.row.vm.id}`"
                            :class="$style.link">{{scope.row.vm.vmName}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="vm.vmPath" align="left" show-overflow-tooltip
                        label="路径"
                        >
        </el-table-column>
        <el-table-column prop="vm.vmHostName"
            label="所属物理主机"
            min-width="150"
            align="left">
        </el-table-column>
        <el-table-column prop="startTime" align="left"
                        min-width="160"
                        label="备份开始时间">
        </el-table-column>
        <el-table-column prop="size" align="left"
                        min-width="100"
                        label="已备份大小">
        </el-table-column>
        <el-table-column prop="state" align="left"
                        min-width="150"
                        label="状态">
            <template slot-scope="scope">
                <el-progress :text-inside="false" :stroke-width="12" :percentage="formatProcess(scope.row)" :status="formatState(scope.row.state)">
                </el-progress>
            </template>
        </el-table-column>
        <el-table-column prop="consume" align="left"
                        min-width="100"
                        label="已持续时间">
            <template slot-scope="scope">
                <span>{{ scope.row.consume | durationFilter}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作"
                        width="80"
                        header-align="center"
                        align="center">
            <template slot-scope="scope">
                <el-tooltip 
                            content="删除"
                            placement="top"
                            effect="light">
                    <el-button type="danger"
                                icon="el-icon-delete"
                                circle
                                size="mini"
                                :class="$style.miniCricleIconBtn"
                                @click="deletePlan(scope)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
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
</div>
</template>
<script>
import {
  deleteVirtualBackupPlan,
  getVmsBackupResult,
} from '../../api/virtuals';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '../../utils/constant';
import baseMixin from '../mixins/baseMixins';
import { paginationMixin, sortMixin } from '../mixins/commonMixin';
export default {
  mixins: [baseMixin, paginationMixin, sortMixin],
  props: {
    id: {
      type: Number,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      timer: null,
      inputSearch: '',
      defaultSort: { prop: 'startTime', order: 'descending' },
    };
  },
  mounted() {
    // this.fetchAll();
    // this.setTimer(this.timer);
  },
  destroyed() {
    // this.clearTimer(this.timer);
  },
  methods: {
    fetchAll() {
      this.loading = true;
      getVmsBackupResult(this.id)
        .then(res => {
          this.tableData = res.data.data;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.loading = false;
        });
    },
    formatProcess(data) {
      if (data.state === 1) {
        return data.processSpeed;
      } else if (data.state === 0) {
        return 0;
      } else if (data.state === 2) {
        return 100;
      } else if (data.state === 3) {
        return data.processSpeed;
      }
    },
    formatState(state) {
      if (state === 2) {
        return 'success';
      } else if (state === 3) {
        return 'exception';
      }
      return '';
    },
    // setTimer() {
    //     this.clearTimer();
    //     this.timer = setInterval(() => {
    //         getVmsBackupResult(this.id).then( res => {
    //             // this.tableData = res.data.data;
    //         })
    //     }, 10000);
    // },
    // clearTimer() {
    //     clearInterval(this.timer);
    // },
    deletePlan(scope) {
      this.$confirm('请确认是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteVirtualBackupPlan(scope.row.id)
            .then(res => {
              this.$message.success('删除成功');
              // this.fetchAll();
              this.tableData.splice(
                this.tableData.findIndex(item => item.id === scope.row.id),
                1
              );
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => {});
    },
    filterFn(item, i) {
      return item.vm[i].includes(this.filter[i]);
    },
    searchByName() {
      const vmName = this.inputSearch;
      this.filter = Object.assign({}, { vmName });
      this.currentPage = 1;
    },
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
@import '../../style/color.scss';
</style>

