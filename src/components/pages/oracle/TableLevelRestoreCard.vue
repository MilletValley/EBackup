<template>
  <el-card class="tableLevelRestoreCard"
           v-if="operation.id"
           :style="operation.state === 2 ? 'color: #999999;' : ''">
    <div slot="header">
      <el-tag size="mini"
              color="#1ba38a"
              style="color: #ffffff">恢复</el-tag>
      <span>{{operation.name}}</span>
      <i v-if="operation.state !== 2"
         style="float: right; margin: 3px 0 3px 10px;"
         class="el-icon-refresh state-refresh stateRefresh"
         @click="refreshBtnClick"></i>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;"
                 type="text"
                 @click="planDeleteBtnClick">删除</el-button>
    </div>
    <el-form inline label-width="100px"
              size="mini">
      <el-form-item label="恢复设备IP：">
        <span>{{ config.hostIp }}</span>
      </el-form-item>
      <el-form-item label="数据库名：">
        <span>{{ config.detailInfo }}</span>
      </el-form-item>
      <el-form-item label="端口：">
        <span>{{ config.dbPort }}</span>
      </el-form-item>
    </el-form>
    <el-row type="flex">
      <el-col :span="18">
        <el-form inline
                 label-width="100px"
                 size="mini">
          <el-form-item label="恢复表名：">
            <span>{{ config.tblName  }}</span>
          </el-form-item>
          <el-form-item label="PDB名：">
            <span>{{ config.PDBName ? config.PDBName : '-'  }}</span>
          </el-form-item>
        </el-form>
        <el-form label-width="100px"
                 size="mini">
          <el-form-item label="计划开始时间"
                        :style="{ width: '100%'}">
            <span>{{ config.startTime }}</span>
          </el-form-item>
          <el-form-item label="时间策略"
                        style="width: 40%">
            <span>{{ config.timeStrategy | timeStrategyMappingFilter }}</span>
          </el-form-item>
          <el-form-item label="恢复至"
                        style="width: 40%">
            <span>{{ config.restoreTimePoint }}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6"
              class="operationInfo">
        <ul style="list-style: none">
          <li>
            <h5>当前状态</h5>
            <div>
              <div style="display: inline-block">
                <i v-if="operation.state === 0"
                   class="el-icon-time"
                   :class="operationStateStyle"></i>
                <i v-else-if="operation.state === 1"
                   class="el-icon-loading"
                   :class="operationStateStyle"></i>
                <span :class="operationStateStyle">{{ operation.state | operationStateMappingFilter }}</span>
              </div>
            </div>
          </li>
          <li>
            <h5>恢复开始时间</h5>
            <div>{{operation.startTime || '-'}}</div>
          </li>
          <li>
            <h5>已持续时间</h5>
            <div v-if="operation.consume">
              <timer v-if="operation.state === 1" :val="operation.consume"></timer>
              <span v-else>{{ operation.consume | durationFilter }}</span>
            </div>
            <div v-else>-</div>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import Timer from '@/components/Timer';
import baseMixin from '@/components/mixins/baseMixins';
import { deleteTableLevelRestorePlan } from '@/api/oracle';
import {
  restoreTimeStrategyMapping,
  operationStateMapping
} from '@/utils/constant';
export default {
  name: 'TableLevelRestoreCard',
  mixins: [baseMixin],
  components: {
    Timer
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    tableLevelRestorePlan: {
      type: Object,
      required: true,
    }
  },
  computed: {
    operation() {
      const { config, ...operation } = this.tableLevelRestorePlan;
      return operation;
    },
    config() {
      return this.tableLevelRestorePlan.config;
    },
    operationStateStyle() {
      if (this.operation.state === 0) {
        return 'waitingColor';
      } else if (this.operation.state === 1) {
        return 'loadingColor';
      } else return '';
    },
  },
  filters: {
    timeStrategyMappingFilter(strategy) {
      return restoreTimeStrategyMapping[strategy];
    },
    operationStateMappingFilter(state) {
      return operationStateMapping[state];
    }
  },
  methods: {
    refreshBtnClick() {
      this.$emit('refresh', this.operation.id);
    },
    planDeleteBtnClick() {
      this.$confirm('此操作即将删除该恢复计划，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        deleteTableLevelRestorePlan(this.operation.id)
          .then(res => {
            const { message } = res.data;
            this.$emit('refreshAll');
            this.$message.success(message);
          })
          .catch(error => {
            this.$message.error(error);
          })
      })
      .catch(() => {
        this.$message.info('已取消操作')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/color.scss';
.tableLevelRestoreCard {
  margin-bottom: 15px;
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
</style>