<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="createModalVisible = true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="items"
              style="width: 100%">
      <el-table-column label="设备名"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="`${scope.row.id}`"
                         append
                         :class="$style.link">{{scope.row.name}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hostIp"
                       label="设备IP"
                       min-width="250"
                       align="center"></el-table-column>
      <el-table-column prop="osName"
                       label="操作系统"
                       width="250"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       width="150"
                       header-align="center"
                       align="center">
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
                           @confirm="items.push(arguments[0])"></host-create-modal>
    <host-update-modal type="host"
                           :visible.sync="updateModalVisible"
                           :item-info="selectedDb"
                           @confirm="updateDb"></host-update-modal>
  </section>
</template>
<script>
import { listMixin } from '../mixins/databaseListMixin';
import HostCreateModal from '../modal/HostCreateModal';
import HostUpdateModal from '../modal/HostUpdateModal';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import { fetchAll, deleteOne } from '../../api/host';
import { applyFilterMethods } from '../../utils/common';

export default {
  name: 'DeviceManager',
  mixins: [listMixin],
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.items = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    deleteDb({ row: host, $index }) {
      this.$confirm('确认删除此设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => deleteOne(host.id))
      .then(() => {
        this.items.splice($index, 1);
        this.$message.success({
          message: '删除成功!',
        });
      })
      .catch(error => {
        if (error !== 'cancel')
          // element-ui Message组件取消会进入catch 避免这种弹窗
          this.$message.error(error);
      });
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
