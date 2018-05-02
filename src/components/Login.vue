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
            <el-switch v-model="rememberMe" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login2">登陆</el-button>
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
      rememberMe: 0,
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
    login2() {
      this.loginForAll(this.$data)
        .then(accessedRouters => {
          this.$router.addRoutes(accessedRouters);
          this.$message.success('登陆成功');
          // this.$router.replace('/');
          this.$router.push('/dashboard');
        })
        .catch(error => {
          this.$message.error({
            message: '权限获取失败' + error,
          });
        });
    },
  },
};
</script>
<style>

</style>
