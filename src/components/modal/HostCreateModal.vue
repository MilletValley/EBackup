<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed">
      <span slot="title">
        添加设备
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="createForm"
               size="small">
        <el-form-item label="设备名"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="设备IP"
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
import { createOne } from '../../api/host';
import { genModalMixin } from '../mixins/modalMixins';

export default {
  name: 'HostCreateModal',
  mixins: [genModalMixin('host')],
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
    },
  },
  components: {
    InputToggle,
  },
};
</script>
<style>
</style>
