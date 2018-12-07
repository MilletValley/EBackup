<template>
  <section>
    <el-row>
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
                      @click="addFn">添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="filteredInfos"
              style="width: 100%">
      <el-table-column label="主机名"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        :class="$style.link">{{scope.row.hostName}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="别名"
                       prop="hostAlias"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column prop="hostIp"
                       label="主机IP"
                       min-width="200"
                       align="center"></el-table-column>
      <el-table-column prop="osName"
                       label="操作系统"
                       min-width="150"
                       align="center"></el-table-column>
      <el-table-column label="创建时间"
                       min-width="180"
                       align="center">
        <template slot-scope="scope">
          <el-tag size="mini">{{ scope.row.createTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="150"
                       header-align="center"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="modifyFn(scope)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="deleteFileHost(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <database-modal  :visible.sync="modalVisible"
                     :btn-loading="btnLoading"
                     :action="action"
                     :data="currentSelectData"
                     @confirm="confirmCall"></database-modal>
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/file/DatabaseModal';
import { applyFilterMethods } from '@/utils/common';
import { sortMixin } from '@/components/mixins/commonMixin';
import { fetchAll, createOne, modifyOne, deleteOne } from '@/api/file';
const OperateFileHost = {
  create: createOne,
  update: modifyOne
}
export default {
  name: 'FileHostList',
  mixins: [sortMixin],
  data() {
    return {
      sysTypeFilter: ['Windows', 'Linux'],
      tableData: [],
      modalVisible: false,
      action: 'create',
      currentSelectData: null,
      btnLoading: false,
      defaultSort: { prop: 'createTime', order: 'descending' },
    };
  },
  computed: {
    sortInfos() {
      return this.sortFn(this.tableData, this.defaultSort.prop, this.defaultSort.order)
    },
    filteredInfos() {
      const filterMethods = [];
      filterMethods.push(info => this.sysTypeFilter.indexOf(info.osName) >= 0);
      return applyFilterMethods(this.sortInfos, filterMethods);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.tableData = Array.isArray(data) ? data : [];
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    addFn() {
      this.modalVisible = true;
      this.action = 'create';
      this.currentSelectData = null;
    },
    modifyFn(scope) {
      this.modalVisible = true;
      this.action = 'update';
      this.currentSelectData = scope.row;
    },
    deleteFileHost(scope) {
      this.$confirm('此操作将删除此系统', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteOne(scope.row.id)
            .then(() => {
              this.fetchData();
              this.$message.success({
                message: '删除成功!',
              });
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => {});
    },
    confirmCall(data, type) {
      this.btnLoading = true;
      OperateFileHost[type](data)
        .then(res => {
          const { message } = res.data;
          this.fetchData();
          this.$message.success(message);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.modalVisible = false;
          this.btnLoading = false;
        })
    }
  },
  components: {
    DatabaseModal
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>