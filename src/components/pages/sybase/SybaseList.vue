<template>
  <section>
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入名称"
                  v-model="inputSearch"
                  @keyup.enter.native="searchByName">
          <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="primary"
                   @click="addFn"
                   style="float: right">添加</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-table :data="processedTableData">
        <el-table-column label="序号"
                        min-width="50"
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
                        label="数据库名"
                        min-width="150"
                        align="center"></el-table-column>
        <el-table-column prop="host.hostIp"
                        label="主机IP"
                        min-width="150"
                        align="center"></el-table-column>
        <el-table-column prop="dbPort"
                        label="端口"
                        align="center"
                        width="80"></el-table-column>
        <el-table-column prop="state"
                        label="状态"
                        width="80"
                        align="center">
          <template slot-scope="scope">
            <el-tag :type="stateTagType(scope.row.state)"
                    size="mini">
              {{ databaseState(scope.row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loginName"
                         label="登录账号"
                         min-width="120"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         width="120"
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
      <el-pagination style="margin-top: 10px; text-align: right"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="pageSize"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-row>
    <database-modal :visible.sync="createModalVisible"
                    :btn-loading="btnLoading"
                    :action="action"
                    :data="currentSelectData"
                    @confirm="confirmCall"></database-modal>
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/sybase/DatabaseModal';
import tableMixin from '@/components/mixins/databaseTableMixin';
export default {
  name: 'SybaseList',
  mixins: [tableMixin],
  data() {
    return {
      databaseType: 'sybase'
    }
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = {};
        this.currentPage = 1;
      }
    }
  },
  methods: {
    filterFn(item, i){
      return item[i].toLowerCase().includes( this.filter[i].toLowerCase());
    },
    searchByName(){
      const name = this.inputSearch;
      this.filter = Object.assign({},{name});
      this.currentPage = 1;
    },
    deleteDb(scope) {
      this.delete(scope, '确认删除此数据库?');
    }
  },
  components: {
    DatabaseModal
  },
}
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