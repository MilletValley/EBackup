<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed">
      <span slot="title">
        添加数据库
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="itemCreateForm"
               size="small">
        <!-- <div class="form-header">主要信息</div> -->
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请输入一个标识名称"></el-input>
        </el-form-item>
        <el-form-item label="所属设备"
                      prop="hostId">
          <el-select v-model="formData.hostId"
                     style="width: 100%;">
            <el-option v-for="host in availableHosts"
                       :key="host.id"
                       :label="`${host.name}(${host.hostIp})`"
                       :value="host.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="主机IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"
                    placeholder="请输入服务器IP"></el-input>
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="databaseOrInstance"
                          prop="instanceName">
              <el-input v-model="formData.instanceName"
                        :placeholder="`请输入要备份的${databaseOrInstance}`"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据库版本"
                          prop="dbVersion">
              <el-input v-model="formData.dbVersion"
                        placeholder="可选"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据库登录名"
                          prop="loginName">
              <el-input v-model="formData.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据库密码"
                          prop="password">
              <input-toggle v-model="formData.password"
                            :hidden.sync="hiddenPassword"></input-toggle>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="所属业务系统"
                      prop="application">
          <el-input v-model="formData.application"
                    placeholder="可选"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelBtnClick()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { genModalMixin } from './mixins/modalMixins';

const vm = {
  name: 'DatabaseCreateModal',
  mixins: [genModalMixin('database')],
  data() {
    return {};
  },

  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemCreateForm.validate(valid => {
        if (valid) {
          const {
            instanceName,
            name,
            loginName,
            password,
            dbVersion,
            application,
            hostId,
          } = this.formData;
          this.$emit('confirm', {
            instanceName,
            name,
            loginName,
            password,
            dbVersion,
            application,
            // 创建对象 传入host对象 0609
            host: this.availableHosts.find(host => host.id === hostId),
          });
        } else {
          return false;
        }
      });
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.itemCreateForm.clearValidate();
      this.hiddenPassword = true;
    },
  },
  components: {
    InputToggle,
  },
};
export default vm;
</script>
<style>
</style>
