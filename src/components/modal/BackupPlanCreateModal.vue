<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed">
      <span slot="title">
        添加备份计划
      </span>
      <el-form :model="formData"
               label-width="110px"
               ref="createForm"
               :rules="rules"
               size="small">
        <el-form-item label="备份计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="备份策略"
                      prop="backupStrategy">
          <el-radio-group v-model="formData.backupStrategy">
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
                                :label="Number(w)"
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
                      v-show="[3,4,5].indexOf(formData.timeStrategy) !== -1">
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
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import isEqual from 'lodash/isEqual';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
} from '../../utils/constant';
// 配置信息 如果有业务添加或者变更 可以直接修改这个对象
const strategyMapping = {
  oracle: {
    1: [0, 2, 3, 4, 5],
  },
  sqlserver: {
    1: [0, 2, 3, 4, 5],
    2: [1],
  },
};
export default {
  name: 'BackupPlanCreateModal',
  props: {
    type: {
      type: String,
    },
    visible: {
      type: Boolean,
    },
  },
  data() {
    const singleTimeValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 0 && !value) {
        callback(new Error('请输入备份时间'));
      } else {
        callback();
      }
    };
    const startTimeValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy !== 0 ) {
        if (!value)
          callback(new Error('请输入计划时间'));
        else if (dayjs(value) < dayjs())
          callback(new Error('计划时间不能晚于当前时间'))
        else
          callback();
      } else {
        callback();
      }
    };
    const weekPointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 4 && value.length === 0) {
        callback(new Error('请选择循环星期'));
      } else {
        callback();
      }
    };
    const datePointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 5 && value.length === 0) {
        callback(new Error('请选择循环日期'));
      } else {
        callback();
      }
    };
    const hourIntervalValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 2 && !value) {
        callback(new Error('请输入循环周期'));
      } else {
        callback();
      }
    };
    const minuteIntervalValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 1 && !value) {
        callback(new Error('请输入循环周期'));
      } else {
        callback();
      }
    };
    const baseFormData = {
      name: '',
      startTime: '',
      singleTime: '',
      datePoints: [],
      timePoints: [{ value: '00:00', key: Date.now() }],
      weekPoints: [], // 必须初始化为数组，checkbox group才能识别
      hourInterval: 1,
      minuteInterval: 10,
      backupStrategy: 1,
      timeStrategy: 0,
    };
    return {
      formData: Object.assign({}, baseFormData), // 备份数据
      originFormData: Object.assign({}, baseFormData), // 原始数据
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        singleTime: [
          {
            validator: singleTimeValidate,
            trigger: 'blur',
          },
        ],
        startTime: [
          {
            validator: startTimeValidate,
            trigger: 'blur',
          },
        ],
        weekPoints: [
          {
            validator: weekPointsValidate,
            trigger: 'blur',
          },
        ],
        datePoints: [
          {
            validator: datePointsValidate,
            trigger: 'blur',
          },
        ],
        minuteInterval: [
          {
            validator: minuteIntervalValidate,
            trigger: 'blur',
          },
        ],
        hourInterval: [
          {
            validator: hourIntervalValidate,
            trigger: 'blur',
          },
        ],
      },
      backupConfig: {},
      weekMapping,
    };
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
    // 根据type生成可用的备份策略
    availableBackupStrategies() {
      return Object.keys(strategyMapping[this.type]).map(strategyCode => ({
        code: +strategyCode,
        value: backupStrategyMapping[strategyCode],
      }));
    },
    // 根据选择的备份策略生成可用的时间策略
    availableTimeStrategies() {
      return strategyMapping[this.type][this.formData.backupStrategy].map(
        strategyCode => ({
          code: strategyCode,
          value: timeStrategyMapping[strategyCode],
        })
      );
    },
  },
  methods: {
    // 时间点去重排序
    filteredTimePoints(timePoints) {
      return Array.from(
        new Set(timePoints.map(p => p.value).filter(p => p))
      ).sort(
        (a, b) =>
          a.slice(0, 2) * 60 +
          a.slice(3, 5) -
          b.slice(0, 2) * 60 +
          b.slice(3, 5)
      );
    },
    pruneFormData(formData) {
      const {
        name,
        timeStrategy,
        singleTime,
        startTime,
        datePoints,
        weekPoints,
        timePoints,
        hourInterval,
        minuteInterval,
        ...other,
      } = formData;
      const filteredTimePoints = this.filteredTimePoints
      return new Promise(function prune(resolve, reject) {
        let config;
        switch (timeStrategy) {
          case 0:
            if (dayjs(singleTime) < dayjs()) reject('单次时间必须晚于当前时间');
            config = { timeStrategy, singleTime, ...other};
            break;
          case 1:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            config = {timeStrategy, startTime, timeInterval: minuteInterval, ...other};
            break;
          case 2:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            config = {timeStrategy, startTime, timeInterval: hourInterval * 60, ...other};
            break;
          case 3:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            config = { timeStrategy, startTime, timePoints, ...other};
            break;
          case 4:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            config = { timeStrategy, startTime, weekPoints, timePoints, ...other};
            break;
          case 5:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            config = { timeStrategy, startTime, datePoints, timePoints, ...other};
            break;
          default:
        }
        if ([3,4,5].includes(timeStrategy)) {
          config.timePoints = filteredTimePoints(timePoints);
        }
        resolve({name, config});
      })
    },
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.pruneFormData(this.formData).then(({name, config}) => {
            this.$emit('confirm', {name, config})
          }).catch(error => {
            this.$message.error(error);
          })
        } else {
          return false;
        }
      })
    },
    cancel() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    modalOpened() {

    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.createForm.clearValidate();
    },
    // 关闭之前 验证是否有修改
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.formData, this.originFormData)) {
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            fn();
          })
          .catch(() => {});
      }
    },
  },
};
</script>
<style>
</style>
