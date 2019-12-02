<template>
  <el-container style="height: 100%;">
    <el-header>
      <my-header></my-header>
    </el-header>
    <div id="box" class="custom-scrollbar el-main"
              @click.native="clickMain">
      <div id="content">
        <el-steps :active="active"
                  finish-status="success"
                  align-center
                  class="step cp">
          <el-step title="开始"
                    @click.native="active = 1"></el-step>
          <el-step title="添加恢复设备"
                    @click.native="active = 2"
                    description="添加易备设备作为恢复机来进行异机恢复"></el-step>
          <el-step title="数据库列表"
                    @click.native="active = 3"
                    description="通过点击数据库名称选择需进行恢复的数据库"></el-step>
          <el-step title="添加恢复计划"
                    @click.native="active = 4"
                    description="可通过点击“添加恢复计划”进行计划恢复，或者选择备份集进行立即恢复"></el-step>
        </el-steps>
        <el-row v-show="active === 1">
          <el-col :span="16"
                  :offset="4">
            <el-card style="padding: 0 20px 30px 0">
              <h3 style="text-align: center">数据库恢复</h3>
              <div style="color: #979797">
                <p class="text-indent">欢迎使用信服易备数据库恢复新手指引功能！</p>
                <p class="text-indent">
                  本操作将对<i-icon name="ip" class="ip"></i-icon>
                    <span class="ip-color">145.170.32.1</span>的生产设备下的Oracle数据库
                    <i-icon name="guide-db" class="icon-class"></i-icon>
                    <span class="db-color">test12c</span>进行数据恢复。
                  用于恢复的易备设备是<span class="ip-color">145.170.32.103</span>。
                </p>
                <p class="text-indent">
                  整个操作分三步完成，请点击下方确认按钮开始。
                </p>
              </div>
              <el-button type="primary"
                          @click="active = 2"
                          class="fr"
                          size="small">下一步</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="active === 2">
          <el-col :span="12"
                  :offset="6">
            <el-card class="form-card">
              <el-form :model="viceHost"
                        label-width="100px"
                        size="small"
                        v-show="active === 2">
                <span class="form-title">添加设备</span>
                <el-form-item label="设备名">
                  <el-input v-model="viceHost.name"
                            disabled></el-input>
                </el-form-item>
                <el-form-item>
                  <span slot="label">设备IP
                      <el-tooltip placement="top"
                                  content="用于做恢复的易备设备" >
                          <i class="el-icon-info"></i>
                      </el-tooltip>
                  </span>
                  <el-input v-model="viceHost.hostIp"
                            disabled></el-input>
                </el-form-item>
                <el-form-item label="设备类型">
                  <el-radio-group v-model="viceHost.hostType"
                                  disabled>
                    <el-radio :label="1">生产环境</el-radio>
                    <el-radio :label="2">易备环境</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="存储方式"
                              prop="storeType">
                  <el-radio-group v-model.number="viceHost.storeType"
                                  disabled>
                    <el-radio v-for="type in Object.keys(storeTypeMapping)"
                              :key="type"
                              :label="Number(type)">{{ storeTypeMapping[type] }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="用途类型"
                              prop="databaseType">
                  <el-select v-model="viceHost.databaseType"
                              style="width: 100%"
                              disabled>
                    <el-option v-for="db in Object.keys(databaseTypeMapping)"
                                :key="db"
                                :value="Number(db)"
                                :label="databaseTypeMapping[db]"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="操作系统"
                              prop="osName">
                  <el-select v-model="viceHost.osName"
                              style="width: 100%"
                              disabled
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
        <el-row v-show="active === 3" style="padding: 0 80px">
          <h4 class="form-title">选择需要恢复的数据库</h4>
          <el-table :data="databases"
                    style="width: 100%"
                    size="small"
                    id="hostTable">
            <el-table-column label="名称"
                            min-width="200"
                            align="center">
              <template slot-scope="scope">
                <el-button type="text">
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="instanceName"
                              label="实例名"
                              min-width="150"
                              align="center"></el-table-column>
            <el-table-column prop="hostIp"
                              label="主机IP"
                              min-width="200"
                              align="center"></el-table-column>
            <el-table-column prop="dbPort"
                              label="端口号"
                              min-width="150"
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
            <database-detail></database-detail>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-container>
</template>

<script>
import DatabaseDetail from '@/components/pages/guide/DatabaseDetail';
import MyHeader from '@/components/MyHeader';
import { viceHost, primaryDatabase } from '@/utils/guide/database-backup';
import { pageMixin } from '@/components/mixins/guideMixins';
import {
  databaseTypeMapping,
  storeTypeMapping
} from '@/utils/constant';

export default {
  name: 'DatabaseRestore',
  mixins: [pageMixin],
  components: {
    DatabaseDetail,
    MyHeader
  },
  data() {
    return {
      active: 1,
      databaseTypeMapping,
      storeTypeMapping,
      viceHost,
      primaryDatabase,
      clickMainShowMask: false
    };
  },
  computed: {
    databases() {
      return [primaryDatabase];
    }
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
