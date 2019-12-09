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
          <el-step title="添加虚拟机设备"
                    @click.native="active = 2"
                    description="进入设备管理，选择添加虚拟机类型生产设备，据实填入相关信息"></el-step>
          <el-step title="添加虚拟机主机"
                    @click.native="active = 3"
                    description="进入虚拟机主机管理，选择添加虚拟机主机，据实填入虚拟机主机所属生产设备及相关信息"></el-step>
          <el-step title="添加虚拟机备份计划"
                    @click.native="active = 4"
                    description="进入虚拟机列表，可添加多虚拟机备份计划; 或者进入点击虚拟机名称进入虚拟机详情页，添加单虚拟机备份计划"></el-step>
          <el-step title="添加单虚拟机备份计划"
                    @click.native="active = 5"
                    description="进入虚拟机详情，通过点击“添加备份计划”按钮添加单虚拟机备份计划"></el-step>
        </el-steps>
        <el-row v-show="active === 1">
          <el-col :span="16"
                  :offset="4">
            <el-card style="padding: 0 20px 30px 0">
              <h3 style="text-align: center">虚拟机备份</h3>
              <div style="color: #979797">
                <p class="text-indent">欢迎使用信服易备虚拟机备份新手指引功能！</p>
                <p class="text-indent">
                  本操作将对<i-icon name="ip" class="ip"></i-icon>
                    <span class="ip-color">145.170.32.42</span>的生产设备下的虚拟机
                    <i-icon name="guide-vm" class="icon-class"></i-icon>
                    <span class="db-color">jy_windows2008_filebackup1_41</span>进行数据备份。
                </p>
                <p class="text-indent">
                  整个操作分四步完成，请点击下方确认按钮开始。
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
              <el-form :model="vmHost"
                        disabled
                        label-width="100px"
                        size="small">
                <span class="form-title">添加设备</span>
                  <el-form-item label="设备名">
                    <el-input v-model="vmHost.name"></el-input>
                  </el-form-item>
                  <el-form-item label="设备IP">
                    <el-input v-model="vmHost.hostIp"></el-input>
                  </el-form-item>
                  <el-form-item label="设备类型">
                    <el-radio-group v-model="vmHost.hostType">
                      <el-radio :label="1">生产环境</el-radio>
                      <el-radio :label="2">易备环境</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="存储方式"
                                prop="storeType">
                    <el-radio-group v-model.number="vmHost.storeType">
                      <el-radio v-for="type in Object.keys(storeTypeMapping)"
                                :key="type"
                                :label="Number(type)">{{ storeTypeMapping[type] }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="用途类型"
                                prop="databaseType">
                    <el-select v-model="vmHost.databaseType"
                              style="width: 100%">
                      <el-option v-for="db in Object.keys(databaseTypeMapping)"
                                  :key="db"
                                  :value="Number(db)"
                                  :label="databaseTypeMapping[db]"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="操作系统"
                                prop="osName">
                    <el-select v-model="vmHost.osName"
                              style="width: 100%"
                              placeholder="请选择">
                      <el-option v-for="(item, index) in ['Windows', 'Linux']"
                                :key="index"
                                :value="item"></el-option>
                    </el-select>
                  </el-form-item>
              </el-form>
              <el-button type="primary"
                        @click="active = 3"
                        class="fr"
                        size="small">下一步</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="active === 3" style="margin-top: 40px">
          <el-col :span="12"
                  :offset="6">
            <el-card class="form-card">
              <el-form :model="serverHost"
                        disabled
                        label-width="100px"
                        size="small">
                <span class="form-title">添加主机</span>
                  <el-form-item label="主机名：">
                      <el-input v-model="serverHost.serverName"></el-input>
                  </el-form-item>
                  <el-form-item label="选择设备：">
                    <el-input v-model="serverHost.hostName">
                      <el-button slot="append">...</el-button>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="主机IP：">
                    <el-input v-model="serverHost.serverIp"></el-input>
                  </el-form-item>
                  <el-form-item label="主机类型：">
                    <el-radio-group v-model="serverHost.serverType">
                      <el-radio v-for="(serverType, index) in serverTypeMapping[serverHost.vmType]"
                                :key="index"
                                :label="serverType">{{ virtualHostServerTypeMapping[serverType] }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="登录账号：">
                    <el-input v-model="serverHost.serverLoginName"></el-input>
                  </el-form-item>
                  <el-form-item label="登录密码：">
                    <el-input v-model="serverHost.serverPassword"
                              show-password></el-input>
                  </el-form-item>
              </el-form>
              <el-button type="primary"
                        @click="active = 4"
                        class="fr"
                        size="small">下一步</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="active === 4" style="padding: 0 80px">
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
                      @click="active = 5"
                      class="fr"
                      size="small"
                      style="margin-top: 20px">下一步</el-button>
        </el-row>
        <el-row v-show="active === 5" style="margin-top: 40px; padding: 0 20px;">
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
  virtuals
} from '@/utils/guide/vm-backup';
import {
  databaseTypeMapping,
  storeTypeMapping,
  serverTypeMapping,
  virtualHostServerTypeMapping,
  bootStateMapping
} from '@/utils/constant';

export default {
  name: 'VirtualBackup',
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
      virtuals
    };
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.virtualList.toggleAllSelection();
    });
  },
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
