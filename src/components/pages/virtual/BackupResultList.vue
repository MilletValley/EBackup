<template>
  <section>
    <el-row>
      <el-row>
        <el-col :span="12">
          <el-button type="text" :icon="buttonIcon" @click="showFilter = !showFilter">过滤</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="text" style="float: right" @click="cancelPlanFilter">显示所有</el-button>
        </el-col>
      </el-row>
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
                        :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
              </span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="持续时间">
              <span>{{ scope.row.consume | durationFilter }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="迁移状态">
              <span>
                {{ migrationStateMapping[scope.row.migrationState] ? migrationStateMapping[scope.row.migrationState] : '本地存储' }}
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
                       min-width="80px"
                       align="center">
        <template slot-scope="scope">
          <span>
            <i-icon :name="migrationStateIcon(scope.row.migrationState)"
                    style="vertical-align: -0.3em"></i-icon>
            {{ migrationStateMapping[scope.row.migrationState] ? migrationStateMapping[scope.row.migrationState] : '本地存储' }}
          </span>
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
                       min-width="130px"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     :disabled="scope.row.state === 1"
                     @click="restoreBtnClick(scope.row)">恢复</el-button>
          <el-button type="text"
                     size="small"
                     @click="resultMigration(scope.row.id)"
                     :disabled="scope.row.migrationState !== 3 || scope.row.state !== 0"
                     v-if="vmType === 1">上云</el-button>
          <el-button type="text"
                     size="small"
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
      migrationStateMapping
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
      if (result.migrationState !== 2 || vmType !== 1 || result.state !== 0) {
        this.deleteResult(result);
      } else {
        const filterResultsByPlanId = this.results
          .filter(v => v.operationId === result.operationId)
          .sort((a, b) => dayjs(b.endTime) - dayjs(a.endTime));
        const resultIndex = filterResultsByPlanId.findIndex(v => v.id === result.id);
        const fullBackupResultIndex = filterResultsByPlanId
          .slice(result.backupType === 1 ? resultIndex + 1 : resultIndex, filterResultsByPlanId.length)
          .findIndex(v => v.backupType === 1 && v.state === 0);
        if (fullBackupResultIndex === -1) {
          this.$emit('multiply-delete-results', filterResultsByPlanId.slice(resultIndex, filterResultsByPlanId.length));
        } else {
          this.$emit('multiply-delete-results', filterResultsByPlanId.slice(resultIndex, fullBackupResultIndex));
        }
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
</style>
