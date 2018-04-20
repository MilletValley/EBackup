<template>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <section>
        <el-form label-position="left">
          <el-form-item label="用户名" props="loginName">
            <el-input type="text" required v-model="loginName" auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" required v-model="password" auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="记住我">
            <el-switch v-model="rememberMe"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login2(loginName, password)">登陆</el-button>
          </el-form-item>
        </el-form>
      </section>
    </el-col>
  </el-row>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: [],
  data() {
    return {
      loginName: '',
      password: '',
      rememberMe: false,
    };
  },
  computed: mapState({
    token: state => state.base.token,
    userId: state => {
      if (state.base.userInfo) {
        return state.base.userInfo.id;
      }
      return '';
    },
  }),
  methods: {
    ...mapActions(['loginForAll']),
    login2(loginName, password) {
      this.loginForAll({ loginName, password })
        .then(() => {
          this.$message({
            message: '登陆成功',
            type: 'success',
          });
          this.$router.replace('/');
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '权限获取失败' + error,
          });
        });
    },
  },
};
</script>
<style>

</style>
