const applyFilterMethods = (originData, methods) =>
  methods.reduce((a, b) => a.filter(b), originData);

const keepTwoDecimalFull = num =>
  Math.round(num * 100) / 100;

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
    size = `${keepTwoDecimalFull(process)}K`;
  } else {
    const res = process / 1024 / 1024;
    if (res < 1) {
      size = `${keepTwoDecimalFull(res * 1024)}M`;
    } else if (res > 1024) {
      size = `${keepTwoDecimalFull(res / 1024)}T`;
    } else {
      size = `${keepTwoDecimalFull(res)}G`;
    }
  }
  return size;
};

const maxLengthFn = (w, maxLength) => {
  if (String(w)) {
    const t = w.replace(/[\u4e00-\u9fa5]/g, ''); // �滻����
    return (w.length - t.length) * 2 + t.length > maxLength; // �жϳ���
  }
  return false;
};

const validateLength10 = (rule, value, callback) => {
  if (maxLengthFn(value, 10)) {
    callback(new Error('������10���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength20 = (rule, value, callback) => {
  if (maxLengthFn(value, 20)) {
    callback(new Error('������20���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength30 = (rule, value, callback) => {
  if (maxLengthFn(value, 30)) {
    callback(new Error('������30���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength40 = (rule, value, callback) => {
  if (maxLengthFn(value, 40)) {
    callback(new Error('������40���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength50 = (rule, value, callback) => {
  if (maxLengthFn(value, 50)) {
    callback(new Error('������50���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength60 = (rule, value, callback) => {
  if (maxLengthFn(value, 60)) {
    callback(new Error('������60���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength70 = (rule, value, callback) => {
  if (maxLengthFn(value, 70)) {
    callback(new Error('������70���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength80 = (rule, value, callback) => {
  if (maxLengthFn(value, 80)) {
    callback(new Error('������80���ַ����ڣ�ע������ռ2���ַ�'));
  } else {
    callback();
  }
};

const validateLength100 = (rule, value, callback) => {
  if (maxLengthFn(value, 100)) {
    callback(new Error('������100���ַ����ڣ�ע������ռ2���ַ�'));
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
