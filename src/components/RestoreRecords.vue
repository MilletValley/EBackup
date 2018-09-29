<template>
  <section>
    <div>
      <h4>正在执行的恢复操作
        <i class="el-icon-refresh"
           :class="$style.stateRefresh"
           @click="$emit('restoreinfo:refresh')"></i>
      </h4>
      <div v-show="plans.length === 0"
           :class="$style.noRestoreTip">
        <span>暂无操作</span>
      </div>
      <el-row v-show="plans.length > 0"
              :gutter="20"
              style="min-height: 144px;">
        <el-col :span="8"
                v-for="item in plans"
                :key="item.id">
          <el-card shadow="hover"
                   :class="$style.ongoingRestoreCard">
            <div>
              <span>
                <i :class="['el-icon-time', $style.successColor]"></i> {{ item.consume | durationFilter }}</span>
              <span :class="[$style.restoreStartTime, 'hidden-']">{{item.startTime}}</span>
            </div>

            <p>
              <i-icon name="ip"
                      :class="$style.ongoingRestoreIcon"></i-icon>
              <el-tooltip content="目标设备IP"
                          placement="right"
                          :open-delay="300">
                <span v-if="!isFile">{{ item.config.database.host.hostIp }}</span>
                <span v-else>{{ item.config.hostIp }}</span>
              </el-tooltip>
            </p>

            <p>
              <i-icon name="instance"
                      :class="$style.ongoingRestoreIcon"></i-icon>
              <el-tooltip :content="detailInfoDisplayName"
                          placement="right"
                          :open-delay="300">
                <span v-if="!isFile">{{item.config.database.instanceName }}</span>
                <span v-else>{{ item.config.detailInfo }}</span>
              </el-tooltip>
            </p>

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
                         min-width="200px">
        </el-table-column>
        <el-table-column prop="detailInfo"
                         :label="detailInfoDisplayName"
                         align="center"
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
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script>
import IIcon from './IIcon';
import baseMixin from './mixins/baseMixins';

export default {
  name: 'RestoreRecords',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'mysql', 'windows', 'linux', 'vm', ''].includes(value);
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
        mysql: '数据库',
        windows: '恢复路径',
        linux: '恢复路径',
        vm: '虚拟机',
      };
      return mapping[this.type];
    },
    isFile() {
      if (this.type === 'windows' || this.type === 'linux') {
        return true;
      }
      return false;
    },
  },
  components: {
    IIcon,
  },
};
</script>
<style lang="scss" module>
@import '../style/color.scss';
.noRestoreTip {
  font-size: 4em;
  color: #c0c4cc;
  min-height: 144px;
  margin: auto;
  width: 280px;
  span {
    line-height: 2.2em;
  }
}
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
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
.ongoingRestoreIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.2em;
}
</style>
