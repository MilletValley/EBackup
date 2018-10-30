const applyFilterMethods = (originData, methods) =>
  methods.reduce((a, b) => a.filter(b), originData);

const fmtSizeFn = process => {
  let size = null;
  if (!process) {
    return;
  }
  if (process < 1024) {
    size = `${process}K`;
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
