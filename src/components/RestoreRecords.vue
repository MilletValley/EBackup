<template>
  <section>
    <div>
      <h4>正在执行的恢复</h4>
      <el-row :gutter="20">
        <el-col :span="6"
                v-for="item in plans"
                :key="item.id">
          <el-card shadow="hover"
                   class="ongoing-restore-card">
            <div>
              <span>
                <i class="el-icon-time"></i> {{ item.consume | durationFilter }}</span>
              <span class="restore-start-time">{{item.startTime}}</span>
            </div>
            <p>恢复设备IP: {{ item.config.hostIp }}</p>
            <p>恢复数据库: {{item.config.detailInfo }}</p>
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
                         label="详情"
                         header-align="center"
                         min-width="200px">
        </el-table-column>
        <el-table-column prop="state"
                         label="状态"
                         align="center"
                         width="100px">
          <template slot-scope="scope">
            <i :class="{ 'el-icon-success': scope.row.state === 0, 'el-icon-error': scope.row.state === 1 }"></i>
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
    plans: {
      type: Array,
      required: true,
    },
    records: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style>
.ongoing-restore-card {
  font-size: 14px;
}
.ongoing-restore-card .restore-start-time {
  font-size: 0.8em;
  line-height: 1.8em;
  color: #999999;
  float: right;
}
.ongoing-restore-card .el-icon-time {
  color: rgb(39, 202, 39);
}
/* 重复样式 */
.el-icon-success {
  color: rgb(39, 202, 39);
}
.el-icon-error {
  color: rgb(202, 39, 39);
}
</style>
