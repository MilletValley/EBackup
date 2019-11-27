<template>
  <el-dialog :visible.sync="modalVisible"
             custom-class="min-width-dialog">
    <span slot="title">
      以下备份集将同时被删除，请检查
    </span>
    <el-table :data="results">
      <el-table-column prop="fileName"
                       label="备份文件名"
                       align="left"
                       header-align="center"
                       width="200"></el-table-column>
      <el-table-column prop="startTime"
                       label="开始时间"
                       width="150"
                       align="center"></el-table-column>
      <el-table-column prop="endTime"
                       label="结束时间"
                       width="150"
                       align="center"></el-table-column>
      <el-table-column label="备份类型"
                       prop="backupType"
                       min-width="60px"
                       align="center">
        <template slot-scope="scope">
          <span>{{scope.row.backupType | backupTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       min-width="50px"
                       align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.state === 0"
             class="el-icon-success successColor"></i>
          <i v-else
             class="el-icon-error errorColor"></i>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirm"
                 :loading="btnLoading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dialogMixin from '@/components/mixins/dialogMixins';
export default {
  name: 'MultiplyDeleteResultsModal',
  props: ['btnLoading', 'visible', 'results'],
  mixins: [dialogMixin],
  filters: {
    backupTypeFilter(type) {
      const backupTypeMapping = {
        1: '全备',
        2: '增备'
      };
      return backupTypeMapping[type];
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.results);
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/color.scss';
</style>