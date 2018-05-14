<template>
  <section>
    <el-form inline size="small">
      <el-form-item label="筛选操作系统">
        <el-checkbox-group v-model="sysTypeFilter">
          <el-checkbox-button label="Windows"></el-checkbox-button>
          <el-checkbox-button label="Linux"></el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" @click="createModalVisible = true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="filteredInfos" style="width: 100%">
      <el-table-column label="主机名" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="`${scope.row.id}`" append class="name-link">{{scope.row.hostName}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hostIp" label="主机IP" width="200" align="center"></el-table-column>
      <el-table-column prop="osName" label="操作系统" width="200" align="center"></el-table-column>
      <el-table-column prop="application" label="所属业务系统" min-width="200" align="center"></el-table-column>
      <el-table-column label="操作" width="100" header-align="center" align="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" class="ws-mini" @click="selectOne(scope)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" class="ws-mini" @click="deleteDb(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <file-host-create-modal host-type="windows" :visible.sync="createModalVisible" @confirm="dbs.push(arguments[0])"></file-host-create-modal>
    <file-host-update-modal host-type="windows" :visible.sync="updateModalVisible" @confirm="updateDb" :file-host-info="selectedDb"></file-host-update-modal>
  </section>
</template>
<script>
import { listMixin } from '../mixins/databaseListMixin';
import { fetchAll, deleteOne } from '../../api/fileHost';
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
      return applyFilterMethods(this.dbs, filterMethods);
    },
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data: infos } = res.data;
          this.dbs = infos;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    deleteDb({ row: info, $index }) {
      this.$confirm('确认删除此数据库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => deleteOne(info.id))
        .then(() => {
          this.dbs.splice($index, 1);
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
    FileHostCreateModal,
    FileHostUpdateModal,
  },
};
</script>
<style>
.name-link {
  color: #409eff;
  text-decoration: none;
}
.cell button.ws-mini {
  padding: 7px;
}
</style>