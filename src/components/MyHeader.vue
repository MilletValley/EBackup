<template>
  <div class="header">
    <el-breadcrumb separator="/"
                  class="bread-crumb">
      <el-breadcrumb-item v-for="nav in breadcrumb"
                          :key="nav.path"
                          :to="{ path: nav.path}">{{ nav.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="float: right;">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">
          {{ userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="backupPlan">备份计划</el-dropdown-item>
          <el-dropdown-item command="restorePlan">恢复计划</el-dropdown-item>
          <el-dropdown-item command="inspection" v-if="configMsg.inspectWeb">巡检  (已{{inspectActive ? '启用' : '禁用'}})</el-dropdown-item>
          <el-dropdown-item command="manual">操作说明</el-dropdown-item>
          <el-dropdown-item command="guide">功能指引</el-dropdown-item>
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item @mouseover.native="leaveInTheme"
                            @mouseout.native="leaveOutTheme"
                            style="position: relative">
            <span>
              主题
              <i class="el-icon-caret-right"></i>
            </span>
            <div v-show="showThemeList"
                class="themeList">
              <div v-for="(item, index) in Object.keys(themeTypeMapping)"
                  :key="index"
                  :class="[item === theme ? 'selectedTheme' : '']"
                  @click="updateTheme(item)"
                  style="padding: 0 10px">
                  {{ themeTypeMapping[item] }}
                  <i class="el-icon-check"
                      v-show="item === theme"
                      style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%)"></i>
              </div>
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { fetchConfig, modifyInspectionActive } from '@/api/home';
import { mapState, mapActions, mapMutations } from 'vuex';
import { sendServerConfig } from '@/api/inspection';
import { userInfo } from 'os';
const themeTypeMapping = {
  default: '简约白(默认)',
  deepBlue: '宝石蓝',
  yellow: '流沙金'
};
export default {
  name: 'MyHeader',
  data() {
    return {
      themeTypeMapping,
      showThemeList: false,
    }
  },
  created() {
    this.fetchConfig();
    if (this.inspectActive) {
      this.sendServerConfig();
    }
  },
  computed: {
    ...mapState({
      menus: state =>
        state.base.routers.filter(router => router.meta && router.meta.title),
      configMsg: state => state.nav.configMsg,
      breadcrumb: state => state.nav.breadcrumb,
      configMsg: state => state.nav.configMsg,
      theme: state => state.nav.theme,
      userName: state => {
        if (state.base.userInfo.userName) {
          return state.base.userInfo.userName;
        }
        return state.base.userInfo.loginName;
      },
      userRole: state => {
        if(state.base.userInfo.roles){
          return state.base.userInfo.roles;
        }
      },
    }),
    inspectActive() {
      if (this.configMsg.inspectWeb) {
        return this.configMsg.inspectWeb.active;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(['logout']),
    ...mapMutations(['setConfig']),
    handleCommand(command) {
      if (command === 'logout') {
        this._logout();
      } else if (command === 'profile') {
        this.$router.push({ name: 'profile' });
      } else if (command === 'backupPlan') {
        this.$router.push({ name: 'backupPlans' });
      } else if (command === 'inspection') {
        this.updateInspection();
      } else if (command === 'restorePlan') {
        this.$router.push({ name: 'restorePlans' });
      } else if (command === 'manual') {
        this.selectToGuide();
      } else if (command === 'guide') {
        this.$router.push({ name: 'guide' });
      }
    },
    selectToGuide() {
      let idStr = '';
      let nameStr = '';
      let roleArray = this.userRole.map(role => role.id);
      if(roleArray.includes('file admin')){
        nameStr ='fileSystemManual';
        idStr = 'fileSystemDeletion';
      } else if(roleArray.includes('vm admin')){
        nameStr ='addManagementManual';
        idStr = 'addManagement';
      } else if(roleArray.includes('application admin')){
        nameStr ='applicationManual';
        idStr = 'addApplication';
      } else if(roleArray.includes('admin')){
        nameStr ='takeoverManual';
        idStr = 'dataDaseTakeOver';
      } else {
        nameStr ='databaseManual';
        idStr = 'addDataBase';
      }
      let routeData = this.$router.resolve({
        name: nameStr,
        query: { aId:idStr }
      });
      window.open(routeData.href, '_blank')
    },
    leaveInTheme() {
      this.showThemeList = true;
    },
    leaveOutTheme() {
      this.showThemeList = false;
    },
    updateTheme(theme) {
      this.$store.commit('SET_THEME', theme);
    },
    _logout() {
      this.logout(this.$store.state.base.token).then(message => {
        this.$message.success({
          message,
        });
        this.$router.push('/login');
      });
    },
    fetchConfig() {
      fetchConfig()
        .then(res => {
          const { data: config } = res.data;
          this.setConfig(config);
        })
    },
    sendServerConfig() {
      const { ebackupServer, inspectWeb } = this.configMsg;
      sendServerConfig(`${inspectWeb.ip}:${inspectWeb.port}`,
        { ip: ebackupServer.ip, port: ebackupServer.port })
        .then(res => {})
    },
    updateInspection() {
      if (this.configMsg.inspectWeb.ip) {
        this.$confirm(`此操作即将${this.inspectActive ? '禁用' : '启用'}巡检功能，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          modifyInspectionActive({ active: this.inspectActive })
            .then(res => {
              const { data: inspectActive, message } = res.data;
              const { inspectWeb, ...others } = this.configMsg;
              const { ip, port, active } = inspectWeb;
              this.setConfig({
                inspectWeb: { ip, port, active: inspectActive.active },
                ...others
              });
              this.$message.success(message);
            })
            .then(() => {
              this.sendServerConfig();
            })
            .catch(error => {
              this.$message.error(error);
            })
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
      } else {
        this.$message.warning('未配置巡检功能！');
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.header {
  @include content-background-color;
  @include themeify {
    border-bottom: 1px solid themed('main-background-color');
  }
  font-size: 12px;
  line-height: 60px;
  position: relative;
  z-index: 99;
}
.bread-crumb {
  display: inline-block;
  line-height: 0.6;
}
.el-dropdown-link {
  @include primary-color;
  cursor: pointer;
}
.themeList {
  position: absolute;
  right: 100%;
  top: 0;
  border-radius: 5px;
  min-width: 115px;
  @include text-color;
  @include content-background-color;
  @include themeify {
    border: 1px solid themed('main-background-color');
  }
}
.selectedTheme {
  @include primary-color;
  @include themeify {
    background-color: rgba(themed('primary-color'), 0.1);
  }
  position: relative;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.router-link-active {
  color: #ffd04b;
  font-weight: 600;
}
</style>
