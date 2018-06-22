<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="switchModalClosed">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: scroll;">
            <div v-if="hostLinkReadyToSwitch"
                 :class="$style.switchIpTip">
              <span>生产环境设备</span>
              <span :class="$style.switchModalName">{{hostLinkReadyToSwitch.primaryHost.name}}</span>
              <div style="padding-top: 5px;">
                <div :class="$style.halfWidth">
                  <span>设备IP:</span>
                  <span :class="$style.hostIp">{{hostLinkReadyToSwitch.primaryHost.hostIp}}</span>
                </div>
                <div :class="$style.halfWidth">
                  <span>服务IP:</span>
                  <span :class="isIpSame ? $style.serviceIpError : $style.serviceIpSuccess">{{hostLinkReadyToSwitch.primaryHost.serviceIp}}</span>
                </div>
              </div>
              <span v-show="isIpSame"
                    :class="$style.errorTip">设备IP与服务IP不符合切换要求，进入
                <el-button type="text"
                           @click="$router.push({name: 'deviceManager'})">设备管理</el-button>修改！</span>
            </div>
            <h4>即将执行以下操作，请检查。</h4>
            <div v-if="hostLinkReadyToSwitch">
              <p>
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
              </p>
            </div>
            <div v-if="databaseLinksReadyToSwitch.length > 0"
                 v-for="link in databaseLinksReadyToSwitch"
                 :key="link.id">
              <p>
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
  },
  data() {
    return {
      password: '',
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
    isIpSame() {
      return (
        this.hostLinkReadyToSwitch.primaryHost.hostIp ===
        this.hostLinkReadyToSwitch.primaryHost.serviceIp
      );
    },
  },
  methods: {
    switchModalClosed() {
      this.password = '';
      this.formData.mask = '';
      this.formData.defaultGateway = '';
      this.$emit('cancel');
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
          this.$emit('confirm');
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
  width: 10em;
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
</style>
