<template>
  <el-dialog custom-class="min-width-dialog"
            :before-close="beforeModalClose"
            @open="modalOpened"
            @close="modalClosed"
            :visible.sync="modalVisible">
    <span slot="title">
      {{title}}
    </span>
    <el-form size="small"
            label-position="right"
            label-width="100px"
            :model="formData"
            :rules="rules"
            ref="restorePlanCreateForm">
      <el-form-item label="计划名称"
                    prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="新虚拟机名"
                    prop="newName">
        <el-input v-model="formData.newName"></el-input>
      </el-form-item>
      <el-row v-if="[1, 3].includes(vmType)">
        <el-col :span="12">
          <el-form-item label="恢复主机"
                        prop="serverId">
            <el-select v-model="formData.serverId" :disabled="action !== 'create'"
                      @change="changeHost(formData.serverId, vmType === 1)"
                      style="width: 100%;">
              <el-option v-for="(server, index) in serverData"
                        :key="index"
                        :value="server.id"
                        v-if="!(details.server.id === server.id && vmType === 3)"
                        :label="`${server.serverName}(${server.serverIp})`">
                <span style="float: left">{{ server.serverName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ server.serverIp }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="恢复磁盘"
                        prop="diskName"
                        v-if="vmType === 1">
            <el-select v-model="formData.diskName"
                      style="width: 100%"
                      :disabled="!hasHostIp"
                      :placeholder="showLoading?'加载中...':'请选择恢复磁盘'">
              <el-option v-for="(disk, index) in disks"
                        :key="index"
                        :label="disk"
                        :value="disk"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="恢复路径"
                        v-if="vmType === 3"
                        prop="diskName"
                        :rules="{ required: true, message: '请输入恢复路径', trigger: 'blur' }">
            <el-input v-model="formData.diskName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="时间策略" class="is-required"
                    style="width: 100%">
        <el-radio-group v-model="formData.timeStrategy">
          <el-radio :label="1">单次执行</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="恢复时间" class="is-required"
                    prop="singleTime">
        <el-date-picker type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formData.singleTime"></el-date-picker>
      </el-form-item>
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
// import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
import TimeInterval from '@/components/common/TimeInterval';
import dayjs from 'dayjs';

const basicFormData = {
  name: '',
  serverId: '',
  newName: '',
  // oldName: '',
  diskName: '',
  startTime: '',
  singleTime: '',
  timeStrategy: 1, // 默认单次执行
};

export default {
  name: 'RestorePlanCreateModal',
  mixins: [restorePlanModalMixin],
  components: {
    TimeInterval
  },
  props: {
    vmType: {
      type: Number
    },
    serverData: {
      type: Array
    }
  },
  data() {
    const singleTimeValidate = (rule, value, callback) => {
      if (this.formData.timeStrategy === 1 && !value) {
        callback(new Error('请输入恢复时间'));
      } else if (dayjs(value) < dayjs()) {
        callback(new Error('恢复时间必须晚于当前时间'));
      } else {
        callback();
      }
    };
    return {
      type: 'vm',
      rules: {
        name: validate.planName,
        serverId: validate.selectServer,
        newName: validate.newVmName,
        diskName: validate.diskName,
        singleTime: [
        { validator: singleTimeValidate, trigger: 'blur' }
        ]
      },
      hasHostIp: false, // 用于虚拟机恢复，根据已选的hostId获取可选的恢复磁盘
      disks: [],
      showLoading: false
    };
  },
  methods: {
    confirmBtnClick() {
      this.$refs.restorePlanCreateForm.validate(valid => {
        if (valid) {
          let data = this.pruneFormData(this.formData);
          if (this.action === 'update') {
            data.id = this.restorePlan.id;
            data.config.id = this.restorePlan.config.id;
          }
          if (!data.config.serverId) {
            data.config.serverId = this.details.server.id;
          }
          this.$emit('confirm', data, this.action);
        }
      });
    },
    fmtData(plan) {
      const { name, config, ...other } = plan;
      const { id, startTime, timeStrategy, ...otherConfig } = config;
      return {
        name,
        startTime: timeStrategy === 1 ? '' : startTime,
        timeStrategy,
        ...otherConfig,
      };
    },
    modalOpened() {
      const baseFormData = cloneDeep(basicFormData);
      if (this.action === 'update' || this.action === 'query') {
        this.originFormData = Object.assign(
          {},
          baseFormData,
          this.fmtData({ ...this.restorePlan })
        );
      } else {
        const {vmName} = this.details;
        this.originFormData = Object.assign({}, baseFormData, { oldName: vmName });
      }
      this.formData = Object.assign({}, this.originFormData);
    },
    modalClosed() {
      // this.formData = { ...baseFormData };
      this.$refs.restorePlanCreateForm.clearValidate();
      this.hiddenPassword = true;
      this.disks = [];
      this.hasHostIp = false;
      this.showLoading = false;
    }
  },
};
</script>
<style >
</style>
