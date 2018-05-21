import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';

import {
  restoreTimeStrategyMapping as strategys,
  weekMapping,
} from '../../utils/constant';

const mapping = {
  oracle: '实例',
  sqlserver: '数据库',
  windows: '恢复路径',
  linux: '恢复路径',
};

const modalMixin = {
  props: {
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'windows', 'linux', ''].includes(value);
      },
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
    if (this.isFileBackupResult) {
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
          { required: true, message: '请输入登陆名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
        ],
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
    isFileBackupResult() {
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
      if (timeStrategy === 1) {
        config = { timeStrategy, recoveringStrategy, singleTime, ...other };
      } else {
        if (timePoints.every(p => !p.value)) {
          this.$message.error('请至少输入一个时间点');
          return false;
        }
        if (timeStrategy === 2) {
          config = {
            timeStrategy,
            startTime,
            timePoints,
            weekPoints,
            ...other,
          };
        } else if (timeStrategy === 3) {
          config = {
            timeStrategy,
            startTime,
            timePoints,
            datePoints,
            ...other,
          };
        }
        config.timePoints = this.filteredTimePoints(timePoints);
      }
      return { name, config };
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

export default modalMixin;
