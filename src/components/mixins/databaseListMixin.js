const databaseListMixin = {
  data() {
    return {
      dbs: [],
      selectedId: '',
      createModalVisible: false,
      updateModalVisible: false,
    };
  },
  computed: {
    selectedDb: {
      // 从dbs列表中筛选出对应的一条记录
      get() {
        return this.selectedId === ''
          ? {}
          : this.dbs.filter(db => db.id === this.selectedId)[0];
      },
      // set() {
      //   this.selectedId = '';
      // },
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
      this.dbs.splice(this.dbs.findIndex(db => db.id === id), 1, data);
      this.selectedId = '';
    },
  },
};

export default databaseListMixin;
