<template>
  <el-container style="height: 100%; min-width: 1100px">
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
          <el-step title="添加虚拟机主机"
                    @click.native="active = 2"
                    description="可添加作为恢复机的虚拟机主机进行异机恢复，或跳过此步骤直接进行本机恢复"></el-step>
          <el-step title="虚拟机列表"
                    @click.native="active = 3"
                    description="通过点击虚拟机名称选择需要进行恢复的虚拟机"></el-step>
          <el-step title="添加恢复计划"
                    @click.native="active = 4"
                    description="可通过点击“添加恢复计划”进行计划恢复，或者选择备份集进行立即恢复"></el-step>
        </el-steps>
        <el-row v-show="active === 1">
          <el-col :span="16"
                  :offset="4">
            <el-card style="padding: 0 20px 30px 0">
              <h3 style="text-align: center">虚拟机恢复</h3>
              <div style="color: #979797">
                <p class="text-indent">欢迎使用信服易备虚拟机恢复新手指引功能！</p>
                <p class="text-indent">
                  本操作将对
                    <i-icon name="ip" class="ip"></i-icon>
                    <span class="ip-color">145.170.32.42</span>的生产设备下的虚拟机
                    <i-icon name="guide-vm" class="icon-class"></i-icon>
                    <span class="db-color">jy_windows2008_filebackup1_41</span>进行数据恢复。用于恢复的恢复主机是
                    <i-icon name="ip" class="ip"></i-icon>
                    <span class="ip-color">145.170.33.8</span>。
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
        <el-row v-show="active === 2" style="margin-top: 40px">
          <el-col :span="12"
                  :offset="6">
            <el-card class="form-card">
              <el-form :model="targetServerHost"
                        disabled
                        label-width="100px"
                        size="small">
                <span class="form-title">添加主机</span>
                  <el-form-item label="主机名：">
                      <el-input v-model="targetServerHost.serverName"></el-input>
                  </el-form-item>
                  <el-form-item label="选择设备：">
                    <el-input v-model="targetServerHost.hostName">
                      <el-button slot="append">...</el-button>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="主机IP：">
                    <el-input v-model="targetServerHost.serverIp"></el-input>
                  </el-form-item>
                  <el-form-item label="主机类型：">
                    <el-radio-group v-model="targetServerHost.serverType">
                      <el-radio v-for="(serverType, index) in serverTypeMapping[targetServerHost.vmType]"
                                :key="index"
                                :label="serverType">{{ virtualHostServerTypeMapping[serverType] }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="登录账号：">
                    <el-input v-model="targetServerHost.serverLoginName"></el-input>
                  </el-form-item>
                  <el-form-item label="登录密码：">
                    <el-input v-model="targetServerHost.serverPassword"
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
          <div style="height: 60px; line-height: 60px;">
            <span style="float: left">选择虚拟机</span>
          </div>
          <el-table :data="virtuals"
                    style="width: 100%"
                    size="small"
                    ref="virtualList">
            <el-table-column label="名称"
                              min-width="200"
                              align="center">
              <template slot-scope="scope">
                <el-button type="text">
                  {{ scope.row.vmName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="vmPath"
                              label="路径"
                              min-width="300"
                              header-align="center"></el-table-column>
            <el-table-column prop="vmHostName"
                              min-width="100"
                              label="所属物理主机"
                              align="center"></el-table-column>
            <el-table-column label="状态"
                              min-width="80"
                              align="center">
              <template slot-scope="scope">
                <el-tag size="mini"
                        :type="scope.row.bootState === 0 ? 'danger' : 'success'">
                  {{ bootStateMapping[scope.row.bootState] }}
                </el-tag>
              </template>
            </el-table-column>
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
            <virtual-detail></virtual-detail>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-container>
</template>

<script>
import VirtualDetail from '@/components/pages/guide/VirtualDetail';
import MyHeader from '@/components/MyHeader';
import { pageMixin } from '@/components/mixins/guideMixins';
import {
  vmHost,
  serverHost,
  virtuals,
  targetServerHost
} from '@/utils/guide/vm-backup';
import {
  databaseTypeMapping,
  storeTypeMapping,
  serverTypeMapping,
  virtualHostServerTypeMapping,
  bootStateMapping
} from '@/utils/constant';

export default {
  name: 'VirtualRestore',
  mixins: [pageMixin],
  components: {
    VirtualDetail,
    MyHeader
  },
  data() {
    return {
      active: 1,
      databaseTypeMapping,
      storeTypeMapping,
      serverTypeMapping,
      virtualHostServerTypeMapping,
      bootStateMapping,
      vmHost,
      serverHost,
      virtuals,
      targetServerHost
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
