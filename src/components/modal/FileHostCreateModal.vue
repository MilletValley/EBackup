<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed">
      <span slot="title">
        添加服务器
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="createForm"
               size="small">
        <el-form-item label="主机名"
                      prop="hostName">
          <el-input v-model="formData.hostName"></el-input>
        </el-form-item>
        <el-form-item label="主机IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="操作系统"
                      prop="osName">
          <el-select v-model="formData.osName"
                     placeholder="请选择">
            <el-option v-for="item in ['Windows', 'Linux']"
                       :key="item.value"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属业务系统"
                      prop="application">
          <el-input v-model="formData.application"></el-input>
        </el-form-item>
        <el-form-item label="系统登录名"
                      prop="loginName">
          <el-input v-model="formData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码"
                      prop="password">
          <input-toggle v-model="formData.password"></input-toggle>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm">确定</el-button>
        <el-button @click="cancelBtnClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { createOne } from '../../api/fileHost';
import { genModalMixin } from '../mixins/modalMixins';

export default {
  name: 'FileHostCreateModal',
  mixins: [genModalMixin('filehost')],
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createOne(this.formData)
            .then(res => {
              const { data: db } = res.data;
              this.$emit('confirm', db);
              this.modalVisible = false;
            })
            .catch(error => {
              this.$message.error(error);
              this.$refs.createForm.clearValidate();
              return false;
            });
        } else {
          return false;
        }
      });
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.createForm.clearValidate();
    },
  },
  components: {
    InputToggle,
  },
};
</script>
<style>
</style>
