<template>
  <section>
    <el-dialog :visible.sync="_visible" :before-close="beforeClose">
      <span slot="title">
        添加Windows服务器
      </span>
      <el-form :model="theData" :rules="rules" label-width="110px" ref="createForm" size="small">
        <el-form-item label="主机名" prop="hostName">
          <el-input v-model="theData.hostName"></el-input>
        </el-form-item>
        <el-form-item label="主机IP" prop="hostIp">
          <el-input v-model="theData.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="osName">
          <el-select v-model="theData.osName" placeholder="请选择">
            <el-option v-for="item in ['Windows', 'Linux']" :key="item.value" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属业务系统" prop="application">
          <el-input v-model="theData.application"></el-input>
        </el-form-item>
        <el-form-item label="系统登录名" prop="loginName">
          <el-input v-model="theData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <input-toggle v-model="theData.password"></input-toggle>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="confirm()">确定</el-button>
        <el-button @click="cancel()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { createOne } from '../../api/fileHost';
import { fileHostModalMixin } from '../mixins/modalMixins';

export default {
  name: 'FileHostCreateModal',
  mixins: [fileHostModalMixin],
  data() {
    return {
      originData: {}, // 原始值
      theData: {},
      // requestMapping: {
      //   windows: data => createWindows(data),
      //   linux: data => {},
      // },
    };
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createOne(this.theData)
            .then(res => {
              const { data: db } = res.data;
              this.$emit('confirm', db);
              this.$refs.createForm.resetFields();
            })
            .then(() => {
              this.$emit('update:visible', false);
              // this.$emit('change-selectedDb', this.originData);
              this.theData = {};
            })
            .catch(error => {
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
</script>
<style>

</style>
