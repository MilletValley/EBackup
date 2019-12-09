<template>
  <div @click="mousemoveCallBack" style="height: 100%">
    <el-container style="height: 100%; min-width: 1000px;" >
      <el-aside style="width: auto;"
                :style="{ backgroundColor: themeColor.asideColor }"
                class="custom-scrollbar">
        <div class="logo">
          <img :src="logo"
              alt="信服易备"
              height="35px">
        </div>
        <el-menu :background-color="themeColor.asideColor"
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
                      v-if="!menu.meta.isActive || (configMsg.inspectWeb && inspectActive)"
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
      </el-aside>
      <el-container style="overflow: auto;">
        <el-header>
          <my-header></my-header>
        </el-header>
        <div class="el-main custom-scrollbar">
          <router-view/>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader';
import { mapState, mapActions, mapMutations } from 'vuex';
import IIcon from './IIcon.vue';
import layoutContraction from '@/assets/layoutContraction.png';
import layoutExpansion from '@/assets/layoutExpansion.png';
import { sockMixin } from '@/components/mixins/commonMixin';
import themeMixin from '@/components/mixins/themeMixins';
import { RSAKey } from '@/components/common/rsa';
import { sendRSAPassword } from '@/api/virtuals';
export default {
  name: 'Layout',
  mixins: [sockMixin, themeMixin],
  data() {
    return {
      clientWidth: 1920,
      curTime: new Date().getTime(),
      lastTime: new Date().getTime(),
      timeOut: 30 * 60 * 1000,
      intervalObj: null,
      url: '/socket-host',
      rsaPassword: ''
    };
  },
  components: {
    IIcon,
    MyHeader
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
      return this.clientWidth < 1300;
    },
    logo() {
      return this.isMenuCollapsed ? layoutContraction : layoutExpansion;
    },
    defaultActive(){
      return this.$route.meta.activeName ? this.$route.meta.activeName : this.$route.path;
    },
    ...mapState({
      menus: state =>
        state.base.routers.filter(router => router.meta && router.meta.title),
      configMsg: state => state.nav.configMsg
    }),
    inspectActive() {
      if (this.configMsg.inspectWeb) {
        return this.configMsg.inspectWeb.active;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(['logout', 'fetchHost', 'setHost']),
    ...mapMutations(['setClientWidth']),
    encryption(publickKey, password) {
      let rsa = new RSAKey();
      rsa.setPublic(publickKey, '10001');
      return rsa.encrypt(password);
    },
    sendServerConfig() {
      const { ebackupServer } = this.configMsg;
      sendServerConfig(this.inspectUrl, { ip: ebackupServer.ip, port: ebackupServer.port })
        .then(res => {})
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
    },
    connectCallback(client) { //connect连接成功的回调函数
      this.stompClient.subscribe('/host', msg => { // 订阅服务端提供的某个topic
        let { data } = JSON.parse(msg.body);// msg.body为服务端返回的报文
        data = Array.isArray(data) ? data : [];
        this.setHost(data);
      });
      this.stompClient.subscribe('/source-rsa-password', msg => {
        let { data } = JSON.parse(msg.body);
        const { id, key, password } = data;
        this.rsaPassword = password ? this.encryption(key, password) : '';
        this.sendRSAMsg({ id, password: this.rsaPassword });
      });
    },
    sendRSAMsg(data) {
      sendRSAPassword(data)
        .then(() => {})
        .catch(error => {
          this.$message.error(error);
        })
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.logo {
  padding: 11px 10px;
  padding-top: 20px;
}
.logo img {
  margin: 0 auto;
  display: block;
}
.el-main {
  @include main-background-color;
  box-sizing: border-box;
  padding: 20px;
}
.el-aside {
  color: #333;
}
.el-menu {
  border: none;
}
.el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.router-link-active {
  color: #ffd04b;
  font-weight: 600;
}
.menu-icon {
  margin-right: 5px;
}
</style>
