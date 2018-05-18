<template>
  <section>
    <el-dialog :visible.sync="modalVisible">
      <span slot="title">
        添加备份计划
      </span>
      <el-form :modal="backupPlanFormData" label-width="110px" ref="createForm" size="small">
        <el-form-item label="备份计划名称" prop="name">
          <el-input v-model="backupPlanFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="startTime">
          <el-date-picker v-model="backupPlanFormData.startTime" type="datetime" placeholder="选择计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-itemn label="备份策略" prop="backupStrategy">
          <el-radio-group v-model="backupPlanFormData.backupStrategy">
            <el-radio :label="0">备份策略</el-radio>
          </el-radio-group>
        </el-form-itemn>
        <el-form-itemn label="时间策略" prop="timeStrategy">
          <el-radio-group v-model="backupPlanFormData.timeStrategy">
            <el-radio :label="0">时间策略</el-radio>
          </el-radio-group>
        </el-form-itemn>
        <el-form-item label="时间点">
          <el-date-picker v-model="backupPlanFormData.singleTime" type="datetime" placeholder="选择执行单次备份的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择星期">
          <el-checkbox-group v-model="backupPlanFormData.weekPonits">
            <el-checkbox-button v-for="w in [1,2,3,4,5,6,7]" :label="w" :key="w">{{ convertWeekPoint(w) }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-select v-model="backupPlanFormData.datePoints">
            <el-option v-for="day in Array.from(new Array(31), (val, index) => index + 1)" :key="day" :value="day" :label="day + '号'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间点">
          <el-date-picker v-model="backupPlanFormData.timePoints" type="time" placeholder="选择执行单次备份的时间">          
        </el-form-item>
        <el-form-item :label="'时间点' + index" v-for="(point, index) in backupPlanFormData.timePoints.slice(1)" :key="index">
          <el-date-picker v-model="backupPlanFormData.timePoints[index+1]" type="time" placeholder="选择执行单次备份的时间">
          </el-date-picker>
          <i class="el-icon-circle-close"></i>
        </el-form-item>
        <el-form-item label="循环周期">
          <el-input-number v-model="backupPlanFormData.minuteInterval" min=10 max=60 step=10 contrls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="循环周期">
          <el-input-number v-model="backupPlanFormData.hourInterval" min=1 max=24 step=1 contrls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="confirm()">确定</el-button>
        <el-button @click="cancel()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  name: 'BackupPlanCreateModal',
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      backupPlanFormData: {}, // 备份计划数据
      backupConfig: {},
    };
  },
  computed: {
    backupConfig() {
      return backupPlanFormData.config;
    },
  },
  method: {
    convertWeekPoint(num) {
      const weekMapping = {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        7: '周日',
      }
      return weekMapping[num];
    },
    confirm() {},
    cancel() {},
  },
};
</script>
<style>

</style>
