<template>
  <el-dialog custom-class="min-width-dialog"
             :visible.sync="modalVisible"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed">
    <span slot="title">执行恢复操作</span>
    <el-form :model="formData"
             :rules="rules"
             label-width="110px"
             ref="singleRestoreForm"
             size="small">
      <el-row v-if="!isVMware">
        <el-col :span=12>
          <el-form-item label="恢复设备"
                        v-if="!this.isHW"
                        prop="hostIp">
            <el-input v-if="isFileHost"
                      v-model="formData.hostIp"></el-input>
            <el-select v-else
                       v-model="formData.hostIp"
                       style="width: 100%;">
              <el-option v-for="host in selectionHosts"
                         :key="host.id"
                         :value="host.hostIp"
                         :label="`${host.name}(${host.hostIp})`">
                <span style="float: left">{{ host.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span=12>
          <el-form-item :label="detailInfoDisplayName"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isVMware">
        <el-col :span="12">
          <el-form-item label="恢复主机IP"
                        prop="hostIp">
            <el-input v-model="formData.hostIp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新虚拟机名"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!this.isHW && !isVMware">
        <el-col :span="12">
          <el-form-item label="登录名"
                        prop="loginName">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码"
                        prop="password"
                        :rules="[{ required: true, message: '请输入登录密码', trigger: 'blur' },]">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="isFileHost"
                    label="覆盖策略"
                    prop="reveringStrategy">
        <el-radio-group v-model="formData.recoveringStrategy">
          <el-radio v-for="s in Object.keys(recoveringStrategys)"
                    :key="s"
                    :label="Number(s)">{{ recoveringStrategys[s] }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="cancelButtonClick">取消</el-button>
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading="btnLoading">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs';
import { restorePlanModalMixin } from '../mixins/planModalMixins';
import { recoveringStrategyMapping } from '../../utils/constant';

export default {
  name: 'SingleRestoreCreateModal',
  mixins: [restorePlanModalMixin],
  data() {
    return {
      recoveringStrategys: recoveringStrategyMapping,
    };
  },
  computed: {
    isHW() {
      const path = this.$route.path;
      return this.$route.path.substring(4, path.lastIndexOf('/'))==='hwVirtual'
    },
    isVMware(){
      const path = this.$route.path;
      return this.$route.path.substring(4, path.lastIndexOf('/'))==='virtual'
    }
  },
  methods: {
    confirmBtnClick() {
      this.$refs.singleRestoreForm.validate(valid => {
        if (valid) {
          this.formData.name = dayjs().format('YYYYMMDDHHmmss');
          this.pruneData(this.formData)
            .then(({ name, config }) => {
              const { loginName, detailInfo} = config;
              let conf = Object.assign({},config);
              conf.loginName = detailInfo;
              conf.detailInfo = loginName;
              this.$emit('confirm', { id: this.id, data: { name, config: conf } });
            })
            .catch(error => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      if(this.isVMware){
        this.formData.loginName = this.database.vmName;
        this.originFormData.loginName = this.database.vmName;
      }
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.singleRestoreForm.clearValidate();
    },
  },
};
</script>
<style>
</style>
