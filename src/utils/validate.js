// eslint-disable-next-line
export default {
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }, {
      max: 20,
      message: '长度在20个字符以内',
      trigger: 'blur'
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  dbPort: [
    {
      required: true,
      message: '请输入端口号',
      trigger: 'blur'
    }, {
      pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
      message: '请输入0-65535之间的数字',
      trigger: 'blur'
    }
  ],
  selelctHost: [
    { required: true, message: '请选择设备', trigger: 'blur' }
  ],
  dbName: [
    {
      required: true,
      message: '请输入数据库名',
      trigger: 'blur',
    }, {
      max: 20,
      message: '长度在20个字符以内',
      trigger: 'blur',
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  dbLoginName: [
    {
      required: true,
      message: '请输入数据库登录账号',
      trigger: 'blur',
    }, {
      length: 20,
      message: '长度在20个字符以内',
      trigger: 'blur'
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  dbPassword: [
    {
      required: true,
      message: '请输入数据库登录密码',
      trigger: 'blur',
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
};
