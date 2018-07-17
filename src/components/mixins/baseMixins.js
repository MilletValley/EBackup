const baseMixin = {
  filters: {
    // 转化持续时间
    durationFilter(value = 0) {
      const hourSeconds = 60 * 60;
      const minuteSeconds = 60;
      const h = Math.floor(value / hourSeconds);
      const m = Math.floor((value % hourSeconds) / minuteSeconds);
      const s = value % minuteSeconds;
      return `${h ? `${h}小时` : ''}${m ? `${m}分` : ''}${s ? `${s}秒` : ''} `;
    },
  },
};

export default baseMixin;
