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
          <div style="height: 200px;max-height: 200px;overflow: scroll;">
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
          <template v-if="hostLinkReadyToSwitch">
            <el-form :model="formData"
                     size="small"
                     label-position="left">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="临时IP"
                                label-width="4em">
                    <el-input v-model="formData.tempIp"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="默认网关"
                                label-width="5em">
                    <el-input v-model="formData.defaultGateway"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
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
        tempIp: '',
        defaultGateway: '',
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
      return (
        !this.password || !this.formData.tempIp || !this.formData.defaultGateway
      );
    },
  },
  methods: {
    switchModalClosed() {
      this.$emit('cancel');
    },
    cancelSwitch() {
      this.password = '';
      this.$emit('cancel');
    },
    confirmSwitch() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', this.formData);
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
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.switchModalName {
  display: inline-block;
  width: 10em;
}
.switchModalDetail {
  display: inline-block;
  width: 5em;
}
.switchModalIp {
  display: inline-block;
  width: 7em;
}
</style>
