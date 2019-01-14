<template>
  <el-container style="height: 100%;" @mousemove="mousemoveCallBack">
    <el-container style="overflow: auto">
      <el-header style="font-size: 12px; height: 48px; background-color: #00264a;">
        <el-col :span="4">
          <span @click="expandMenu">
            <IIcon :name="menuIconName" class="menu-icon"></IIcon>
          </span>
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
        
        

      </el-header>
      <el-aside v-show="showMenu" style="margin-top: 48px;position: fixed;z-index: 1000;width:auto;background-color: #00264a">
        <!-- <div class="logo">
          <img src="../../assets/layoutContraction.png"
              alt="信服易备"
              v-show="isMenuCollapsed"
              height="35px">
          <img src="../../assets/layoutExpansion.png"
              alt="信服易备"
              v-show="!isMenuCollapsed"
              height="35px">
        </div> -->
        <el-menu background-color="#00264a"
                text-color="#fff"
                active-text-color="#fff"
                :default-active="defaultActive"
                :collapse="isMenuCollapsed">
          <el-menu-item index="/dashboard">
            <router-link to="/dashboard"
                        tag="div"
                        style="display: inline-block; width: 120px;">
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
            <el-menu-item v-for="submenu in menu.children.filter(child => child.meta && child.meta.title)"
                          :key="submenu.path"
                          :index="submenu.meta.activeName ? submenu.meta.activeName : `${menu.path}/${submenu.path}`">
              <router-link :to="`${menu.path}/${submenu.path}`"
                          tag="li">{{ submenu.meta.title }}</router-link>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- IE不支持main标签 -->
      <!-- <el-main>
        <router-view/>
      </el-main> -->
      <div class="el-main">
        <router-view/>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import IIcon from '../IIcon.vue';

export default {
  name: 'Layout',
  data() {
    return {
      clientWidth: 1920,
      curTime: new Date().getTime(),
      lastTime: new Date().getTime(),
      timeOut: 30 * 60 * 1000,
      intervalObj: null,
      menuIconName: 'caidanlan',
      showMenu: false
    };
  },
  components: {
    IIcon,
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
    expandMenu() {
      this.showMenu = !this.showMenu;
      this.menuIconName = this.showMenu ? 'guanbi' : 'caidanlan';
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
.el-header {
  background-color: #ffffff;
  color: #333;
  line-height: 60px;
  box-shadow: 1px 1px #eeeeee;
  position: relative;
}
.el-main {
  background-color: #f0f2f5;
  box-sizing: border-box;
  padding: 0px;
}
.el-main::-webkit-scrollbar{
  display: none;
  width: 0px;
}
.el-aside {
  color: #333;
}
.el-menu {
  border: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 150px;
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
.menu-icon {
  margin-right: 5px;
}
</style>
