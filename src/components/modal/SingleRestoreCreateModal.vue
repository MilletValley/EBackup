<template>
  <section>
    <el-dialog :visible.sync="modalVisible" width="30%">
      <span slot="title">执行恢复操作</span>
      <el-form :model="formDate" label-width="110px" ref="singleRestoreForm" size="small">
        <el-form-item label="恢复主机IP">
          <el-input v-model="formDate.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="formDate.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formDate.password"></el-input>
        </el-form-item>
        <el-form-item label="详细信息">
          <el-input v-model="formDate.detailInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import moment from 'moment';
import { createSingleRestorePlan } from '../../api/sqlserver';

const requestMapping = {
  sqlserver: createSingleRestorePlan,
};

export default {
  name: 'SingleRestoreCreateModal',
  props: {
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formDate: {
        timeStrategy: 1, // 单次恢复时间策略固定
      },
    };
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
  },
  methods: {
    confirm() {
      const data = {
        name: moment().format('YYYYMMDDHHmmss'),
        config: this.formDate,
      };
      requestMapping[this.type]({ id: this.id, data })
        .then(res => {
          const { data: restorePlan } = res.data;
          this.$emit('confirm', restorePlan);
          this.$emit('update:visible', false);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
};
</script>
<style>
</style>
