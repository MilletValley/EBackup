<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
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
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="设备IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="设备类型"
                      prop="hostType">
          <el-radio v-model="formData.hostType"
                    :label="1">生产环境</el-radio>
          <el-radio v-model="formData.hostType"
                    :label="2">易备环境</el-radio>
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
        <el-form-item label="临时IP"
                      v-if="formData.osName==='Windows'"
                      prop="serviceIp">
          <el-input v-model="formData.serviceIp"></el-input>
        </el-form-item>
        <el-form-item label="是否Rac环境"
                      v-if="formData.osName==='Linux'"
                      prop="isRacMark">
          <el-radio v-model="formData.isRacMark"
                    :label="0">是</el-radio>
          <el-radio v-model="formData.isRacMark"
                    :label="1">否</el-radio>
        </el-form-item>
        <el-row v-if="formData.isRacMark===0 && formData.osName === 'Linux'">
          <el-col :span="12">
            <el-form-item label="VIP"
                          prop="vip">
              <el-input v-model="formData.vip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时VIP"
                          prop="tempVip">
              <el-input v-model="formData.tempVip"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务IP"
                      v-if="formData.osName==='Linux'"
                      prop="serviceIp">
          <el-input v-model="formData.serviceIp"></el-input>
        </el-form-item>
        <el-form-item label="用途类型"
                      prop="databaseType">
          <el-radio v-model="formData.databaseType"
                    :label="1">oracle</el-radio>
          <el-radio v-model="formData.databaseType"
                    :label="2">sqlserver</el-radio>
          <el-radio v-model="formData.databaseType"
                    :label="5">mysql</el-radio>
          <el-radio v-model="formData.databaseType"
                    :label="4">虚拟机</el-radio>
        </el-form-item>
        <el-form-item label="Windows系统版本"
                      v-if="formData.osName === 'Windows' && formData.databaseType === 2"
                      prop="windowsType">
          <el-radio v-model="formData.windowsType" :label="1">2003</el-radio>
          <el-radio v-model="formData.windowsType" :label="2">2008及以上</el-radio>
        </el-form-item>
        <el-form-item label="oracle版本"
                      prop="oracleVersion"
                      v-if="this.formData.databaseType===1">
          <el-select v-model="formData.oracleVersion"
                     placeholder="请选择">
            <el-option v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--windows下 10G Oracle版本显示 -->
        <template v-if="this.formData.oracleVersion===1&&this.formData.databaseType===1&&this.formData.osName==='Windows'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="存储盘符"
                            prop="storagePath">
                <el-select v-model="formData.storagePath">
                  <el-option v-for="item in words"
                            :key="item.value.value"
                            :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="共享盘符"
                            prop="sharingPath">
                <el-select v-model="formData.sharingPath">
                  <el-option v-for="item in words"
                            :key="item.value.value"
                            :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
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
          let data = {...this.formData};
          if(!(data.osName === 'Windows' && data.databaseType === 2)){
            delete data.windowsType
          }
          this.$emit('confirm', data);
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
