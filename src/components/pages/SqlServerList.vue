<template>
  <section>
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="createModalVisible = true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dbs" style="width: 100%">
      <el-table-column label="数据库名称" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="`${scope.row.id}`" append class="name-link">{{scope.row.name}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="instanceName" label="数据库实例名" width="150" align="center"></el-table-column>
      <el-table-column prop="hostName" label="主机名" min-width="200" align="center"></el-table-column>
      <el-table-column prop="hostIp" label="主机IP" width="200" align="center"></el-table-column>
      <el-table-column label="操作" width="100" header-align="center" align="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" class="ws-mini" @click="selectOne(scope)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" class="ws-mini" @click="deleteDb(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <database-create-modal db-type="sqlserver" :visible.sync="createModalVisible" @confirm="dbs.push(arguments[0])"></database-create-modal>
    <database-update-modal db-type="sqlserver" :visible.sync="updateModalVisible" :database-info="selectedDb" @confirm="updateDb"></database-update-modal>
  </section>
</template>
<script>
import DatabaseCreateModal from '@/components/DatabaseCreateModal';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import { fetchAll, deleteOne } from '../../api/sqlserver';
import databaseListMixin from '../mixins/databaseListMixin';

export default {
  name: 'SqlServer',
  mixins: [databaseListMixin],
  methods: {
    // 从服务器获取所有的Oracle数据库
    fetchData() {
      fetchAll()
        .then(res => {
          const { data: sqlservers } = res.data;
          this.dbs = sqlservers;
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error,
          });
        });
    },
    deleteDb({ row: db, $index }) {
      this.$confirm('确认删除此数据库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => deleteOne(db.id))
        .then(() => {
          this.dbs.splice($index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {});
    },
  },
  components: {
    DatabaseCreateModal,
    DatabaseUpdateModal,
  },
};
</script>
<style scoped>
.name-link {
  color: #409eff;
  text-decoration: none;
}
.cell button.ws-mini {
  padding: 7px;
}
</style>