import moment from 'moment';

const backupMixin = {
  filters: {
    durationFilter(value) {
      const duration = moment.duration(value, 's');
      const h = duration.get('h');
      const m = duration.get('m');
      const s = duration.get('s');
      return `${h ? `${h}小时` : ''} ${m ? `${m}分` : ''} ${
        s ? `${s}秒` : ''
      } `;
    },
  },
};

export default backupMixin;
