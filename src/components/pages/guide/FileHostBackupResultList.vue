<template>
  <div style="position: relative">
    <el-table :data="backupResults"
              default-expand-all>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <file-host-backup-result  :data="scope.row.fmtData"
                                    :backupType="scope.row.backupType"
                                    :type="type"
                                    :index="scope.$index"
                                    :next-step="nextStep"
                                    @single-restore-btn-click="restoreResultBtnClick"
                                    @delete-result-by-id="deleteResultById"
                                    @cancel-step="$emit('cancel-step')"></file-host-backup-result>
        </template>
      </el-table-column>
      <el-table-column label="备份计划名称"
                       prop="name"
                       min-width="180px"
                       align="center"></el-table-column>
      <el-table-column label="计划创建时间"
                       prop="createTime"
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
             class="el-icon-success successColor"></i>
          <i v-else
             class="el-icon-error errorColor"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="100px"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="del(scope.row)">删除</el-button>
          <!-- <el-button type="text"
                     style="margin-left:0"
                     size="small"
                     :disabled="scope.row.backupType === 3"
                     @click="restorePlanBtnClick(scope.row)">恢复</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { filehostBackupTypeMapping } from '@/utils/constant';
import FileHostBackupResult from '@/components/pages/guide/FileHostBackupResult';
import { baseMixin } from '@/components/mixins/guideMixins';
import { fmtSizeFn } from '@/utils/common';
export default {
  name: 'FileHostBackupResultList',
  components: {
    FileHostBackupResult
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
    nextStep: {
      type: String
    }
  },
  computed: {
    backupResults() {
      return this.fmtData(this.data);
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
        // eslint-disable-next-line
        state === 1;
      }
      return state;
    },
    fmtData(data) {
      return data.map(res => {
        let filesData = res.backupFiles.map((r, i, arr) => {
          return Object.assign({}, r);
        });
        const map = {};
        filesData.forEach((result, index) => {
          const { size } = result;
          let fmtSize = 0;
          fmtSize = fmtSizeFn(size);
          // eslint-disable-next-line
          result.size = fmtSize ? fmtSize : 0;
          if (!map[result.sourcePath]) {
            map[result.sourcePath] = [];
            map[result.sourcePath].push(result);
          } else {
            map[result.sourcePath].push(result);
          }
        });
        const fmtData = Object.keys(map).map(e => {
          const fData = map[e].sort((a, b) => {
            return dayjs(b.endTime) - dayjs(a.endTime);
          });
          return Object.assign({}, map[e][0], {list: fData});
        });
        res.fmtData = fmtData;
        if (fmtData.find(item => item.state === 1)) {
          res.state = 1;
        } else {
          res.state = 0;
        }
        return res;
      });
    },
    keepTwoDecimalFull(num) {
      return Math.round(num * 100) / 100;
    },
    // 点击恢复按钮
    restoreResultBtnClick(id, backupType, type) {
      this.$emit('single-restore-btn-click', id, backupType, type);
    },
    restorePlanBtnClick({ id, backupType }) {
      this.$emit('single-restore-btn-click', id, backupType, 'restorePlan');
    },
    deleteResultById(id) {
      this.$emit('delete-result-by-id', id);
    },
    del(row) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('delete-result-by-plan-id', row.id);
        })
        .catch(() => { });
    },
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/guide.scss';
@import '@/style/color.scss';
.el-table {
  overflow: visible;
  /deep/
  .el-table__body-wrapper {
    overflow: visible;
  }
}
</style>
