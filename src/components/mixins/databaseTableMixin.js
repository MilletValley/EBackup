import { paginationMixin, filterMixin, sortMixin } from './commonMixin';
import {
  databaseStateMapping
} from '../../utils/constant';
import {
  fetchListData,
  createDatabase,
  updateDatabase,
  deleteDatabase
} from '../../api/database';

const tableMixin = {
  mixins: [paginationMixin, filterMixin, sortMixin],
  data() {
    return {
      createModalVisible: false,
      btnLoading: false,
      inputSearch: '',
      tableData: [],
      currentSelectData: null,
      defaultSort: { prop: 'createTime', order: 'descending' },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 从服务器获取所有的Oracle数据库
    fetchData() {
      fetchListData(this.databaseType).then(res => {
        const { data } = res.data;
        this.tableData = data;
      }).catch(error => {
        this.$message.error(error);
      });
    },
    stateFormatter(row, column, cellValue) {
      return databaseStateMapping[cellValue];
    },
    addFn() {
      this.createModalVisible = true;
      this.currentSelectData = null;
    },
    modifyDb(scope) {
      this.createModalVisible = true;
      this.currentSelectData = scope.row;
    },
    confirmCall(data, type) {
      this.btnLoading = true;
      (type === 'create' ? createDatabase(this.databaseType, data) : updateDatabase(this.databaseType, data)).then(res => {
        const { message } = res.data;
        this.fetchData();
        this.createModalVisible = false;
        this.$message.success(message);
      }).catch(error => {
        this.$message.error(error);
      }).then(() => {
        this.btnLoading = false;
      });
    },
    deleteDb(scope) {
      this.$confirm('确认删除此数据库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteDatabase(this.databaseType, scope.row.id)
            .then(() => {
              this.fetchData();
              this.$message.success({
                message: '删除成功!',
              });
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(() => { });
    }
  },
};
export default tableMixin;
