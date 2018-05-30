import { databaseStateMapping } from '../../utils/constant';

const listMixin = {
  data() {
    return {
      items: [],
      selectedId: '',
      createModalVisible: false,
      updateModalVisible: false,
    };
  },
  computed: {
    selectedDb: {
      // 从items列表中筛选出对应的一条记录
      get() {
        return this.selectedId === ''
          ? {}
          : this.items.filter(db => db.id === this.selectedId)[0];
      },
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    selectOne({ row: db }) {
      this.selectedId = db.id;
      this.updateModalVisible = true;
    },
    // 更新后的回调
    updateDb(data) {
      const { id } = data;
      // 使用splice替换oracles列表中被选中的记录
      this.items.splice(this.items.findIndex(db => db.id === id), 1, data);
      this.selectedId = '';
    },
    stateFormatter(row, column, cellValue) {
      return databaseStateMapping[cellValue];
    },
  },
};
// eslint-disable-next-line
export { listMixin };
