<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="cancelBtn"
               @open="dialogOpen">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning"
                  class="switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px;overflow: scroll;">
            <h4>即将执行以下操作，请检查。</h4>
            <p v-if="Object.keys(readyToFailBackLink).length">
              <span class="targetEnvColor">
                  <i-icon name="virtual-target"
                          style="vertical-align: -0.3em;"></i-icon>
                  {{ '同步虚拟机' }}
                </span>
                <span class="syncVirtualName">
                  {{ readyToFailBackLink.targetVirtual.vmName }}
              </span>
              数据将恢复至
              <span class="sourceEnvColor">
                <i-icon name="virtual-source"
                        style="vertical-align: -0.3em;"></i-icon>
                {{ '源虚拟机' }}
              </span>
              <span class="syncVirtualName">
                {{ readyToFailBackLink.sourceVirtual.vmName }}
              </span>
            </p>
            时间点： <el-select v-model="timePoint"
                               :placeholder="`${loading ? '加载中...' : ''}`"
                               size="small"
                               :disabled="loading">
                      <el-option v-for="(point, index) in timePoints"
                                 :key="index"
                                 :label="point"
                                 :value="point">
                      </el-option>
                    </el-select>
          </div>
          <el-input type="password"
                    v-model="password"
                    placeholder="请输入用户密码以执行此操作"></el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="cancelBtn">取消</el-button>
        <el-button type="primary"
                   :disabled="confirmBtnDisable"
                   :loading="btnLoading"
                   @click="confirmBtn">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import IIcon from '@/components/IIcon';
import { validatePassword } from '@/api/user';
import { fetchTimePoints } from '@/api/virtuals';
export default {
  name: 'FailBackModal',
  props: ['visible', 'btnLoading', 'readyToFailBackLink'],
  components: {
    IIcon
  },
  data() {
    return {
      password: '',
      timePoint: '',
      loading: false,
      timePoints: []
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', false);
        }
      }
    },
    confirmBtnDisable() {
      return !this.password || !this.timePoint;
    }
  },
  methods: {
    cancelBtn() {
      this.modalVisible = false;
    },
    dialogOpen() {
      this.password = '';
      this.loading = true;
      fetchTimePoints(this.readyToFailBackLink.id)
        .then(res => {
          const { data: points } = res.data;
          this.timePoints = [].concat(points.sort((a, b) => a < b));
          this.timePoint = this.timePoints.length ? this.timePoints[0] : '';
          this.loading = false;
        })
        .catch(() => {
          this.$message.error(error);
        });
    },
    confirmBtn() {
      validatePassword(this.password)
        .then(() => {
          this.$emit('confirm', { link: this.readyToFailBackLink, timePoint: this.timePoint });
        })
        .catch(error => {
          this.$message.error(error);
        });
    }
  }
}
</script>
<style scoped>
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.sourceEnvColor {
  color: #31a17b;
}
.targetEnvColor {
  color: #c22b76;
}
.syncVirtualName {
  display: inline-block;
  min-width: 6em;
  margin-left: 0.5em;
}
</style>

