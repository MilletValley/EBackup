<template>
    <el-table :data="tableData" @select="selectDbChangeFn"  :ref="refTable"
           @select-all="((selection) => selectAll(selection, tableData))">
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
                <router-link :to="`/vm/virtual/${scope.row.id}`"
                            :class="$style.link">{{scope.row.vmName}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="vmPath"
                        label="路径"
                        align="left"
                        min-width="200">
        </el-table-column>
        <el-table-column prop="vmHostName"
            label="所属主机"
            min-width="150"
            align="left"></el-table-column>
    </el-table>
</template>
<script>
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
        console.log(123)
        this.$nextTick( () => {
            this.$refs[this.refTable].clearSelection();
            this.selectData.forEach( item => {
                this.tableData.forEach( e => {
                    if(item.id === e.id){
                        this.$refs[this.refTable].toggleRowSelection(item, true);
                    }
                })
                
            })
        });
    },
    watch: {
        selectData(data){
            console.log(data)
            this.$nextTick( () => {
                if(!this.$refs[this.refTable]){
                    return
                }
                this.$refs[this.refTable].clearSelection();
                data.forEach( item => {
                    this.tableData.forEach( e => {
                        if(item.id === e.id){
                            this.$refs[this.refTable].toggleRowSelection(item, true);
                        }
                    })
                    
                })
            });
        }
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
    },
    methods: {
        selectDbChangeFn(selectData, row){
            if(selectData.includes(row)){
                this.currentSelect.push(row);
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

