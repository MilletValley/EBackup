<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item label="操作系统">
        <el-checkbox-group v-model="sysTypeFilter">
          <el-checkbox-button label="Windows"></el-checkbox-button>
          <el-checkbox-button label="Linux"></el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="createModalVisible = true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="filteredInfos"
              style="width: 100%">
      <el-table-column label="主机名"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="`${scope.row.id}`"
                         append
                         :class="$style.link">{{scope.row.hostName}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hostIp"
                       label="主机IP"
                       width="240"
                       align="center"></el-table-column>
      <el-table-column prop="osName"
                       label="操作系统"
                       width="220"
                       align="center"></el-table-column>
      <el-table-column prop="loginName"
                       label="登录账号"
                       width="200"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       width="150"
                       header-align="center"
                       align="right">
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
    <file-host-create-modal type="filehost"
                            :visible.sync="createModalVisible"
                            :btn-loading="btnLoading"
                            @confirm="createItem"></file-host-create-modal>
    <file-host-update-modal type="filehost"
                            :visible.sync="updateModalVisible"
                            :btn-loading="btnLoading"
                            @confirm="updateItem"
                            :item-info="selectedDb"></file-host-update-modal>
  </section>
</template>
<script>
import { listMixin } from '../mixins/databaseListMixin';
import { fetchAll, deleteOne, createOne, modifyOne } from '../../api/fileHost';
import FileHostCreateModal from '../modal/FileHostCreateModal';
import FileHostUpdateModal from '../modal/FileHostUpdateModal';
import { applyFilterMethods } from '../../utils/common';

export default {
  name: 'FileHostList',
  mixins: [listMixin],
  data() {
    return {
      sysTypeFilter: ['Windows', 'Linux'],
    };
  },
  computed: {
    filteredInfos() {
      const filterMethods = [];
      filterMethods.push(info => this.sysTypeFilter.indexOf(info.osName) >= 0);
      return applyFilterMethods(this.items, filterMethods);
    },
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data: infos } = res.data;
          this.items = infos;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    deleteDb({ row: info, $index }) {
      this.$confirm('此操作将删除此系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOne(info.id)
            .then(() => {
              this.items.splice($index, 1);
              this.$message.success({
                message: '删除成功!',
              });
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(error => {});
    },
    createItem(data) {
      this.btnLoading = true;
      createOne(data)
        .then(res => {
          const { data: item, message } = res.data;
          this.items.push(item);
          this.createModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    updateItem(data) {
      this.btnLoading = true;
      modifyOne(data)
        .then(res => {
          const { data: filehost, message } = res.data;
          // FIXME: mock数据保持id一致，生产环境必须删除下面一行
          filehost.id = this.selectedDb.id;
          this.items.splice(
            this.items.findIndex(item => item.id === filehost.id),
            1,
            filehost
          );
          this.selectedId = '';
          this.updateModalVisible = false;
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
  },
  components: {
    FileHostCreateModal,
    FileHostUpdateModal,
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
