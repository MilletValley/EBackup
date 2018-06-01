<template>
  <el-dialog :visible.sync="modalVisible"
             :before-close="beforeModalClose"
             @close="modalClosed"
             width="40%">
    <span slot="title">执行恢复操作</span>
    <el-form :model="formData"
             :rules="rules"
             label-width="110px"
             ref="singleRestoreForm"
             size="small">
      <el-row>
        <el-col :span=12>
          <el-form-item label="恢复主机IP"
                        prop="hostIp">
            <el-input v-model="formData.hostIp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=12>
          <el-form-item :label="detailInfoDisplayName"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录名"
                        prop="loginName">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="isFileBackupResult"
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
                 @click="confirmBtnClick">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import moment from 'moment';
import { createSingleRestorePlan as createSqlserverSingleRestorePlan } from '../../api/sqlserver';
import { createSingleRestorePlan as createOracleSingleRestorePlan } from '../../api/oracle';
import { createSingleRestorePlan as createFileHosteRestorePlan } from '../../api/fileHost';
import modalMixin from '../mixins/restorePlanModalMixins';
import { recoveringStrategyMapping } from '../../utils/constant';

const requestMapping = {
  oracle: createOracleSingleRestorePlan,
  sqlserver: createSqlserverSingleRestorePlan,
  windows: createFileHosteRestorePlan,
  linux: createFileHosteRestorePlan,
};

export default {
  name: 'SingleRestoreCreateModal',
  mixins: [modalMixin],
  data() {
    return {
      recoveringStrategys: recoveringStrategyMapping,
    };
  },
  computed: {},
  methods: {
    confirmBtnClick() {
      this.$refs.singleRestoreForm.validate(valid => {
        if (valid) {
          this.formData.name = moment().format('YYYYMMDDHHmmss');
          const { name, config } = this.pruneData(this.formData);
          this.$emit('confirm', { id: this.id, data: { name, config } });
        } else {
          return false;
        }
      });
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
