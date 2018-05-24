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
        <div class="form-header">主要信息</div>
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请输入一个标识名称"></el-input>
        </el-form-item>
        <el-form-item label="主机IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"
                    placeholder="请输入服务器IP"></el-input>
        </el-form-item>
        <el-form-item :label="databaseOrInstance"
                      prop="instanceName">
          <el-input v-model="formData.instanceName"
                    :placeholder="`请输入要备份的${databaseOrInstance}`"></el-input>
        </el-form-item>
        <el-form-item label="数据库登录名"
                      prop="loginName">
          <el-input v-model="formData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="数据库密码"
                      prop="password">
          <input-toggle v-model="formData.password"></input-toggle>
        </el-form-item>
        <el-collapse v-model="collapseName">
          <el-collapse-item name="more"
                            title="更多信息">
            <el-form-item label="主机名"
                          prop="hostName">
              <el-input v-model="formData.hostName"></el-input>
            </el-form-item>
            <el-form-item label="操作系统"
                          prop="osName">
              <el-input v-model="formData.osName"></el-input>
            </el-form-item>
            <el-form-item label="所属业务系统"
                          prop="application">
              <el-input v-model="formData.application"></el-input>
            </el-form-item>
            <el-form-item label="数据库版本"
                          prop="dbVersion">
              <el-input v-model="formData.dbVersion"></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm()"
                   :loading="confirmBtnLoading">确定</el-button>
        <el-button @click="cancelBtnClick()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { createOne as oracleCreate } from '../api/oracle';
import { createOne as sqlCreate } from '../api/sqlserver';
import { genModalMixin } from './mixins/modalMixins';

const vm = {
  name: 'DatabaseCreateModal',
  mixins: [genModalMixin('database')],
  data() {
    return {
      // formData: {},
      requestMapping: {
        oracle: data => oracleCreate(data),
        sqlserver: data => sqlCreate(data),
      },
    };
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemCreateForm.validate(valid => {
        if (valid) {
          this.confirmBtnLoading = true;
          this.requestMapping[this.type](this.formData)
            .then(res => {
              const { data: db } = res.data;
              this.$emit('confirm', db);
              this.modalVisible = false;
            })
            .catch(error => {
              this.$message.error(error);
              this.$refs.itemCreateForm.clearValidate();
              return false;
            })
            .then(() => {
              this.confirmBtnLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.itemCreateForm.clearValidate();
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
