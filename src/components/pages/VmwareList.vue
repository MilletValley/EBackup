<template>
  <section>
    <div style="margin-bottom: 15px;">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-button type="primary" @click="scanVmFn" :loading="buttonFlag">{{buttonFlag ? "正在扫描" : "重新扫描"}}</el-button>
          <!-- <div class="grid-content"></div> -->
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table :data="vmItems|filterBySearch(filterItem)|filterByPage(currentPage, pagesize)"
              v-if="vmItems"
              style="width: 100%">
      <el-table-column label="序号"
                       min-width="100"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
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
                       min-width="200"></el-table-column>
      <el-table-column prop="vmHostName"
                       label="所属主机"
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
    <el-dialog
      title="请选择要扫描的设备"
      @close="closeHandler"
      :visible.sync="dialogVisible">
      <el-table :data="hostsInVuex"
                ref="hostTable"
                @selection-change="selectChangeHandler"
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
        <el-button type="primary" @click="comfirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { fetchAll, rescan } from '../../api/virtuals';
import { hostTypeMapping, databaseTypeMapping } from '../../utils/constant';
export default {
  name: 'VMwareList',
  data() {
    return {
      vmItems: [],
      currentPage: 1,
      pagesize: 10,
      inputSearch: '',
      filterItem: '',
      buttonFlag: false,
      dialogVisible: false,
      curSelectd: []
    }
  },
  computed: {
    hostsInVuex() {
      return this.$store.state.host.hosts;
    },
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
          if(this.$route.name === 'VMwareList') {
            this.vmItems = data.filter(item => item.type==='1');
          } else {
            this.vmItems = data.filter(item => item.type==='2');
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
    scanVmFn(){
      this.dialogVisible = true;
    },
    judgeHost(data) {
      return hostTypeMapping[data.hostType];
    },
    selectChangeHandler(selection){
      console.log(selection);
      this.curSelectd = selection
    },
    comfirmFn(){
      const ids = this.curSelectd.map( e => {
        return e.hostIp
      });
      console.log(ids)
      this.dialogVisible = false;
      this.buttonFlag = true;
      rescan(ids).then( res => {
        const {message} = res.data;
        this.$message.success(message);
        this.fetchData();
      }).catch( error => {
        this.$message.error(error);
      }).then( () => {
        this.buttonFlag = false;
      })
    },
    closeHandler(){
      this.curSelectd = [];
      this.$refs.hostTable.clearSelection();
    }
    // judgeDatabase(data) {
    //   return databaseTypeMapping[data.databaseType];
    // },
  }
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style>
.el-table th{
  text-align: center;
}
.grid-content {
  min-height: 40px;
}
.input-with-select {
  background-color: #fff;
}
</style>