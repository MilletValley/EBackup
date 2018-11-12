const applyFilterMethods = (originData, methods) =>
  methods.reduce((a, b) => a.filter(b), originData);


const fmtSizeFn = num => {
  let size = null;
  if (!num) {
    return;
  }
  const process = num / 1024;
  if (process < 1) {
    return `${num}B`;
  }
  if (process < 1024) {
    size = `${Math.round(process)}K`;
  } else {
    const res = process / 1024 / 1024;
    if (res < 1) {
      size = `${Math.round(res * 1024)}M`;
    } else if (res > 1024) {
      size = `${Math.round(res / 1024)}T`;
    } else {
      size = `${Math.round(res)}G`;
    }
  }
  return size;
};

const maxLengthFn = (w, maxLength) => {
  if (String(w)) {
    const t = w.replace(/[\u4e00-\u9fa5]/g, ''); // 替换中文
    return (w.length - t.length) * 2 + t.length > maxLength; // 判断长度
  }
  return false;
};

const validateLength10 = (rule, value, callback) => {
  if (maxLengthFn(value, 10)) {
    callback(new Error('长度在10个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength20 = (rule, value, callback) => {
  if (maxLengthFn(value, 20)) {
    callback(new Error('长度在20个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength30 = (rule, value, callback) => {
  if (maxLengthFn(value, 30)) {
    callback(new Error('长度在30个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength40 = (rule, value, callback) => {
  if (maxLengthFn(value, 40)) {
    callback(new Error('长度在40个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength50 = (rule, value, callback) => {
  if (maxLengthFn(value, 50)) {
    callback(new Error('长度在50个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength60 = (rule, value, callback) => {
  if (maxLengthFn(value, 60)) {
    callback(new Error('长度在60个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength70 = (rule, value, callback) => {
  if (maxLengthFn(value, 70)) {
    callback(new Error('长度在70个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength80 = (rule, value, callback) => {
  if (maxLengthFn(value, 80)) {
    callback(new Error('长度在80个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};

const validateLength100 = (rule, value, callback) => {
  if (maxLengthFn(value, 100)) {
    callback(new Error('长度在100个字符以内，注：中文占2个字符'));
  } else {
    callback();
  }
};
// eslint-disable-next-line
export {
  applyFilterMethods,
  fmtSizeFn,
  maxLengthFn,
  validateLength10,
  validateLength20,
  validateLength30,
  validateLength40,
  validateLength50,
  validateLength60,
  validateLength70,
  validateLength80,
  validateLength100,
};
