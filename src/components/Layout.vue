<template>
  <el-container style="height: 100%;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router>
        <el-menu-item index="/dashboard">
          <i class="el-icon-menu"></i>
          <span slot="title">主页</span>
        </el-menu-item>
        <el-submenu v-for="menu in menus" :key="menu.path" :index="menu.path">
          <template slot="title">
            <icon name="database"></icon>
            <span>{{ menu.meta.title }}</span>
          </template>
          <el-menu-item v-for="submenu in menu.children.filter(child => child.meta && child.meta.title)" :key="submenu.path" :index="`${menu.path}/${submenu.path}`">
            {{ submenu.meta.title }}
          </el-menu-item>
        </el-submenu>

      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  data() {
    return {};
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
    }),
  },
  methods: {
    handleCommand(command) {},
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.fa-icon {
  color: #909399;
  width: 24px;
  font-size: 1em;
  margin-right: 5px;
}
</style>
