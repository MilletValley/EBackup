<template>
<div>
    <el-row style="margin-bottom:5px;">
        <el-col :span="6">
            <el-input  placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select" size="small">
                <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
            </el-input>
        </el-col>
        <el-col :span="18" style="text-align: left;">
          <el-button  @click="addVM" size="small" style="margin-left: 20px;" :disabled="btnDisable">添加</el-button>
        </el-col>
    </el-row>
    
    <el-table :data="processedTableData" style="text-align:left;">
        <el-table-column label="虚拟机名称" align="left" min-width="100"
                    >
            <template slot-scope="scope">
                <router-link :to="scope.row.vm.type === 1 ? `/vm/virtual/${scope.row.vm.id}` : `/vm/hwVirtual/${scope.row.vm.id}`"
                            :class="$style.link">{{scope.row.vm.vmName}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="vm.type" align="center" show-overflow-tooltip
                        label="类型"
                        >
            <template slot-scope="scope">
              <span>{{scope.row.vm.type === 1 ? 'VMware' : '华为虚拟机'}}</span>
            </template>
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
                <el-progress :text-inside="true" :stroke-width="16" :percentage="formatProcess(scope.row)" :status="formatState(scope.row.state)">
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
    <el-dialog
      title="添加虚拟机"
      :visible.sync="dialogVisible"
      custom-class="min-width-dialog"
      @opened="dialogOpenedCB">
      <server-table v-loading="loading" :tableData="serverTableData" :currentSelect.sync="currentSelect" :curSelectData="curSelectData" size="mini" :showSelect.sync="isSelect"></server-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirCB">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
import dayjs from 'dayjs';
import {
  deleteVirtualBackupPlan,
  getVmsBackupResult,
  updateBackupPlanForVm
} from '@/api/virtuals';
import { fetchServerList } from '@/api/host';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '@/utils/constant';
import baseMixin from '@/components/mixins/baseMixins';
import { paginationMixin, filterMixin, sortMixin } from '@/components/mixins/commonMixin';
import ServerTable from '@/components/pages/vm/ServerTable';
export default {
  mixins: [baseMixin, paginationMixin, filterMixin, sortMixin],
  components: {
    ServerTable
  },
  props: {
    backupPlan: {
      type: Object,
    },
    data: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      timer: null,
      inputSearch: '',
      tableData: [],
      defaultSort: { prop: 'startTime', order: 'descending' },
      dialogVisible: false,
      serverTableData: [],
      currentSelect: [],
      curSelectData: [],
      isSelect: false,
      btnDisable: false
    };
  },
  mounted() {
    if(this.$route.name === 'virtualBackup') {
      this.tableData = this.data.filter(item => item.vm.type === 1);
    } else {
      this.tableData = this.data.filter(item => item.vm.type === 2);
    }
    if (this.backupPlan.config.timeStrategy === 0) {
      const time = this.backupPlan.config.singleTime;
      this.btnDisable = dayjs(new Date()) > dayjs(time) ? true : false;
    }
  },
  destroyed() {
  },
  methods: {
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
      return 'text';
    },
    deletePlan(scope) {
      const h = this.$createElement;
      let delBackupResults = 1;
      const that = this;
      this.$msgbox({
        title: '提示',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        message:
          h('div', null, [
            h('p', null, '请确认是否删除'),
            h('el-checkbox', {
              key: (new Date()).valueOf(),
              on: {
                change: function($event) {
                  delBackupResults = event.target.checked ? 0 : 1;
                  that.$refs.warnText.style.opacity = event.target.checked ? 1 : 0;
                  console.log(that.$refs.warnText.style.opacity);
                }
              }
            }),
            h('span', {
              style: {
                fontSize: '12px', color: '#ccc', marginLeft: '-15px'
              },
            }, '同时删除备份计划下的所有备份集'),
            h('p',
              {
                ref: 'warnText',
                style: {
                  fontSize: '12px',
                  color: '#f78989',
                  opacity: 0
                },
              },
              '该操作将导致备份集被永久删除！')
          ])
      })
        .then(() => {
          deleteVirtualBackupPlan(scope.row.id, delBackupResults)
            .then(res => {
              this.$message.success('删除成功');
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
    addVM() {
      this.currentSelect = [];
      this.curSelectData = [];
      this.serverTableData = [];
      this.dialogVisible = true;
    },
    dialogOpenedCB() {
      this.loading = true;
      fetchServerList().then(res => {
        const { data } = res.data;
        if (!Array.isArray(data)) {
          this.serverTableData = [];
          return;
        }
        this.serverTableData = data.filter(item => {
          if (this.type === 'virtualBackup') {
            return [1, 2].includes(item.serverType);
          }
          return item.serverType === 3;
        });
        this.currentSelect = this.tableData.map(e => e.vm);
        this.curSelectData = this.tableData.map(e => e.vm);
      })
      .catch(error => {
        this.$message.error(error);
      }).then(() => {
        this.loading = false;
      });
    },
    comfirCB() {
      let idList = [];
      this.currentSelect.forEach(e => {
        if (!this.curSelectData.some(i => i.id === e.id)) {
          idList.push(e.id);
        }
      });
      updateBackupPlanForVm(this.backupPlan.id, idList).then(res => {
        this.$message.success('添加成功！');
        this.dialogVisible = false;
        this.$emit('refresh');
      }).catch(err => {
        this.$message.error(err);
      })
    }
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
</style>

