<template>
  <section>
    <el-dialog :visible.sync="_visible" :before-close="beforeClose">
      <span slot="title">
        更新数据库
      </span>
      <el-form :model="theData" :rules="rules" label-width="110px" ref="updateForm" size="small">
        <el-form-item label="ID">
          <el-input v-model="theData.id" disabled></el-input>
        </el-form-item>
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
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { modifyOne } from '../../api/fileHost';
import { fileHostModalMixin } from '../mixins/modalMixins';

export default {
  name: 'FileHostUpdateModal',
  mixins: [fileHostModalMixin],
  props: {
    fileHostInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      theData: {},
      // requestMapping: {
      //   windows: data => updateWindows(data),
      //   linux: data => {},
      // },
    };
  },
  watch: {
    visible(value) {
      if (value) {
        // modal显示
        // 保存原始值 赋予表单数据
        this.originData = { ...this.fileHostInfo };
        this.theData = { ...this.fileHostInfo };
        // this.$refs.updateForm.clearValidate();
      } else {
        // modal隐藏
        // 原始值清空 表单model清空
        this.originData = {};
        this.theData = {};
      }
    },
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          modifyOne(this.theData)
            .then(res => {
              const { data: db, message } = res.data;
              // FIXME: mock数据保持id一致，生产环境必须删除下面一行
              db.id = this.fileHostInfo.id;
              this.$emit('confirm', db);
              this.$refs.updateForm.clearValidate();
              this.$emit('update:visible', false);
              return message;
            })
            .then(message => {
              this.$message.success(message);
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
        this.$refs.updateForm.clearValidate();
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.$refs.updateForm.clearValidate();
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
