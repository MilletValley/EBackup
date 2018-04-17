<template>
  <section>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="showModalForCreate">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="oracles" style="width: 100%">
      <el-table-column label="数据库名称" width="200">
        <template slot-scope="scope">
          <el-button type="text">{{scope.row.instanceName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hostName" label="主机名" width="200"></el-table-column>
      <el-table-column prop="hostIp" label="主机IP" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" class="ws-mini" @click="selectOne(scope)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" class="ws-mini" @click="deleteOracle(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <DatabaseEditForm db-type="oracle" :operation-type.sync="operationType" :selected-db.sync="selectedDb" :onCreateComplete="createOracle" :onUpdateComplete="updateOracle"></DatabaseEditForm>
  </section>
</template>
<script>
import DatabaseEditForm from '../DatabaseEditModal.vue';
import { fetchAll, deleteOne } from '../../api/oracle';
export default {
  name: 'Oracle',
  props: {},
  data() {
    return {
      oracles: [],
      operationType: '', // update or create
      selectedId: '',
    };
  },
  computed: {
    selectedDb: {
      // 从oracles列表中筛选出对应的一条记录
      get() {
        return this.selectedId === ''
          ? {}
          : Object.assign(
              {},
              this.oracles.filter(db => db.id === this.selectedId)[0]
            );
      },
      set(data) {
        this.selectedId = '';
      },
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 从服务器获取所有的Oracle数据库
    fetchData() {
      fetchAll()
        .then(res => {
          const { data: oracles } = res.data;
          this.oracles = oracles;
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error,
          });
        });
    },
    selectOne({ row: db }) {
      this.operationType = 'update';
      this.selectedId = db.id;
    },
    showModalForCreate() {
      this.operationType = 'create';
      this.selectedId = '';
    },
    // 新增成功后的回调
    createOracle(data) {
      this.oracles.push(data);
    },
    deleteOracle({ row: db, $index }) {
      this.$confirm('确认删除此数据库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => deleteOne(db.id))
        .then(() => {
          console.log($index);
          this.oracles.splice($index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {});
    },
    // 更新后的回掉
    updateOracle(data) {
      const { id } = data;
      // 使用splice替换oracles列表中被选中的记录
      this.oracles.splice(this.oracles.findIndex(db => db.id === id), 1, data);
    },
  },
  components: { DatabaseEditForm },
};
</script>
<style>
.cell button.ws-mini {
  padding: 7px;
}
</style>
