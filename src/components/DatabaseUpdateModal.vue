<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
        更新数据库
        <span style="color: #999999">（ID: {{formData.id}}）</span>
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="itemUpdateForm"
               size="small">
        <div class="form-header">主要信息</div>
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请输入一个用来标识此数据库的名称"></el-input>
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
                   @click="confirm"
                   :loading="confirmBtnLoading">确定</el-button>
        <el-button @click="cancelBtnClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import InputToggle from '@/components/InputToggle';
import { modifyOne as oracleModify } from '../api/oracle';
import { modifyOne as sqlModify } from '../api/sqlserver';
import { databaseModalMixin } from './mixins/modalMixins';

export default {
  name: 'DatabaseUpdateModal',
  mixins: [databaseModalMixin],
  props: {
    itemInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      requestMapping: {
        oracle: data => oracleModify(data),
        sqlserver: data => sqlModify(data),
      },
    };
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemUpdateForm.validate(valid => {
        if (valid) {
          this.confirmBtnLoading = true;
          this.requestMapping[this.dbType](this.formData)
            .then(res => {
              const { data: db, message } = res.data;
              // FIXME: mock数据保持id一致，生产环境必须删除下面一行
              db.id = this.itemInfo.id;
              this.$emit('confirm', db);
              this.modalVisible = false;
              this.$message.success(message);
            })
            .catch(error => {
              this.$message.error(error);
              this.$refs.itemUpdateForm.clearValidate();
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
