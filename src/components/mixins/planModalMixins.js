import isEqual from 'lodash/isEqual';
import dayjs from 'dayjs';
import InputToggle from '@/components/InputToggle';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  restoreTimeStrategyMapping as strategys,
  weekMapping,
} from '../../utils/constant';
// 配置信息 如果有业务添加或者变更 可以直接修改这个对象
const strategyMapping = {
  default: {
    0: [0],
  },
  oracle: {
    1: [0, 2, 3, 4, 5],
  },
  vm: {
    1: [0, 2, 3, 4, 5],
  },
  sqlserver: {
    1: [0, 2, 3, 4, 5],
    2: [1],
  },
  windows: {
    1: [0, 1, 2, 3, 4],
  },
  linux: {
    1: [0, 1, 2, 3, 4],
  },
};

const mapping = {
  oracle: '实例',
  sqlserver: '数据库',
  windows: '恢复路径',
  linux: '恢复路径',
};

const backupPlanModalMixin = {
  props: {
    type: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
    },
    btnLoading: {
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
      if (this.formData.timeStrategy !== 0) {
        if (!value) {
          callback(new Error('请输入计划时间'));
        } else if (dayjs(value) < dayjs()) {
          callback(new Error('计划时间不能晚于当前时间'));
        } else callback();
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
      // type值会延迟获取到 使用pruneData裁剪数据
      backupPath: '',
      backupSystem: 'nosys',
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
    // 根据type生成可用的备份策略
    availableBackupStrategies() {
      if (!this.type) {
        return [
          {
            code: 0,
            value: backupStrategyMapping['0'],
          },
        ];
      }
      return Object.keys(strategyMapping[this.type]).map(strategyCode => ({
        code: +strategyCode,
        value: backupStrategyMapping[strategyCode],
      }));
    },
    // 根据选择的备份策略生成可用的时间策略
    availableTimeStrategies() {
      if (!this.type) {
        return [
          {
            code: 0,
            value: timeStrategyMapping['0'],
          },
        ];
      }
      return (
        strategyMapping[this.type][this.formData.backupStrategy] || []
      ).map(strategyCode => ({
        code: strategyCode,
        value: timeStrategyMapping[strategyCode],
      }));
    },
  },
  methods: {
    // 切换备份策略时 同时更新时间策略为第一个可用值
    backupStrategyChange(label) {
      this.formData.timeStrategy = strategyMapping[this.type][label][0];
    },
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
        backupPath,
        backupSystem,
        ...other
      } = formData;
      const filteredTimePoints = this.filteredTimePoints;
      return new Promise((resolve, reject) => {
        let config;
        switch (timeStrategy) {
          case 0:
            if (dayjs(singleTime) < dayjs()) reject('单次时间必须晚于当前时间');
            config = { timeStrategy, singleTime, ...other };
            break;
          case 1:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            config = {
              timeStrategy,
              startTime,
              timeInterval: minuteInterval,
              ...other,
            };
            break;
          case 2:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            config = {
              timeStrategy,
              startTime,
              timeInterval: hourInterval * 60,
              ...other,
            };
            break;
          case 3:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            config = { timeStrategy, startTime, timePoints, ...other };
            break;
          case 4:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            config = {
              timeStrategy,
              startTime,
              weekPoints,
              timePoints,
              ...other,
            };
            break;
          case 5:
            if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
            if (timePoints.every(p => !p.value)) {
              reject('请至少输入一个时间点');
            }
            config = {
              timeStrategy,
              startTime,
              datePoints,
              timePoints,
              ...other,
            };
            break;
          default:
        }
        if ([3, 4, 5].includes(timeStrategy)) {
          config.timePoints = filteredTimePoints(timePoints);
        }
        if (this.type === 'windows') {
          resolve({ name, backupPath, backupSystem, config });
        } else if (this.type === 'linux') {
          resolve({ name, backupPath, config });
        } else {
          resolve({ name, config });
        }
      });
    },
    cancel() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
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

const restorePlanModalMixin = {
  props: {
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'windows', 'linux', ''].includes(value);
      },
    },
    id: {
      type: Number,
      // required: true,
    },
    database: {
      type: Object,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    btnLoading: {
      type: Boolean,
    },
    selectionHosts: {
      type: Array,
      // required: true,
    },
  },
  data() {
    const singleTimeValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 1 && !value) {
        callback(new Error('请输入恢复时间'));
      } else {
        callback();
      }
    };
    const startTimeValidate = (rule, value, callback) => {
      if ([2, 3].indexOf(this.formData.timeStrategy) !== -1 && !value) {
        callback(new Error('请输入计划时间'));
      } else {
        callback();
      }
    };
    const weekPointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 2 && value.length === 0) {
        callback(new Error('请输入循环星期'));
      } else {
        callback();
      }
    };
    const timePointsValidate = (rule, value, callback) => {
      if (this.formData.timePoints.every(p => !p.value)) {
        callback(new Error('请输入时间点'));
      } else {
        callback();
      }
    };
    const datePointsValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 3 && value.length === 0) {
        callback(new Error('请输入循环日期'));
      } else {
        callback();
      }
    };
    const detailInfoDisplayName = mapping[this.type];
    const baseFormData = {
      name: '',
      hostIp: '',
      loginName: '',
      password: '',
      detailInfo: '',
      startTime: '',
      singleTime: '',
      datePoints: [],
      timePoints: [{ value: '00:00', key: Date.now() }],
      weekPoints: [], // 必须初始化为数组，checkbox group才能识别
      timeStrategy: 1, // 默认单次执行
    };
    // 文件单次恢复 增加覆盖策略
    if (this.isFileHost) {
      baseFormData.recoveringStrategy = 1;
    }
    return {
      // 原始表单值
      originFormData: Object.assign({}, baseFormData),
      formData: Object.assign({}, baseFormData),
      strategys, // 时间策略
      weekMapping, // 星期映射
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        hostIp: [
          { required: true, message: '请输入主机IP', trigger: 'blur' },
          {
            pattern:
              '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          },
        ],
        detailInfo: [
          {
            required: true,
            message: `请输入${detailInfoDisplayName}`,
            trigger: 'blur',
          },
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
        ],
        // password: [
        //   { required: true, message: '请输入登录密码', trigger: 'blur' },
        // ],
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
        timePoints: [
          {
            validator: timePointsValidate,
            trigger: 'blur',
          }
        ],
        datePoints: [
          {
            validator: datePointsValidate,
            trigger: 'blur',
          },
        ],
      },
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
    detailInfoDisplayName() {
      return mapping[this.type];
    },
    isFileHost() {
      return this.type === 'windows' || this.type === 'linux';
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
    // 精简计划数据，返回不同时间策略下所需要的数据
    pruneData(formData) {
      const {
        name,
        timeStrategy,
        startTime,
        singleTime,
        timePoints,
        weekPoints,
        datePoints,
        recoveringStrategy,
        ...other
      } = formData;
      let config;
      const filteredTimePoints = this.filteredTimePoints;
      return new Promise((resolve, reject) => {
        if (timeStrategy === 1) {
          if (dayjs(singleTime) < dayjs()) reject('单次时间必须晚于当前时间');
          config = { timeStrategy, recoveringStrategy, singleTime, ...other };
        } else {
          if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
          // if (timePoints.every(p => !p.value)) {
          //   reject('请至少输入一个时间点');
          // }
          if (timeStrategy === 2) {
            // 按周循环
            config = {
              timeStrategy,
              startTime,
              timePoints,
              weekPoints,
              ...other,
            };
          } else if (timeStrategy === 3) {
            // 按月循环
            config = {
              timeStrategy,
              startTime,
              timePoints,
              datePoints,
              ...other,
            };
          }
          config.timePoints = filteredTimePoints(timePoints);
        }
        resolve({ name, config });
      });

      // return { name, config };
    },
    // 点击取消按钮
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
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
  components: {
    InputToggle,
  },
};

export { restorePlanModalMixin, backupPlanModalMixin };
