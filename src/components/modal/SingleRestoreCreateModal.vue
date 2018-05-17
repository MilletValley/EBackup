<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               width="30%">
      <span slot="title">执行恢复操作</span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="singleRestoreForm"
               size="small">
        <el-form-item label="恢复主机IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="登录名"
                      prop="loginName">
          <el-input v-model="formData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="详细信息"
                      prop="detailInfo">
          <el-input v-model="formData.detailInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button>取消</el-button>
        <el-button type="primary"
                   @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import moment from 'moment';
import { createSingleRestorePlan } from '../../api/sqlserver';
import modalMixin from '../mixins/restorePlanModalMixins';

const requestMapping = {
  sqlserver: createSingleRestorePlan,
};

export default {
  name: 'SingleRestoreCreateModal',
  mixins: [modalMixin],
  methods: {
    confirm() {
      this.formData.name = moment().format('YYYYMMDDHHmmss');
      const { name, config } = this.pruneData(this.formData);
      requestMapping[this.type]({ id: this.id, data: { name, config } })
        .then(res => {
          const { data: restorePlan } = res.data;
          this.$emit('confirm', restorePlan);
          this.$emit('update:visible', false);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
};
</script>
<style>
</style>
