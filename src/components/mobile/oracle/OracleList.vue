<template>
  <section>
    
  </section>
</template>
<script>
import DatabaseModal from '@/components/pages/oracle/DatabaseModal';
import tableMixin from '@/components/mixins/databaseTableMixin';
import Vue from 'vue';
export default {
  name: 'OracleList',
  mixins: [tableMixin],
  data(){
    return {
      databaseType: 'oracle',
      // batchCreateModalVisible: false,
      tableFilter: {},
      roleFilters: [
        { text: '无连接', value: 0 },
        { text: '主库', value: 1 },
        { text: '备库', value: 2 }
      ]
    }
  },
  watch: {
    inputSearch() {
      if (this.inputSearch === '') {
        this.filter = Object.assign({}, this.tableFilter);
        this.currentPage = 1;
      }
    }
  },
  methods: {
    filterChange(filters){
      this.tableFilter = Object.assign({}, this.tableFilter, filters);
      this.filter = Object.assign({}, this.filter, this.tableFilter);
    },
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(item[i]);
      }else {
        return item[i].toLowerCase().includes(this.filter[i].toLowerCase());
      }
    },
    searchByName(){
      const name = this.inputSearch;
      this.filter = Object.assign({},{name}, this.tableFilter);
      this.currentPage = 1;
    },
    deleteDb(scope) {
      this.delete(scope, '确认删除此数据库?');
    },
  },
  components: {
    DatabaseModal
  },
};
</script>
<style lang="scss" module>
@import '@/style/common.scss';
</style>
<style scoped>
.margin-top20{
  margin-top: 20px;
}
.margin-top10{
  margin-top: 10px;
}
.text-right{
  text-align: right;
}
</style>
