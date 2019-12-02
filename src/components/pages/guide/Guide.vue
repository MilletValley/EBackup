<template>
  <el-container style="height: 100%; overflow: auto">
    <el-header>
      <my-header></my-header>
    </el-header>
    <div class="el-main guide-box custom-scrollbar">
      <div class="guide-content">
        <div class="db">
          <div class="title">
            <i-icon name="guide-db" class="icon-title"></i-icon>
            数据库
          </div>
          <div class="content">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-backup" class="operation-icon"></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/databaseBackup"
                                  tag="div">备份</router-link>
                    <p class="operation-explain">Oracle、SQL Server、MySQL、DB2、达梦、Sybase、Cache、InSQL、Informix、PostgreSQL</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-restore" class="operation-icon"></i-icon>
                  <i-icon name=""></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/databaseRestore">恢复</router-link>
                    <p class="operation-explain">Oracle、SQL Server、MySQL、DB2、达梦、Sybase、Cache、InSQL、Informix、PostgreSQL</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-takeover" class="operation-icon"></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/databaseTakeover">一键接管</router-link>
                    <p class="operation-explain">Oracle、SQL Server、MySQL、InSQL</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="vm">
          <div class="title">
            <i-icon name="guide-vm" class="icon-title"></i-icon>虚拟机
          </div>
          <div class="content">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-backup" class="operation-icon"></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/vmBackup">备份</router-link>
                    <p class="operation-explain">VMware、华为虚拟机、Hyper-V、aCloud</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-restore" class="operation-icon"></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/vmRestore">恢复</router-link>
                    <p class="operation-explain">VMware、华为虚拟机、Hyper-V、aCloud</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-takeover" class="operation-icon"></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/vmTakeOver">一键接管</router-link>
                    <p class="operation-explain">VMware、Hyper-V</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="file">
          <div class="title">
            <i-icon name="guide-file" class="icon-title"></i-icon>
            文件系统
          </div>
          <div class="content">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-backup" class="operation-icon"></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/filehostBackup">备份</router-link>
                    <p class="operation-explain">Windows、Linux</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="operation-box">
                  <i-icon name="guide-restore" class="operation-icon"></i-icon>
                  <div class="operation-content">
                    <router-link class="operation-type"
                                  to="guide/filehostRestore">恢复</router-link>
                    <p class="operation-explain">Windows、Linux</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </el-container>
</template>
<script>
import IIcon from '@/components/IIcon';
import MyHeader from '@/components/MyHeader';
export default {
  name: 'Guide',
  components: {
    IIcon,
    MyHeader
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/theme/variable.scss';
.guide-box {
  height: calc(100% - 60px);
  min-width: calc(100% - 120px);
  padding: 50px 60px;
  @include main-background-color;
  .guide-content {
    @include content-background-color;
    padding: 10px 70px;
  }
}
.title {
  font-size: 20px;
  font-weight: 700;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #ccc;
  .icon-title {
    vertical-align: -0.3em;
    margin-right: 5px;
    width: 30px;
  }
}
.content {
  margin: 10px 0;
  .operation-box {
    min-height: 130px;
    width: calc(100% - 20px);
    padding: 5px 0;
    margin: 0 auto;
    position: relative;
    &:hover::before,
    &:hover::after {
      position: absolute;
      content: '';
      z-index: 1;
      border-radius: 5px;
    }
    &:hover::before{
      bottom: 0;
      right: 0;
      @include themeify {
        border-bottom: 1px solid themed('primary-color');
        border-left: 1px solid themed('primary-color');
      }
      animation: showBorder1 .25s linear 1;
      animation-fill-mode : forwards;
    }
    &:hover::after {
      top: 0;
      left: 0px;
      @include themeify {
        border-top: 1px solid themed('primary-color');
        border-right: 1px solid themed('primary-color');
      }
      animation: showBorder2 .25s linear 1 .25s;
      animation-fill-mode : forwards;
    }
    &:hover {
      animation-fill-mode : forwards;
    }
    .operation-icon {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(-50%, -50%);
      z-index: 3;
      font-size: 40px;
      width: 60px;
    }
    .operation-content {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2;
      transform: translate(-50%, -50%);
      width: calc(100% - 100px);
      height: calc(100% - 20px);
      .operation-type {
        cursor: pointer;
        font-size: 24px;
        font-weight: 400;
        display: inline-block;
        padding: 5px 0;
        width: 100%;
        @include primary-color;
        text-decoration: none;
      }
      .operation-explain {
        color: #888;
        font-size: 14px;
      }
    }
  }
}
@keyframes showBorder1 {
  0% {
    height: 0;
    width: 0;
  }
  50% {
    width: calc(100% - 1px);
    height: 0;
  }
  100% {
    width: calc(100% - 1px);
    height: calc(100% - 1px);
  }
}
@keyframes showBorder2 {
  0% {
    height: 0;
    width: 0;
  }
  50% {
    width: calc(100% - 1px);
    height: 0;
  }
  100% {
    width: calc(100% - 1px);
    height: calc(100% - 1px);
  }
}
</style>
