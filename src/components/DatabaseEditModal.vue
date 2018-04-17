<template>
  <section>
    <el-dialog :visible.sync="_visible" :before-close="beforeClose">
      <span slot="title">
        {{ updateOrCreate }}数据库
      </span>
      <el-form :model="selectedDb" label-width="100px" ref="theForm">
        <el-form-item label="ID" v-if="operationType === 'update'">
          <el-input v-model="selectedDb.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="主机名" prop="hostName">
          <el-input v-model="selectedDb.hostName"></el-input>
        </el-form-item>
        <el-form-item label="主机IP" prop="hostIp">
          <el-input v-model="selectedDb.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="osName">
          <el-input v-model="selectedDb.osName"></el-input>
        </el-form-item>
        <el-form-item label="所属业务系统" prop="application">
          <el-input v-model="selectedDb.application"></el-input>
        </el-form-item>
        <el-form-item label="数据库实例名" prop="instanceName">
          <el-input v-model="selectedDb.instanceName"></el-input>
        </el-form-item>
        <el-form-item label="数据库版本" prop="dbVersion">
          <el-input v-model="selectedDb.dbVersion"></el-input>
        </el-form-item>
        <el-form-item label="数据库登录名" prop="loginName">
          <el-input v-model="selectedDb.loginName"></el-input>
        </el-form-item>
        <el-form-item label="数据库密码" prop="password">
          <el-input v-model="selectedDb.password"></el-input>
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
import clone from 'lodash/clone';
import { modifyOne, createOne } from '../api/oracle';

const requestMapping = {
  'oracle:update': data => modifyOne(data),
  'oracle:create': data => createOne(data),
  'sqlserver:update': () => {},
  'sqlserver:create': () => {},
};
const vm = {
  name: 'DatabaseEditModal',
  props: {
    dbType: String,
    operationType: String,
    selectedDb: Object,
    onCreateComplete: Function,
    onUpdateComplete: Function,
  },
  data() {
    return {
      // dialogVisible: this.visible,
      originData: {}, // 原始值
    };
  },
  computed: {
    updateOrCreate() {
      const updateCreateMapping = {
        update: '更新',
        create: '新建',
      };
      return updateCreateMapping[this.operationType];
    },
    type() {
      return `${this.dbType}:${this.operationType}`;
    },
    _visible: {
      get() {
        return this.operationType === '' ? false : true;
      },
      set(value) {
        if (!value) {
          this.$emit('update:operationType', '');
        }
      },
    },
  },
  watch: {
    operationType(value) {
      if (value) {
        this.originData = { ...this.selectedDb };
      } else {
        this.originData = {};
      }
    },
  },
  methods: {
    confirm() {
      requestMapping[this.type](this.selectedDb)
        .then(res => {
          if (this.operationType === 'create') {
            const { data: db } = res.data;
            // this.$refs['theForm'].resetFields();
            // this.$emit('update:selectedDb', this.originData);
            this.onCreateComplete(db);
          } else {
            const { data: db } = res.data;
            // FIXME: mock数据保持id一致，生产环境必须删除下面一行
            db.id = this.selectedDb.id;
            this.onUpdateComplete(db);
          }
        })
        .then(() => {
          this.$emit('update:operationType', '');
          // this.$emit('update:visible', false);
        })
        .catch(error => {
          this.$message({
            type: 'error',
            error,
          });
        });
    },
    cancel() {
      if (this.operationType === 'update') {
        this.$emit('update:selectedDb', this.originData);
        // this.$refs['theForm'].resetFields();
      }
      this.$emit('update:operationType', '');
      // this.$emit('update:visible', false);
    },
    // 退出之前，判断是否有未保存的修改
    beforeClose(done) {
      if (isEqual(this.selectedDb, this.originData)) {
        done();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.$emit('update:selectedDb', this.originData);
            // this.$refs['theForm'].resetFields();
            done();
          })
          .catch(() => {});
      }
    },
  },
};
export default vm;
</script>
<style>

</style>
