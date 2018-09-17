<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
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
                      style="width: 100%"
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
        <el-form-item label="登录密码"
                      prop="password">
          <input-toggle v-model="formData.password"
                        :hidden.sync="hiddenPassword"></input-toggle>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelBtnClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { genModalMixin } from '../mixins/modalMixins';

export default {
  name: 'FileHostCreateModal',
  mixins: [genModalMixin('filehost')],
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.formData);
        } else {
          return false;
        }
      });
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.createForm.clearValidate();
      this.hiddenPassword = true;
    },
  },
  components: {
    InputToggle,
  },
};
</script>
<style>
</style>
