<template>
  <section>
    <div style="margin-bottom: 15px;">
      <el-row :gutter="20">
        <el-col :span="18"><div class="grid-content"></div></el-col>
        <el-col :span="6">
          <el-input placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table :data="vmItems?vmItems.slice((currentPage-1)*pagesize,currentPage*pagesize):vmItems"
              style="width: 100%">
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
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="vmItems?vmItems.length:0">
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
      newItems: [],
      originItems: [],
    }
  },
  created() {
    this.fetchData();
  },
  watch: {
    inputSearch() {
      if(this.inputSearch==='') {
        this.vmItems=this.originItems;
        this.currentPage=1;
      }
    },
    $route: function() {
      this.vmItems=[];
      this.originItems=[];
      this.newItems=[];
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
            this.originItems = data.filter(item => item.type==='1');
          } else {
            this.vmItems = data.filter(item => item.type==='2');
            this.originItems = data.filter(item => item.type==='2');
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    searchByName() {
      this.newItems=[];
      this.currentPage=1;
      if(this.originItems){
        for(let index=0; index<this.originItems.length; index++) {
          if(this.originItems[index].vmName.toLowerCase().includes(this.inputSearch.toLowerCase()))
            this.newItems.push(this.originItems[index]);
        }
      }
      this.vmItems=this.newItems;
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
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

