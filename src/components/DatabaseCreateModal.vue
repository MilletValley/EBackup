<template>
  <section>
    <el-dialog :visible.sync="_visible" :before-close="beforeClose">
      <span slot="title">
        添加数据库
      </span>
      <el-form :model="theData" :rules="rules" label-width="110px" ref="createForm" size="small">
        <div class="form-header">主要信息</div>
        <el-form-item label="名称" prop="name">
          <el-input v-model="theData.name" placeholder="请输入一个标识名称"></el-input>
        </el-form-item>
        <el-form-item label="主机IP" prop="hostIp">
          <el-input v-model="theData.hostIp" placeholder="请输入服务器IP"></el-input>
        </el-form-item>
        <el-form-item :label="databaseOrInstance" prop="instanceName">
          <el-input v-model="theData.instanceName" :placeholder="`请输入要备份的${databaseOrInstance}`"></el-input>
        </el-form-item>
        <el-form-item label="数据库登录名" prop="loginName">
          <el-input v-model="theData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="数据库密码" prop="password">
          <input-toggle v-model="theData.password"></input-toggle>
        </el-form-item>
        <el-collapse v-model="collapseName">
          <el-collapse-item name="more" title="更多信息">
            <el-form-item label="主机名" prop="hostName">
              <el-input v-model="theData.hostName"></el-input>
            </el-form-item>
            <el-form-item label="操作系统" prop="osName">
              <el-input v-model="theData.osName"></el-input>
            </el-form-item>
            <el-form-item label="所属业务系统" prop="application">
              <el-input v-model="theData.application"></el-input>
            </el-form-item>
            <el-form-item label="数据库版本" prop="dbVersion">
              <el-input v-model="theData.dbVersion"></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="confirm()" :loading="confirmBtnLoading">确定</el-button>
        <el-button @click="cancel()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { createOne as oracleCreate } from '../api/oracle';
import { createOne as sqlCreate } from '../api/sqlserver';
import { databaseModalMixin } from './mixins/modalMixins';

const vm = {
  name: 'DatabaseCreateModal',
  mixins: [databaseModalMixin],
  data() {
    return {
      originData: {}, // 原始值
      theData: {},
      requestMapping: {
        oracle: data => oracleCreate(data),
        sqlserver: data => sqlCreate(data),
      },
    };
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.confirmBtnLoading = true;
          this.requestMapping[this.dbType](this.theData)
            .then(res => {
              const { data: db } = res.data;
              this.$emit('confirm', db);
              this.$refs.createForm.resetFields();
              this.confirmBtnLoading = false;
            })
            .then(() => {
              this.$emit('update:visible', false);
              this.theData = {};
            })
            .catch(error => {
              this.confirmBtnLoading = false;
              this.$message.error(error);
              return false;
            });
        } else {
          return false;
        }
      });
    },
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.theData, this.originData)) {
        this.theData = {};
        this.$refs.createForm.resetFields();
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.theData = {};
            this.$refs.createForm.resetFields();
            fn();
          })
          .catch(() => {});
      }
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
