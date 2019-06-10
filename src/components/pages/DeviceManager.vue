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
                       min-width="60"
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
                       min-width="120"
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
                       min-width="100"
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
                       :filters="Array.from(new Array('Windows', 'Linux', 'AIX'), val => ({text: val, value: val}))"
                       column-key="osName"
                       min-width="120"
                       align="center"></el-table-column>
      <!-- <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="100"
                       show-overflow-tooltip
                       align="center"></el-table-column> -->
      <el-table-column prop="storeType"
                       label="存储方式"
                       min-width="100"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.storeType | storeTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="200"
                       header-align="center"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-row>
            <i-icon name="monitor" class="monitorClass" @click.native="linkMonitor(scope)"></i-icon>
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
                      @click="deleteItem(scope)"></el-button>
          </el-row>
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
                       :host-names="hostNames"
                       @confirm="createItem"
                       :btn-loading="btnLoading"></host-create-modal>
    <host-update-modal type="host"
                       :visible.sync="updateModalVisible"
                       :host-names="hostNames"
                       :item-info="selectedHost"
                       @confirm="updateItem"
                       :btn-loading="btnLoading"></host-update-modal>
  </section>
</template>
<script>
import { listMixin } from '@/components/mixins/databaseListMixin';
import { webSocketMixin, paginationMixin, filterMixin, sortMixin } from '@/components/mixins/commonMixin';
import HostCreateModal from '@/components/modal/HostCreateModal';
import HostUpdateModal from '@/components/modal/HostUpdateModal';
import { createOne, deleteOne, modifyOne } from '@/api/host';
import { getMonitorInfo } from '@/api/home';
import { mapActions } from 'vuex';
import { storeTypeMapping } from '@/utils/constant';
import {
  hostTypeMapping,
  databaseTypeMapping,
  windowsTypeMapping,
  oracleVersionMapping
} from '@/utils/constant';

export default {
  name: 'DeviceManager',
  mixins: [listMixin, paginationMixin, filterMixin, sortMixin],
  data() {
    return {
      wsuri: '/test',
      selectedId: '',
      tableData: [],
      tableFilter: {},
      defaultSort: { prop: 'createdTime', order: 'descending' },
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
    hostNames() {
      return this.tableData.map(host => host.name);
    },
    hostTypeFilters() {
      return Object.keys(hostTypeMapping).map(type => ({
        text: hostTypeMapping[Number(type)],
        value: Number(type)
      }))
    },
    databaseTypeFilters() {
      return Object.keys(databaseTypeMapping).map(db => ({
        text: databaseTypeMapping[Number(db)],
        value: Number(db)
      }))
    }
  },
  filters: {
    storeTypeFilter(type) {
      return storeTypeMapping[type];
    }
  },
  watch: {
    hostsInVuex(data){
      this.tableData = Object.assign([], this.hostsInVuex);
    },
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = Object.assign({}, this.tableFilter);
        this.currentPage = 1;
      }
    }
  },
  created() {
    this.tableData = Object.assign([], this.hostsInVuex);
  },
  methods: {
    judgeHost(data) {
      return hostTypeMapping[data.hostType];
    },
    judgeOsName(data){
      let str = data.osName;
      if(data.osName === 'Windows' && [2, 10, 11].includes(data.databaseType) && windowsTypeMapping[data.windowsType]){
        str += (' ' + windowsTypeMapping[data.windowsType]);
      }
      return str;
    },
    judgeDatabase(data) {
      let db = databaseTypeMapping[data.databaseType];
      if(data.databaseType=== 1) {
        return db + ' ' + oracleVersionMapping[data.oracleVersion];
      }
      return db;
    },
    // 搜索关键字高亮
    showData(val, property) {
      val = val + '';
      const firstIndex = val.toLowerCase().indexOf(this.inputSearch.toLowerCase());
      if (firstIndex>-1 && this.inputSearch && this.selectTag === property) {
        const highLightWords = val.substr(firstIndex, this.inputSearch.length);
        return val.replace(highLightWords, '<font color="#409EFF">'+highLightWords+'</font>');
      }
      return val;
    },
    fetchData() {},
    filterChange(filters) {
      this.tableFilter = Object.assign({},this.tableFilter, filters);
      this.filter = Object.assign({}, this.filter, this.tableFilter);
      this.currentPage = 1;
    },
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      } else {
        return item[i].toLowerCase().includes(this.filter[i].toLowerCase());
      }
    },
    searchByName(){
      this.filter = Object.assign({}, this.tableFilter, {[this.selectTag]: this.inputSearch});
      this.currentPage = 1;
    },
    linkMonitor({row}) {
      const objId = row.id;
      getMonitorInfo(objId, 'device').then(res => {
        const {message, data} = res.data;
        const {token, id, origin} = data;
        let popup = window.open(origin + '/monitor/common');
        window.addEventListener('message', e => {
          if (e.data === 'monitor') {
            let obj = {
              token,
              id,
              type: 'deviceDashboard'
            }
            popup.postMessage(obj, origin);
          }
        });
      }).catch(error => {
        this.errorMessage(error);
      })
    },
    createItem(host) {
      this.btnLoading = true;
      if(!(host.osName === 'Windows' && [2, 10, 11].includes(host.databaseType))) {
        delete host.windowsType;
      }
      createOne(host)
        .then(res => {
          this.createModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          this.errorMessage(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    deleteItem({ row: host }) {
      this.$confirm('确认删除此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOne(host.id)
            .then(() => {
              this.$message.success({ message: '删除成功!' });
            })
            .catch(error =>{
              this.errorMessage(error);
            })
        })
        .catch(error => {
          this.$message.info('已取消删除操作!');
        });
    },
    updateItem(host) {
      this.btnLoading = true;
      if(!(host.osName === 'Windows' && [2, 10, 11].includes(host.databaseType))) {
        delete host.windowsType;
      }
      modifyOne(host)
        .then(res => {
          this.updateModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          this.errorMessage(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    wsCall(e) {
    },
  },
  components: {
    HostCreateModal,
    HostUpdateModal,
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>

