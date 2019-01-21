<template>
  <el-container style="height: 100%;" @mousemove="mousemoveCallBack">
    <el-container style="overflow: auto; padding-top: 48px;" class="container">
      <div style="height: 48px;">
        <div class="header">
          <el-row>
            <el-col :span="4" style="text-align: center">
              <IIcon name="caidanlan" style="vertical-align: -0.2em" @click.native="showMenu = !showMenu"></IIcon>
            </el-col>
            <el-col :span="16">
              <div class="logo">
                <img src="../../assets/layoutExpansion.png"
                    alt="信服易备"
                    height="25px">
              </div>
            </el-col>
            <el-col :span="4">
              <div class="user-info">
                <el-dropdown @command="handleCommand" trigger="click">
                  <span class="el-dropdown-link">
                    {{ userName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="backupPlan">备份计划</el-dropdown-item>
                    <el-dropdown-item command="restorePlan">恢复计划</el-dropdown-item>
                    <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <drawer width="300px;"
              :show.sync="showMenu"
              show-mode="push"
              class="vux-drawer">
        <div slot="drawer">
          <el-menu background-color="#00264a"
                  text-color="#fff"
                  active-text-color="#fff"
                  :unique-opened="true"
                  :default-active="defaultActive"
                  :collapse="isMenuCollapsed">
            <el-menu-item index="/dashboard">
              <router-link to="/dashboard"
                          tag="div"
                          style="display: inline-block; width: 220px;">
                <IIcon name="dashboard" class="menu-icon"></IIcon>
                <span>主页</span>
              </router-link>
            </el-menu-item>
            <el-submenu v-for="menu in menus"
                        :key="menu.path"
                        :index="menu.path">
              <template slot="title">
                <IIcon :name="menu.meta.icon"
                      class="menu-icon"></IIcon>
                <span>{{ menu.meta.title }}</span>
              </template>
              <div v-for="(submenu, index) in menu.children.filter(child => child.meta && child.meta.title)"
                  :key="index">
                  <el-submenu v-if="submenu.children"
                              :index="submenu.meta.activeName ? submenu.meta.activeName : String(index)">
                  <template slot="title">
                    <span>{{ submenu.meta.title }}</span>
                  </template>
                  <el-menu-item v-for="(menu2,index) in submenu.children.filter(child => child.meta && child.meta.title)"
                                :key="index"
                                :index="menu2.meta.activeName ? menu2.meta.activeName : `${menu.path}/${menu2.path}`">
                    <router-link :to="`${menu.path}/${menu2.path}`"
                                  tag="li">{{ menu2.meta.title }}</router-link>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else
                              :index="submenu.meta.activeName ? submenu.meta.activeName : `${menu.path}/${submenu.path}`">
                  <router-link :to="`${menu.path}/${submenu.path}`"
                              tag="li">{{ submenu.meta.title }}</router-link>
                </el-menu-item>
              </div>
            </el-submenu>
          </el-menu>
        </div>
        <div class="main">
          <router-view/>
        </div>
      </drawer>
      <div class="dashbord-footer">
        <el-row>
          <el-col :span="12" style="text-align: center; color: #fff">
            <el-row><i-icon name="dashboard"></i-icon></el-row>
            <el-row>
              <router-link to="/dashboard"
                           style="text-decoration: none;">主页</router-link>
            </el-row>
          </el-col>
          <el-col :span="12" style="text-align: center; color: #fff">
            <el-row><i-icon name="setting"></i-icon></el-row>
            <el-row>配置管理</el-row>
          </el-col>
        </el-row>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import IIcon from '../IIcon.vue';
import { Drawer } from 'vux'

export default {
  name: 'Layout',
  data() {
    return {
      clientWidth: 1920,
      curTime: new Date().getTime(),
      lastTime: new Date().getTime(),
      timeOut: 30 * 60 * 1000,
      intervalObj: null,
      showMenu: false
    };
  },
  components: {
    IIcon,
    Drawer
  },
  watch: {
    showMenu(val) {
      const contain = document.getElementsByClassName('container')[0];
      contain.style.overflow = val ? 'hidden' : 'auto';
    },
    '$route': function() {
      this.showMenu = !this.showMenu;
    }
  },
  mounted() {
    this.setTimer();
    this.clientWidth = document.documentElement.clientWidth;
    const that = this;
    window.onresize = function windowResize() {
      that.clientWidth = document.documentElement.clientWidth;
      that.setClientWidth(document.documentElement.clientWidth);
    };
  },
  created() {
    this.fetchHost().catch(error => {
      this.$message.error(error);
    });
  },
  destroyed() {
    clearInterval(this.intervalObj);
  },
  computed: {
    isMenuCollapsed() {
      // return this.clientWidth < 1300;
      return false;
    },
    defaultActive(){
      return this.$route.meta.activeName ? this.$route.meta.activeName : this.$route.path;
    },
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
    ...mapActions(['logout', 'fetchHost']),
    ...mapMutations(['setClientWidth']),
    handleCommand(command) {
      if (command === 'logout') {
        this._logout();
      } else if (command === 'profile') {
        this.$router.push({ name: 'profile' });
      } else if (command === 'backupPlan') {
        // this.BackupPlans
        this.$router.push({ name: 'backupPlans' });
      } else if (command === 'restorePlan') {
        this.$router.push({ name: 'restorePlans' });
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
    setTimer() {
      this.intervalObj = setInterval(this.checkTime, 10000);
    },
    mousemoveCallBack() {
      this.lastTime = new Date().getTime();
    },
    checkTime() {
      this.curTime = new Date().getTime();
      if (this.curTime - this.lastTime > this.timeOut) {
        this._logout();
      }
    }
  },
};
</script>

<style scoped>
.logo {
  padding: 11px 10px;
  padding-top: 10px;
}
.logo img {
  margin: 0 auto;
  display: block;
}
.header {
  background-color: #ffffff;
  color: #333;
  background-color: #00264a;
  line-height: 48px;
  box-shadow: 1px 1px #eeeeee;
  width: 100%;
  height: 48px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  font-size: 12px;
}
.dashbord-footer {
  background-color: #00264A;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 42px;
  padding: 5px 0 0;
  font-size: 12px;
}
.vux-drawer>>>.vux-drawer-content {
  background-color: #00264a;
  position: fixed;
  top: 48px;
  left: 0;
  overflow: scroll;
}
.vux-drawer >>> .vux-drawer-body {
  background-color: #F0F2F5;
}
.main {
  background-color: #f0f2f5;
  box-sizing: border-box;
  padding: 0px;
  padding-bottom: 48px;
}
.main::-webkit-scrollbar{
  display: none;
  width: 0px;
  position: relative;  
}
.el-aside {
  color: #333;
}
.el-menu {
  border: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 180px;
}
.bread-crumb {
  display: inline-block;
  line-height: 0.6;
}
.user-info {
  margin: 0 auto;
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
.menu-icon {
  margin-right: 5px;
}
a:visited {
  color: #fff;
}
</style>
