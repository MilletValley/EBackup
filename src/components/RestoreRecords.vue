<template>
  <section>
    <div>
      <h4>正在执行的恢复
        <i class="el-icon-refresh"
           :class="$style.stateRefresh"
           @click="$emit('restoreinfo:refresh')"></i>
      </h4>
      <el-row :gutter="20"
              style="min-height: 144px;">
        <el-col :span="6"
                v-for="item in plans"
                :key="item.id">
          <el-card shadow="hover"
                   :class="$style.ongoingRestoreCard">
            <div>
              <span>
                <i :class="['el-icon-time', $style.successColor]"></i> {{ item.consume | durationFilter }}</span>
              <span :class="$style.restoreStartTime">{{item.startTime}}</span>
            </div>
            <p>恢复设备IP: {{ item.config.database.host.hostIp }}</p>
            <p>{{detailInfoDisplayName}}: {{item.config.database.instanceName }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <h4>已完成恢复记录</h4>
      <el-table :data="records"
                :default-sort="{ prop: 'startTime', order: 'descending' }">
        <el-table-column prop="startTime"
                         label="开始时间"
                         align="center"
                         width="200px">
        </el-table-column>
        <el-table-column prop="endTime"
                         label="结束时间"
                         align="center"
                         width="200px">
        </el-table-column>
        <el-table-column prop="hostIp"
                         label="恢复设备IP"
                         align="center"
                         width="150px">
        </el-table-column>
        <el-table-column prop="detailInfo"
                         :label="detailInfoDisplayName"
                         align="left"
                         header-align="center"
                         min-width="200px">
        </el-table-column>
        <el-table-column prop="state"
                         label="状态"
                         align="center"
                         width="100px">
          <template slot-scope="scope">
            <el-tooltip :disabled="scope.row.state === 0"
                        :content="scope.row.errorMsg"
                        placement="right"
                        effect="light">
              <i v-if="scope.row.state === 0"
                 class="el-icon-success"
                 :class="$style.successColor"></i>
              <i v-else
                 class="el-icon-error"
                 :class="$style.errorColor"></i>
              <!-- <i :class="{ 'el-icon-success': scope.row.state === 0, 
              'el-icon-error': scope.row.state === 1,
              [$style.successIcon]:  scope.row.state === 0,
              [$style.errorIcon]:  scope.row.state === 1 }"></i> -->
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script>
import baseMixin from './mixins/baseMixins';

export default {
  name: 'RestoreRecords',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'windows', 'linux', ''].includes(value);
      },
    },
    plans: {
      type: Array,
      required: true,
    },
    records: {
      type: Array,
      required: true,
    },
  },
  computed: {
    detailInfoDisplayName() {
      const mapping = {
        oracle: '实例',
        sqlserver: '数据库',
        windows: '恢复路径',
        linux: '恢复路径',
      };
      return mapping[this.type];
    },
  },
};
</script>
<style lang="scss" module>
@import '../style/color.scss';
.ongoingRestoreCard {
  font-size: 14px;
}
.restoreStartTime {
  font-size: 0.8em;
  line-height: 1.8em;
  color: #999999;
  float: right;
}
.stateRefresh {
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
</style>
