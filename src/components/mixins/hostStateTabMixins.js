import { linkStateMapping, databaseStateMapping } from '../../utils/constant';

const hostState = {
  methods: {
    databaseTypeConverter(state) { // 主备库状态
      return databaseStateMapping[state];
    },
    linkTypeConverter(state) { // 连接状态
      return linkStateMapping[state];
    },
    stateTagType(state) { // 主备库el-tag类型
      switch (state) {
        case 1:
          return 'success';
        case 2:
          return 'danger';
        case 3:
          return 'warning';
        case 4:
          return 'danger';
        default:
          return '';
      }
    },
    linkTagType(state) {
      switch (state) {
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case 3:
          return 'danger';
        case 4:
          return 'danger';
        case 5:
          return 'info';
        default:
          return '';
      }
    },
  }
};
export default hostState;
