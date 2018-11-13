// eslint-disable-next-line

const maxLengthFn = (w, maxLength) => {
  console.log(w)
  if (String(w)) {
    console.log(w)
    const t = w.replace(/[\u4e00-\u9fa5]/g, ''); // 替换中文
    return (w.length - t.length) * 2 + t.length > maxLength; // 判断长度
  }
  return false;
};

const validateLength = length =>
  (rule, value, callback) => {
    if (maxLengthFn(value, length)) {
      callback(new Error(`长度在${length}个字符以内，注：中文占2个字符`));
    } else {
      callback();
    }
  };

export default {
  planName: [
    {
      required: true,
      message: '请输入计划名称',
      trigger: 'blur'
    }, {
      validator: validateLength(64),
      trigger: 'blur'
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }, {
      validator: validateLength(64),
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
      validator: validateLength(64),
      trigger: 'blur'
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
      validator: validateLength(64),
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
      validator: validateLength(64),
      trigger: 'blur'
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  // 文件系统校验
  fileLoginName: [
    {
      required: true,
      message: '请输入服务器登录密码',
      trigger: 'blur',
    }, {
      validator: validateLength(64),
      trigger: 'blur'
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  filePassword: [
    {
      required: true,
      message: '请输入服务器登录密码',
      trigger: 'blur',
    }, {
      validator: validateLength(64),
      trigger: 'blur'
    }, {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  hostIp: [
    {
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
  hostName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    },
    {
      validator: validateLength(64),
      trigger: 'blur'
    },
    {
      pattern: '^[^\\s]*$',
      message: '不能包含空格',
      trigger: ['blur'],
    }
  ],
  osName: [{
    required: true,
    message: '请选择操作系统',
    trigger: 'blur'
  }],
  application: [
    {
      validator: validateLength(64),
      trigger: 'blur'
    }
  ],
};