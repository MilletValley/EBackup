<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item v-show="enterFromMenu">
        <el-radio-group v-model="type" size="small">
          <el-radio label="vmware" border>VMware</el-radio>
          <el-radio label="hyperV" border>Hyper-V</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="!enterFromMenu"
                    style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: `${type}CollectManager`})">虚拟机主机</el-button>
      </el-form-item>
    </el-form>
    <section style="clear: both">
      <el-row>
        <el-col :span="10">
          <div class="env-header">
            <h2 class="header-title">
              <i-icon name="virtual-source"
                      class="envIcon"></i-icon>
              <span>源虚拟机</span>
            </h2>
          </div>
        </el-col>
        <el-col :span="10"
                :offset="4">
          <div class="env-header">
            <h2 class="header-title">
              <i-icon name="virtual-target"
                      class="envIcon"></i-icon>
              <span>同步虚拟机</span>
            </h2>
          </div>
        </el-col>
      </el-row>
      <div class="linkContainer">
        <div v-for="link in links"
            :key="link.id"
            style="position: relative">
          <el-row>
            <el-col :span="10">
              <div class="sourceVirtualInfo">
                <el-row type="flex"
                        align="middle">
                  <el-col :span="8"
                          class="virtualInfoCol">
                    <h4>
                      <router-link :to="`/virtual/${type}/${link.sourceVirtual.id}`"
                                   :class="$style.primaryLink">
                        {{ link.sourceVirtual.vmName }}
                      </router-link>
                    </h4>
                  </el-col>
                  <el-col :span="8"
                          class="virtualInfoCol">
                    <h4>IP地址</h4>
                    <p>{{ link.sourceVirtual.ip | ipFilter }}</p>
                  </el-col>
                  <el-col :span="8"
                          class="virtualInfoCol">
                    <h4>所属物理主机</h4>
                    <p>{{ link.sourceVirtual.vmHostName }}</p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="virtualSync">
                <el-popover placement="right"
                            trigger="hover"
                            width="300"
                            :open-delay="200">
                  <el-form size="mini"
                           label-width="100px">
                    <el-form-item class="syncFormItem"
                                  label="连接状态">
                      <el-tag :type="link.state | linkStateStyleFilter"
                              size="mini">{{ link.state | linkStateFilter }}</el-tag>
                    </el-form-item>
                    <el-form-item class="syncFormItem"
                                  label="信息"
                                  v-if="link.linkMessage">
                      <span>{{ link.linkMessage }}</span>
                    </el-form-item>
                  </el-form>
                  <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">同步策略</h4>
                  <el-form size="mini"
                           label-width="100px">
                    <el-form-item label="同步策略"
                                  class="syncFormItem">
                      <span>{{ link.strategyConfig.syncTimeStrategy | syncStrategyFilter }}</span>
                    </el-form-item>
                    <el-form-item label="同步周期"
                                  class="syncFormItem"
                                  v-if="[1, 2].includes(link.strategyConfig.syncTimeStrategy)">
                      <span>{{ link.strategyConfig.syncTimeInterval  }}{{ link.strategyConfig.syncTimeStrategy === 1 ? '分钟' : '小时' }}</span>
                    </el-form-item>
                    <el-form-item label="星期"
                                  class="syncFormItem"
                                  v-if="link.strategyConfig.syncTimeStrategy === 4">
                      <el-tag class="infoTag"
                              v-for="week in link.strategyConfig.weekDays"
                              :key="week"
                              size="mini">{{ weekMapping[week] }}</el-tag>
                    </el-form-item>
                    <el-form-item label="时间"
                                  class="syncFormItem"
                                  v-if="[3, 4].includes(link.strategyConfig.syncTimeStrategy)">
                      <el-tag class="infoTag"
                              size="mini">{{ link.strategyConfig.syncRunTime }}</el-tag>
                    </el-form-item>
                    <!-- <el-form-item label="下次同步时间"
                                  class="syncFormItem"
                                  v-if="[3, 4].includes(link.strategyConfig.syncTimeStrategy)">
                      <span>{{ link.strategyConfig.nextSyncTime }}</span>
                    </el-form-item> -->
                  </el-form>
                  <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">上次同步状态</h4>
                  <p v-if="!link.latestSyncInfo">暂无</p>
                  <el-form size="mini"
                           label-width="100px"
                           v-else>
                    <el-form-item class="syncFormItem"
                                  label="同步状态">
                      <el-tag :type="link.latestSyncInfo.state | syncStateStyleFilter"
                              size="mini">{{ link.latestSyncInfo.state | syncStateFilter }}</el-tag>
                    </el-form-item>
                    <el-form-item class="syncFormItem"
                                  label="时间">
                      <span>{{ link.latestSyncInfo.time }}</span>
                    </el-form-item>
                    <el-form-item class="syncFormItem"
                                  label="信息"
                                  v-if="link.latestSyncInfo.content">
                      <span>{{ link.latestSyncInfo.content }}</span>
                    </el-form-item>
                  </el-form>
                  <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                       v-if="link.state === 2">
                      <div class="rightMask"></div>
                      <i-icon :name="link.state | linkIconFilter"
                              class="linkIcon"></i-icon>
                    </div>
                  <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                       v-else-if="[1, 3].includes(link.state)">
                      <div class="leftMask"></div>
                      <i-icon :name="link.state | linkIconFilter"
                              class="linkIcon"></i-icon>
                  </div>
                  <i-icon :name="link.state | linkIconFilter"
                          slot="reference"
                          class="linkIcon"
                          v-else></i-icon>
                </el-popover>
                <div>
                  <div>
                    <el-button type="text"
                               class="deleteLink"
                               @click="deleteLink(link)">解除连接</el-button>
                  </div>
                  <div>
                    <el-dropdown>
                      <span class="dropdownLink">
                        同步操作<i class="el-icon-arrow-down el-icon--right" style="font-size: 12px; margin-left: 0"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="failOverLink(link)">故障转移</el-dropdown-item>
                        <el-dropdown-item @click.native="failBackLink(link)">故障恢复</el-dropdown-item>
                        <el-dropdown-item @click.native="updateStrategy(link)">修改策略</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="text" @click="jumpToLinkDetail(link)">查看详情</el-button>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="targetVirtualInfo">
                <el-row type="flex"
                        align="middle">
                  <el-col :span="8"
                          class="virtualInfoCol">
                    <h4>
                      {{ link.targetVirtual.vmName }}
                    </h4>
                  </el-col>
                  <el-col :span="8"
                          class="virtualInfoCol">
                    <h4>IP地址</h4>
                    <p>{{ link.targetVirtual.ip | ipFilter }}</p>
                  </el-col>
                  <el-col :span="8"
                          class="virtualInfoCol">
                    <h4>所属物理主机</h4>
                    <p>{{ link.targetVirtual.vmHostName }}</p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </section>
    <delete-link-modal :visible.sync="deleteLinkModalVisible"
                       :btn-loading="btnLoading"
                       :ready-to-delete-link="readyToDeleteLink"
                       @confirm="deleteLinkConfirm"></delete-link-modal>
    <fail-over-modal :visible.sync="failOverModalVisible"
                     :btn-loading="btnLoading"
                     :ready-to-fail-over-link="readyToFailOverLink"
                     @confirm="failOverConfirm"></fail-over-modal>
    <fail-back-modal :visible.sync="failBackModalVisible"
                     :btn-loading="btnLoading"
                     :ready-to-fail-back-link="readyToFailBackLink"
                     @confirm="failBackConfirm"></fail-back-modal>
    <update-link-strategy-modal :visible.sync="updateLinkStrategyModalVisible"
                                :btn-loading="btnLoading"
                                :source-data="readyToUpdateStrategy"
                                @confirm="updateLinkStrategyConfirm"></update-link-strategy-modal>
  </section>
</template>

<script>
import IIcon from '@/components/IIcon';
import DeleteLinkModal from '@/components/pages/virtual/takeover/DeleteLinkModal';
import FailOverModal from '@/components/pages/virtual/takeover/FailOverModal';
import FailBackModal from '@/components/pages/virtual/takeover/FailBackModal';
import UpdateLinkStrategyModal from '@/components/pages/virtual/takeover/UpdateLinkStrategyModal';
import {
  fetchLinks,
  deleteLink,
  failOverLink,
  failBackLink,
  modifyLinkStrategy
} from '@/api/virtuals';
import {
  virtualMapping,
  syncLinkMapping,
  syncStragegyMapping,
  weekMapping,
  syncStateMapping,
} from '@/utils/constant';

export default {
  name: 'TakeOver',
  components: {
    IIcon,
    DeleteLinkModal,
    FailOverModal,
    FailBackModal,
    UpdateLinkStrategyModal
  },
  data() {
    return {
      items: [],
      btnLoading: false,
      deleteLinkModalVisible: false,
      failOverModalVisible: false,
      failBackModalVisible: false,
      updateLinkStrategyModalVisible: false,
      readyToDeleteLink: {},
      readyToFailOverLink: {},
      readyToFailBackLink: {},
      readyToUpdateStrategy: {},
      weekMapping
    }
  },
  created() {
    this.fetchData();
  },
  filters: {
    ipFilter(value) {
      return value ? value : '暂无';
    },
    linkStateFilter(type) {
      return syncLinkMapping[type];
    },
    syncStrategyFilter(type) {
      return syncStragegyMapping[type];
    },
    linkStateStyleFilter(type) {
      switch(type) {
        case 0:
        case 1:
          return 'warning';
        case 2:
        case 3:
          return 'danger';
        default:
          return 'primary';
      }
    },
    syncStateStyleFilter(state) {
      if(state === 0) {
        return 'success';
      } else if (state === 1) {
        return 'danger';
      } else if (state === 2) {
        return 'warning';
      }
      return 'primary';
    },
    syncStateFilter(state) {
      return syncStateMapping[state];
    },
    linkIconFilter(state) {
      switch(state) {
        case 0:
          return 'switch-1';
        case 1:
          return 'transportationRight';
        case 2:
          return 'transportationRight-warning';
        case 3:
          return 'transportationLeft-warning';
        case 4:
          return 'switch-3';
        default:
          return '';
      }
    }
  },
  computed: {
    enterFromMenu() {
      return this.$route.path.split('/')[1] === 'virtual' ? false : true;
    },
    type: {
      get() {
        const path = this.$route.path;
        return this.$route.path.split('/')[2];
      },
      set(value) {
        this.$router.push({ name: `${value}TakeOverView` });
      },
    },
    vmType() {
      return Number(Object.keys(virtualMapping).find(type => virtualMapping[type] === this.type));
    },
    links() {
      return this.items.filter(item => item.sourceVirtual.type === this.vmType);
    }
  },
  methods: {
    fetchData() {
      fetchLinks()
        .then(res => {
          const { data } = res.data;
          this.items = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    deleteLink(link) {
      this.deleteLinkModalVisible = true;
      this.readyToDeleteLink = link;
    },
    failOverLink(link) {
      this.failOverModalVisible = true;
      this.readyToFailOverLink = link;
    },
    failBackLink(link) {
      this.failBackModalVisible = true;
      this.readyToFailBackLink = link;
    },
    jumpToLinkDetail(link) {
      this.$router.push({
        name:  `${this.type}LinkDetail`,
        params: { id: link.id },
      });
    },
    updateStrategy(link) {
      const { nextSyncTime, ...configs } = link.strategyConfig;
      this.updateLinkStrategyModalVisible = true;
      this.readyToUpdateStrategy = { ...configs, id: link.id };
    },
    deleteLinkConfirm(link) {
      this.btnLoading = true;
      deleteLink(link.id)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.deleteLinkModalVisible = false;
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    failOverConfirm(data) {
      const { link, timePoint } = data;
      this.btnLoading = true;
      failOverLink(link.id, timePoint)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.failOverModalVisible = false;
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    failBackConfirm(data) {
      const { link, timePoint } = data;
      this.btnLoading = true;
      failBackLink(link.id, timePoint)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.failBackModalVisible = false;
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    },
    updateLinkStrategyConfirm(data) {
      this.btnLoading = true;
      const { id, ...configs} = data;
      modifyLinkStrategy(id, configs)
        .then(res => {
          const { message } = res.data;
          this.$message.success(message);
          this.updateLinkStrategyModalVisible = false;
          this.fetchData();
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        })
    }
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
</style>

<style scoped>
.env-header {
  text-align: center;
}
.header-title {
  margin: 5px 0;
}
.envIcon {
  vertical-align: -0.3em;
}
.linkContainer {
  margin: 10px 0;
  border-radius: 5px;
  background-color: #ffffff;
}
.sourceVirtualInfo {
  border: 1px solid #409eff;
}
.targetVirtualInfo {
  border: 1px solid #6d6d6d;
}
.sourceVirtualInfo:hover {
  box-shadow: 0px 0px 2px 1px #409eff;
}
.targetVirtualInfo:hover {
  box-shadow: 0px 0px 2px 1px #6d6d6d;
}
.sourceVirtualInfo,
.targetVirtualInfo {
  border-radius: 5px;
  transition: box-shadow 0.5s;
  padding: 5px 0 5px 10px;
  margin: 8px 0;
  min-height: 100px;
}
.virtualInfoCol {
  text-align: center;
}
.virtualSync {
  text-align: center;
  margin: 20px 0;
}
.syncFormItem {
  margin-bottom: 5px !important;
}
.syncFormItem label {
  color: #a0a0a0;
}
.infoTag {
  margin: 0 2px;
}
.linkIcon {
  width: 3em;
  height: 3em;
  transition: all 0.5s ease;
}
.linkIcon:hover {
  transform: scale(1.2);
}
.deleteLink {
  color: rgb(223, 77, 77);
  padding: 2px 0 3px;
}
.deleteLink:hover {
  color: lighten(rgb(223, 77, 77), 10%);
  transform:scale(1.2);
}
.dropdownLink {
  cursor: pointer;
  color: #409EFF;
}
.rightMask,
.leftMask {
  animation: move 2s infinite;
  position: absolute;
  height: 3em;
  width: 100px;
  right: -20px;
  background: #fff;
}
.leftMask {
  left: -20px;
}
@keyframes move {
  from {
    width: 100px;
  }
  to {
    width: 0;
  }
}
</style>
