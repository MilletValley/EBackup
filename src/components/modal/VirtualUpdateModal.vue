<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
        更新虚拟机
        <span style="color: #999999">（ID: {{formData.id}}）</span>
      </span>
      <el-form :model="formData"

               label-width="110px"
               ref="itemUpdateForm"
               size="small">
        <el-form-item label="虚拟机名"
                      prop="vmName">
          <el-input v-model="formData.vmName"></el-input>
        </el-form-item>
        <el-form-item label="主机名"
                      prop="hostName">
          <el-input v-model="formData.host.name"></el-input>
        </el-form-item>
        <el-form-item label="主机IP"
                      prop="hostIp">
          <el-input v-model="formData.host.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="操作系统"
                      prop="osName">
          <el-select v-model="formData.host.osName"
                     style="width: 100%"
                     placeholder="请选择">
            <el-option v-for="item in ['Windows', 'Linux']"
                       :key="item.value"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="虚拟机账号"
                      prop="loginName">
          <el-input v-model="formData.host.loginName"></el-input>
        </el-form-item>
        <el-form-item label="虚拟机密码"
                      prop="password">
          <input-toggle v-model="formData.host.password"
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
  name: 'VirtualUpdateModal',
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
