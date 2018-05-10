<template>
  <section>
    <el-dialog :visible.sync="_visible" :before-close="beforeClose">
      <span slot="title">
        更新数据库
        <span style="color: #999999">（ID: {{theData.id}}）</span>
      </span>
      <el-form :model="theData" :rules="rules" label-width="110px" ref="theForm" size="small">
        <div class="form-header">主要信息</div>
        <el-form-item label="数据库名称" prop="name">
          <el-input v-model="theData.name" placeholder="请输入一个用来标识此数据库的名称"></el-input>
        </el-form-item>
        <el-form-item label="主机IP" prop="hostIp">
          <el-input v-model="theData.hostIp" placeholder="请输入服务器IP"></el-input>
        </el-form-item>
        <el-form-item label="数据库实例" prop="instanceName">
          <el-input v-model="theData.instanceName" placeholder="请输入要备份的数据库实例"></el-input>
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
        <el-button type="primary" @click="confirm" :loading="confirmBtnLoading">确定</el-button>
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
import { databaseModalMixin } from './mixins/modalMixins';

export default {
  name: 'DatabaseUpdateModal',
  mixins: [databaseModalMixin],
  props: {
    databaseInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      theData: {},
      requestMapping: {
        oracle: data => oracleModify(data),
        sqlserver: data => sqlModify(data),
      },
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
          this.confirmBtnLoading = true;
          this.requestMapping[this.dbType](this.theData)
            .then(res => {
              const { data: db, message } = res.data;
              // FIXME: mock数据保持id一致，生产环境必须删除下面一行
              db.id = this.databaseInfo.id;
              this.$emit('confirm', db);
              this.$refs.theForm.clearValidate();
              this.$emit('update:visible', false);
              this.confirmBtnLoading = false;
              return message;
            })
            .then(message => {
              this.$message.success(message);
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
        this.$refs.theForm.clearValidate();
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.$refs.theForm.clearValidate();
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
