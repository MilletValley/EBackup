<template>
  <section>
    <!-- 创建数据库备份配置页面 begin-->
    <el-dialog :title="'添加'+type+'备份配置'" :visible.sync="_visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
        <el-form-item label="备份标题" prop="name">
          <el-input v-model="create.name"></el-input>
        </el-form-item>
        <el-form-item label="计划时间" prop="startTime">
          <el-date-picker v-model="create.startTime" :picker-options="pickerStartTime" type="datetime" placeholder="选择日期时间" default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备份路径" prop="backupPath" v-show="type === 'windows' || type === 'linux'">
          <el-input v-model="create.backupPath"></el-input>
        </el-form-item>
        <el-form-item label="备份系统" prop="backupSystem" v-show="type === 'windows'">
          <el-radio-group v-model="create.backupSystem">
            <el-radio label="sys">是</el-radio>
            <el-radio label="nosys">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份机制">
          <el-radio-group v-model="create.backupStrategy">
            <el-radio v-for="item in _backupStrategys" :key="item.label" :label="item.label" :disabled="item.disabled">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份策略">
          <el-radio-group v-model="tmpTimeStrategy">
            <el-radio v-for="item in _timeStrategys" :key="item.label" :label="item.label" :disabled="item.disabled">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单次备份" v-show="isShowOnce" prop="singleTime">
          <el-date-picker v-model="create.singleTime" type="datetime" :picker-options="pickerSingleTime" placeholder="请选择日期时间" default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="每月备份" v-show="isShowDay" prop="datePoints">
          <el-select v-model="create.datePoints" multiple placeholder="请选择日期">
            <el-option v-for="item in datePointsInfo" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每周备份" v-show="isShowWeek" prop="weekPoints">
          <el-select v-model="create.weekPoints" multiple placeholder="请选择周几">
            <el-option v-for="item in weekPointsInfo" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔小时" v-show="isShowTimeRateH">
          <el-input-number v-model="create.timeIntervalH" :min="1" :max="23"></el-input-number>
        </el-form-item>
        <el-form-item label="间隔分钟" v-show="isShowTimeRateM">
          <el-input-number v-model="create.timeIntervalM" :step="10" :min="10" :max="60"></el-input-number>
        </el-form-item>
        <el-form-item v-for="(domain, index) in create.timePoints" :label="'备份时间'" :key="domain.key" prop="timePoints" v-show="isShowTime">
          <el-col :span="11">
            <el-time-select v-model="domain.value" :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }" placeholder="请选择时间点">
            </el-time-select>
          </el-col>
          <el-col :span="11">
            <el-button @click.prevent="removeTimePoint(domain)" v-show="index !== 0">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item v-show="isShowTime">
          <el-button type="primary" @click="addTimePoint">新增时间点</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="_visible = false">取 消</el-button>
        <el-button type="primary" :loading="createLoading" @click="createBackupPlan">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 创建数据库备份配置页面 end-->
  </section>
</template>
<script>
import _ from 'lodash'; // lodash按需加载 05/07
import { createOracleBackupPlan } from '../api/oracle';
import { createSqlServerBackupPlan } from '../api/sqlserver';
import { createBackupPlan } from '../api/fileHost';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
} from '../utils/constant';
const requestMapping = {
  oracle: (id, data) => createOracleBackupPlan({ id, plan: data }),
  sqlserver: (id, data) => createSqlServerBackupPlan({ id, plan: data }),
  windows: (id, data) => createBackupPlan({ id, plan: data }),
  linux: (id, data) => createBackupPlan({ id, plan: data }),
};
// 转换方法pick、objToArr、objToArr1、convert
const pick = (obj, arr) =>
  arr.reduce((iter, val) => (val in obj && (iter[val] = obj[val]), iter), {});
const objToArr = obj => {
  const arr = [];
  for (const key in obj) {
    arr.push({
      label: parseInt(key),
      name: obj[key],
    });
  }
  return arr;
};
const objToArr1 = obj => {
  const arr = [];
  for (const key in obj) {
    arr.push({
      value: key,
      label: obj[key],
    });
  }
  return arr;
};
const convert = type => {
  const backup = type.backupStrategy;
  const time = type.timeStrategy;
  const backupBB = objToArr(backup);
  for (let i = 0; i < backupBB.length; i++) {
    const timeTT = objToArr(time[i]);
    backupBB[i].timeStrategys = timeTT;
  }
  return backupBB;
};
const config = {
  oracle: {
    backupStrategy: pick(backupStrategyMapping, [1]),
    timeStrategy: [pick(timeStrategyMapping, [0, 2, 3, 4, 5])],
  },
  sqlserver: {
    backupStrategy: pick(backupStrategyMapping, ['1', '2']),
    timeStrategy: [
      pick(timeStrategyMapping, ['0', '2', '3', '4', '5']),
      pick(timeStrategyMapping, ['1']),
    ],
  },
  file: {
    backupStrategy: pick(backupStrategyMapping, ['1']),
    timeStrategy: [pick(timeStrategyMapping, ['0', '1', '2', '3', '4'])],
  },
};
const backupStrategys = {
  oracle: convert(config.oracle),
  sqlserver: convert(config.sqlserver),
  windows: convert(config.file),
  linux: convert(config.file),
};
const datePoints = [];
for (let i = 1; i < 32; i++) {
  datePoints.push({ value: '' + i + '', label: i + '号' });
}
const weekPoints = objToArr1(weekMapping);

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  name: 'AddBackupPlan',
  data() {
    const valiSingleTime = (rule, value, callback) => {
      if (this.tmpTimeStrategy === 0) {
        if (!value) {
          callback(new Error('请选择单次备份时间'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const valiTimePoints = (rule, value, callback) => {
      if (
        this.tmpTimeStrategy === 3 ||
        this.tmpTimeStrategy === 4 ||
        this.tmpTimeStrategy === 5
      ) {
        let i = 0;
        value.map(item => {
          if (item.value !== '') {
            callback();
            i = 1;
          }
        });
        if (i === 0) {
          callback(new Error('时间请至少选择一个'));
        }
      } else {
        callback();
      }
    };
    const valiWeekPoints = (rule, value, callback) => {
      if (this.tmpTimeStrategy === 4) {
        if (value.length === 0) {
          callback(new Error('每周请至少选择一天'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const valiDatePoints = (rule, value, callback) => {
      if (this.tmpTimeStrategy === 5) {
        if (value.length === 0) {
          callback(new Error('每月请至少选择一天'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      createLoading: false,
      isShowOnce: true,
      isShowTime: false,
      isShowTimeRateH: false,
      isShowTimeRateM: false,
      isShowDay: false,
      isShowWeek: false,
      weekPointsInfo: weekPoints,
      datePointsInfo: datePoints,
      create: {
        backupPath: '',
        backupSystem: 'sys',
        name: '',
        timePoints: [
          {
            value: '',
          },
        ],
        startTime: '',
        timeIntervalH: 1,
        timeIntervalM: 10,
        singleTime: '',
        weekPoints: [],
        datePoints: [],
        backupStrategy: 1,
      },
      tmpTimeStrategy: 0,
      rules: {
        startTime: [
          { required: true, message: '计划时间不能为空', trigger: 'change' },
        ],
        singleTime: [{ validator: valiSingleTime, trigger: 'change' }],
        weekPoints: [{ validator: valiWeekPoints, trigger: 'change' }],
        timePoints: [{ validator: valiTimePoints, trigger: 'change' }],
        datePoints: [{ validator: valiDatePoints, trigger: 'change' }],
        backupPath: [
          { required: true, message: '备份路径不能为空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '备份名称不能为空', trigger: 'blur' },
        ],
        backupSystem: [
          { required: true, message: '备份系统不能为空', trigger: 'blur' },
        ],
      },
      pickerSingleTime: {
        disabledDate: time => {
          return time.getTime() < new Date(this.create.startTime).getTime();
        },
      },
      pickerStartTime: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime();
        },
      },
    };
  },
  computed: {
    _backupStrategys: function() {
      return backupStrategys[this.type];
    },
    _timeStrategys: function() {
      const valBackupStrategy = this.create.backupStrategy;
      if (Array.isArray(backupStrategys[this.type]) === true) {
        for (let i = 0; i < backupStrategys[this.type].length; i++) {
          if (backupStrategys[this.type][i].label === valBackupStrategy) {
            const valtimeStrategys =
              backupStrategys[this.type][i].timeStrategys;
            this.tmpTimeStrategy = valtimeStrategys[0].label;
            return valtimeStrategys;
          }
        }
      }
    },
    _timeInterval: function() {
      if (this.tmpTimeStrategy === 1) {
        return this.create.timeIntervalM;
      } else if (this.tmpTimeStrategy === 2) {
        return this.create.timeIntervalH * 60;
      } else {
        return '';
      }
    },
    _visible: {
      get: function() {
        return this.visible;
      },
      set: function(value) {
        this.$emit('update:visible', value);
      },
    },
  },
  methods: {
    // 重置表单
    resetCreate() {
      // this.$refs.create.resetFields(); 重置后数据不匹配
      this.$refs.create.clearValidate();
      this.tmpTimeStrategy = 1;
      this.create.name = '';
      this.create.backupStrategy = 1;
      this.create.startTime = '';
      this.create.backupPath = '';
      this.create.backupSystem = 'sys';
      this.create.singleTime = '';
      this.create.datePoints = [];
      this.create.weekPoints = [];
      this.create.timeIntervalH = 1;
      this.create.timeIntervalM = 10;
      this.create.timePoints[0].value = '';
    },
    createBackupPlan() {
      if (this.type === 'oracle' || this.type === 'sqlserver') {
        this.create.backupPath = 'value';
        this.create.backupSystem = 'sys';
      }
      this.$refs.create.validate(valid => {
        if (valid) {
          this.createLoading = true;
          const data = this.create.timePoints;
          const arr1 = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].value !== '') {
              arr1.push(data[i].value);
            }
          }
          const arr = [...new Set(arr1)];
          const emptydata = {
            timeInterval: '',
            singleTime: '',
            weekPoints: [],
            datePoints: [],
            timePoints: [],
          };
          if (this.tmpTimeStrategy === 0) {
            emptydata.singleTime = this.create.singleTime;
          } else if (this.tmpTimeStrategy === 1) {
            emptydata.timeInterval = this._timeInterval;
          } else if (this.tmpTimeStrategy === 2) {
            emptydata.timeInterval = this._timeInterval;
          } else if (this.tmpTimeStrategy === 3) {
            emptydata.timePoints = arr.sort();
          } else if (this.tmpTimeStrategy === 4) {
            emptydata.weekPoints = this.create.weekPoints.sort();
            emptydata.timePoints = arr.sort();
          } else if (this.tmpTimeStrategy === 5) {
            emptydata.datePoints = this.create.datePoints.sort((a, b) => a - b
            );
            emptydata.timePoints = arr.sort();
          }
          const tmpdata = {
            startTime: this.create.startTime,
            backupStrategy: this.create.backupStrategy,
            timeStrategy: this.tmpTimeStrategy,
            // backupUrl: this.create.backupUrl,
          };
          const configdata = Object.assign({}, emptydata, tmpdata);
          const postdata = {
            oracle: { name: this.create.name, config: configdata },
            sqlserver: { name: this.create.name, config: configdata },
            windows: {
              name: this.create.name,
              backupPath: this.create.backupPath,
              backupSystem: this.create.backupSystem,
              config: configdata,
            },
            linux: {
              name: this.create.name,
              backupPath: this.create.backupPath,
              backupSystem: '',
              config: configdata,
            },
          };
          // 向请求服务端
          requestMapping[this.type](this.id, postdata[this.type])
            .then(response => {
              this.$emit('confirm', response.data.data);
              this.create.timePoints.splice(
                1,
                this.create.timePoints.length - 1
              );
              this.$message.success(response.data.message);
              this._visible = false;
              this.createLoading = false;
              this.resetCreate();
            })
            .catch(error => {
              this.createLoading = false;
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    removeTimePoint(item) {
      const index = this.create.timePoints.indexOf(item);
      if (index !== -1) {
        this.create.timePoints.splice(index, 1);
      }
    },
    addTimePoint() {
      this.create.timePoints.push({
        value: '',
        key: Date.now(),
      });
    },
    getTimeStrategy(val) {
      if (val === 0) {
        this.emptyCreateInfo();
        this.isShowOnce = true;
      } else if (val === 1) {
        this.emptyCreateInfo();
        this.isShowTimeRateM = true;
      } else if (val === 2) {
        this.emptyCreateInfo();
        this.isShowTimeRateH = true;
      } else if (val === 3) {
        this.emptyCreateInfo();
        this.isShowTime = true;
      } else if (val === 4) {
        this.emptyCreateInfo();
        this.isShowTime = true;
        this.isShowWeek = true;
      } else if (val === 5) {
        this.emptyCreateInfo();
        this.isShowTime = true;
        this.isShowDay = true;
      }
    },
    emptyCreateInfo() {
      this.isShowOnce = false;
      this.isShowTime = false;
      this.isShowTimeRateH = false;
      this.isShowTimeRateM = false;
      this.isShowDay = false;
      this.isShowWeek = false;
    },
  },
  watch: {
    tmpTimeStrategy: function(newVal) {
      this.getTimeStrategy(newVal);
    },
  },
};
</script>
