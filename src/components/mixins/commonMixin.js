const paginationMixin = {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    processedTableData() {
      const data = this.currentTableData;
      return data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  watch: {
    tableData(data) {
      // 判断当前页是否有数据，如果没有则显示上一页
      if (data.length <= (this.currentPage - 1) * this.pageSize) {
        this.currentPage = this.currentPage === 1 ? this.currentPage : this.currentPage - 1;
      }
    }
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
  }
};

const filterMixin = {
  data() {
    return {
      filter: {}
    };
  },
  computed: {
    currentTableData() {
      let filterData = this.tableData;
      Object.keys(this.filter).forEach(i => {
        if (this.filter[i] && this.filter[i].length > 0) {
          // filterData = this.tableData.filter(item => {
          //   // if (Array.isArray(this.filter[i])) {
          //   //   if (this.filter[i].includes(item[i])) {
          //   //     return true;
          //   //   }
          //   // } else {
          //   //   // if(item[i].toLowerCase().includes(this.filter[i].toLowerCase())){
          //   //   //     return true;
          //   //   // }
          //   //   // if (item[i].includes(this.filter[i])) {
          //   //   //   return true;
          //   //   // }
          //   //   return this.filterFn(item, i);
          //   //   // return item['vm'][i].includes(this.filter[i]);
          //   // }
          //   // return false;
          //   // 判断方法无法固定
          //   return this.filterFn(item, i);
          // });
          filterData = this.tableData.filter(item => this.filterFn(item, i));
        }
      });
      return filterData;
    }
  }
};


// eslint-disable-next-line
export { paginationMixin, filterMixin };