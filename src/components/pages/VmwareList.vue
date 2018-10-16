<template>
  <section>
    <div style="margin-bottom: 15px;">
      <el-row :gutter="20">
        <!-- <el-col :span="18"><div class="grid-content">
            <el-button type="primary" @click="buttonClick" >
              {{buttonfalg ? '返回' : '已选'}}
            </el-button>
          </div></el-col>
        <el-col :span="6" style="text-align:right">
          <el-input v-if="!buttonfalg" placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
          <el-button v-else type="primary" @click="backupPlanCreateModalVisible=true" :disabled="currentSelectDb.length ? false : true">
            添加备份计划
          </el-button>
        </el-col> -->
        
        <el-col :span="6" >
          <el-input v-if="!buttonfalg" placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
          <el-button v-else size="small" type="primary" @click="backupPlanCreateModalVisible=true" :disabled="currentSelectDb.length ? false : true">
            添加备份计划
          </el-button>
        </el-col>
        <el-col :span="18" style="text-align:right">
          <el-button size="small" type="primary" @click="buttonClick" >
            {{buttonfalg ? '返回' : '查看已选虚拟机'}}
          </el-button>
          <!-- <el-button v-if="isVMware" class="margin-right10"  type="primary" size="small" @click="scanVmFn" :loading="buttonFlag">{{buttonFlag ? "正在扫描" : "重新扫描"}}</el-button> -->
        </el-col>
      </el-row>
    </div>
    <el-table :data="processDbTableData" ref="dbTable"
              v-if="vmItems"   @select="selectDbChangeFn"    @select-all="selectAll"
              style="width: 100%">
      <el-table-column
          type="selection"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column label="序号"
                       width="50"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       header-align="center"
                       fixed
                       min-width="200">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        :class="$style.link">{{scope.row.vmName}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="vmPath"
                       label="路径"
                       header-align="center"
                       min-width="200"></el-table-column>
      <el-table-column prop="vmHostName"
                       label="所属物理主机"
                       min-width="150"
                       align="center"></el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-if="vmItems"
          :total="vmItems|filterBySearch(filterItem).length">
        </el-pagination>
      </div>
    
    <!-- <el-dialog
      title="请选择要扫描的设备"
      @close="closeHandler"
      :visible.sync="dialogVisible">
      <el-table :data="hostsInVuex"
                ref="hostTable"
                @selection-change="DeviceSelectChangeHandler"
                max-height="350">
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column prop="name"
                        label="设备名"
                        min-width="150"
                        align="center">
        </el-table-column>
        <el-table-column prop="hostIp"
                        label="设备IP"
                        min-width="150"
                        align="center"></el-table-column>
        <el-table-column prop="hostType"
                        label="设备类型"
                        :formatter="judgeHost"
                        min-width="150"
                        align="center"></el-table-column>
        <el-table-column prop="loginName"
                        label="登录账号"
                        min-width="140"
                        align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmFn" :disabled="disabled">确 定</el-button>
      </span>
    </el-dialog> -->

      <backup-plan-create-modal type="vm"
                     :visible.sync="backupPlanCreateModalVisible"
                     :btn-loading="btnLoading"
                     @confirm="addBackupPlan"></backup-plan-create-modal>

  </section>
</template>
<script>
import { fetchAll ,createMultipleVirtualBackupPlan, rescan} from '../../api/virtuals';
import BackupPlanCreateModal from '@/components/modal/BackupPlanCreateModal';
import { hostTypeMapping, databaseTypeMapping } from '../../utils/constant';
export default {
  name: 'VMwareList',
  components: {
    BackupPlanCreateModal
  },
  data() {
    return {
      vmItems: [],
      currentPage: 1,
      pagesize: 10,
      inputSearch: '',
      filterItem: '',
      currentSelectDb: [],
      buttonfalg: false,
      btnLoading: false,
      backupPlanCreateModalVisible: false,
      // buttonFlag: false,
      dialogVisible: false,
      curSelectd: [],
    }
  },
  computed:{
    processDbTableData(){
      let data = [];
      if(this.buttonfalg){
        // data = this.currentSelectDb.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase()));
        data = this.currentSelectDb;
      }else{
        data = this.vmItems.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase()));
      }
      data = data.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
      this.$nextTick( () => {
          data.forEach( e => {
            if(this.currentSelectDb.includes(e)){
              this.$refs.dbTable.toggleRowSelection(e,true);
            }
          })
      });
      return data;
    },
    hostsInVuex() {
      return this.$store.state.host.hosts.filter( e => {
        return e.databaseType === 4 && e.osName === 'Windows'
      });
    },
    isVMware(){
      return this.$route.name === 'VMwareList'
    },
    disabled(){
      return this.curSelectd.length === 0
    }
  },
  created() {
    this.fetchData();
  },
  filters: {
    filterBySearch(tableData, arg) {
      if (!tableData) {
        return '';
      }
      return tableData.filter(v => v.vmName.toLowerCase().includes(arg.toLowerCase()));
    },
    filterByPage(data, currentPage, pagesize) {
      if (!data) {
        return '';
      }
      return data.slice((currentPage - 1) * pagesize, currentPage * pagesize);
    }
  },
  watch: {
    inputSearch() {
      if(this.inputSearch==='') {
        this.filterItem=''
        this.currentPage=1;
      }
    },
    $route: function() {
      this.vmItems=[];
      this.currentPage=1;
      this.fetchData();
    }
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          if(!Array.isArray(data)){
            this.vmItems = [];
            return
          }
          if(this.$route.name === 'VMwareList') {
            this.vmItems = data.filter(item => item.type===1);
          } else {
            this.vmItems = data.filter(item => item.type===2);
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    searchByName() {
      this.filterItem = this.inputSearch;
      this.currentPage = 1;
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
    },
    // scanVmFn(){
    //   this.dialogVisible = true;
    // },
    // judgeHost(data) {
    //   return hostTypeMapping[data.hostType];
    // },
    // DeviceSelectChangeHandler(selection){
    //   this.curSelectd = selection
    // },
    // comfirmFn(){
    //   const ids = this.curSelectd.map( e => {
    //     return e.hostIp
    //   });
    //   this.dialogVisible = false;
    //   this.buttonFlag = true;
    //   rescan(ids).then( res => {
    //     const {message} = res.data;
    //     this.$message.success(message);
    //     this.fetchData();
    //   }).catch( error => {
    //     this.$message.error(error);
    //   }).then( () => {
    //     this.buttonFlag = false;
    //   })
    // },
    // closeHandler(){
    //   this.curSelectd = [];
    //   this.$refs.hostTable.clearSelection();
    // },
    selectDbChangeFn(selectData, row){
        if(selectData.includes(row)){
            this.currentSelectDb.push(row);
        }else{
            //需要优化，匹配到即跳出循环
            this.currentSelectDb = this.currentSelectDb.filter( e => {
                if(e.id === row.id){
                    return false;
                }
                return true;
            });
        }
    },
    selectAll(selection){
        if(selection.length === 0){
            this.currentSelectDb = this.currentSelectDb.filter( e => {
                let flag = true;
                this.processDbTableData.forEach( i => {
                    if(i.id === e.id){
                        flag = false;
                    }
                })
                return flag;
            })
        }else{
            let data = [];
            this.processDbTableData.forEach( e => {
                let flag = true;
                if(this.currentSelectDb.includes(e)){
                  flag = false;
                }
                flag && data.push(e);
            });
            this.currentSelectDb.push(...data)
        }
    },
    buttonClick(){
      this.buttonfalg = !this.buttonfalg;
      this.currentPage = 1;
    },
    addBackupPlan(data) {
        let plan = Object.assign({}, data);
        let vmIds = this.currentSelectDb.map( e => {
            return e.id;
        });
        plan.vmList = vmIds;
        this.btnLoading = true;
        createMultipleVirtualBackupPlan(plan)
            .then(res => {
            const { message } = res.data;
            this.backupPlanCreateModalVisible = false;
            this.$message.success(message);
            })
            .catch(error => {
            this.$message.error(error);
            return false;
            })
            .then(() => {
            this.btnLoading = false;
            });
    },
  }
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style>
