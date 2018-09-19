<template>
    <section>
    <el-row>
      <el-form inline
               size="small">
        <el-form-item style="float: left" >
          <el-input placeholder="请输入名称"
                    v-model="inputSearch"
                    @keyup.enter.native="searchByName">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>          
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="createModalVisible = true">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="tableData|filterByIp(filterItem)"
              style="width: 100%">
      <el-table-column prop="vmManageHostLogin"
                       label="主机登录账号"
                       min-width="150"
                       align="center"
                       fixed>
      </el-table-column>
      <el-table-column prop="vmManageHostIp"
                       label="主机IP"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="vmHostServerUser"
                       label="服务登录账号"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="vmHostServerIp"
                       label="服务IP"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="vmHostServerType"
                       label="服务类型"
                       :formatter="serverTypeFotmat"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="state"
                       label="状态"
                       :formatter="stateFormat"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="createDate"
                       label="创建时间"
                       min-width="150"
                       align="center"></el-table-column>
    </el-table>
    <add-collect-modal type="vmManageCollect"
                       :visible.sync="createModalVisible"
                       @confirm="createItem"
                       :btn-loading="btnLoading"></add-collect-modal>
  </section>
</template>
<script>
import { listMixin } from '../mixins/databaseListMixin';
import AddCollectModal from '../modal/AddCollectModal';
import { fetchAll, addCollect } from '../../api/vmCollect';
import { mapActions } from 'vuex';
import { backupResultMapping, vmHostServerTypeMapping } from '../../utils/constant';

export default {
  name: 'collectManager',
  mixins: [listMixin],
  data() {
    return {
      tableData: []
    };
  },
  computed: {
    
  },
  methods: {
    serverTypeFotmat(row, column, cellValue, index){
        return vmHostServerTypeMapping[cellValue]
    },
    stateFormat(row, column, cellValue, index){
        return backupResultMapping[cellValue]
    },
    fetchData() {
        fetchAll().then( res => {
            this.tableData = res.data.data;
        }).catch( error => {
            this.$message.error(error);
        })
    },
    createItem(host) {
      this.btnLoading = true;
      addCollect(host)
        .then(res => {
          this.createModalVisible = false;
          this.$message.success(res.data.message);
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
   
  },
  filters: {
    filterByIp(data, filterItem){
      if (!data) {
        return '';
      }
      return data.filter(v => v.vmManageHostIp.includes(filterItem));
    }
  },
  components: {
    AddCollectModal,

  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>



