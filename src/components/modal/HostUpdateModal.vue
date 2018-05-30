<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
        更新设备
        <span style="color: #999999">（ID: {{formData.id}}）</span>
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="itemUpdateForm"
               size="small">
        <el-form-item label="设备名"
                      prop="hostName">
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
import { modifyOne } from '../../api/host';
import { genModalMixin } from '../mixins/modalMixins';

export default {
  name: 'HostUpdateModal',
  mixins: [genModalMixin('host')],
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
          modifyOne(this.formData)
            .then(res => {
              const { data: host, message } = res.data;
              // FIXME: mock数据保持id一致，生产环境必须删除下面一行
              host.id = this.itemInfo.id;
              this.$emit('confirm', host);
              this.modalVisible = false;
              this.$message.success(message);
            })
            .catch(error => {
              this.$message.error(message);
              this.$refs.itemUpdateForm.clearValidate();
              return false;
            });
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
    },
  },
  components: {
    InputToggle,
  },
};
</script>
<style>
</style>
