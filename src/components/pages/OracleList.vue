<template>
  <section>
    <el-row>
      <el-form inline
               size="medium">
        <el-form-item style="float: left">
          <el-input placeholder="请输入名称"
                    v-model="inputSearch"
                    @keyup.enter.native="searchByName">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>          
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="info"
                    @click="$router.push({name: 'oracleTakeOver'})">一键接管</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary"
                    @click="createModalVisible = true">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="currentItems|filterBySearch(filterItem)|filterByPage(currentPage, pagesize)"
              style="width: 100%"
              @filter-change="filterChange"
              v-if="items">
      <el-table-column label="序号"
                       min-width="100"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        :class="$style.link">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="instanceName"
                       label="实例名"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="host.hostIp"
                       label="主机IP"
                       min-width="200"
                       align="center"></el-table-column>
      <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="role"
                       label="角色"
                       :filters="stateFilters"
                       column-key="role"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="roleTagType(scope.row.role)"
                  size="mini">
            {{ databaseRole(scope.row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state"
                       label="状态"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="stateTagType(scope.row.state)"
                  size="mini">
            {{ databaseState(scope.row.state) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
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
    <div class="block" style="text-align: right">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="pagesize"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="currentItems|filterBySearch(filterItem).length"
                     v-if="items">
      </el-pagination>
    </div>
    <database-create-modal type="oracle"
                           :visible.sync="createModalVisible"
                           :btn-loading="btnLoading"
                           @confirm="createDb"></database-create-modal>
    <database-update-modal type="oracle"
                           :visible.sync="updateModalVisible"
                           :btn-loading="btnLoading"
                           :item-info="selectedDb"
                           @confirm="updateDb"></database-update-modal>
  </section>
</template>
<script>
import DatabaseCreateModal from '@/components/DatabaseCreateModal';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import { fetchAll, deleteOne, createOne, modifyOne } from '../../api/oracle';
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
          this.currentItems = this.items;
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
      })
        .then(() => {
          deleteOne(db.id)
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
    createDb(data) {
      this.btnLoading = true;
      createOne(data)
        .then(res => {
          const { data: db, message } = res.data;
          this.items.push(db);
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
    updateDb(data) {
      this.btnLoading = true;
      modifyOne(data)
        .then(res => {
          const { data: oracle, message } = res.data;
          // FIXME: mock数据保持id一致，生产环境必须删除下面一行
          oracle.id = this.selectedDb.id;
          this.items.splice(
            this.items.findIndex(db => db.id === oracle.id),
            1,
            oracle
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
    DatabaseCreateModal,
    DatabaseUpdateModal,
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
