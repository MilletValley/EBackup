<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="createModalVisible = true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="hostsInVuex"
              style="width: 100%">
      <el-table-column prop="name"
                       label="设备名"
                       min-width="150"
                       align="center"
                       fixed>
      </el-table-column>
      <el-table-column prop="hostIp"
                       label="设备IP"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="serviceIp"
                       label="服务IP"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="hostType"
                       label="设备类型"
                       :formatter="judgeHost"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="databaseType"
                       label="用途类型"
                       :formatter="judgeDatabase"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="osName"
                       label="操作系统"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="140"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       min-width="150"
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
import HostCreateModal from '../modal/HostCreateModal';
import HostUpdateModal from '../modal/HostUpdateModal';
import { fetchAll, deleteOne } from '../../api/host';
import { mapActions } from 'vuex';
import {hostTypeMapping, databaseTypeMapping} from '../../utils/constant';

export default {
  name: 'DeviceManager',
  mixins: [listMixin],
  data() {
    return {
      selectedId: '',
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
  methods: {
    judgeHost(data) {
      return hostTypeMapping[data.hostType];
    },
    judgeDatabase(data) {
      return databaseTypeMapping[data.databaseType];
    },
    fetchData() {},
    createItem(host) {
      this.btnLoading=true;
      this.create(host)
        .then(res => {
          this.createModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading=false;
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
          if (error !== 'cancel')
            this.$message.error(error);
        });
    },
    updateItem(host) {
      this.btnLoading=true;
      this.update(host)
        .then(res => {
          this.updateModalVisible = false;
          this.$message.success(res.data.message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading=false;
        });
    },
    ...mapActions({
      update: 'updateHost',
      delete: 'deleteHost',
      create: 'createHost',
    }),
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
