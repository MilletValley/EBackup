<template>
  <div class="root">
    <section class="login-content">
      <div class="login-box">
        <el-form class="login-form" label-position="left">
          <div class="login-head"> <img src="../assets/logo.png" class="login-img"></div>
          <el-form-item label="用户名" props="loginName" class="login-name">
            <el-input type="text" required v-model="loginName" auto-complete="off" @keyup.enter.native="doPassword">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" class="login-pass">
            <el-input type="password" required v-model="password" auto-complete="off" ref="isAutofocus" @keyup.enter.native="doLogin">
            </el-input>
          </el-form-item>
          <el-form-item label="记住我">
            <el-switch v-model="rememberMe" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-button" @click="login2" :loading="isLoading">登&emsp;&emsp;录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <div>
      <div class="home-copyright">
        <p>Copyright @2018 whstone Corportation All Rights Reserved</p>
        <p>Powered By esay standby<br/></p>
        <p>Version 1.0.0<br/></p>
        <p>武汉四通信服易备数据中心应用连续性管理系统<br/></p>
      </div>
    </div>
</div>
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
      isLoading: false,
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
      this.isLoading = true;
      this.loginForAll(this.$data)
        .then(accessedRouters => {
          this.isLoading = false;
          // 登录成功后，必须马上添加允许登录的路由
          this.$router.addRoutes(accessedRouters);
          this.$message.success('登录成功');
          this.$router.replace('/');
          // this.$router.push('/dashboard');
        })
        .catch(error => {
          this.isLoading = false;
          this.$message.error(error);
        });
    },
    doPassword() {
      if(!this.loginName){
        this.$message.error('用户名不能为空');
      }else{
        this.$refs.isAutofocus.focus();
      }
    },
    doLogin() {
      if(!this.password){
        this.$message.error('密码不能为空');
      }else if(!this.loginName){
        this.$message.error('用户名不能为空');
      }else{
        this.login2();
      }
    }
  },
};
</script>
<style scoped>
.root {
  background-image: url("../assets/homePage3.jpg");
  background-size: 100% auto;
  background-repeat: no-repeat;
  width: 100%;
}

@font-face {
  font-family: 'Niconne';
  font-style: normal;
  font-weight: 400;
  src: url('../assets/Niconne-Regular.ttf');
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset;
 }

.login-content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  padding: 15% 0 5%;
}

.login-content .logo {
  margin-bottom: 40px;
  font-family: "Niconne";
  color: #fff;
}

.login-content .logo h1 {
  font-size: 52px;
  font-weight: 400;
}

.login-content .login-box {
  position: relative;
  width: 390px;
  height: 430px;
  font-weight: 700;
  background-color: #fff;
  margin: 0 auto;
  -webkit-box-shadow: 0px 29px 147.5px 102.5px rgba(0, 0, 0, 0.05), 0px 29px 95px 0px rgba(0, 0, 0, 0.16);
          box-shadow: 0px 29px 147.5px 102.5px rgba(0, 0, 0, 0.05), 0px 29px 95px 0px rgba(0, 0, 0, 0.16);
  -webkit-perspective: 800px;
          perspective: 800px;
  -webkit-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}

.login-content .login-box .login-head {
  margin-top: 0;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.login-content .login-box .login-img {
  height: 50px;
  padding-right: 20px;
  line-height: .75em;
  vertical-align: -40%;
}

.login-content .login-box .login-button {
  width: 310px;
}

.login-content .login-box .login-form {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  padding-top: 25px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
}

.el-form-item {
    margin-bottom: 10px;
}

.el-button {
    font-weight: 700;
}
.home-copyright {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 100%;
}
.home-copyright p {
  text-align: center;
  display: block;
  font-size: 12px;
  color: #666;
}
@media screen and (max-width: 1460px) {
  .login-content .login-box {
    width: 300px;
    height: 350px;
    margin-top: -50px;
  }
  .login-content .login-box .login-button {
    width: 222px;
    height: 35px;
  }
  .login-content .login-box .login-head {
    margin-top: -10px;
  }
  .login-content {
    padding-bottom: 2px;
  }
  .home-copyright {
    bottom: 10px;
  }
  .home-copyright p {
    margin: 0;
    padding: 2px;
  }
}
</style>
<style>
@media screen and (max-width: 1460px) {
  .login-name .el-form-item__label,
  .login-pass .el-form-item__label {
    line-height: 30px;
  }
  .login-name .el-form-item__content,
  .login-pass .el-form-item__content {
    line-height: 24px;
  }
  .login-name .el-input__inner,
  .login-name .el-input__inner {
    height: 35px;
  }
}
</style>