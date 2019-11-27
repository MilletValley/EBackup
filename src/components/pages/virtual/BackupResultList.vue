<template>
  <section>
    <el-row>
      <div>
        <el-button type="text" :icon="buttonIcon" @click="showFilter = !showFilter">过滤</el-button>
        <div style="float: right">
          <el-tooltip effect="dark" content="刷新" placement="top">
            <i class="el-icon-refresh stateRefresh" @click="$emit('resultinfo:refresh')"></i>
          </el-tooltip>
          <el-button type="text" @click="cancelPlanFilter">显示所有</el-button>
        </div>
      </div>
      <el-row v-show="showFilter">
        <el-form ref="filterForm" :model="filterForm" label-width="150px" size="small">
          <el-form-item label="备份文件名：" prop="fileName"
                        v-if="vmType !== 4">
            <el-input v-model="filterForm.fileName" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="开始时间：" prop="startTime">
            <el-date-picker
              v-model="filterForm.startTime"
              type="datetimerange"
              :unlink-panels="true"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endTime">
            <el-date-picker
              v-model="filterForm.endTime"
              type="datetimerange"
              :unlink-panels="true"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <span style="margin-left:40px">
              <el-button size="mini" type="primary" @click="filterHandler">搜索</el-button>
              <el-button size="mini"  @click="resetFn">重置</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-row>
    </el-row>
    <el-table :data="data|NotNullfilter|filterFn(filterValue)|planIdFilters(operationId)"
              style="width: 100%; margin-top: 15px"
              @expand-change="expandChange"
              :default-sort="{ prop: 'endTime', order: 'descending' }">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form inline
                   label-width="100px"
                   size="small"
                   class="result-detail-form">
            <!-- <el-form-item class="detailFormItem"
                          label="ID">
              <span>{{ scope.row.id }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="备份类型">
              <span>{{scope.row.backupType |backupTypeFilter}}</span>
            </el-form-item> -->
            <el-form-item class="detailFormItem"
                          label="开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="存储目标路径">
              <span>{{ scope.row.path }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="结束时间">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="文件名"
                          v-if="vmType !== 4">
              <span>{{ scope.row.fileName }}</span>
            </el-form-item>
            
            <el-form-item class="detailFormItem"
                          label="大小">
              <span>{{ scope.row.size }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="状态">
              <span>
                <el-tag size="mini"
                        :type="stateTagStyle(scope.row.state)">{{ stateMapping[scope.row.state] }}</el-tag>
              </span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="持续时间">
              <span>{{ scope.row.consume | durationFilter }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="迁移状态">
              <span>
                {{ migrationStateMapping[scope.row.migrationState] ? migrationStateMapping[scope.row.migrationState] : 'NFS存储' }}
              </span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="错误信息"
                          v-if="scope.row.state === 1">
              <span>{{ scope.row.errorMsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column  label="备份文件名"
                       prop="fileName"
                       min-width="180px"
                       align="left"
                       header-align="center"
                       v-if="vmType !== 4"></el-table-column>
      <!-- <el-table-column  label="备份类型"
                       prop="backupType"
                       min-width="100px"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.backupType |backupTypeFilter}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="开始时间"
                       prop="startTime"
                       min-width="150px"
                       align="center"></el-table-column>
      <el-table-column label="结束时间"
                       prop="endTime"
                       min-width="150px"
                       :sortable="true"
                       align="center"></el-table-column>
      <el-table-column label="备份类型"
                       prop="backupType"
                       min-width="80px"
                       align="center">
        <template slot-scope="scope">
          <span>{{scope.row.backupType | backupTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小"
                       prop="size"
                       min-width="100px"
                       align="center"></el-table-column>
      <el-table-column label="迁移状态"
                       prop="migrationState"
                       min-width="100px"
                       align="center">
        <template slot-scope="scope">
          <span>
            <i-icon :name="migrationStateIcon(scope.row.migrationState)"
                    style="vertical-align: -0.3em"></i-icon>
            {{ migrationStateMapping[scope.row.migrationState] ? migrationStateMapping[scope.row.migrationState] : 'NFS存储' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       min-width="90px"
                       align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.state === 0"
             class="el-icon-success successColor"></i>
          <i v-else-if="scope.row.state === 1"
             class="el-icon-error errorColor"></i>
          <span v-else>
            <i class="el-icon-loading waitingColor"></i>
            合并中
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="130px"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     :disabled="isAfterMergingResult(scope.row) || [1, 2].includes(scope.row.state)"
                     @click="restoreBtnClick(scope.row)">恢复</el-button>
          <el-button type="text"
                     size="small"
                     @click="resultMigration(scope.row.id)"
                     :disabled="scope.row.migrationState !== 3 || scope.row.state !== 0"
                     v-if="vmType === 1">上云</el-button>
          <el-button type="text"
                     size="small"
                     :disabled="scope.row.state === 2"
                     @click="deleteSomeResult(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
// import dayjs from 'dayjs';
import baseMixin from '@/components/mixins/baseMixins';
// import { backupResultMapping, backupTypeMapping, yesOrNoMapping } from '@/utils/constant';
import backupResultMixin from '@/components/mixins/backupResultMixin';
import { migrationStateMapping } from '@/utils/constant';
import IIcon from '@/components/IIcon';
import dayjs from 'dayjs';

export default {
  name: 'BackupResultList',
  mixins: [baseMixin, backupResultMixin],
  props: ['vmType', 'operationId'],
  components: {
    IIcon
  },
  data() {
    return {
      machineType: 3,
      migrationStateMapping,
      stateMapping: {
        0: '成功',
        1: '失败',
        2: '合并中'
      }
    }
  },
  filters: {
    backupTypeFilter(type) {
      const backupTypeMapping = {
        1: '全备',
        2: '增备'
      };
      return backupTypeMapping[type];
    },
    planIdFilters(results, id) {
      if (id === -1) {
        return results;
      } else {
        return results.filter(result => result.operationId === id);
      }
    }
  },
  computed: {
    planId: {
      get() {
        return this.operationId;
      },
      set(value) {
        this.$emit('update-operation-id', value);
      }
    },
    afterMergingResults() { // 处于正在合并中备份集之后、全备备份集之前的备份集集合
      const mergingResults = this.data.filter(result => result.state === 2);
      return mergingResults.reduce((flat, next) => {
        return flat.concat(this.chainResults(next))
      }, []);
    }
  },
  methods: {
    cancelPlanFilter() {
      this.planId = -1;
    },
    migrationStateIcon(state) {
      if (state === 0) {
        return 'local';
      } else if (state === 1) {
        return 'onMigration';
      } else if (state === 2) {
        return 'migrationSuccess';
      } else if (state === 3) {
        return 'migrationFail';
      }
      return 'local';
    },
    resultMigration(id) {
      this.$confirm('此备份集即将手动上云, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('result-migration', id);
      }).catch(() => {
        this.$message.info('已取消操作');
      });
    },
    deleteSomeResult(result) {
      if (result.migrationState === 0 || this.vmType !== 1) {
        this.deleteResult(result);
      } else if (result.state === 1) {
        this.$emit('multiply-delete-results', [result]);
      } else {
        this.$emit('multiply-delete-results', this.chainResults(result));
      }
    },
    chainResults(result) { // 与下个全备备份集之间的所有备份集
      const filterResultsByPlanId = this.data
          .filter(v => v.operationId === result.operationId)
          .sort((a, b) => dayjs(a.endTime) - dayjs(b.endTime));
        const resultIndex = filterResultsByPlanId.findIndex(v => v.id === result.id);
        const fullBackupResultIndex = filterResultsByPlanId
          .slice(result.backupType === 1 ? resultIndex + 1 : resultIndex, filterResultsByPlanId.length)
          .findIndex(v => v.backupType === 1 && v.state === 0);
        if (fullBackupResultIndex === -1) {
          return filterResultsByPlanId.slice(resultIndex, filterResultsByPlanId.length);
        } else {
          return filterResultsByPlanId.slice(resultIndex, fullBackupResultIndex);
        }
    },
    isAfterMergingResult(result) {
      return this.afterMergingResults.findIndex(v => v.id === result.id) > -1;
    },
    stateTagStyle(state) {
      if (state === 0) {
        return 'success';
      } else if (state === 1) {
        return 'danger';
      } else {
        return 'warning';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/color.scss';
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  width: 30%;
  &:nth-child(2n) {
    width: 69%;
  }
}
.stateRefresh {
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
</style>
