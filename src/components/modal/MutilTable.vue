<template>
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
        currentSelect: {
            get() {
                return this.selectData;
            },
            set(value) {
                this.$emit('update:selectData', value);
            },
        },
        curTableData: {
            get() {
                return this.tableData;
            }
        },
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
    }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>

