const applyFilterMethods = (originData, methods) =>
  methods.reduce((a, b) => a.filter(b), originData);
// eslint-disable-next-line
export { applyFilterMethods };
