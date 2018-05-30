import isEqual from 'lodash/isEqual';

const genModalMixin = type => {
  if (!['database', 'filehost', 'host'].includes(type)) {
    throw new Error('参数错误！');
  }
  const databaseModalMixin = {
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      type: {
        type: String,
        required: true,
        validator(value) {
          return ['oracle', 'sqlserver', 'filehost', 'host'].includes(value);
        },
      },
    },
    data() {
      const databaseBaseFormData = {
        id: -1,
        hostIp: '',
        instanceName: '',
        loginName: '',
        password: '',
        hostName: '',
        osName: '',
        application: '',
        dbVersion: '',
      };
      const fileHostBaseFormData = {
        id: -1,
        name: '',
        hostIp: '',
        loginName: '',
        password: '',
        hostName: '',
        osName: '',
        application: '',
      };
      return {
        originFormData: Object.assign(
          {},
          type === 'database' ? databaseBaseFormData : fileHostBaseFormData
        ), // 原始值
        formData: Object.assign(
          {},
          type === 'database' ? databaseBaseFormData : fileHostBaseFormData
        ),
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
                this.type === 'sqlserver' ? '数据库名' : '实例名'
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
            {
              required: true,
              message: '请输入数据库登录账号',
              trigger: 'blur',
            },
            { length: 20, message: '长度在20个字符以内', trigger: 'blur' },
            {
              pattern: '^[^\\s]*$',
              message: '不能包含空格',
              trigger: ['blur'],
            },
          ],
          password: [
            {
              required: true,
              message: '请输入数据库登录密码',
              trigger: 'blur',
            },
            {
              pattern: '^[^\\s]*$',
              message: '不能包含空格',
              trigger: ['blur'],
            },
          ],
        },
        collapseName: '', // 折叠面板名称 目前就一个
        confirmBtnLoading: false, // 确认按钮加载动画
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
        return this.type === 'sqlserver' ? '数据库名' : '实例名';
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
  return databaseModalMixin;
};

// eslint-disable-next-line
export { genModalMixin };
