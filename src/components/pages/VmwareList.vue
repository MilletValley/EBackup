<template>
  <section>
    <div style="margin-bottom: 15px;">
      <el-row :gutter="20">
        <el-col :span="18"><div class="grid-content">
            <el-button @click="buttonClick">
              已选
            </el-button>
          </div></el-col>
        <el-col :span="6">
          <el-input placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table :data="processDbTableData" ref="dbTable"
              v-if="vmItems"   @select="selectDbChangeFn"    @select-all="selectAll"
              style="width: 100%">
      <el-table-column
      :reserve-selection="true"
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column label="序号"
                       min-width="100"
                       fixed
                       align="center">
        <template slot-scope="scope">
            {{scope.$index+1+(currentPage-1)*pagesize}}
        </template>
      </el-table-column>
      <el-table-column label="名称"
                       fixed
                       min-width="200">
        <template slot-scope="scope">
          <router-link :to="`${scope.row.id}`"
                        append
                        :class="$style.link">{{scope.row.vmName}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="vmPath"
                       label="路径"
                       min-width="200"></el-table-column>
      <el-table-column prop="vmHostName"
                       label="所属主机"
                       min-width="150"
                       align="center"></el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 5, 10, 15, 20]"
          :page-size="pagesize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          v-if="vmItems"
          :total="vmItems|filterBySearch(filterItem).length">
        </el-pagination>
      </div>
  </section>
</template>
<script>
import { fetchAll } from '../../api/virtuals';

export default {
  name: 'VMwareList',
  data() {
    return {
      vmItems: [],
      currentPage: 1,
      pagesize: 10,
      inputSearch: '',
      filterItem: '',
      currentSelectDb: []
    }
  },
  computed:{
    processDbTableData(){
      let data = [];
      if(this.buttonfalg){
        console.log(this.currentSelectDb)
        data = this.currentSelectDb.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase()));
      }else{
        data = this.vmItems.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase()));
      }
      
      data = data.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
      this.$nextTick( () => {
          this.currentSelectDb.forEach( item => {
              data.forEach( i => {
                  if(i.dbId === item.dbId){
                      this.$refs.dbTable.toggleRowSelection(i);
                  }
              })
              
          })
      });
      return data;
    }
  },
  created() {
    this.fetchData();
  },
  filters: {
    filterBySearch(tableData, arg) {
      if (!tableData) {
        return '';
      }
      return tableData.filter(v => v.vmName.toLowerCase().includes(arg.toLowerCase()));
    },
    filterByPage(data, currentPage, pagesize) {
      if (!data) {
        return '';
      }
      return data.slice((currentPage - 1) * pagesize, currentPage * pagesize);
    }
  },
  watch: {
    inputSearch() {
      if(this.inputSearch==='') {
        this.filterItem=''
        this.currentPage=1;
      }
    },
    $route: function() {
      this.vmItems=[];
      this.currentPage=1;
      this.fetchData();
    }
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          if(this.$route.name === 'VMwareList') {
            this.vmItems = data.filter(item => item.type==='1');
          } else {
            this.vmItems = data.filter(item => item.type==='2');
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    searchByName() {
      this.filterItem = this.inputSearch;
      this.currentPage = 1;
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
    },
    selectDbChangeFn(selectData, row){
        // this.currentSelectDb = selectData;
        if(selectData.includes(row)){
            this.currentSelectDb.push(row);
        }else{
            // console.log(this.currentSelectDb.indexOf(row))
            //需要优化，匹配到即跳出循环
            this.currentSelectDb = this.currentSelectDb.filter( e => {
                if(e.id === row.id){
                    return false;
                }
                return true;
            });
        }
    },
    selectAll(selection){
        if(selection.length === 0){
            this.currentSelectDb = this.currentSelectDb.filter( e => {
                let flag = true;
                this.processDbTableData.forEach( i => {
                    if(i.id === e.id){
                        flag = false;
                    }
                })
                return flag;
            })
        }else{
            let data = [];
            this.processDbTableData.forEach( e => {
                let flag = true;
                this.currentSelectDb.forEach( i => {
                    if(i.dbId === e.dbId){
                        flag = false;
                    }
                })
                flag && data.push(e);
            });
            this.currentSelectDb.push(...data)
        }
    },
    buttonClick(){
      this.buttonfalg = !this.buttonfalg;
    }
    
  }
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style>
.el-table th{
  text-align: center;
}
.grid-content {
  min-height: 40px;
}
.input-with-select {
  background-color: #fff;
}
</style>