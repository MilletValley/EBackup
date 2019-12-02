<template>
<el-container style="height: 100%;">
    <el-header style=" font-size: 12px;"> 
      <h3 style="line-height:40px;height:40px;color:white">
        <router-link :to="{ name: 'dashboard'}" style="color: white;font-size: 18px;">
          <i class="el-icon-s-home"></i>主页</router-link> |  信服易备操作手册</h3>
    </el-header>

  <el-container style="height: calc(100% - 120px)" class="middle">
      <el-aside width="220px" class="custom-scrollbar">
          <el-menu 
            id="Guide_menu"
            :unique-opened="true"
            :default-active="defaultActive">
            <el-submenu v-for="(v, i) in routers"
                        :key="i"
                        :index="v.path"
                        v-if="v.meta">
              <template slot="title">
                <i :class="v.meta.icon"></i>
                {{ v.meta.name }}
              </template>
              <el-menu-item-group>
                <router-link v-for="(route, index) in v.meta.children"
                             :key="index"
                             :to="{ name: `${v.name}`, query: { aId: `${ route.aId }` } }">
                  <el-menu-item :index="`/${route.aId}`">
                    <i class="el-icon-key"></i>
                    {{ route.name }}
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
  <el-main class="main-content custom-scrollbar"
           @scroll.native="getScroll">
     <div class="main">
        <router-view ref='child' @func="isActived" @getR="getRouters"></router-view>
      </div>
  </el-main>
  </el-container>
  <el-footer style="font-size: 12px;border:5px;">
    <div style="float:right;margin-top:24px;color:white">
      <span >© 2019 武汉四通信息服务有限公司 或其子公司,保留所有权利。</span>
    </div>
  </el-footer>
</el-container>

</template>
<script>
  import { mapState, mapActions, mapMutations } from 'vuex';
  import manualRouters from '@/router/manual';
   export default {
    data() {
      return {
        defaultAc :'/'+this.$route.query.aId
      }
    },
    mounted(){
      this.fetchData();
    },
    // 监控页面路由name，发现不同路由则将页面定位至顶部，并将当前路由name存放在本地储存中
    watch:{
      '$route':'fetchData'
    },
    computed:{
      defaultActive(){
        return this.defaultAc;
      },
      routers() {
        const routerList = manualRouters.map(routers => {
          if(routers.children) {
            return routers.children.filter(router => {
              if (this.userRole.indexOf('admin') > -1) {
                return true;
              } else if (router.meta && router.meta.roles) {
                if (router.meta.children) {
                  router.meta.children = router.meta.children.filter(child =>
                    this.userRole.indexOf('admin') > -1 || !child.roles || !child.roles.length
                  )
                }
                return !router.meta.roles.length;
              }
              return true;
            })
          }
          return false;
        })
        return routerList.reduce(
          (flat, next) => {
            return flat.concat(next);
          },
          []
        )
      },
      userRole() {
        const roles = JSON.parse(localStorage.getItem('userInfo')).roles;
        if(roles && roles.length){
          return roles.map(role => role.id);
        }
        return [];
      }
    },
    methods:{
      getScroll() {
        const ele = document.querySelector('.main-content');
        this.$refs.child.onScroll(ele.scrollTop)
      },
      getRouters(){
        return this.routers;
      },
      fetchData(){
        this.defaultAc = '/'+this.$route.query.aId;
      },
      isActived(str){
        this.defaultAc = '/'+str;
      },
    },
  }
</script>
<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
  .el-header {
    background-color: #333;
    color: white;
    line-height: 60px;
  }
  .el-aside {
    /* @include main-background-color; */
    @include content-background-color;
    color: #333;
    height: 100%;
  }
  .el-menu{
    height: 100%;
    border: 0;
  }
  .middle{
    @include main-background-color;
  }
  /* .main-content {
    @include content-background-color;
  } */
  .main {
    @include content-background-color;
    min-height:100%;
    width:80%;
    margin-left:10%;
    padding-bottom: 5px;
  }
  .el-footer{
    background-color: #333;
  } 
  a {
    text-decoration: none;
  }
  .router-link-active {
    text-decoration: none;
  }
  .manualtab{
    /* background-color: #409EFF; */
    width: 10px;
    margin-top: 0;
    padding-top: 0;
  }
</style>
