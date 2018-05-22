import isEqual from 'lodash/isEqual';

const databaseModalMixin = {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    dbType: {
      type: String,
      required: true,
      validator(value) {
        return ['oracle', 'sqlserver'].includes(value);
      },
    },
  },
  data() {
    const baseFormData = {
      id: '',
      name: '',
      hostIp: '',
      instanceName: '',
      loginName: '',
      password: '',
      hostName: '',
      osName: '',
      application: '',
      dbVersion: '',
    };
    return {
      originFormData: Object.assign({}, baseFormData), // 原始值
      formData: Object.assign({}, baseFormData),
      // trigger增加change更方便 但是再次打开modal会显示出验证结果
      // 猜测是因为初始化时，触发了change事件
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内', trigger: 'blur' },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        hostIp: [
          { required: true, message: '请输入主机IP', trigger: 'blur' },
          {
            pattern:
              '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          },
        ],
        instanceName: [
          {
            required: true,
            message: `请输入${
              this.dbType === 'sqlserver' ? '数据库名' : '实例名'
            }`,
            trigger: 'blur',
          },
          {
            max: 20,
            message: '长度在20个字符以内',
            trigger: 'blur',
          },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        loginName: [
          { required: true, message: '请输入数据库登录账号', trigger: 'blur' },
          { length: 20, message: '长度在20个字符以内', trigger: 'blur' },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        password: [
          { required: true, message: '请输入数据库登录密码', trigger: 'blur' },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
      },
      collapseName: '',
      confirmBtnLoading: false,
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
    // 区分不同数据库都提示信息
    databaseOrInstance() {
      return this.dbType === 'sqlserver' ? '数据库名' : '实例名';
    },
  },
  methods: {
    // 点击取消按钮触发
    cancelBtnClick() {
      this.hasModifiedBeforeClose(() => {
        this.$emit('update:visible', false); // 关闭modal
      });
    },
    // 退出之前，判断是否有未保存的修改
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    // 关闭之前 验证是否有修改
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

const fileHostModalMixin = {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    hostType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // trigger增加change更方便 但是再次打开modal会显示出验证结果
      // 猜测是因为初始化时，触发了change事件
      rules: {
        hostName: [
          { required: true, message: '请输入主机名', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在3到20个字符',
            trigger: 'blur',
          },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        hostIp: [
          { required: true, message: '请输入主机IP', trigger: 'blur' },
          {
            pattern:
              '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          },
        ],
        loginName: [
          { required: true, message: '请输入服务器登录账号', trigger: 'blur' },
          { length: 20, message: '长度在20个字符以内', trigger: 'blur' },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        password: [
          { required: true, message: '请输入服务器登录密码', trigger: 'blur' },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
      },
    };
  },
  computed: {
    _visible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
  },
  methods: {
    // 点击取消按钮触发
    cancel() {
      this.hasModifiedBeforeClose(() => {
        this.$emit('update:visible', false); // 关闭modal
      });
    },
    // 退出之前，判断是否有未保存的修改
    beforeClose(done) {
      this.hasModifiedBeforeClose(done);
    },
  },
};

export { databaseModalMixin, fileHostModalMixin };
