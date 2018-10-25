<template>
  <section>
    <div style="margin-bottom: 22px;">
      <el-row>
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
        </el-col>
      </el-row>
    </div>
    <el-table :data="processDbTableData" ref="dbTable"
              @select="selectDbChangeFn"    @select-all="selectAll"
              style="width: 100%">
      <el-table-column
          type="selection"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column label="序号"
                       width="50"
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       header-align="center"
                       align="center"
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
                       align="center"
                       min-width="200"></el-table-column>
      <el-table-column prop="vmHostName"
                       label="所属物理主机"
                       min-width="150"
                       header-align="center"
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
          v-if="total"
          :total="total">
        </el-pagination>
      </div>
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
      dialogVisible: false,
    }
  },
  computed:{
    processDbTableData(){
      let data = [];
      if(this.buttonfalg){
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
    total(){
      if(this.buttonfalg){
        return this.currentSelectDb.length;
      }
      return this.vmItems.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase())).length;
    },
    hostsInVuex() {
      return this.$store.state.host.hosts.filter( e => {
        return e.databaseType === 4 && e.osName === 'Windows'
      });
    },
  },
  created() {
    this.fetchData();
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
              this.$confirm(
                  '备份计划添加成功，是否跳转到备份计划页面',
                  '提示',
                  {
                      confirmButtonText: '是',
                      cancelButtonText: '否',
                      type: 'success'
                  }
              ).then( () => {
                  this.$router.push({name: 'backup'});
              }).catch( action => {
              });
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
