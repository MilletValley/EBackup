<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="switchModalClosed"
               @open="switchModalOpend">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: scroll;">
            <!-- <div v-if="hostLinkReadyToSwitch"
                 :class="$style.switchIpTip">
              <span>{{ hostLinkReadyToSwitch && hostLinkReadyToSwitch.serviceIpMark | serviceIpMarkFilter }}</span>
              <span :class="$style.switchModalName">{{hostLinkReadyToSwitch.primaryHost.name}}</span>
              <div style="padding-top: 5px;">
                <div :class="$style.halfWidth">
                  <span>设备IP:</span>
                  <span :class="$style.hostIp">{{hostLinkReadyToSwitch.primaryHost.hostIp}}</span>
                </div>
                <div :class="$style.halfWidth">
                  <span>服务IP:</span>
                  <span :class="isServiceIpOK ? $style.serviceIpSuccess : $style.serviceIpError">{{hostLinkReadyToSwitch.primaryHost.serviceIp}}</span>
                </div>
              </div>
              <span v-show="!isServiceIpOK"
                    :class="$style.errorTip">服务IP不符合切换要求，进入
                <el-button type="text"
                           @click="$router.push({name: 'deviceManager'})">设备管理</el-button>修改！</span>
            </div> -->
            <h4>即将执行以下操作，请检查。</h4>
            <span v-if="!isServiceIpOK"
                  :class="$style.errorTip">服务IP不符合切换要求，进入
              <el-button type="text"
                         @click="$router.push({name: 'deviceManager'})">设备管理</el-button>修改！</span>
            <!-- 临时IP开始：Windows下 -->
            <div v-else-if="switchTempIp">
              <p>
                <p>
                  <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 1 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class=" hostLinkReadyToSwitch.serviceIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>的IP
                  <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.hostIp }}</span>与
                </p>
                <p>
                  <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 2 ? 'production-env' : 'ebackup-env'"
                        style="vertical-align: -0.3em;"></i-icon>
                  <span :class="hostLinkReadyToSwitch.serviceIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>的IP
                  <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.viceHost.hostIp }}</span>即将交换
                </p>
                <p>临时IP为：<span :class="$style.serviceIp">{{hostLinkReadyToSwitch.primaryHost.serviceIp }}</span><p>
              </p>
            </div>
            <!-- 临时IP结束 -->
            <!-- 服务IP开始：Linux下单机 -->
            <div v-else-if="switchServiceIp">
              <p>服务IP
                <span :class="$style.serviceIp">{{hostLinkReadyToSwitch.primaryHost.serviceIp }}</span> 将由</p>
              <p>
                <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 1 ? 'production-env' : 'ebackup-env'"
                        style="vertical-align: -0.3em;"></i-icon>
                <span :class=" hostLinkReadyToSwitch.serviceIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark | serviceIpMarkFilter }}</span>
                <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                <span style="width: 4em;">切换至</span>
                <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 2 ? 'production-env' : 'ebackup-env'"
                        style="vertical-align: -0.3em;"></i-icon>
                <span :class="hostLinkReadyToSwitch.serviceIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
              </p>
              <!-- <p>
                <span>{{ hostLinkReadyToSwitch && hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                <span>{{ hostLinkReadyToSwitch.serviceIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
              </p> -->
              <!-- <p>
                <span>生产环境</span>
                <span :class="$style.switchModalName">{{hostLinkReadyToSwitch.primaryHost.name}}</span>
                <el-tag size="mini">IP变更</el-tag>
                <span :class="$style.switchModalIp">{{hostLinkReadyToSwitch.primaryHost.hostIp}}</span>
                <i class="el-icon-caret-right"></i>
                <span :class="$style.switchModalIp">{{hostLinkReadyToSwitch.viceHost.hostIp}}</span>
              </p>
              <p>
                <span>易备环境</span>
                <span :class="$style.switchModalName">{{hostLinkReadyToSwitch.viceHost.name}}</span>
                <el-tag size="mini">IP变更</el-tag>
                <span :class="$style.switchModalIp">{{hostLinkReadyToSwitch.viceHost.hostIp}}</span>
                <i class="el-icon-caret-right"></i>
                <span :class="$style.switchModalIp">{{hostLinkReadyToSwitch.primaryHost.hostIp}}</span>
              </p> -->
            </div>
            <!-- 服务IP结束 -->
            <!-- scanIp、vip开始 -->
            <div v-else-if="switchIpInRac">
              <el-radio-group v-model="switchRacIp"
                              size="mini">
                <el-radio-button label="scanIp">scanIp</el-radio-button>
                <el-radio-button label="vip">VIP</el-radio-button>
              </el-radio-group>
              <div v-if="switchRacIp === 'scanIp'">
                <p>scanIp
                  <span :class="$style.serviceIp">{{hostLinkReadyToSwitch.primaryHost.serviceIp }}</span> 将由</p>
                <p>
                  <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 1 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class=" hostLinkReadyToSwitch.serviceIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                  <span style="width: 4em;">切换至</span>
                  <i-icon :name="hostLinkReadyToSwitch.serviceIpMark === 2 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class="hostLinkReadyToSwitch.serviceIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.serviceIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                </p>
              </div>
              <div v-else>
                <p>
                  VIP将从
                  <i-icon :name="hostLinkReadyToSwitch.vipIpMark === 1 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class=" hostLinkReadyToSwitch.vipIpMark === 1 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.vipIpMark | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.vipIpMark === 1 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                  <span style="width: 4em;">切换至</span>
                  <i-icon :name="hostLinkReadyToSwitch.vipIpMark === 2 ? 'production-env' : 'ebackup-env'"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class="hostLinkReadyToSwitch.vipIpMark === 2 ? $style.productionEnvColor : $style.ebackupEnvColor">{{ hostLinkReadyToSwitch.vipIpMark === 1 ? 2 : 1 | serviceIpMarkFilter }}</span>
                  <span :class="$style.switchModalName">{{ hostLinkReadyToSwitch.vipIpMark === 2 ? hostLinkReadyToSwitch.primaryHost.name : hostLinkReadyToSwitch.viceHost.name}}</span>
                </p>
                <!-- vip=>易备 -->
                <div v-if="hostLinkReadyToSwitch.vipIpMark === 1 ">
                  <p>
                    <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.vip }}</span>
                    <i-icon name="readySwitch"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.viceHost.hostIp }}</span>
                  </p>
                  <p v-for="primaryNode in hostLinkReadyToSwitch.primaryNodes"
                       :key="primaryNode.id">
                    <span :class="$style.productionEnvColor">{{ primaryNode.vip }}</span>
                    <i-icon name="readySwitch"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.viceHost.hostIp }}</span>
                  </p>
                </div>
                <!-- vip=>生产 -->
                <div v-else>
                  <p>
                    <span :class="$style.ebackupEnvColor">{{ hostLinkReadyToSwitch.primaryHost.vip }}</span>
                    <i-icon name="readySwitch"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.hostIp }}</span>
                  </p>
                  <p v-for="primaryNode in hostLinkReadyToSwitch.primaryNodes"
                       :key="primaryNode.id">
                    <span :class="$style.ebackupEnvColor">{{ primaryNode.vip }}</span>
                    <i-icon name="readySwitch"
                            style="vertical-align: -0.3em;"></i-icon>
                    <span :class="$style.productionEnvColor">{{ hostLinkReadyToSwitch.primaryHost.hostIp }}</span>
                  </p>
                </div>
              </div>
            </div>
            <!-- scanIp、vip结束 -->
            <!-- 单切开始 -->
            <div v-else-if="switchSimpleIp">
              <div v-if="osIsWindows(readyToSimpleSwitch.viceHost.osName)">
                <p>
                  <i-icon name="ebackup-env"
                          style="vertical-align: -0.3em;"></i-icon>
                  <span :class="$style.ebackupEnvColor">易备环境</span>
                  <span :class="$style.switchModalName">{{ readyToSimpleSwitch.viceHost.name }}</span>的IP将由
                </p>
                <p>
                  <span :class="$style.ebackupEnvColor">{{ simpleSwitchOriginIp(readyToSimpleSwitch) }}</span>
                  切换至
                  <span :class="$style.productionEnvColor">{{ simpleSwitchTargetIp(readyToSimpleSwitch) }}</span>
                </p>
              </div>
              <div v-else>
                <p>
                  服务IP: <span :class="$style.serviceIp">{{ simpleSwitchOriginIp(readyToSimpleSwitch) }}</span>将从
                </p>
                <p>
                  <span :class="readyToSimpleSwitch.serviceIpMark === 2 ? $style.ebackupEnvColor : $style.productionEnvColor">
                    <i-icon :name="readyToSimpleSwitch.serviceIpMark === 2 ? 'ebackup-env' : 'production-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    {{ readyToSimpleSwitch.serviceIpMark === 2 ? '易备环境' : '生产环境' }}
                  </span>
                  <span :class="$style.switchModalName">
                    {{ readyToSimpleSwitch.serviceIpMark === 2 ? readyToSimpleSwitch.viceHost.name : readyToSimpleSwitch.primaryHost.name }}
                  </span>
                  切换至
                  <span :class="readyToSimpleSwitch.serviceIpMark === 1 ? $style.ebackupEnvColor : $style.productionEnvColor">
                    <i-icon :name="readyToSimpleSwitch.serviceIpMark === 1 ? 'ebackup-env' : 'production-env'"
                            style="vertical-align: -0.3em;"></i-icon>
                    {{ readyToSimpleSwitch.serviceIpMark === 1 ? '易备环境' : '生产环境' }}
                  </span>
                  <span :class="$style.switchModalName">
                    {{ readyToSimpleSwitch.serviceIpMark === 1 ? readyToSimpleSwitch.viceHost.name : readyToSimpleSwitch.primaryHost.name }}
                  </span>
                </p>
              </div>
            </div>
            <!-- 单切结束 -->
            <!-- 切实例开始 -->
            <div v-if="databaseLinksReadyToSwitch.length > 0"
                 v-for="link in databaseLinksReadyToSwitch"
                 :key="link.id">
              <p v-if="!isSimpleSwitch">
                <span :class="$style.switchModalName">{{ link.primaryDatabase.name }}</span>
                <span :class="$style.switchModalDetail">{{ link.primaryDatabase.instanceName}}</span>
                <el-tag size="mini">角色变更</el-tag>
                <span>{{ link.primaryDatabase.role | databaseRoleFilter}}</span>
                <i class="el-icon-caret-right"></i>
                <span>{{ link.viceDatabase.role | databaseRoleFilter }}</span>
              </p>
              <p>
                <span :class="$style.switchModalName">{{ link.viceDatabase.name }}</span>
                <span :class="$style.switchModalDetail">{{ link.viceDatabase.instanceName}}</span>
                <el-tag size="mini">角色变更</el-tag>
                <span>{{ link.viceDatabase.role | databaseRoleFilter}}</span>
                <i class="el-icon-caret-right"></i>
                <span>{{ link.primaryDatabase.role | databaseRoleFilter}}</span>
              </p>
            </div>
            <!-- 切实例结束 -->
            <!-- 解除连接开始 -->
            <div v-if="isRemoveHostLink">
              <p>
                <span :class="$style.productionEnvColor">
                  <i-icon name="production-env"
                          style="vertical-align: -0.3em;"></i-icon>
                  {{ '生产环境' }}
                </span>
                <span :class="$style.switchModalName">
                  {{ readyToRemoveHostLink.primaryHost.name }}
                </span>
                与
                <span :class="$style.ebackupEnvColor">
                    <i-icon name="ebackup-env"
                            style="vertical-align: -0.3em;"></i-icon>
                    {{ '易备环境' }}
                  </span>
                  <span :class="$style.switchModalName">
                    {{ readyToRemoveHostLink.viceHost.name }}
                </span>的连接将被取消
              </p>
            </div>
            <!-- 解除连接结束 -->
          </div>
          <!-- <template v-if="hostLinkReadyToSwitch">
            <el-form :model="formData"
                     size="small"
                     label-position="left"
                     style="margin-top: 15px;">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="默认网关"
                                required
                                label-width="5.5em">
                    <el-input v-model="formData.defaultGateway"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="掩码"
                                label-width="3em">
                    <el-input v-model="formData.mask"
                              placeholder="默认掩码: 255.255.255.0"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template> -->
          <el-input type="password"
                    v-model="password"
                    placeholder="请输入用户密码以执行此操作"></el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="cancelSwitch">取消</el-button>
        <el-button type="primary"
                   :disabled="confirmBtnDisable"
                   :loading="btnLoading"
                   @click="confirmSwitch">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import IIcon from '../IIcon';
import { validatePassword } from '../../api/user';
import takeoverMixin from '../mixins/takeoverMixins';
export default {
  name: 'SwitchModal',
  mixins: [takeoverMixin],
  props: {
    visible: {
      type: Boolean,
    },
    hostLinkReadyToSwitch: {
      type: Object,
    },
    databaseLinksReadyToSwitch: {
      type: Array,
      default: [],
    },
    readyToSimpleSwitch: {
      type: Object
    },
    readyToRemoveHostLink: {
      type: Object
    },
    btnLoading: {
      type: Boolean,
    },
    isSimpleSwitch: {
      type: Boolean
    }
  },
  data() {
    return {
      password: '',
      switchRacIp: '',
      formData: {
        // tempIp: '',
        defaultGateway: '',
        mask: '',
      },
    };
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('cancel');
        }
      },
    },
    confirmBtnDisable() {
      return !this.password;
      // if (this.hostLinkReadyToSwitch) {
      //   return !this.password || !this.formData.defaultGateway;
      // } else return !this.password;
    },
    isServiceIpOK() {
      let res = true;
      if (!this.hostLinkReadyToSwitch) {
        return res;
      }
      if (this.hostLinkReadyToSwitch.serviceIpMark === 1) {
        // 服务IP属于生产设备
        if (!this.hostLinkReadyToSwitch.primaryHost.serviceIp) res = false;
        else if (
          this.hostLinkReadyToSwitch.primaryHost.hostIp ===
          this.hostLinkReadyToSwitch.primaryHost.serviceIp
        )
          res = false;
      } else if (this.hostLinkReadyToSwitch.serviceIpMark === 2) {
        // 服务IP属于易备设备
        if (!this.hostLinkReadyToSwitch.viceHost.serviceIp) res = false;
        else if (
          this.hostLinkReadyToSwitch.viceHost.hostIp ===
          this.hostLinkReadyToSwitch.viceHost.serviceIp
        )
          res = false;
      }
      return res;
    },
    // 切服务IP
    switchServiceIp() {
      return this.hostLinkReadyToSwitch&&
             this.hostLinkReadyToSwitch.primaryHost.osName==='Linux'&&
             this.hostLinkReadyToSwitch.primaryHost.isRacMark===1
    },
    // rac环境下的切IP
    switchIpInRac() {
      return this.hostLinkReadyToSwitch&&
             this.hostLinkReadyToSwitch.primaryHost.osName==='Linux'&&
             this.hostLinkReadyToSwitch.primaryHost.isRacMark===0
    },
    // 切临时IP
    switchTempIp() {
      return this.hostLinkReadyToSwitch&&this.hostLinkReadyToSwitch.primaryHost.osName==='Windows'
    },
    // 单切IP
    switchSimpleIp() {
      return this.readyToSimpleSwitch&&Object.keys(this.readyToSimpleSwitch).length>0
    },
    // 解除连接
    isRemoveHostLink() {
      return this.readyToRemoveHostLink&&Object.keys(this.readyToRemoveHostLink).length>0
    }
    // oppsiteServiceIpMark() {
    //   return this.hostLinkReadyToSwitch.serviceIpMark === 1 ? 2 : 1;
    // }
  },
  methods: {
    switchModalClosed() {
      this.password = '';
      this.switchRacIp = '';
      this.formData.mask = '';
      this.formData.defaultGateway = '';
      this.$emit('cancel');
    },
    switchModalOpend() {
      console.log(this.readyToRemoveHostLink);
      if(this.switchIpInRac) {
        this.switchRacIp = 'scanIp'
      }
    },
    cancelSwitch() {
      this.password = '';
      this.$emit('cancel');
    },
    confirmSwitch() {
      validatePassword(this.password)
        .then(() => {
          if (!this.formData.mask) this.formData.mask = '255.255.255.0';
          // this.$emit('confirm', this.formData);
          this.$emit('confirm', this.switchRacIp);
          this.password = '';
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
  components: {
    IIcon,
  },
};
</script>
<style lang="scss" module>
@import '../../style/color.scss';
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.switchIpTip {
  border-bottom: 1px solid #aaaaaa;
  padding-bottom: 5px;
}
.halfWidth {
  display: inline-block;
  width: 40%;
}
.switchModalName {
  display: inline-block;
  width: 8em;
  margin-left: 0.5em;
}
.switchModalDetail {
  display: inline-block;
  width: 5em;
}
.switchModalIp {
  display: inline-block;
  width: 7em;
}
.hostIp {
  composes: switchModalIp;
  text-align: center;
}
.serviceIp {
  composes: switchModalIp;
  padding: 0 0.6em;
  border-radius: 0.4em;
  color: #1b80c4;
  background-color: lighten(#1b80c4, 45%);
  text-align: center;
}
.serviceIpSuccess {
  composes: switchModalIp;
  margin-left: 0.5em;
  padding: 0 0.6em;
  border-radius: 0.4em;
  color: $success-color;
  background-color: lighten($success-color, 45%);
  text-align: center;
}
.serviceIpError {
  composes: serviceIpSuccess;
  color: $error-color;
  background-color: lighten($error-color, 45%);
}
.errorTip {
  color: $error-color;
}
.productionEnvColor {
  color: #31a17b;
}
.ebackupEnvColor {
  color: #c22b76;
}
</style>
