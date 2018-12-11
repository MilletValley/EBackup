<template>
  <section>
    <el-table :data="backupResults">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <backup-result  :data="scope.row.backupFiles"
                          :backupType="scope.row.backupType"
                          :type="type"
                          @single-restore-btn-click="restoreResultBtnClick"
                          @refresh="refreshResults"></backup-result>
        </template>
      </el-table-column>
      <el-table-column label="备份计划名称"
                       prop="name"
                       min-width="180px"
                       align="center"></el-table-column>
      <el-table-column label="备份开始时间"
                       prop="startTime"
                       min-width="180px"
                       align="center"
                       header-align="center"></el-table-column>
      <el-table-column  label="备份类型"
                       prop="backupType"
                       min-width="100px"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.backupType |fileHostBackupTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       min-width="70px"
                       align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.state === 0"
             class="el-icon-success"
             :class="$style.successColor"></i>
          <i v-else
             class="el-icon-error"
             :class="$style.errorColor"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="100px"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="del(scope.row)">删除</el-button>
          <el-button type="text"
                      style="margin-left:0"
                     size="small"
                     @click="restorePlanBtnClick(scope.row)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import { filehostBackupTypeMapping } from '@/utils/constant';
import BackupResult from '@/components/pages/file/BackupResult';
import { deleteResultByPlanId } from '@/api/file';
export default {
  name: 'BackupResultList',
  components: {
    BackupResult
  },
  props: {
    type: {
      type: String
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
  },
  computed: {
    backupResults() {
      return this.data.map(result => {
        if(result.backupFiles.find(item => item.state === 1)) {
          result.state = 1;
        } else {
          result.state = 0;
        }
        return result;
      })
    }
  },
  filters: {
    fileHostBackupTypeFilter(val) {
      return filehostBackupTypeMapping[val];
    }
  },
  methods: {
    getState(row) {
      const result = row.backupFiles;
      const state = 0;
      try {
        result.forEach(i => {
          if (i.state === 1) {
            throw new Error('跳出');
          }
        });
      } catch (error) {
        state === 1;
      }
      return state;
    },
    // 点击恢复按钮
    restoreResultBtnClick(id, backupType, type) {
      this.$emit('single-restore-btn-click', id, backupType, type);
    },
    restorePlanBtnClick({ id, backupType }) {
      this.$emit('single-restore-btn-click', id, backupType, 'restorePlan');
    },
    del(row) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const id = row.id;
          deleteResultByPlanId(id).then(res => {
            const {message} = res.data;
            this.$message.success(message);
          }).catch( error => {
            this.$message.error(error);
          }).then(() => {
            this.refreshResults();
          })
        })
        .catch(() => { });
      // this.$emit('deleteResult', row.id);
    },
    refreshResults() {
      this.$emit('refresh');
    }
  }
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
</style>
