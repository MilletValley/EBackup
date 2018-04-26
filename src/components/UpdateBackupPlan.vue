<template>
  <section>
    <!-- 修改数据库备份配置页面 begin-->
    <el-dialog :title="'修改'+dbType+'备份配置'"
               :visible.sync="_visible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#update"
               :model="update"
               :rules="rules"
               ref="update" label-width="100px">
        <el-form-item label="计划时间" prop="startTime">
          <el-date-picker
            v-model="update.startTime"
            :picker-options="pickerStartTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备份路径" prop="backupUrl">
          <el-input v-model="update.backupUrl"></el-input>
        </el-form-item>
        <el-form-item label="备份机制">
          <el-radio-group v-model="update.backupStrategy">
            <el-radio
              v-for="item in _backupStrategys"
              :key="item.label"
              :label="item.label"
              :disabled="item.disabled">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份策略">
          <el-radio-group v-model="tmpTimeStrategy">
            <el-radio
              v-for="item in _timeStrategys"
              :key="item.label"
              :label="item.label"
              :disabled="item.disabled">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单次备份" v-show="isShowOnce" prop="singleTime">
          <el-date-picker
            v-model="update.singleTime"
            type="datetime"
            :picker-options="pickerSingleTime"
            placeholder="请选择日期时间"
            default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="每月备份" v-show="isShowDay" prop="datePoints">
          <el-select v-model="update.datePoints" multiple placeholder="请选择日期">
            <el-option
              v-for="item in datePointsInfo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每周备份" v-show="isShowWeek" prop="weekPoints">
          <el-select v-model="update.weekPoints" multiple placeholder="请选择周几">
            <el-option
              v-for="item in weekPointsInfo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔小时" v-show="isShowTimeRate">
          <el-input-number v-model="update.timeIntervel" :step="2" :min="2" :max="24"></el-input-number>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in update.timePoints"
          :label="'备份时间'"
          :key="domain.key"
          prop="timePoints"
          v-show="isShowTime"
        >
          <el-col :span="11">
            <el-time-select
              v-model="domain.value"
              :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
              placeholder="请选择时间点">
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
        <el-button type="primary" :loading="updateLoading" @click="updateBackupPlan">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改数据库备份配置页面 end-->
  </section>
</template>
<script>
import _ from 'lodash';
import {
  updateBackupPlans,
} from '../api/database';

const requestMapping = {
  oracle: (id, data) => updateBackupPlans({ id, plan: data }),
  sqlserver: (id, data) => updateBackupPlans({ id, plan:data }),
};
const backupStrategys = {
  oracle: [
    {
      label: 0,
      name: '全备',
      timeStrategys: [
        {
          label: 0,
          name: '单次',
          disabled: false,
        },
        {
          label: 1,
          name: '每天',
          disabled: false,
        },
        {
          label: 2,
          name: '每周',
          disabled: false,
        },
        {
          label: 3,
          name: '每月',
          disabled: false,
        },
        {
          label: 4,
          name: '间隔',
          disabled: false,
        },
      ],
    },
    {
      label: 1,
      name: '全备+增备',
      timeStrategys: [
        {
          label: 1,
          name: '每天',
          disabled: false,
        },
        {
          label: 2,
          name: '每周',
          disabled: false,
        },
        {
          label: 3,
          name: '每月',
          disabled: false,
        },
      ],
    },
    {
      label: 2,
      name: '全备+日志',
      timeStrategys: [
        {
          label: 1,
          name: '每天',
          disabled: false,
        },
        {
          label: 2,
          name: '每周',
          disabled: false,
        },
        {
          label: 3,
          name: '每月',
          disabled: false,
        },
      ],
    },
  ],
  sqlserver: [
    {
      label: 0,
      name: '全备',
      timeStrategys: [
        {
          label: 0,
          name: '单次',
          disabled: false,
        },
        {
          label: 1,
          name: '每天',
          disabled: false,
        },
        {
          label: 2,
          name: '每周',
          disabled: false,
        },
        {
          label: 3,
          name: '每月',
          disabled: false,
        },
        {
          label: 4,
          name: '间隔',
          disabled: false,
        },
      ],
    },
    {
      label: 1,
      name: '全备+增备',
      timeStrategys: [
        {
          label: 1,
          name: '每天',
          disabled: false,
        },
        {
          label: 2,
          name: '每周',
          disabled: false,
        },
        {
          label: 3,
          name: '每月',
          disabled: false,
        },
      ],
    },
  ],
};
const datePoints = [];
for (let i = 1; i < 32; i++) {
  datePoints.push({ value: i, label: i + '号' });
}
const weekPoints = [
  {
    value: 1,
    label: '周一',
  },
  {
    value: 2,
    label: '周二',
  },
  {
    value: 3,
    label: '周三',
  },
  {
    value: 4,
    label: '周四',
  },
  {
    value: 5,
    label: '周五',
  },
  {
    value: 6,
    label: '周六',
  },
  {
    value: 7,
    label: '周日',
  },
];

export default {
  props: {
    dbType: {
      type: String,
      required: true,
    },
    dbId: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    backupPlan: {
      type: Object,
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
        this.tmpTimeStrategy === 1 ||
        this.tmpTimeStrategy === 2 ||
        this.tmpTimeStrategy === 3
      ) {
        let i = 0;
        value.map(item => {
          if (item.value != '') {
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
      if (this.tmpTimeStrategy === 2) {
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
      if (this.tmpTimeStrategy === 3) {
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
      updateLoading: false,
      isShowOnce: false,
      isShowTime: true,
      isShowTimeRate: false,
      isShowDay: false,
      isShowWeek: false,
      weekPointsInfo: weekPoints,
      datePointsInfo: datePoints,
      update: {
        timePoints: [
          {
            value: '',
          },
        ],
        startTime: '',
        timeIntervel: '',
        singleTime: '',
        weekPoints: [],
        datePoints: [],
        backupStrategy: 0,
        backupUrl: '',
      },
      tmpTimeStrategy: 1,
      rules: {
        startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
        singleTime: [{ validator: valiSingleTime, trigger: 'change' }],
        weekPoints: [{ validator: valiWeekPoints, trigger: 'change' }],
        timePoints: [{ validator: valiTimePoints, trigger: 'change' }],
        datePoints: [{ validator: valiDatePoints, trigger: 'change' }],
        backupUrl: [{ required: true, message: '备份路径不能为空', trigger: 'blur' }],
      },
      pickerSingleTime: {
        disabledDate: time => {
          return time.getTime() < new Date(this.update.startTime).getTime();
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
      return backupStrategys[this.dbType];
    },
    _timeStrategys: function() {
      return backupStrategys[this.dbType][this.update.backupStrategy].timeStrategys;
    },
    _visible: {
      get: function() {
        this.initUpdate();
        return this.visible;
      },
      set: function(value) {
        this.$emit('update:visible', value);
      },
    },
  },
  methods: {
    // 赋值表单
    initUpdate() {
      //this.$refs.update.clearValidate();
      // 需要浅复制吗？
      this.tmpTimeStrategy = this.backupPlan.timeStrategy;
      this.update.backupStrategy = this.backupPlan.backupStrategy;
      this.update.startTime = this.backupPlan.startTime;
      this.update.backupUrl = this.backupPlan.backupUrl;
      this.update.singleTime = this.backupPlan.singleTime;
      this.update.datePoints = this.backupPlan.datePoints;
      this.update.weekPoints = this.backupPlan.weekPoints;
      this.update.timeInterval = this.backupPlan.timeInterval;
      this.update.timePoints = this.backupPlan.timePoints.map(i => {
            return { value: i }
          });
    },
    // 重置表单清空验证
    resetUpdate() {
      this.$refs.update.clearValidate();
    },
    updateBackupPlan() {
      this.$refs.update.validate(valid => {
        if (valid) {
          this.updateLoading = true;
          const arr = this.update.timePoints.map(item => {
            return item.value
          });
          const postdata = {
            startTime: this.update.startTime,
            backupStrategy: this.update.backupStrategy,
            timeIntervel: this.update.timeIntervel,
            timeStrategy: this.tmpTimeStrategy,
            singleTime: this.update.singleTime,
            weekPoints: this.update.weekPoints,
            datePoints: this.update.datePoints,
            timePoints: arr,
            backupUrl: this.update.backupUrl,
          };
          console.log('POSE数据:'+ this.dbId);
          console.log(postdata);
          // 向请求服务端
          requestMapping[this.dbType](this.dbId,postdata)
            .then(response => {
              console.log(response.data.message);
              this.$emit('confirm', response.data.data);
              this.update.timePoints.splice(
                1,
                this.update.timePoints.length - 1
              );
              this.$message.success('修改备份配置成功!');
              this._visible = false;
              this.updateLoading = false;
              this.resetUpdate();
            })
            .catch(error => {
              console.log('修改备份配置失败:');
              console.log(error);
              this.updateLoading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    removeTimePoint(item) {
      let index = this.update.timePoints.indexOf(item);
      if (index !== -1) {
        this.update.timePoints.splice(index, 1);
      }
    },
    addTimePoint() {
      this.update.timePoints.push({
        value: '',
        key: Date.now(),
      });
    },
    getTimeStrategy(val) {
      if (val === 0) {
        this.emptyUpdateInfo();
        this.isShowOnce = true;
      } else if (val === 1) {
        this.emptyUpdateInfo();
        this.isShowTime = true;
      } else if (val === 2) {
        this.emptyUpdateInfo();
        this.isShowTime = true;
        this.isShowWeek = true;
      } else if (val === 3) {
        this.emptyUpdateInfo();
        this.isShowTime = true;
        this.isShowDay = true;
      } else if (val === 4) {
        this.emptyUpdateInfo();
        this.isShowTimeRate = true;
      }
    },
    emptyUpdateInfo() {
      this.isShowOnce = false;
      this.isShowTime = false;
      this.isShowTimeRate = false;
      this.isShowDay = false;
      this.isShowWeek = false;
    },
  },
  watch: {
    tmpTimeStrategy: function(newVal, oldVal) {
      this.getTimeStrategy(newVal);
    },
  },
};
</script>
