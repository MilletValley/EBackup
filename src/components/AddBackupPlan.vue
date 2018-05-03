<template>
  <section>
    <!-- 创建数据库备份配置页面 begin-->
    <el-dialog :title="'添加'+dbType+'备份配置'" :visible.sync="_visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
        <el-form-item label="备份标题" prop="name">
          <el-input v-model="create.name"></el-input>
        </el-form-item>
        <el-form-item label="计划时间" prop="startTime">
          <el-date-picker v-model="create.startTime" :picker-options="pickerStartTime" type="datetime" placeholder="选择日期时间" default-time="00:00:00" value-format="yyyy-MM-dd HH-mm-ss">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="备份路径" prop="backupUrl">
          <el-input v-model="create.backupUrl"></el-input>
        </el-form-item> -->
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
          <el-date-picker v-model="create.singleTime" type="datetime" :picker-options="pickerSingleTime" placeholder="请选择日期时间" default-time="00:00:00" value-format="yyyy-MM-dd HH-mm-ss">
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
import _ from 'lodash';
import { createOracleBackupPlans } from '../api/oracle';
import { createSqlServerBackupPlans } from '../api/sqlserver';
const requestMapping = {
  oracle: (id, data) => createOracleBackupPlans({ id, plan: data }),
  sqlserver: (id, data) => createSqlServerBackupPlans({ id, plan: data }),
};
const backupStrategys = {
  oracle: [
    {
      label: 1,
      name: '全备+增备',
      timeStrategys: [
        {
          label: 0,
          name: '单次',
        },
        {
          label: 2,
          name: '按小时',
        },
        {
          label: 3,
          name: '按天',
        },
        {
          label: 4,
          name: '按周',
        },
        {
          label: 5,
          name: '按月',
        },
      ],
    }
  ],
  sqlserver: [
    {
      label: 1,
      name: '全备+增备',
      timeStrategys: [
        {
          label: 0,
          name: '单次',
        },
        {
          label: 2,
          name: '按小时',
        },
        {
          label: 3,
          name: '按天',
        },
        {
          label: 4,
          name: '按周',
        },
        {
          label: 5,
          name: '按月',
        },
      ],
    },{
      label: 2,
      name: '全备+日志',
      timeStrategys: [
        {
          label: 1,
          name: '按分钟',
        },
      ],
    },
  ],
  file: [
    {
      label: 1,
      name: '全备+增备',
      timeStrategys: [
        {
          label: 0,
          name: '单次',
        },
        {
          label: 1,
          name: '按分钟',
        },
        {
          label: 2,
          name: '按小时',
        },
        {
          label: 3,
          name: '按天',
        },
        {
          label: 4,
          name: '按周',
        },
      ],
    },
  ],
};
const datePoints = [];
for (let i = 1; i < 32; i++) {
  datePoints.push({ value: ''+i+'', label: i + '号' });
}
const weekPoints = [
  {
    value: '1',
    label: '周一',
  },
  {
    value: '2',
    label: '周二',
  },
  {
    value: '3',
    label: '周三',
  },
  {
    value: '4',
    label: '周四',
  },
  {
    value: '5',
    label: '周五',
  },
  {
    value: '6',
    label: '周六',
  },
  {
    value: '7',
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
        // backupUrl: '',
      },
      tmpTimeStrategy: 0,
      rules: {
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
        ],
        singleTime: [{ validator: valiSingleTime, trigger: 'change' }],
        weekPoints: [{ validator: valiWeekPoints, trigger: 'change' }],
        timePoints: [{ validator: valiTimePoints, trigger: 'change' }],
        datePoints: [{ validator: valiDatePoints, trigger: 'change' }],
        /* backupUrl: [
          { required: true, message: '备份路径不能为空', trigger: 'blur' },
        ], */
        name: [
          { required: true, message: '备份名称不能为空', trigger: 'blur' },
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
      return backupStrategys[this.dbType];
    },
    _timeStrategys: function() {
      const valBackupStrategy = this.create.backupStrategy;
      for( let i=0; i<backupStrategys[this.dbType].length; i++){
        if(backupStrategys[this.dbType][i].label === valBackupStrategy){
          const valtimeStrategys = backupStrategys[this.dbType][i].timeStrategys;
          this.tmpTimeStrategy = valtimeStrategys[0].label;
          return valtimeStrategys;
        }
      }
    },
    _timeInterval: function() {
      if(this.tmpTimeStrategy === 1){
        return this.create.timeIntervalM  
      }else if(this.tmpTimeStrategy === 2){
        return this.create.timeIntervalH*60
      }else{
        return ''
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
      // this.create.backupUrl = '';
      this.create.singleTime = '';
      this.create.datePoints = [];
      this.create.weekPoints = [];
      this.create.timeIntervalH = 1;
      this.create.timeIntervalM = 10;
      this.create.timePoints[0].value = '';
    },
    createBackupPlan() {
      this.$refs.create.validate(valid => {
        if (valid) {
          this.createLoading = true;
          const data = this.create.timePoints;
          const arr1 = [];
          for(let i=0; i<data.length; i++){
            if(data[i].value !== ''){
              arr1.push(data[i].value)
            }
          }
          let arr = [...new Set(arr1)];       
          let emptydata = {
            timeInterval: '',
            singleTime: '',
            weekPoints: [],
            datePoints: [],
            timePoints: [],
          };
          if(this.tmpTimeStrategy === 0){
            emptydata.singleTime = this.create.singleTime;
          }else if(this.tmpTimeStrategy === 1){
            emptydata.timeInterval = this._timeInterval;      
          }else if(this.tmpTimeStrategy === 2){
            emptydata.timeInterval = this._timeInterval;
          }else if(this.tmpTimeStrategy === 3){
            emptydata.timePoints = arr.sort();
          }else if(this.tmpTimeStrategy === 4){
            emptydata.weekPoints = this.create.weekPoints.sort();
            emptydata.timePoints = arr.sort();
          }else if(this.tmpTimeStrategy === 5){
            emptydata.datePoints = this.create.datePoints.sort(
              function sortNumber(a,b)
                {
                    return a - b
                });
            emptydata.timePoints = arr.sort();
          }
          const tmpdata = {
            startTime: this.create.startTime,
            backupStrategy: this.create.backupStrategy,
            timeStrategy: this.tmpTimeStrategy,
            // backupUrl: this.create.backupUrl,
          };
          const configdata = Object.assign({},emptydata,tmpdata)
          const postdata = {name: this.create.name, config:configdata}
          // 向请求服务端
          requestMapping[this.dbType](this.dbId, postdata)
            .then(response => {
              this.$emit('confirm', response.data.data);
              this.create.timePoints.splice(
                1,
                this.create.timePoints.length - 1
              );
              this.$message.success('创建备份配置成功!');
              this._visible = false;
              this.createLoading = false;
              this.resetCreate();
            })
            .catch(error => {
              console.log('创建备份配置失败:');
              console.log(error);
              this.createLoading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    removeTimePoint(item) {
      let index = this.create.timePoints.indexOf(item);
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
      }else if (val === 5) {
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
    tmpTimeStrategy: function(newVal, oldVal) {
      this.getTimeStrategy(newVal);
    },
  },
};
</script>
