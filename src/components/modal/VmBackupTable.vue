<template>
    <el-table :data="tableData" v-loading="loading" style="text-align:left;">
        <el-table-column label="虚拟机名称" align="left"
                    >
            <template slot-scope="scope">
                <router-link :to="`/vm/virtual/${scope.row.vm.id}`"
                            :class="$style.link">{{scope.row.vm.vmName}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="vm.vmPath" align="left"
                        label="路径"
                        >
        </el-table-column>
        <el-table-column prop="vm.vmHostName"
            label="所属主机"
            align="left">
        </el-table-column>
        <el-table-column prop="vmBackupPlan.startTime" align="left"
                        label="备份开始时间">
        </el-table-column>
        <el-table-column prop="vmBackupPlan.size" align="left"
                        label="已备份大小">
        </el-table-column>
        <el-table-column prop="vmBackupPlan.state" align="left"
                        label="状态">
            <template slot-scope="scope">
                <el-tooltip 
                            :content="tipsText(scope.row.vmBackupPlan)"
                            placement="left"
                            effect="light">
                    <i  :class="operationStateStyle(scope.row.vmBackupPlan.state)"></i>
                    <!-- <i v-if="backupOperation.state === 0"
                        class="el-icon-time"
                        :class="operationStateStyle(scope.row.vmBackupPlan.state)"></i>
                    <i v-else-if="backupOperation.state === 1"
                        class="el-icon-loading"
                        :class="operationStateStyle"></i>
                    <i v-else-if="backupOperation.state === 3"
                        class="el-icon-warning"
                        :class="operationStateStyle"></i>
                    <span :class="operationStateStyle">{{operationState || '-'}}</span> -->
                    <!-- </div> -->
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column prop="vmBackupPlan.consume" align="left"
                        label="已持续时间">
            <template slot-scope="scope">
                <span>{{ scope.row.vmBackupPlan.consume | durationFilter}}</span>
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

