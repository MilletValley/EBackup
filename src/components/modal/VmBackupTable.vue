<template>
    <el-table :data="tableData" v-loading="loading" style="text-align:left;">
        <el-table-column label="虚拟机名称" align="left" min-width="100"
                    >
            <template slot-scope="scope">
                <router-link :to="scope.row.vm.type === '1' ? `/vm/virtual/${scope.row.vm.id}` : `/vm/hwVirtual/${scope.row.vm.id}`"
                            :class="$style.link">{{scope.row.vm.vmName}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="vm.vmPath" align="left" show-overflow-tooltip
                        label="路径"
                        >
        </el-table-column>
        <el-table-column prop="vm.vmHostName"
            label="所属物理主机"
            min-width="150"
            align="left">
        </el-table-column>
        <el-table-column prop="vmBackupResult.startTime" align="left"
                        min-width="160"
                        label="备份开始时间">
        </el-table-column>
        <el-table-column prop="vmBackupResult.size" align="left"
                        min-width="100"
                        label="已备份大小">
        </el-table-column>
        <el-table-column prop="vmBackupResult.state" align="left"
                        min-width="150"
                        label="状态">
            <template slot-scope="scope">
                <!-- <el-tooltip 
                            :content="tipsText(scope.row.vmBackupResult)"
                            placement="left"
                            effect="light">
                    <i  :class="operationStateStyle(scope.row.vmBackupResult.state)"></i>
                </el-tooltip> -->
                <el-progress :text-inside="false" :stroke-width="12" :percentage="formatProcess(scope.row.vmBackupResult)" :status="formatState(scope.row.vmBackupResult.state)">
                    
                </el-progress>
                <!-- <i  :class="operationStateStyle(scope.row.vmBackupResult.state)"></i> -->
                
            </template>
        </el-table-column>
        <el-table-column prop="vmBackupResult.consume" align="left"
                        min-width="100"
                        label="已持续时间">
            <template slot-scope="scope">
                <span>{{ scope.row.vmBackupResult.consume | durationFilter}}</span>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
import {
  getVmsBackupResult} from '../../api/virtuals';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '../../utils/constant';
import baseMixin from '../mixins/baseMixins';
export default {
    mixins: [baseMixin],
    props:{
        id: {
            type: Number
        }
    },
    data(){
        return {
            tableData: [],
            loading: false,
            timer: null
        }
    },
    mounted(){
        this.fetchAll();
        this.setTimer(this.timer);
    },
    destroyed() {
        this.clearTimer(this.timer);
    },
    methods: {
        fetchAll(){
            this.loading = true
            getVmsBackupResult(this.id).then( res => {
                this.tableData = res.data.data;
            }).catch( error => {
                this.$message.error(error);
            }).then( () => {
                this.loading = false
            })
        },
        operationStateStyle(state) {
            if (state === 0) {
                return this.$style.waitingColor + ' el-icon-time';
            } else if (state === 1) {
                return this.$style.loadingColor + ' el-icon-loading';
            } else if(state === 3) {
                return this.$style.errorColor + ' el-icon-warning';
            } else if(state === 2){
                return this.$style.successColor + ' el-icon-success';
            }else return '';
        },
        tipsText(data){
            if(data.state === 1){
                return data.processSpeed;
            }
            return operationStateMapping[data.state];
        },
        formatProcess(data){
            if(data.state === 1){
                return data.processSpeed;
            }else if (data.state === 0){
                return 0;
            }else if (data.state === 2){
                return 100
            }else if (data.state === 3){
                return data.processSpeed;
            }
        },
        formatState(state){
            if(state === 2){
                return 'success';
            }else if( state === 3){
                return 'exception'
            }
            return ''
        },
        setTimer() {
            this.clearTimer();
            this.timer = setInterval(() => {
                getVmsBackupResult(this.id).then( res => {
                    this.tableData = res.data.data;
                })
            }, 10000);
        },
        clearTimer() {
            clearInterval(this.timer);
        }
    }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
@import '../../style/color.scss';
</style>

