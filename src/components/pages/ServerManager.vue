<template>
    <div>
        <el-row style="margin-bottom:10px;">
            <el-col :span="12" style="text-align:left;">
                <el-button type="primary" @click="isSelect = !isSelect"
                    >{{isSelect ? '返回' : '已选虚拟机'}}</el-button>
            </el-col>
            <el-col :span="12" style="text-align:right;">
                <el-button type="primary" @click="buttonClickHandler" :disabled="disabled"
                    >{{isSelect ? '添加备份计划' : '添加主机'}}</el-button>
            </el-col>
        </el-row>
        <el-table v-show="!isSelect" :data="serverTableData" ref="serverTable">
             <el-table-column type="expand">
                    <template slot-scope="props">
                        <mutil-table :tableData="props.row.vmList" :ref="props.row.id" :refTable="props.row.serverName" :selectData.sync="currentSelect"></mutil-table>
                    </template>
            </el-table-column>
            <el-table-column label="主机名" prop="serverName" align="left"
                        min-width="200">
                <!-- <template slot-scope="scope">
                    <router-link :to="`/vm/virtual/${scope.row.id}`"
                                :class="$style.link">{{scope.row.vmName}}</router-link>
                </template> -->
            </el-table-column>
            <el-table-column prop="hostName" align="left"
                            label="所属设备"
                            min-width="200">
            </el-table-column>
            <el-table-column prop="serverIp" align="left"
                            label="主机IP地址"
                            min-width="200">
            </el-table-column>
            <el-table-column prop="createDate" align="left"
                            label="创建时间"
                            min-width="200">
            </el-table-column>
            <el-table-column prop="serverType" 
                label="主机类型"
                :formatter="serverTypeFormat"
                min-width="150"
                align="left"></el-table-column>
            <el-table-column label="操作"
                            min-width="150"
                            header-align="center"
                            align="center">
                <template slot-scope="scope">
                    <el-button type="primary"
                                icon="el-icon-refresh"
                                circle
                                :disabled="scope.row.disabled"
                                size="mini"
                                :class="$style.miniCricleIconBtn"
                                @click="refresh(scope)"></el-button>
                    <!-- <el-button type="danger"
                                icon="el-icon-delete"
                                circle
                                size="mini"
                                :class="$style.miniCricleIconBtn"
                                @click="deleteDb(scope)"></el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <mutil-table v-show="isSelect" :tableData="currentSelect" refTable="selectTable" :selectData.sync="currentSelect"></mutil-table>
        <backup-plan-create-modal type="vm"
                     :visible.sync="backupPlanCreateModalVisible"
                     :btn-loading="btnLoading"
                     @confirm="addBackupPlan"></backup-plan-create-modal>
        <server-modal :btn-loading="btnLoading"
            @confirm="submitServerFn"
            :visible.sync="serverModalVisible">
        </server-modal>
    </div>
    
</template>
<script>
import { addServer, fetchServerList} from '../../api/host'
import {
  createMultipleVirtualBackupPlan,
  rescan,
  getVMByserverId
} from '../../api/virtuals';
import BackupPlanCreateModal from '@/components/modal/BackupPlanCreateModal';
import ServerModal from '@/components/modal/ServerModal';
import MutilTable from '@/components/modal/MutilTable';
import {
  vmHostServerTypeMapping
} from '../../utils/constant';
export default {
    components: {
        BackupPlanCreateModal,
        ServerModal,
        MutilTable
    },
    data(){
        return {
            serverTableData: [],
            currentSelect: [],
            isSelect: false,
            btnLoading: false,
            backupPlanCreateModalVisible: false,
            serverModalVisible: false,
            refreshBtn: false
        }
    },
    computed: {
        disabled(){
            return this.isSelect && this.currentSelect.length === 0
        }
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        fetchData(){
            fetchServerList().then( res => {
                const {data} = res.data;
                let tdata = data.map( e => {
                    e.disabled = false;
                    return e;
                })
                this.serverTableData = tdata;
                // this
            }).catch( error => {
                this.$message.error(error);
            })
        },
        addBackupPlan(data) {
            console.log(data);
            let plan = Object.assign({}, data);
            let vmIds = this.currentSelect.map( e => {
                return e.id;
            });
            plan.vmList = vmIds;
            console.log(plan);
            this.btnLoading = true;
            createMultipleVirtualBackupPlan(plan)
                .then(res => {
                const { message } = res.data;
                // // 刷新情况下可能会出现两个添加后的计划
                // if (this.backupPlans.findIndex(plan => plan.id === backupPlan.id) === -1) {
                //     this.backupPlans.unshift(backupPlan)
                // }
                    this.backupPlanCreateModalVisible = false;
                    this.$confirm(
                        '备份计划添加成功，是否跳转到备份计划页面',
                        '提示',
                        {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }
                    ).then( () => {
                        this.$router.push({name: 'backup'});
                    }).catch( action => {
                    });
                })
                .catch(error => {
                this.$message.error(error);
                return false;
                })
                .then(() => {
                this.btnLoading = false;
                });
        },
        submitServerFn(data){
            let server = Object.assign({},data);
            this.btnLoading = true;
            addServer(server).then( res => {
                const {data, message} = res.data;
                if(this.serverTableData.findIndex( e => e.id === data.id) === -1){
                    this.serverTableData.unshift(data);
                    let d = Object.assign([], this.serverTableData);
                    this.serverTableData = [];
                    this.$nextTick( () => {
                        this.serverTableData = d;
                    });
                }
                this.serverModalVisible = false;
                this.$message.success(message);
            }).catch( error => {
                this.$message.error(error);
            }).then( () => {
                this.btnLoading = false;
            })
        },
        buttonClickHandler(){
            if(this.isSelect){
                this.backupPlanCreateModalVisible = true;
            }else{
                this.serverModalVisible = true;
            }
        },
        serverTypeFormat(row, column, cellValue, index){
            return vmHostServerTypeMapping[cellValue]
        },
        refresh(scope){
            scope.row.disabled = true
            rescan(scope.row).then( res => {
                // if(!this.$refs[scope.row.id]){
                    getVMByserverId(scope.row.id).then( res => {
                        const ids = scope.row.vmList.map( i => i.id)
                        this.currentSelect = this.currentSelect.filter( e => {
                            if(ids.includes(e.id)){
                                return false
                            }
                            return true
                        })
                        const {data } = res.data;
                        scope.row.vmList = data;
                    })
                // }else{
                //     this.$refs[scope.row.id] && this.$refs[scope.row.id].refresh(scope.row.id);
                // }
            }).catch( error => {
                this.$message.error( error)
            }).then(() => {
                scope.row.disabled = false
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


