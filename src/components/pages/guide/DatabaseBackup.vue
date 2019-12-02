<template>
  <el-container style="height: 100%;">
    <el-header>
      <my-header></my-header>
    </el-header>
    <div id="box" @click.native="clickMain"  class="el-main custom-scrollbar">
      <div id="content">
        <el-steps :active="active"
                  finish-status="success"
                  align-center
                  class="step cp">
          <el-step title="开始"
                    @click.native="active = 1"></el-step>
          <el-step title="添加设备"
                    @click.native="active = 2"
                    description="通过添加生产设备对需进行备份的数据库所在的服务器进行管理"></el-step>
          <el-step title="添加数据库"
                    @click.native="active = 3"
                    description="添加单个生产设备下需要进行备份的数据库"></el-step>
          <el-step title="添加备份计划"
                    @click.native="active = 4"
                    description="进入数据库详情，点击“添加备份计划”来进行数据库计划备份"></el-step>
        </el-steps>
        <el-row v-show="active === 1">
          <el-col :span="16"
                  :offset="4">
            <el-card style="padding: 0 20px 30px 0">
              <h3 style="text-align: center">数据库备份</h3>
              <div style="color: #979797">
                <p class="text-indent">欢迎使用信服易备数据库备份新手指引功能！</p>
                <p class="text-indent">
                  本操作将对<i-icon name="ip" class="ip"></i-icon>
                    <span class="ip-color">145.170.32.1</span>的生产设备下的Oracle数据库
                    <i-icon name="guide-db" class="icon-class"></i-icon>
                    <span class="db-color">test12c</span>进行数据备份。
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
        <el-row v-show="[2, 3].includes(active)">
          <el-col :span="12"
                  :offset="6">
            <el-card class="form-card">
              <div v-show="active === 2">
                <el-form :model="primaryHost"
                          disabled
                          label-width="100px"
                          size="small">
                  <span class="form-title">添加设备</span>
                  <el-form-item label="设备名">
                    <el-input v-model="primaryHost.name"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <span slot="label">设备IP
                      <el-tooltip placement="top"
                                  content="用于做备份的生产设备">
                          <i class="el-icon-info"></i>
                      </el-tooltip>
                    </span>
                    <el-input v-model="primaryHost.hostIp"></el-input>
                  </el-form-item>
                  <el-form-item label="设备类型">
                    <el-radio-group v-model="primaryHost.hostType">
                      <el-radio :label="1">生产环境</el-radio>
                      <el-radio :label="2">易备环境</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="存储方式"
                                prop="storeType">
                    <el-radio-group v-model.number="primaryHost.storeType">
                      <el-radio v-for="type in Object.keys(storeTypeMapping)"
                                :key="type"
                                :label="Number(type)">{{ storeTypeMapping[type] }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="用途类型"
                                prop="databaseType">
                    <el-select v-model="primaryHost.databaseType"
                              style="width: 100%">
                      <el-option v-for="db in Object.keys(databaseTypeMapping)"
                                  :key="db"
                                  :value="Number(db)"
                                  :label="databaseTypeMapping[db]"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="操作系统"
                                prop="osName">
                    <el-select v-model="primaryHost.osName"
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
              </div>
              <div v-show="active === 3">
                <el-form :model="primaryDatabase"
                          label-width="100px"
                          size="small"
                          disabled>
                    <span class="form-title">添加数据库</span>
                    <el-form-item label="名称">
                      <el-input v-model="primaryDatabase.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <span slot="label">所属设备
                        <el-tooltip placement="top"
                                    content="生产设备" >
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                      </span>
                      <el-input v-model="primaryDatabase.hostIp"></el-input>
                    </el-form-item>
                    <el-form-item label="实例名">
                      <el-input v-model="primaryDatabase.instanceName"></el-input>
                    </el-form-item>
                    <el-form-item label="端口号">
                      <el-input v-model="primaryDatabase.dbPort"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库登录名">
                      <el-input v-model="primaryDatabase.loginName"></el-input>
                    </el-form-item>
                    <el-form-item label="数据库密码">
                      <el-input v-model="primaryDatabase.password"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary"
                          @click="active = 4"
                          class="fr"
                          size="small">下一步</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="active === 4" style="margin-top: 40px; padding: 0 20px;">
          <el-col :span="20"
                  :offset="2">
            <database-detail></database-detail>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-container>
</template>

<script>
import DatabaseDetail from '@/components/pages/guide/DatabaseDetail';
import IIcon from '@/components/IIcon';
import { primaryHost, primaryDatabase } from '@/utils/guide/database-backup';
import { pageMixin } from '@/components/mixins/guideMixins';
import { databaseTypeMapping, storeTypeMapping } from '@/utils/constant';
import MyHeader from '@/components/MyHeader';

export default {
  name: 'DatabaseBackup',
  mixins: [pageMixin],
  components: {
    DatabaseDetail,
    IIcon,
    MyHeader
  },
  data() {
    return {
      active: 1,
      primaryHost,
      primaryDatabase,
      clickMainShowMask: false,
      storeTypeMapping,
      databaseTypeMapping
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
    .explain {
      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
        label {
          width: 90px;
          color: #99a9bf;
        }
      }
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
