<template>
<div>
    <el-row style="margin-bottom:10px;">
        <el-col :span="6">
            <el-input  placeholder="请输入名称" v-model="inputSearch" @keyup.enter.native="searchByName" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="searchByName"></el-button>
            </el-input>
        </el-col>
    </el-row>
    <el-table :data="curTableData" @select="selectDbChangeFn"  :ref="refTable"
           @select-all="((selection) => selectAll(selection, curTableData))">
        <el-table-column   
            type="selection"
            align="left"
            width="55">
        </el-table-column>
        <el-table-column
            type="index"
            align="left"
            width="50">
        </el-table-column>
        <el-table-column label="虚拟机名称"
                    align="left"
                    min-width="200">
            <template slot-scope="scope">
                <router-link :to="scope.row.type === '1' ? `/vm/virtual/${scope.row.id}` : `/vm/hwVirtual/${scope.row.id}`"
                            :class="$style.link">{{scope.row.vmName}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="vmPath"
                        label="路径"
                        align="left"
                        min-width="200">
        </el-table-column>
        <el-table-column prop="vmHostName"
            label="所属物理主机"
            min-width="150"
            align="left"></el-table-column>
    </el-table>
    <el-pagination style="text-align:right;margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        v-if="tableData"
        :total="tableData|filterBySearch(filterItem).length">
    </el-pagination>
</div>
    
</template>
<script>
import {
    getVMByserverId
} from '../../api/virtuals';
export default {
    props: {
        tableData: {
            type: Array
        },
        refTable: {
            type: String
        },
        selectData: {
            type: Array
        }
    },
    data(){
        return {
            pagesize: 10,
            currentPage: 1,
            filterItem: '',
            inputSearch: ''
        }
    },
    mounted(){
        this.$nextTick( () => {
            this.$refs[this.refTable].clearSelection();
            this.selectData.forEach( item => {
                this.curTableData.forEach( e => {
                    if(item.id === e.id){
                        this.$refs[this.refTable].toggleRowSelection(item, true);
                    }
                })
                
            })
        });
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
        selectData(data){
            this.$nextTick( () => {
                if(!this.$refs[this.refTable]){
                    return
                }
                this.$refs[this.refTable].clearSelection();
                data.forEach( item => {
                    this.curTableData.forEach( e => {
                        if(item.id === e.id){
                            this.$refs[this.refTable].toggleRowSelection(item, true);
                        }
                    })
                    
                })
            });
        },
    },
    computed: {
        curTableData(){
            let data = [];
            // if(this.buttonfalg){
            //     data = this.currentSelectDb.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase()));
            // }else{
                data = this.tableData.filter(v => v.vmName.toLowerCase().includes(this.filterItem.toLowerCase()));
            // }
            
            data = data.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
            this.$nextTick( () => {
                data.forEach( e => {
                    if(this.currentSelect.includes(e)){
                    this.$refs[this.refTable].toggleRowSelection(e,true);
                    }
                })
            });
            return data;
        },
        currentSelect: {
            get() {
                return this.selectData;
            },
            set(value) {
                this.$emit('update:selectData', value);
            },
        },
        // curTableData: {
        //     get() {
        //         return this.tableData;
        //     }
        // },
    },
    methods: {
        refresh(id){
            getVMByserverId(id).then( res => {
                const {data} = res.data;
                //更新数据前，去除已选数据。表格刷新后默认清空该表格的选中状态
                // const ids = this.curTableData.map( i => {
                //     return i.id;
                // });
                
                // this.currentSelect = this.currentSelect.filter( e => {
                //     if(ids.includes(e.id)){
                //         return false
                //     }
                //     return true
                // });
                // this.currentSelect = aa;
                
                // this.curTableData = data;
            }).catch( error => {
                this.$message.error( error)
            })
        },
        selectDbChangeFn(selectData, row){
            if(selectData.includes(row)){
                const ids = this.currentSelect.map( e => {
                    return e.id;
                })
                if(!ids.includes(row.id)){
                     this.currentSelect.push(row);
                }
            }else{
                //需要优化，匹配到即跳出循环
                this.currentSelect = this.currentSelect.filter( e => {
                    if(e.id === row.id){
                        return false;
                    }
                    return true;
                });
            }
        },
        selectAll(selection,list){
            if(selection.length === 0){
                this.currentSelect = this.currentSelect.filter( e => {
                    let flag = true;
                    list.forEach( i => {
                        if(i.id === e.id){
                            flag = false;
                        }
                    })
                    return flag;
                })
            }else{
                let data = [];
                list.forEach( e => {
                    let flag = true;
                    this.currentSelect.forEach( i => {
                        if(i.id === e.id){
                            flag = false;
                        }
                    })
                    flag && data.push(e);
                });
                this.currentSelect.push(...data)
            }
        },
        handleSizeChange: function (size) {
            this.pagesize = size;
        },
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage;
        },
        searchByName() {
            this.filterItem = this.inputSearch;
            this.currentPage = 1;
        },
    }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>

