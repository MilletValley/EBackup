<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: 'oracleTakeOver'})">一健接管</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="createModalVisible = true">添加</el-button>
      </el-form-item>

    </el-form>
    <el-table :data="items"
              style="width: 100%">
      <el-table-column label="名称"
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
      <el-table-column prop="instanceName"
                       label="实例名"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="hostIp"
                       label="主机IP"
                       width="200"
                       align="center"></el-table-column>
      <el-table-column prop="loginName"
                       label="登陆账号"
                       width="250"
                       align="center"></el-table-column>
      <el-table-column prop="state"
                       label="状态"
                       width="150"
                       :formatter="stateFormatter"
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
    <database-create-modal type="oracle"
                           :visible.sync="createModalVisible"
                           @confirm="items.push(arguments[0])"></database-create-modal>
    <database-update-modal type="oracle"
                           :visible.sync="updateModalVisible"
                           :item-info="selectedDb"
                           @confirm="updateDb"></database-update-modal>
  </section>
</template>
<script>
import DatabaseCreateModal from '@/components/DatabaseCreateModal';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import { fetchAll, deleteOne } from '../../api/oracle';
import { listMixin } from '../mixins/databaseListMixin';

export default {
  name: 'OracleList',
  mixins: [listMixin],
  methods: {
    // 从服务器获取所有的Oracle数据库
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
    deleteDb({ row: db, $index }) {
      this.$confirm('确认删除此数据库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() =>
        deleteOne(db.id)
          .then(() => {
            this.items.splice($index, 1);
            this.$message.success({
              message: '删除成功!',
            });
          })
          .catch(error => {
            if (error !== 'cancel') {
              // element-ui Message组件取消会进入catch 避免这种弹窗
              this.$message.error(error);
            }
          })
      );
    },
  },
  components: {
    DatabaseCreateModal,
    DatabaseUpdateModal,
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
