<template>
  <el-card :class="$style.backupCard"
           v-if="backupOperation.id && backupConfig.id"
           :style="backupOperation.state === 2 ? 'color: #999999;' : ''">
    <div slot="header"
         class="clearfix">
      <el-tag size="mini"
              color="#8465ff"
              style="color: #ffffff">备份</el-tag>
      <!-- {{ backupStrategyType }} -->
      <span>{{backupOperation.name}}</span>
      <i v-if="backupOperation.state !== 2"
         style="float: right; margin: 3px 0 3px 10px;"
         class="el-icon-refresh"
         :class="$style.stateRefresh"
         @click="refreshBtnClick"></i>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;"
                 type="text"
                 @click="planDeleteBtnClick">删除</el-button>
      <el-button v-if="backupOperation.state !== 2"
                 style="float: right; padding: 3px 3px"
                 type="text"
                 @click="planUpdateBtnClick">编辑</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="18">
        <el-form inline
                 label-width="100px"
                 size="mini">
          <el-form-item label="计划开始时间"
                        :style="{ width: type !== 'windows' && type !== 'linux' ? '100%' : '40%'}">
            <span>{{ backupConfig.startTime }}</span>
          </el-form-item>
          <el-form-item v-if="type === 'windows'"
                        label="是否备份系统"
                        style="width: 40%">
            <span>{{ backupOperation.backupSystem === 'sys' ? '是' : '否' }}</span>
          </el-form-item>
          <el-form-item label="备份策略"
                        style="width: 40%">
            <span>{{ backupStrategy }}</span>
          </el-form-item>
          <el-form-item label="时间策略"
                        style="width: 40%">
            <span>{{ timeStrateg }}</span>
          </el-form-item>
          <el-form-item label="时间"
                        v-if="backupConfig.timeStrategy === 0"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      size="small">{{ backupConfig.singleTime }}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="星期"
                        v-if="backupConfig.timeStrategy === 4"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in weekPoints"
                      :key="point"
                      size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="日期"
                        v-if="backupConfig.timeStrategy === 5"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in backupConfig.datePoints"
                      :key="point"
                      size="small">{{point}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="时间"
                        v-if="[3,4,5].indexOf(backupConfig.timeStrategy) >= 0"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      v-for="point in backupConfig.timePoints"
                      :key="point.key"
                      size="small">{{point.value}}</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="间隔"
                        v-if="backupConfig.timeStrategy === 1|| backupConfig.timeStrategy === 2"
                        style="width: 100%">
            <div>
              <el-tag :class="$style.infoTag"
                      size="small">{{backupConfig.timeInterval}}分钟</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="备份路径"
                        v-if="type === 'windows' || type === 'linux'">
            <span>{{ backupOperation.backupPath }}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6"
              :class="$style.operationInfo">
        <ul>
          <li>
            <h5>当前状态</h5>
            <div>
              <el-tooltip :disabled="!isFileBackupResult || backupOperation.state !== 1"
                          :content="backupOperation.process"
                          placement="left"
                          effect="light">
                <div style="display: inline-block">
                  <i v-if="backupOperation.state === 0"
                     class="el-icon-time"
                     :class="operationStateStyle"></i>
                  <i v-else-if="backupOperation.state === 1"
                     class="el-icon-loading"
                     :class="operationStateStyle"></i>
                  <span :class="operationStateStyle">{{operationState || '-'}}</span>
                </div>
              </el-tooltip>
            </div>
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
          <li v-if="!isFileBackupResult">
            <h5>已备份大小</h5>
            <div>{{backupOperation.size || '-'}}</div>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import throttle from 'lodash/throttle';
import baseMixin from './mixins/baseMixins';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '../utils/constant';

export default {
  name: 'BackupCard',
  mixins: [baseMixin],
  props: {
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['oracle', 'sqlserver', 'windows', 'linux', 'vm', ''].includes(
          value
        );
      },
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
      return this.backupPlan.config;
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
      return this.backupConfig.timeStrategy === 0 ? '单次' : '循环';
    },
    // 是否为文件备份
    isFileBackupResult() {
      return this.type === 'windows' || this.type === 'linux';
    },
    operationStateStyle() {
      if (this.backupOperation.state === 0) {
        return this.$style.waitingColor;
      } else if (this.backupOperation.state === 1) {
        return this.$style.loadingColor;
      } else return '';
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
          this.$emit('deletePlan', this.backupPlan.id);
        })
        .catch(() => {});
    },
    planUpdateBtnClick() {
      this.$emit('updatePlan');
    },
    refreshBtnClick() {
      this.$emit('refresh', this.id);
    },
  },
};
</script>
<style lang="scss" module>
@import '../style/color.scss';
.backupCard {
  margin-bottom: 15px;
}
/* 标签之间的间隔在for循环下消失了 */
.infoTag {
  margin: 0 2px;
}
.stateRefresh {
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
.operationInfo {
  h5 {
    font-weight: 400;
    color: #888888;
    margin: 4px 0;
    text-align: right;
  }
  div {
    margin-left: 5px;
    text-align: right;
  }
  ul {
    list-style: none;
    margin: 0;
  }
  li {
    margin: 10px 0;
  }
}
</style>
