const applyFilterMethods = (originData, methods) =>
  methods.reduce((a, b) => a.filter(b), originData);

export { applyFilterMethods };
