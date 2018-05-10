<template>
  <el-table :data="data" style="width: 100%; margin-top: 15px" :default-sort="{ prop: 'startTime', order: 'descending' }">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-form inline label-width="90px" size="small" class="result-detail-form">
          <el-form-item label="ID">
            <span>{{ scope.row.id }}</span>
          </el-form-item>
          <el-form-item label="存储路径">
            <span>{{ scope.row.path }}</span>
          </el-form-item>
          <el-form-item label="开始时间">
            <span>{{ scope.row.startTime }}</span>
          </el-form-item>
          <el-form-item label="文件名">
            <span>{{ scope.row.fileName }}</span>
          </el-form-item>
          <el-form-item label="结束时间">
            <span>{{ scope.row.endTime }}</span>
          </el-form-item>
          <el-form-item label="文件标识符" v-if="isFileBackupResult">
            <span>{{ scope.row.identifier }}</span>
          </el-form-item>
          <el-form-item label="大小">
            <span>{{ scope.row.size }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>
              <el-tag size="mini" :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
            </span>
          </el-form-item>
          <el-form-item label="持续时间">
            <span>{{ scope.row.consume | durationFilter }}</span>
          </el-form-item>
          <el-form-item label="信息" v-if="isFileBackupResult && scope.row.state === 1">
            <span>{{ scope.row.errorMsg }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="文件标识符" prop="identifier" v-if="isFileBackupResult" width="200px" align="center"></el-table-column>
    <el-table-column label="备份文件名" prop="fileName" min-width="180px" align="left" header-align="center"></el-table-column>
    <el-table-column label="开始时间" prop="startTime" width="200px" align="center"></el-table-column>
    <el-table-column label="结束时间" prop="endTime" width="200px" align="center"></el-table-column>
    <el-table-column label="大小" prop="size" width="120px" align="center"></el-table-column>
    <el-table-column label="状态" prop="state" width="70px" align="center">
      <template slot-scope="scope">
        <i :class="{ 'el-icon-success': scope.row.state === 0, 'el-icon-error': scope.row.state === 1 }"></i>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="100px">
      <template slot-scope="scope">
        <el-button type="text" size="small">恢复</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import backupMixin from './mixins/backupMixins';
import { backupResultMapping } from '../utils/constant';

export default {
  name: 'BackupResultList',
  mixins: [backupMixin],
  props: {
    data: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: '',
    },
  },
  methods: {
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
  },
  computed: {
    isFileBackupResult() {
      return this.type === 'filebackup';
    },
  },
};
</script>
<style scoped>
.result-detail-form .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}
.result-detail-form .el-form-item:nth-child(2n) {
  width: 69%;
}
.el-icon-success {
  color: rgb(39, 202, 39);
}
.el-icon-error {
  color: rgb(202, 39, 39);
}
</style>
