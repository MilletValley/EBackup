<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpened"
               @close="modalClosed"
               v-if="backupPlan">
      <span slot="title">
        {{disable ? "查看备份计划": "更新备份计划"}}
        <span style="color: #999999"> (ID: {{backupPlan.id}})</span>
      </span>
      <el-form :model="formData"
               label-width="110px"
               ref="updateForm"
               :disabled="disable"
               :rules="rules"
               size="small">
        <el-form-item label="备份计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item v-if="['windows', 'linux'].includes(type)"
                      label="备份路径"
                      :rules="{required: true, message: '请输入备份路径', trigger: 'blur'}"
                      prop="backupPath">
          <el-input v-model="formData.backupPath"></el-input>
        </el-form-item>
        <el-form-item label="备份策略"
                      prop="backupStrategy">
          <el-radio-group v-model="formData.backupStrategy"
                          @change="backupStrategyChange">
            <el-radio :label="bs.code"
                      v-for="bs in availableBackupStrategies"
                      :key="bs.code">{{ bs.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间策略"
                      prop="timeStrategy">
          <el-radio-group v-model="formData.timeStrategy">
            <el-radio :label="ts.code"
                      v-for="ts in availableTimeStrategies"
                      :key="ts.code">{{ ts.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计划开始时间"
                      v-show="[1,2,3,4,5].includes(formData.timeStrategy)"
                      prop="startTime">
          <el-date-picker v-model="formData.startTime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="datetime"
                          placeholder="选择计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间点"
                      v-show="formData.timeStrategy === 0"
                      prop="singleTime">
          <el-date-picker v-model="formData.singleTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择执行单次备份的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择星期"
                      v-show="formData.timeStrategy === 4">
          <el-checkbox-group v-model="formData.weekPoints">
            <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                                :label="w"
                                :key="w">{{ weekMapping[w] }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择日期"
                      v-show="formData.timeStrategy === 5">
          <el-select v-model="formData.datePoints"
                     multiple
                     style="width: 60%;">
            <el-option v-for="day in Array.from(new Array(31), (val, index) => index + 1)"
                       :key="day"
                       :value="day"
                       :label="day + '号'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="`时间点${index+1}`"
                      style="width: 100%"
                      v-for="(p, index) in formData.timePoints"
                      :key="p.key"
                      v-show="[3,4,5].includes(formData.timeStrategy)">
          <el-time-select v-model="formData.timePoints[index].value"
                          :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
          <el-button icon="el-icon-delete"
                     type="danger"
                     v-show="formData.timePoints.length !== 1"
                     @click="formData.timePoints.splice(index, 1)"></el-button>
          <el-button icon="el-icon-plus"
                     type="primary"
                     v-show="index + 1 === formData.timePoints.length"
                     @click="formData.timePoints.push({ value: '00:00', key: Date.now() })"></el-button>
        </el-form-item>
        <el-form-item label="循环周期"
                      prop="minuteInterval"
                      v-show="formData.timeStrategy === 1">
          <el-input-number v-model="formData.minuteInterval"
                           :min="10"
                           :max="60"
                           :step="10"
                           contrls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="循环周期"
                      prop="hourInterval"
                      v-show="formData.timeStrategy === 2">
          <el-input-number v-model="formData.hourInterval"
                           :min="1"
                           :max="24"
                           :step="1"
                           contrls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="是否备份系统"
                      prop="backupSys"
                      v-if="type === 'windows'">
          <el-switch v-model="formData.backupSystem"
                     active-value="sys"
                     inactive-value="nosys"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" v-if="!disable"
                   :loading="btnLoading"
                   @click="confirmBtnClick">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep';
import { backupPlanModalMixin } from '../mixins/planModalMixins';

export default {
  name: 'BackupPlanUpdateModal',
  mixins: [backupPlanModalMixin],
  props: {
    backupPlan: {
      type: Object,
      // required: true,
    },
    disable:{
      type: Boolean
    }
  },
  methods: {
    confirmBtnClick() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.pruneFormData(this.formData)
            .then(requestData => {
              this.$emit('confirm', this.backupPlan.id, requestData);
            })
            .catch(error => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      console.log(111,this.backupPlan)
      console.log(this.availableTimeStrategies)
      // 当备份策略时间点为空时（非按天、周、月）需要初始化才会显示
      if (this.backupPlan.config.timePoints.length === 0) {
        this.backupPlan.config.timePoints.push({ value: '00:00', key: Date.now() })
      }
      
      const { id, name, config, backupPath, backupSystem } = this.backupPlan;
      const { timeInterval, timePoints, ...otherConfig } = config;
      let hourInterval = 1,
        minuteInterval = 10;
      if (otherConfig.timeStrategy === 1) {
        minuteInterval = timeInterval;
      } else if (otherConfig.timeStrategy === 2) {
        hourInterval = Math.round(timeInterval / 60);
      }
      this.originFormData = {
        name,
        minuteInterval,
        hourInterval,
        timePoints: cloneDeep(timePoints),
        ...otherConfig,
      };
      if (this.type === 'windows') {
        this.originFormData.backupPath = backupPath;
        this.originFormData.backupSystem = backupSystem;
      } else if (this.type === 'linux') {
        this.originFormData.backupPath = backupPath;
      }
      this.formData = {
        ...this.originFormData,
        ...{ timePoints: cloneDeep(timePoints) },
      };
    },
    modalClosed() {
       console.log(this.backupPlan)
      this.formData = { ...this.originFormData };
      this.$refs.updateForm.clearValidate();
      this.$emit('cancel');
    },
  },
};
</script>
