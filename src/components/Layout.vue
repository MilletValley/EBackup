<template>
  <el-container style="height: 100%;">
    <el-aside width="250px" style="background-color: #00264a">
      <div class="logo">
        <img src="../assets/elogo.png" alt="信服易备" height="40px">
      </div>
      <el-menu background-color="#00264a" text-color="#fff" active-text-color="#fff">
        <el-menu-item index="/dashboard">
          <IIcon name="dashboard"></IIcon>
          <span slot="title">主页</span>
        </el-menu-item>
        <el-submenu v-for="menu in menus" :key="menu.path" :index="menu.path">
          <template slot="title">
            <IIcon :name="menu.meta.icon"></IIcon>
            <span>{{ menu.meta.title }}</span>
          </template>
          <el-menu-item v-for="submenu in menu.children.filter(child => child.meta && child.meta.title)" :key="submenu.path" :index="`${menu.path}/${submenu.path}`">
            <router-link :to="`${menu.path}/${submenu.path}`" tag="li">{{ submenu.meta.title }}</router-link>
          </el-menu-item>
        </el-submenu>

      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="font-size: 12px">
        <el-breadcrumb separator="/" class="bread-crumb">
          <el-breadcrumb-item v-for="nav in breadcrumb" :key="nav.path" :to="{ path: nav.path}">{{ nav.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import IIcon from './IIcon.vue';

export default {
  name: 'Layout',
  data() {
    return {};
  },
  components: {
    IIcon,
  },
  computed: {
    ...mapState({
      userName: state => {
        if (state.base.userInfo.userName) {
          return state.base.userInfo.userName;
        }
        return state.base.userInfo.loginName;
      },
      menus: state =>
        state.base.routers.filter(router => router.meta && router.meta.title),
      // [],
      breadcrumb: state => state.nav.breadcrumb,
    }),
  },
  methods: {
    ...mapActions(['logout']),
    handleCommand(command) {
      if (command === 'logout') {
        this._logout();
      }
    },
    _logout() {
      this.logout(this.$store.state.base.token).then(message => {
        this.$message.success({
          message,
        });
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style>
.logo {
  padding: 10px 10px;
}
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
  box-shadow: 1px 1px #eeeeee;
  position: relative;
}
.el-main {
  background-color: #f0f2f5;
}
.el-aside {
  color: #333;
}
.el-menu {
  border: none;
}
.bread-crumb {
  display: inline-block;
  line-height: 0.6;
}
.user-info {
  float: right;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.router-link-active {
  color: #ffd04b;
  font-weight: 600;
}
</style>
