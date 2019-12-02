<template>
  <el-container style="height: 100%;">
    <el-header>
      <my-header></my-header>
    </el-header>
    <div id="box" class="custom-scrollbar el-main">
      <div id="content">
        <el-steps :active="active"
                  finish-status="success"
                  align-center
                  class="step cp">
          <el-step title="开始"
                    @click.native="active = 1"></el-step>
          <el-step title="添加文件服务器"
                    @click.native="active = 2"
                    description="添加需要进行备份的文件服务器，据实填入相关信息"></el-step>
          <el-step title="添加备份计划"
                    @click.native="active = 3"
                    description="进入文件服务器详情，通过点击“添加备份计划”按钮进行计划备份"></el-step>
        </el-steps>
        <el-row v-show="active === 1">
          <el-col :span="16"
                  :offset="4">
            <el-card style="padding: 0 20px 30px 0">
              <h3 style="text-align: center">文件备份</h3>
              <div style="color: #979797">
                <p class="text-indent">欢迎使用信服易备文件系统备份新手指引功能！</p>
                <p class="text-indent">
                  本操作将对主机
                    <i-icon name="ip" class="ip"></i-icon>
                    <span class="ip-color">145.170.32.1</span>的文件服务器
                    <i-icon name="guide-file" class="icon-class"></i-icon>
                    <span class="db-color">WIN-FILE-F1</span>进行数据备份。
                </p>
                <p class="text-indent">
                  整个操作分两步完成，请点击下方确认按钮开始。
                </p>
              </div>
              <el-button type="primary"
                          @click="active = 2"
                          class="fr"
                          size="small">确认</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="active === 2">
          <el-col :span="12"
                  :offset="6">
            <el-card class="form-card">
              <el-form :model="filehost"
                        label-width="100px"
                        size="small"
                        disabled>
                  <span class="form-title">添加服务器</span>
                  <el-form-item label="主机名">
                    <el-input v-model="filehost.hostName"></el-input>
                  </el-form-item>
                  <el-form-item label="别名">
                    <el-input v-model="filehost.hostAlias"></el-input>
                  </el-form-item>
                  <el-form-item label="主机IP">
                    <el-input v-model="filehost.hostIp"></el-input>
                  </el-form-item>
                  <el-form-item label="操作系统">
                    <el-select v-model="filehost.osName">
                      <el-option v-for="(item, index) in ['Windows', 'Linux']"
                                  :key="index"
                                  :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="服务器登录名">
                    <el-input v-model="filehost.loginName"></el-input>
                  </el-form-item>
                  <el-form-item label="登录密码">
                    <el-input v-model="filehost.password"
                              show-password></el-input>
                  </el-form-item>
              </el-form>
              <el-button type="primary"
                        @click="active = 3"
                        class="fr"
                        size="small">下一步</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="active === 3" style="margin-top: 40px; padding: 0 20px;">
          <el-col :span="20"
                  :offset="2">
            <file-host-detail></file-host-detail>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-container>
</template>

<script>
import MyHeader from '@/components/MyHeader';
import { filehost } from '@/utils/guide/filehost-backup';
import FileHostDetail from '@/components/pages/guide/FileHostDetail';
import { pageMixin } from '@/components/mixins/guideMixins';
import {
  databaseTypeMapping,
  storeTypeMapping
} from '@/utils/constant';

export default {
  name: 'FileHostBackup',
  mixins: [pageMixin],
  components: {
    FileHostDetail,
    MyHeader
  },
  data() {
    return {
      active: 1,
      databaseTypeMapping,
      storeTypeMapping,
      filehost
    };
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/guide.scss';
@import '@/assets/theme/variable.scss';
.fr {
  float: right;
}
.cp {
  cursor: pointer;
}
#box {
  padding: 30px 70px;
  @include main-background-color;
  #content {
    .step {
      margin-bottom: 20px;
    }
    min-height: 100%;
    .form-card {
      padding: 30px 30px 30px 20px;
      .form-title {
        margin-top: -25px;
        margin-bottom: 20px;
        display: block;
      }
    }
  }
}
</style>
