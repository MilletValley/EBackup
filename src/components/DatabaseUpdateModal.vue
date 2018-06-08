<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
        更新数据库
        <span style="color: #909399">（ID: {{formData.id}}）</span>
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="itemUpdateForm"
               size="small">
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请输入一个用来标识此数据库的名称"></el-input>
        </el-form-item>
        <el-form-item label="所属设备"
                      prop="host">
          <el-input disabled
                    :value="`${formData.host.name || ''}(${formData.host.hostIp || ''})`"></el-input>
        </el-form-item>

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
              <input-toggle v-model="formData.password"></input-toggle>
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
        <el-button @click="cancelBtnClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import InputToggle from '@/components/InputToggle';
import { genModalMixin } from './mixins/modalMixins';

export default {
  name: 'DatabaseUpdateModal',
  mixins: [genModalMixin('database')],
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemUpdateForm.validate(valid => {
        if (valid) {
          const {
            id,
            instanceName,
            name,
            loginName,
            password,
            dbVersion,
            application,
          } = this.formData;
          this.$emit('confirm', {
            id,
            instanceName,
            name,
            loginName,
            password,
            dbVersion,
            application,
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
.form-header {
  font-size: 13px;
  font-weight: 700;
  padding-bottom: 10px;
  padding-left: 16px;
}
.form-header,
.el-collapse-item__header {
  text-align: center;
  color: #777777;
  border-bottom: none;
}
.el-collapse-item__header .el-collapse-item__arrow {
  float: none;
}
</style>
