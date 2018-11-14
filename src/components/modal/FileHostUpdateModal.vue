<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
        更新服务器
        <span style="color: #999999">（ID: {{formData.id}}）</span>
      </span>
      <el-form :model="formData"
               :rules="fileHostRules"
               label-width="110px"
               ref="itemUpdateForm"
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
                     style="width: 100%"
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
                   :loading="btnLoading"
                   @click="confirm">确定</el-button>
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
  name: 'FileHostUpdateModal',
  mixins: [genModalMixin('filehost')],
  props: {
    itemInfo: {
      type: Object,
      default: {},
    },
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemUpdateForm.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.formData);
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      this.originFormData = { ...this.itemInfo };
      this.formData = { ...this.itemInfo };
    },
    modalClosed() {
      this.$refs.itemUpdateForm.clearValidate();
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
