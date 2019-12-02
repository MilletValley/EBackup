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
                    description="可添加作为恢复机的文件服务器进行异机恢复，或跳过此步骤直接进行同机恢复"
                    @click.native="active = 2"></el-step>
          <el-step title="文件服务器列表"
                    description="通过点击主机名选择需要进行恢复的文件服务器"
                    @click.native="active = 3"></el-step>
          <el-step title="添加恢复计划"
                    description="展开备份记录，通过点击“恢复”按钮进行立即恢复"
                    @click.native="active = 4"></el-step>
        </el-steps>
        <el-row v-show="active === 1">
          <el-col :span="16"
                  :offset="4">
            <el-card style="padding: 0 20px 30px 0">
              <h3 style="text-align: center">文件恢复</h3>
              <div style="color: #979797">
                <p class="text-indent">欢迎使用信服易备文件系统恢复新手指引功能！</p>
                <p class="text-indent">
                  本操作将对主机
                    <i-icon name="ip" class="ip"></i-icon>
                    <span class="ip-color">145.170.32.64</span>的文件服务器
                    <i-icon name="guide-file" class="icon-class"></i-icon>
                    <span class="db-color">WIN-FILE-F1</span>进行数据恢复。
                    用于恢复的服务器是<i-icon name="ip" class="ip"></i-icon>
                      <span class="ip-color">145.170.32.65</span>的
                      <i-icon name="guide-file" class="icon-class"></i-icon>
                    <span class="db-color">WIN-FILE-F2</span>
                </p>
                <p class="text-indent">
                  整个操作分三步完成，请点击下方确认按钮开始。
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
              <el-form :model="targetFileHost"
                        label-width="100px"
                        size="small"
                        disabled>
                  <span class="form-title">添加服务器</span>
                  <el-form-item label="主机名">
                    <el-input v-model="targetFileHost.hostName"></el-input>
                  </el-form-item>
                  <el-form-item label="别名">
                    <el-input v-model="targetFileHost.hostAlias"></el-input>
                  </el-form-item>
                  <el-form-item label="主机IP">
                    <el-input v-model="targetFileHost.hostIp"></el-input>
                  </el-form-item>
                  <el-form-item label="操作系统">
                    <el-select v-model="targetFileHost.osName">
                      <el-option v-for="(item, index) in ['Windows', 'Linux']"
                                  :key="index"
                                  :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="服务器登录名">
                    <el-input v-model="targetFileHost.loginName"></el-input>
                  </el-form-item>
                  <el-form-item label="登录密码">
                    <el-input v-model="targetFileHost.password"
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
        <el-row v-show="active === 3" style="padding: 0 80px">
          <h4>选择文件服务器</h4>
          <el-table :data="filehosts"
                    style="width: 100%"
                    size="small">
            <el-table-column label="主机名"
                            min-width="200"
                            align="center">
              <template slot-scope="scope">
                <el-button type="text">
                  {{ scope.row.hostName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="hostAlias"
                              label="别名"
                              min-width="200"
                              align="center"></el-table-column>
            <el-table-column prop="hostIp"
                              label="主机IP"
                              min-width="200"
                              align="center"></el-table-column>
            <el-table-column prop="osName"
                              label="操作系统"
                              min-width="200"
                              align="center"></el-table-column>
            <el-table-column prop="loginName"
                              label="登录名"
                              min-width="200"
                              align="center"></el-table-column>
          </el-table>
          <el-button type="primary"
                      @click="active = 4"
                      class="fr"
                      size="small"
                      style="margin-top: 20px">下一步</el-button>
        </el-row>
        <el-row v-show="active === 4" style="margin-top: 40px; padding: 0 20px;">
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
import {
  filehost as sourceFileHost,
  targetFileHost
} from '@/utils/guide/filehost-backup';
import FileHostDetail from '@/components/pages/guide/FileHostDetail';
import MyHeader from '@/components/MyHeader';
import { pageMixin } from '@/components/mixins/guideMixins';
import {
  databaseTypeMapping,
  storeTypeMapping
} from '@/utils/constant';

export default {
  name: 'FileHostRestore',
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
      sourceFileHost,
      targetFileHost,
      filehosts: [sourceFileHost]
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
    // @include content-background-color;
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
