<template>
  <el-card class="backup-card" v-if="backupOperation.id && backupConfig.id">
    <div slot="header" class="clearfix">
      <el-tag size="mini">{{ backupStrategyType }}</el-tag>
      <span>{{backupOperation.name}}</span>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;" type="text" @click="planDeleteBtnClick">删除</el-button>
      <el-button style="float: right; padding: 3px 3px" type="text" @click="planUpdateBtnClick">编辑</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="18">
        <el-form inline label-width="100px" size="mini">
          <el-form-item label="计划开始时间" style="width: 100%">
            <span>{{ backupConfig.startTime }}</span>
          </el-form-item>
          <el-form-item label="备份策略" style="width: 40%">
            <span>{{ backupStrategy }}</span>
          </el-form-item>
          <el-form-item label="时间策略" style="width: 40%">
            <span>{{ timeStrateg }}</span>
          </el-form-item>
          <el-form-item label="时间" v-if="backupConfig.timeStrategy === 0" style="width: 100%">
            <div>
              <el-tag size="small">{{ backupConfig.singleTime }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="星期" v-if="backupConfig.timeStrategy === 4" style="width: 100%">
            <div>
              <el-tag v-for="point in weekPoints" :key="point" size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="日期" v-if="backupConfig.timeStrategy === 5" style="width: 100%">
            <div>
              <el-tag v-for="point in backupConfig.datePoints" :key="point" size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="时间" v-if="[3,4,5].indexOf(backupConfig.timeStrategy) >= 0" style="width: 100%">
            <div>
              <el-tag v-for="point in backupConfig.timePoints" :key="point" size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="间隔" v-if="backupConfig.timeStrategy === 1|| backupConfig.timeStrategy === 2" style="width: 100%">
            <div>
              <el-tag size="small">{{backupConfig.timeInterval}}分钟</el-tag>
            </div>
          </el-form-item>
          <!-- <el-form-item label="备份路径">
            <span>{{ backupConfig.backupUrl }}</span>
          </el-form-item> -->
        </el-form>
      </el-col>
      <el-col :span="6" class="operation-info">
        <ul style="list-style: none">
          <li>
            <h5>当前状态</h5>
            <div>{{operationState || '-'}}</div>
          </li>
          <li>
            <h5>备份开始时间</h5>
            <div>{{backupOperation.startTime || '备份未开始'}}</div>
          </li>
          <li>
            <h5>已持续时间</h5>
            <div v-if="backupOperation.consume">{{backupOperation.consume | durationFilter}}</div>
            <div v-else>-</div>
          </li>
          <li>
            <h5>已备份大小</h5>
            <div>{{backupOperation.size || '-'}}</div>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import backupMixin from './mixins/backupMixins';
import { deleteBackupPlan } from '../api/database';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '../utils/constant';

export default {
  name: 'BackupCard',
  mixins: [backupMixin],
  props: {
    id: {
      type: Number,
      required: true,
    },
    backupPlan: {
      type: Object,
      required: true,
    },
  },
  computed: {
    backupOperation() {
      const { config, ...operation } = this.backupPlan;
      return operation;
    },
    backupConfig() {
      const { config, ...backupOperation } = this.backupPlan;
      return config;
    },
    backupStrategy() {
      return backupStrategyMapping[this.backupPlan.config.backupStrategy];
    },
    timeStrateg() {
      return timeStrategyMapping[this.backupPlan.config.timeStrategy];
    },
    weekPoints() {
      return this.backupPlan.config.weekPoints.map(p => weekMapping[p]);
    },
    operationState() {
      return operationStateMapping[this.backupPlan.state];
    },
    // 单次／多次
    backupStrategyType() {
      return this.backupConfig.timeStrategy === 0 ? '单次' : '多次';
    },
  },
  methods: {
    planDeleteBtnClick() {
      this.$confirm('即将删除该备份计划，是否继续？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          deleteBackupPlan(this.backupPlan.id).then(() => {
            // this.backupConfig = {};
            // this.backupOperation = {};
            this.$emit('deletePlan');
            this.$message.success('删除成功');
          });
        })
        .catch(() => {});
    },
    planUpdateBtnClick() {
      this.$emit('updatePlan');
    },
  },
};
</script>
<style scoped>
.backup-card {
  margin-top: 15px;
}
.operation-info h5 {
  font-weight: 400;
  color: #888888;
  margin: 4px 0;
  text-align: right;
}
.operation-info div {
  margin-left: 5px;
  text-align: right;
}
.operation-info ul {
  list-style: none;
  margin: 0;
}
.operation-info li {
  margin: 10px 0;
}
/* 标签之间的间隔在for循环下消失了 */
.el-tag {
  margin: 0 2px;
}
</style>
