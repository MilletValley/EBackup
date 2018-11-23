<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible">
    <span slot="title">
      执行恢复操作
    </span>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="singleRestorePlanForm">
      <el-form-item label="新虚拟机名"   v-if="vmType === 'HW'"
                    prop="newName">
        <el-input v-model="formData.newName"></el-input>
      </el-form-item>
      <el-row v-if="vmType === 'VMware'">
         <el-form-item label="恢复主机"
                        prop="hostIp">
            <!-- <el-input v-model="formData.hostIp"></el-input> -->
            <el-select v-model="formData.hostIp"
                        style="width: 100%;">
              <el-option v-for="server in serverData"
                          :key="server.id"
                          :value="server.serverIp"
                          :label="`${server.serverName}(${server.serverIp})`">
                <span style="float: left">{{ server.serverName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ server.serverIp }}</span>
              </el-option>
            </el-select>
          </el-form-item>
      </el-row> 
      <el-row v-if="vmType === 'VMware'">
        <el-col :span="12">
          <el-form-item label="新虚拟机名"
                        prop="newName">
            <el-input v-model="formData.newName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="恢复磁盘名"
                      prop="diskName">
          <el-input v-model="formData.diskName"></el-input>
        </el-form-item>
        </el-col>
      </el-row>
      
        
				
    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading="btnLoading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
const baseFormData = {
  newName: '',
  hostIp: '',
  diskName: '',
};

export default {
  name: 'singleRestorePlanModal',
  mixins: [restorePlanModalMixin],
  props: {
    resultId: {
      type: Number,
      required: true,
    },
    vmType: {
      type: String,
    },
    serverData: {
      type: Array
    }
  },
  data() {
    return {
      type: 'vm',
      rules: {
        newName: validate.newVmName,
        hostIp: validate.selectServer,
        diskName: validate.diskName,
      },
    };
  },
  methods: {
    confirmBtnClick() {
      this.$refs.singleRestorePlanForm.validate(valid => {
        if (valid) {
          const name = dayjs().format('YYYYMMDDHHmmss');
          const { hostIp, newName, diskName, ...other } = this.formData;
          const config = {
            hostIp,
            newName,
            diskName,
            timeStrategy: 1,
            singleTime: '',
            ...other
          };
          this.$emit('confirm', { id: this.resultId, data: { name, config } });
        }
      });
    },
    modalClosed() {
      // this.formData = { ...baseFormData };
      this.$refs.singleRestorePlanForm.clearValidate();
      this.hiddenPassword = true;
    },
    modalOpened() {
      const { vmName } = this.details;
      this.originFormData = Object.assign({}, baseFormData, {
        oldName: vmName,
      });
      this.formData = Object.assign({}, this.originFormData);
    },
  },
};
</script>
<style >
</style>
