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
    <el-table :data="processedTableData"
              style="width: 100%"
              @filter-change="filterChange">
      <el-table-column label="序号"
                       min-width="100"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pageSize}}
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
      <!-- <el-table-column prop="loginName"
                       label="登录账号"
                       min-width="150"
                       align="center"></el-table-column> -->
      <el-table-column prop="role"
                       label="角色"
                       :filters="roleFilters"
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
                     @click="modifyDb(scope)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteDb(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="margin-top10 text-right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    <database-modal :visible.sync="createModalVisible"
                    :btn-loading="btnLoading"
                    :action="action"
                    :data="currentSelectData"
                    @confirm="confirmCall"></database-modal>
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/oracle/DatabaseModal';
import tableMixin from '@/components/mixins/databaseTableMixin';
import Vue from 'vue';
export default {
  name: 'OracleList',
  mixins: [tableMixin],
  data(){
    return {
      databaseType: 'oracle',
      // batchCreateModalVisible: false,
      tableFilter: {},
      roleFilters: [
        { text: '无连接', value: 0 },
        { text: '主库', value: 1 },
        { text: '备库', value: 2 }
      ]
    }
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = Object.assign({}, this.tableFilter);
        this.currentPage = 1;
      }
    }
  },
  methods: {
    filterChange(filters){
      this.tableFilter = Object.assign({}, this.tableFilter, filters);
      this.filter = Object.assign({}, this.filter, this.tableFilter);
    },
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      }else {
        return item[i].toLowerCase().includes(this.filter[i].toLowerCase());
      }
    },
    searchByName(){
      const name = this.inputSearch;
      this.filter = Object.assign({},{name}, this.tableFilter);
      this.currentPage = 1;
    },
    deleteDb(scope) {
      this.delete(scope, '确认删除此数据库?');
    },
  },
  components: {
    DatabaseModal
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style scoped>
.margin-top20{
  margin-top: 20px;
}
.margin-top10{
  margin-top: 10px;
}
.text-right{
  text-align: right;
}
</style>
