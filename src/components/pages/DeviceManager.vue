<template>
  <section>
    <el-row>
      <el-form inline>
        <el-form-item style="float: left" class="input-with-select">
          <el-input placeholder="请输入内容"
                    v-model="inputSearch"
                    @keyup.enter.native="searchByName">
            <el-select v-model="selectTag" slot="prepend" placeholder="请选择" style="width: 90px;">
              <el-option label="设备名" value="name"></el-option>
              <el-option label="设备IP" value="hostIp"></el-option>
              <el-option label="操作IP" value="serviceIp"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="createModalVisible = true">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="processedTableData"
              @filter-change="filterChange"
              style="width: 100%">
      <el-table-column label="序号"
                       min-width="100"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pageSize}}
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="设备名"
                       min-width="150"
                       align="center">
        <template slot-scope="scope">
          <span v-html="showData(scope.row.name, scope.column.property)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="hostIp"
                       label="设备IP"
                       min-width="150"
                       align="center">
        <template slot-scope="scope">
          <span v-html="showData(scope.row.hostIp, scope.column.property)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceIp"
                       label="操作IP"
                       min-width="150"
                       align="center">
        <template slot-scope="scope">
          <span v-html="showData(scope.row.serviceIp || '', scope.column.property)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="hostType"
                       label="设备类型"
                       :formatter="judgeHost"
                       :filters="hostTypeFilters"
                       column-key="hostType"
                       min-width="120"
                       align="center"></el-table-column>
      <el-table-column prop="databaseType"
                       label="用途类型"
                       :formatter="judgeDatabase"
                       :filters="databaseTypeFilters"
                       column-key="databaseType"
                       min-width="120"
                       align="center"></el-table-column>
      <el-table-column prop="osName"
                       label="操作系统"
                       :formatter="judgeOsName"
                       :filters="osNameFilters"
                       column-key="osName"
                       min-width="120"
                       align="center"></el-table-column>
      <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="140"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       min-width="120"
                       header-align="center"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="selectOne(scope)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteDb(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="pageSize"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <host-create-modal type="host"
                       :visible.sync="createModalVisible"
                       @confirm="createItem"
                       :btn-loading="btnLoading"></host-create-modal>
    <host-update-modal type="host"
                       :visible.sync="updateModalVisible"
                       :item-info="selectedHost"
                       @confirm="updateItem"
                       :btn-loading="btnLoading"></host-update-modal>
  </section>
</template>
<script>
import { listMixin } from '../mixins/databaseListMixin';
import { webSocketMixin, paginationMixin, filterMixin } from '../mixins/commonMixin';
import HostCreateModal from '../modal/HostCreateModal';
import HostUpdateModal from '../modal/HostUpdateModal';
// import { fetchAll, deleteOne } from '../../api/host';
import { mapActions } from 'vuex';
import { hostTypeMapping, databaseTypeMapping, windowsTypeMapping } from '../../utils/constant';

export default {
  name: 'DeviceManager',
  // mixins: [listMixin, webSocketMixin],
  mixins: [listMixin, paginationMixin, filterMixin],
  data() {
    return {
      wsuri: '/test',
      selectedId: '',
      hostTypeFilters: [
        {text: '生产环境', value: 1},
        {text: '易备环境', value: 2}
      ],
      databaseTypeFilters: [
        {text: 'oracle', value: 1},
        {text: 'sqlserver', value: 2},
        {text: '虚拟机', value: 4},
        {text: 'mysql', value: 5},
        {text: 'db2', value: 6},
        {text: '达梦', value: 7},
      ],
      osNameFilters: [
        {text: 'Windows', value: 'Windows'},
        {text: 'Linux', value: 'Linux'}
      ],
      tableData: [],
      tableFilter: {}
    };
  },
  computed: {
    // 从vuex中获取hosts列表
    hostsInVuex() {
      return this.$store.state.host.hosts;
    },
    selectedHost() {
      return this.$store.getters.selectedHost(this.selectedId);
    },
  },
  watch: {
    hostsInVuex(data){
      this.tableData = this.hostsInVuex;
    }
  },
  created() {
    // if (sessionStorage.getItem("store") ) {
    //     this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    // }
    // //在页面刷新时将vuex里的信息保存到sessionStorage里
    // window.addEventListener("beforeunload",()=>{
    //     sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    // })
    this.tableData = this.hostsInVuex;
    this.fetchHosts()
  },
  methods: {
    judgeHost(data) {
      return hostTypeMapping[data.hostType];
    },
    judgeOsName(data){
      let str = data.osName;
      if(data.osName === 'Windows' && data.databaseType === 2 && windowsTypeMapping[data.windowsType]){
        str += (' ' + windowsTypeMapping[data.windowsType]);
      }
      return str;
    },
    judgeDatabase(data) {
      return databaseTypeMapping[data.databaseType];
    },
    // 搜索关键字高亮
    showData(val, property) {
      val = val + '';
      if (val.includes(this.inputSearch) && this.inputSearch && this.selectTag === property) {
        return val.replace(this.inputSearch, '<font color="#409EFF">'+this.inputSearch+'</font>');
      }
      return val;
    },
    fetchData() {},
    fetchHosts(){
      // 判断是刷新还是页面正常跳转
      if(this.$route.meta.isRefresh){
        return
      }
      this.fetchAll().catch( error => {
        // this.$message.error( error);
        this.errorMessage( error);
      });
    },
    filterChange(filters) {
      this.tableFilter = Object.assign({},this.tableFilter, filters);
      this.filter = Object.assign({}, this.filter, this.tableFilter);
      this.currentPage = 1;
    },
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      }else {
        return item[i].toLowerCase().includes(this.filter[i].toLowerCase());
      }
    },
    searchByName(){
      this.filter = Object.assign({}, this.tableFilter, {[this.selectTag]: this.inputSearch});
      this.currentPage = 1;
    },
    createItem(host) {
      this.btnLoading = true;
      this.create(host)
        .then(res => {
          this.createModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          // this.$message.error(error);
          this.errorMessage(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    deleteDb({ row: host, $index }) {
      this.$confirm('确认删除此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => this.delete(host.id))
        .then(() => {
          this.$message.success({
            message: '删除成功!',
          });
        })
        .catch(error => {
          // if (error !== 'cancel') this.$message.error(error);
          if (error !== 'cancel') this.errorMessage(error);
        });
    },
    updateItem(host) {
      this.btnLoading = true;
      this.update(host)
        .then(res => {
          this.updateModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          // this.$message.error(error);
          this.errorMessage(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    wsCall(e) {
    },
    ...mapActions({
      update: 'updateHost',
      delete: 'deleteHost',
      create: 'createHost',
      fetchAll: 'fetchHost'
    }),
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = Object.assign({}, this.tableFilter);
      }
    }
  },
  components: {
    HostCreateModal,
    HostUpdateModal,
  },
  beforeRouteEnter (to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
      if(from.path === '/'){
        to.meta.isRefresh = true;
      }else{
        to.meta.isRefresh = false;
      }
      next();
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
