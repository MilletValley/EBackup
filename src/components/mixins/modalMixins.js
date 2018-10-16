import isEqual from 'lodash/isEqual';

const genModalMixin = type => {
  if (!['database', 'filehost', 'host', 'vm', 'vmManageCollect'].includes(type)) {
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
          return ['oracle', 'sqlserver', 'mysql', 'filehost', 'host', 'vm', 'vmManageCollect'].includes(value);
        },
      },
      btnLoading: {
        type: Boolean,
        // required: true,
      },
    },
    data() {
      const databaseBaseFormData = {
        id: -1,
        hostId: '',
        instanceName: '',
        loginName: '',
        password: '',
        application: '',
        dbVersion: '',
        host: {},
      };
      const fileHostBaseFormData = {
        id: -1,
        // name: '',
        hostIp: '',
        loginName: '',
        password: '',
        hostName: '',
        osName: '',
        application: '',
      };
      const hostBaseFormData = {
        id: -1,
        name: '',
        hostIp: '',
        serviceIp: '',
        osName: '',
        loginName: '',
        password: '',
        hostType: 1,
        databaseType: 1,
        oracleVersion: '',
        storagePath: '',
        sharingPath: '',
        isRacMark: 1,
        vip: '',
        tempVip: ''
      };
      const virtualFormData = {
        id: -1,
        vmName: '',
        host: {},
      };
      const vmManageCollectFormData = {
        vmManageHostIp: '',
        vmManageHostLogin: '',
        vmManageHostPass: '',
        vmHostServerIp: '',
        vmHostServerUser: '',
        vmHostServerPass: '',
        vmHostServerType: 2
      };
      const baseData = {
        oracle: databaseBaseFormData,
        sqlserver: databaseBaseFormData,
        mysql: databaseBaseFormData,
        filehost: fileHostBaseFormData,
        host: hostBaseFormData,
        vm: virtualFormData,
        vmManageCollect: vmManageCollectFormData
      };
      const loginType = {
        oracle: 'oracle数据库',
        sqlserver: 'sql server数据库',
        mysql: 'mysql数据库',
        filehost: '服务器',
        host: '设备'
      };
      const rules = {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        {
          max: 20,
          message: '长度在20个字符以内',
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        hostId: [{
          required: true,
          message: '请选择设备',
          trigger: 'change'
        }],
        hostIp: [{
          required: true,
          message: '请输入主机IP',
          trigger: 'blur'
        },
        {
          pattern: '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
          message: 'IP地址不正确',
          trigger: 'blur',
        },
        ],
        serviceIp: [{
          pattern: '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
          message: 'IP地址不正确',
          trigger: 'blur',
        }],
        hostType: [{
          required: true,
          message: '请选择设备类型',
          trigger: 'blur'
        }],
        databaseType: [{
          required: true,
          message: '请选择数据库类型',
          trigger: 'blur'
        }],
        instanceName: [{
          required: true,
          message: `请输入${
            this.type === 'oracle' ? '实例名' : '数据库名'
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
        osName: [{
          required: true,
          message: '请选择操作系统',
          trigger: 'blur'
        }],
        oracleVersion: [{
          required: true,
          message: '请选择Oracle版本',
          trigger: 'blur'
        }],
        loginName: [{
          required: true,
          message: `请输入${loginType[this.type]}登录账号`,
          trigger: 'blur',
        },
        {
          length: 20,
          message: '长度在20个字符以内',
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        password: [{
          required: true,
          message: `请输入${loginType[this.type]}登录密码`,
          trigger: 'blur',
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        storagePath: [{
          required: true,
          message: '请输入存储盘符',
          trigger: 'change',
        }],
      };
      // 文件服务器备份必填 0530反馈
      if (this.type === 'filehost') {
        rules.osName = [{
          required: true,
          message: '请选择操作系统',
          trigger: 'change'
        }];
        rules.hostName = [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },
        {
          max: 20,
          message: '长度在20个字符以内',
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ];
      }
      return {
        originFormData: Object.assign({}, baseData[this.type]), // 原始值
        formData: Object.assign({}, baseData[this.type]),
        // trigger增加change更方便 但是再次打开modal会显示出验证结果
        // 猜测是因为初始化时，触发了change事件
        rules,
        hiddenPassword: true,
        collapseName: '', // 折叠面板名称 目前就一个
        confirmBtnLoading: false, // 确认按钮加载动画
        isLoading: false,
        options: [{
          value: 1,
          label: '10G'
        }, {
          value: 2,
          label: '11G'
        }],
        words: [],
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
        return this.type === 'oracle' ? '实例名' : '数据库名';
      },
      sqlserverHosts() {
        return this.$store.getters.hostsWithSqlServer.filter(
          h => h.hostType === 1
        );
      },
      mysqlHosts() {
        return this.$store.getters.hostsWithMySql.filter(
          h => h.hostType === 1
        );
      },
      oracleHosts() {
        return this.$store.getters.hostsWithOracle.filter(
          h => h.hostType === 1
        );
      },
      availableHosts() {
        if (this.type === 'oracle') {
          return this.oracleHosts;
        } else if (this.type === 'sqlserver') {
          return this.sqlserverHosts;
        }
        return this.mysqlHosts;
      },
    },
    mounted() {
      for (let i = 67; i < 91; i++) {
        const word = {};
        word.value = String.fromCharCode(i);
        this.words.push(word);
      }
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
