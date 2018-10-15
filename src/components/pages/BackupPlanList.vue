<template>
    <div>
        <el-row style="margin-bottom:10px;">
            <el-col style="text-align:right">
                <el-button type="primary" @click="addPlan" size="small">添加备份计划</el-button>
                <el-button type="info" @click="stopPlan" size="small">一键停止</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table
                :data="tableData"
                style="width: 100%;">
                <el-table-column type="expand" align="center" width="55">
                    <template slot-scope="props">
                        <vm-backup-table :id="props.row.id"></vm-backup-table>
                    </template>
                </el-table-column>
                <el-table-column
                label="计划名称"
                align="center"
                prop="name">
                </el-table-column>
                <el-table-column
                label="备份策略"
                align="center"
                :formatter="backupStrategy"
                prop="config.backupStrategy">
                </el-table-column>
                <el-table-column
                label="时间策略"
                align="center"
                :formatter="timeStrateg"
                prop="config.timeStrategy">
                </el-table-column>
                <el-table-column
                label="备份开始时间"
                align="center"
                prop="startTime">
                </el-table-column>
                <el-table-column label="操作"
                                width="150"
                                header-align="center"
                                align="center">
                    <template slot-scope="scope">
                        <el-tooltip 
                            content="查看"
                            placement="top"
                            effect="light">
                            <el-button type="primary"
                                        icon="el-icon-view"
                                        circle
                                        size="mini"
                                        :class="$style.miniCricleIconBtn"
                                        @click="view(scope)"></el-button>
                        </el-tooltip>
                        <el-tooltip 
                            content="删除"
                            placement="top"
                            effect="light">
                            <el-button type="danger"
                                        icon="el-icon-delete"
                                        circle
                                        size="mini"
                                        :class="$style.miniCricleIconBtn"
                                        @click="deletePlan(scope)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <backup-plan-update-modal type="vm" :disable="true"
                              :visible.sync="backupPlanModalVisible"
                              :backup-plan="selectedBackupPlan"
                              @cancel="selectedBackupPlan = {}"></backup-plan-update-modal>
    </div>
</template>

<script>
import {fetchVmBackupPlanList, deletePlan, stopAllBackupPlan} from '../../api/virtuals';
import VmBackupTable from '@/components/modal/VmBackupTable';
import BackupPlanUpdateModal from '@/components/modal/BackupPlanUpdateModal';
import {
  backupStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
} from '../../utils/constant';
export default {
    components: {
        VmBackupTable,
        BackupPlanUpdateModal
    },
    data(){
        return {
            tableData: [],
            backupPlanModalVisible: false,
            selectedBackupPlan: {}
        }
    },
    mounted(){
        this.fetchAll();
    },
    methods: {
        fetchAll(){
            fetchVmBackupPlanList().then( res => {
                const {data} = res.data;
                this.tableData = data;
            }).catch( error => {
                this.$message.error(error);
            })
        },
        backupStrategy(row, column, cellValue, index) {
            return backupStrategyMapping[cellValue];
        },
        timeStrateg(row, column, cellValue, index) {
            return timeStrategyMapping[cellValue];
        },
        addPlan(){
            this.$router.push({name: 'collectManager'});
        },
        deletePlan(scope){
            deletePlan(scope.row.id).then( res => {
                this.$message.success( res.data.message);
                this.fetchAll();
            }).catch( error => {
                this.$message.error( error );
            })
        },
        view(scope){
            this.selectedBackupPlan = scope.row;
            this.backupPlanModalVisible = true;
        },
        stopPlan(){
            stopAllBackupPlan().then( res => {
                const {message} = res.data;
                this.$message.success( message );
                this.fetchAll();
            }).catch( error => {
                this.$message.error( error );
            })
        }
    }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style>

</style>


