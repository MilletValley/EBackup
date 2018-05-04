<template>
  <section>
    <el-dialog :visible.sync="_visible" :before-close="beforeClose">
      <span slot="title">
        更新数据库
      </span>
      <el-form :model="theData" :rules="rules" label-width="110px" ref="theForm" size="small">
        <el-form-item label="ID">
          <el-input v-model="theData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="数据库名" prop="name">
          <el-input v-model="theData.name"></el-input>
        </el-form-item>
        <el-form-item label="主机名" prop="hostName">
          <el-input v-model="theData.hostName"></el-input>
        </el-form-item>
        <el-form-item label="主机IP" prop="hostIp">
          <el-input v-model="theData.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="osName">
          <el-input v-model="theData.osName"></el-input>
        </el-form-item>
        <el-form-item label="所属业务系统" prop="application">
          <el-input v-model="theData.application"></el-input>
        </el-form-item>
        <el-form-item label="实例名" prop="instanceName">
          <el-input v-model="theData.instanceName"></el-input>
        </el-form-item>
        <el-form-item label="数据库版本" prop="dbVersion">
          <el-input v-model="theData.dbVersion"></el-input>
        </el-form-item>
        <el-form-item label="数据库登录名" prop="loginName">
          <el-input v-model="theData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="数据库密码" prop="password">
          <input-toggle v-model="theData.password"></input-toggle>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { modifyOne as oracleModify } from '../api/oracle';
import { modifyOne as sqlModify } from '../api/sqlserver';
import databaseModalMinxin from './mixins/databaseModalMixins';

const requestMapping = {
  oracle: data => oracleModify(data),
  sqlserver: data => sqlModify(data),
};

export default {
  name: 'DatabaseUpdateModal',
  mixins: [databaseModalMinxin],
  props: {
    databaseInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      theData: {},
    };
  },
  watch: {
    visible(value) {
      if (value) {
        // modal显示
        this.originData = { ...this.databaseInfo };
        this.theData = { ...this.databaseInfo };
        // this.$refs.theForm.clearValidate();
      } else {
        // modal隐藏
        this.originData = {};
        this.theData = {};
      }
    },
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.theForm.validate(valid => {
        if (valid) {
          requestMapping[this.dbType](this.theData)
            .then(res => {
              const { data: db } = res.data;
              // FIXME: mock数据保持id一致，生产环境必须删除下面一行
              db.id = this.databaseInfo.id;
              this.$emit('confirm', db);
              this.$refs.theForm.clearValidate();
            })
            .then(() => {
              this.$emit('update:visible', false);
              this.theData = {};
            })
            .catch(error => {
              this.$message.error(message);
            });
        } else {
          return false;
        }
      });
    },
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.theData, this.originData)) {
        // this.$emit('change-db', this.originData); // 清空数据
        this.theData = {};
        this.$refs.theForm.clearValidate();
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            // this.$emit('change-db', this.originData); // 清空数据
            this.theData = {};
            this.$refs.theForm.clearValidate();
            fn();
          })
          .catch(() => {});
      }
    },
  },
  components: {
    'input-toggle': InputToggle,
  },
};
</script>
<style>

</style>
