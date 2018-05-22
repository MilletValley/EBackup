import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
} from '../../utils/constant';

// 转换方法pick、objToArr、objToArr1、convert
const pick = (obj, arr) =>
  arr.reduce((iter, val) => (val in obj && (iter[val] = obj[val]), iter), {});
const objToArr = obj => {
  const arr = [];
  for (let i = 0; i < Object.keys(obj).length; i++) {
    arr.push({
      label: parseInt(Object.keys(obj)[i], 0),
      name: Object.values(obj)[i],
    });
  }
  return arr;
};
const objToArr1 = obj => {
  const arr = [];
  for (let i = 0; i < Object.keys(obj).length; i++) {
    arr.push({
      value: parseInt(Object.keys(obj)[i], 0),
      label: Object.values(obj)[i],
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
// console.log(config)
const backupStrategys = {
  oracle: convert(config.oracle),
  sqlserver: convert(config.sqlserver),
  windows: convert(config.file),
  linux: convert(config.file),
};
const datePoints = [];
for (let i = 1; i < 32; i++) {
  datePoints.push({ value: `${i}`, label: `${i}号` });
}
const weekPoints = objToArr1(weekMapping);

const backupPlanModalMixin = {
  data() {
    const valiSingleTime = (rule, value, callback) => {
      if (this.theData.timeStrategy === 0) {
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
        this.theData.timeStrategy === 3 ||
        this.theData.timeStrategy === 4 ||
        this.theData.timeStrategy === 5
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
      if (this.theData.timeStrategy === 4) {
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
      if (this.theData.timeStrategy === 5) {
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
      theFormLoading: false,
      weekPointsInfo: weekPoints,
      datePointsInfo: datePoints,
      theData: {},
      originData: {
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
        timeStrategy: '',
      },
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
        backupStrategy: [
          { required: true, message: '请选择备份机制', trigger: 'change' },
        ],
        timeStrategy: [
          { required: true, message: '请选择备份策略', trigger: 'change' },
        ],
      },
    };
  },
  computed: {
    _backupStrategys() {
      return backupStrategys[this.type];
    },
    _timeStrategys() {
      const valBackupStrategy = this.theData.backupStrategy;
      let value;
      if (Array.isArray(backupStrategys[this.type]) === true) {
        for (let i = 0; i < backupStrategys[this.type].length; i++) {
          if (backupStrategys[this.type][i].label === valBackupStrategy) {
            value = backupStrategys[this.type][i].timeStrategys;
            this.theData.timeStrategy = value[0].label;
          }
        }
      }
      return value;
    },
    isTimeInterval() {
      let value;
      if (this.theData.timeStrategy === 1) {
        value = this.theData.timeIntervalM;
      } else if (this.theData.timeStrategy === 2) {
        value = this.theData.timeIntervalH * 60;
      }
      return value;
    },
    _visible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      },
    },
  },
  methods: {
    removeTimePoint(item) {
      const index = this.theData.timePoints.indexOf(item);
      if (index !== -1) {
        this.theData.timePoints.splice(index, 1);
      }
    },
    addTimePoint() {
      this.theData.timePoints.push({
        value: '',
        key: Date.now(),
      });
    },
    emptydata() {
      const data = this.theData.timePoints;
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
      if (this.theData.timeStrategy === 0) {
        emptydata.singleTime = this.theData.singleTime;
      } else if (this.theData.timeStrategy === 1) {
        emptydata.timeInterval = this.isTimeInterval;
      } else if (this.theData.timeStrategy === 2) {
        emptydata.timeInterval = this.isTimeInterval;
      } else if (this.theData.timeStrategy === 3) {
        emptydata.timePoints = arr.sort();
      } else if (this.theData.timeStrategy === 4) {
        emptydata.weekPoints = this.theData.weekPoints.sort();
        emptydata.timePoints = arr.sort();
      } else if (this.theData.timeStrategy === 5) {
        emptydata.datePoints = this.theData.datePoints.sort((a, b) => a - b);
        emptydata.timePoints = arr.sort();
      }
      return emptydata;
    },
    valiTime() {
      // 验证计划时间、单次时间，大于当前时间
      let x = false;
      if (new Date(this.theData.startTime).getTime() < new Date().getTime()) {
        this.theFormLoading = false;
        this.$message.error('计划时间必须大于当前时间');
        x = false;
      } else if (
        this.theData.timeStrategy === 0 &&
        (new Date(this.theData.singleTime).getTime() < new Date().getTime() ||
          new Date(this.theData.singleTime).getTime() <
            new Date(this.theData.startTime).getTime())
      ) {
        this.theFormLoading = false;
        this.$message.error('单次时间必须大于计划时间和当前时间');
        x = false;
      } else {
        x = true;
      }
      return x;
    },
  },
  created() {
    this.theData = { ...this.originData };
  },
};

export { backupStrategys, datePoints, weekPoints, backupPlanModalMixin };
