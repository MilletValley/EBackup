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
// eslint-disable-next-line
export { applyFilterMethods, fmtSizeFn };
