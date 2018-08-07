<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item v-show="enterFromMenu">
        <el-radio-group v-model="databaseType">
          <el-radio-button label="oracle">Oracle</el-radio-button>
          <el-radio-button label="sqlserver">SQLServer</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="!enterFromMenu"
                    style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: `${databaseType}List`})">数据库列表</el-button>
      </el-form-item>

      <el-form-item v-show="!enterFromMenu"
                    style="float: right;">
        <el-button type="primary"
                   @click="displayLinkCreateModal">添加</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button icon="el-icon-refresh"
                   @click="refreshData">刷新</el-button>
      </el-form-item>
    </el-form>
    <section style="clear: both;">
      <el-row>
        <el-col :span="10">
          <div :class="$style.envHeader">
            <h2>
              <i-icon name="production-env"
                      :class="$style.envIcon"></i-icon>
              <span>生产环境</span>
            </h2>
          </div>
        </el-col>
        <el-col :span="10"
                :offset="4">
          <div :class="$style.envHeader">
            <h2>
              <i-icon name="ebackup-env"
                      :class="$style.envIcon"></i-icon>
              <span>易备环境</span>
            </h2>
          </div>

        </el-col>
      </el-row>
      <div :class="$style.hostLinkContainer"
           v-for="hostLink in links"
           :key="hostLink.id">
        <el-row type="flex"
                justify="space-around">
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <div>
                <i-icon name="host-production"
                        :class="$style.hostIcon"></i-icon>
                <span>{{ hostLink.primaryHost.name }}</span>
              </div>
              <div>
                <i-icon name="ip"
                        :class="$style.hostIpIcon"></i-icon>
                <span :class="$style.hostIp">{{ hostLink.primaryHost.hostIp }}</span>
                <el-tooltip v-show="hostLink.serviceIpMark === 1 && hostLink.primaryHost.osName === 'Linux'"
                            placement="right"
                            effect="light">
                  <div slot="content">
                    提供服务中
                    <br/>服务IP：{{ hostLink.primaryHost.serviceIp }}
                  </div>
                  <i-icon :class="$style.serviceIcon"
                          name="service"></i-icon>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div :class="$style.hostSwitch">
              <div>
                <el-popover placement="right"
                            trigger="hover"
                            width="300"
                            :open-delay="200">
                  <!-- <el-form v-show="hostLink.primaryHost.osName==='Windows'"
                          size="mini"
                          label-width="70px"
                          style="margin: 5px 0 5px;border-bottom: 1px solid;">
                    <el-form-item :class="$style.switchFormItem"
                                  label="临时IP：">
                      <span>{{ hostLink.primaryHost.serviceIp }}</span>
                    </el-form-item>
                  </el-form> -->
                  <h4 style="margin: 5px 0; padding: 3px 0;">最近操作</h4>
                  <p v-if="!hostLink.latestSwitch || hostLink.latestSwitch.type === 1">暂无操作</p>
                  <el-form v-else-if="hostLink.latestSwitch.type === 2"
                           size="mini"
                           label-width="70px">
                    <el-form-item :class="$style.switchFormItem"
                                  label="切换内容">
                      <span>{{ hostLink.latestSwitch.content }}</span>
                    </el-form-item>
                    <el-form-item :class="$style.switchFormItem"
                                  label="切换方式">
                      <span>{{ hostLink.latestSwitch.manual | switchManualFilter }}</span>
                    </el-form-item>
                    <el-form-item :class="$style.switchFormItem"
                                  label="状态">
                      <el-tag :type="hostLink.latestSwitch.state === 2 ? 'success' : 'danger' "
                              size="mini">
                        {{ hostLink.latestSwitch.state | switchStateFilter }}
                      </el-tag>
                    </el-form-item>
                    <el-form-item :class="$style.switchFormItem"
                                  v-if="hostLink.latestSwitch.state !== 1"
                                  label="完成时间">
                      <span>{{ hostLink.latestSwitch.switchTime }}</span>
                    </el-form-item>
                  </el-form>
                  <el-form v-else-if="hostLink.latestSwitch.type === 3"
                           size="mini"
                           label-width="70px">
                    <el-form-item :class="$style.switchFormItem"
                                  label="解除信息">
                      <span>{{ hostLink.latestSwitch.content }}</span>
                    </el-form-item>
                    <el-form-item :class="$style.switchFormItem"
                                  label="状态">
                      <el-tag :type="switchStateStyle(hostLink.latestSwitch.state)"
                              size="mini">
                        {{ hostLink.latestSwitch.state | switchStateFilter }}
                      </el-tag>
                    </el-form-item>
                  </el-form>
                  <i-icon name="link"
                          :class="$style.hostSwitchIcon"
                          slot="reference"></i-icon>
                </el-popover>
              </div>
              <div v-if="hostLink.latestSwitch && hostLink.latestSwitch.state === 1 && hostLink.latestSwitch.type === 2"
                   style="margin-top: 12px;">
                <i class="el-icon-loading"></i>
                <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">切换IP中...</span>
              </div>
              <div v-else-if="hostLink.latestSwitch && hostLink.latestSwitch.state === 1 && hostLink.latestSwitch.type === 3"
                   style="margin-top: 12px;">
                <i class="el-icon-loading"></i>
                <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">解除连接中...</span>
              </div>
              <template v-else>
                <div style="margin: -3px 0 -6px;">
                  <el-button type="text"
                             :disabled="!hostLink.databaseLinks.some(dbLink => dbLink.primaryDatabase.role === 2)"
                             @click="switchMultiDatabasesToProduction(hostLink)">切主</el-button>
                  <el-button type="text"
                             @click="switchHostIp(hostLink)">切IP</el-button>
                  <el-button type="text"
                             :disabled="!hostLink.databaseLinks.some(dbLink => dbLink.viceDatabase.role === 2)"
                             @click="switchMultiDatabaseToEbackup(hostLink)">切备</el-button>
                </div>
                <div v-show="!enterFromMenu">
                  <el-button type="text"
                             @click="removeHostLink(hostLink)"
                             :class="$style.removeHostLink">解除连接</el-button>
                </div>
              </template>

            </div>
          </el-col>
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <div>
                <i-icon name="host-ebackup"
                        :class="$style.hostIcon"></i-icon>
                <span>{{ hostLink.viceHost.name }}</span>
                <el-tooltip v-show="hostLink.serviceIpMark === 2 && hostLink.viceHost.osName === 'Linux'"
                            placement="right"
                            effect="light">
                  <div slot="content">
                    提供服务中
                    <br/>服务IP：{{ hostLink.viceHost.serviceIp }}
                  </div>
                  <i-icon :class="$style.serviceIcon"
                          name="service"></i-icon>
                </el-tooltip>
              </div>
              <div>
                <i-icon name="ip"
                        :class="$style.hostIpIcon"></i-icon>
                <span :class="$style.hostIp">{{ hostLink.viceHost.hostIp }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 数据库连接的排列 -->
        <el-row v-for="dbLink in hostLink.databaseLinks"
                :key="dbLink.id">
          <el-col :span="10">
            <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
              <el-row type="flex"
                      align="middle">
                <el-col :span="8">
                  <h4>
                    <router-link :class="dbLink.primaryDatabase.role === 1 ? $style.primaryLink : $style.viceLink"
                                 :to="`/db/${databaseType}/${dbLink.primaryDatabase.id}`">
                      {{dbLink.primaryDatabase.name}}
                    </router-link>
                  </h4>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>{{instanceName}}</h5>
                  <p>{{ dbLink.primaryDatabase.instanceName }}</p>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>登录名</h5>
                  <p>{{ dbLink.primaryDatabase.loginName }}</p>
                </el-col>
                <el-col :span="3"
                        :class="$style.dbInfoCol">
                  <h5>状态</h5>
                  <p>
                    <el-tag :type="databaseStateStyle(dbLink.primaryDatabase.state)"
                            size="mini">{{ dbLink.primaryDatabase.state | databaseStateFilter }}</el-tag>
                  </p>
                </el-col>
                <el-col :span="3">
                  <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryRole : $style.viceRole">
                    <span style="font-size: 3vw;">{{ dbLink.primaryDatabase.role | databaseRoleFilter}}</span>
                  </div>
                </el-col>
              </el-row>

            </div>
          </el-col>
          <el-col :span="4">
            <div :class="$style.databaseSwitch">
              <el-popover placement="right"
                          trigger="hover"
                          width="300"
                          :open-delay="200">
                <el-form size="mini"
                         label-width="70px">
                  <el-form-item :class="$style.switchFormItem"
                                label="连接状态">
                    <el-tag :type="databaseLinkStateStyle(dbLink.state)"
                            size="mini">{{ dbLink.state | linkStateFilter }}</el-tag>
                  </el-form-item>
                  <el-form-item :class="$style.switchFormItem"
                                label="信息">
                    <span>{{ dbLink.errMsg }}</span>
                  </el-form-item>
                </el-form>
                <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">最近操作</h4>
                <p v-if="!dbLink.latestSwitch">暂无操作</p>
                <el-form v-else
                         size="mini"
                         label-width="70px">
                  <el-form-item :class="$style.switchFormItem"
                                label="切换内容">
                    <span>{{ dbLink.latestSwitch.content }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.switchFormItem"
                                label="切换方式">
                    <span>{{ dbLink.latestSwitch.manual | switchManualFilter }}</span>
                  </el-form-item>
                  <el-form-item :class="$style.switchFormItem"
                                label="状态">
                    <el-tag size="mini"
                            :type="switchStateStyle(dbLink.latestSwitch.state)">
                      {{ dbLink.latestSwitch.state | switchStateFilter }}
                    </el-tag>
                  </el-form-item>
                  <el-form-item :class="$style.switchFormItem"
                                v-if="dbLink.latestSwitch.state !== 1"
                                label="完成时间">
                    <span>{{ dbLink.latestSwitch.switchTime }}</span>
                  </el-form-item>
                </el-form>
                <i-icon :name="`switch-${dbLink.state}`"
                        :class="$style.switchIcon"
                        slot="reference"></i-icon>
              </el-popover>
              <div v-if="dbLink.latestSwitch && dbLink.latestSwitch.state === 1"
                   style="margin-top: 6px;">
                <i class="el-icon-loading"></i>
                <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">切换实例中...</span>
              </div>
              <div v-else>
                <el-button type="text"
                           @click="switchDatabase(dbLink.id)">切换实例</el-button>
                <el-button type="text"
                           @click="jumpToLinkDetail(dbLink.id)">查看详情</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
              <el-row type="flex"
                      align="middle">
                <el-col :span="8">
                  <h4>
                    <router-link :class="dbLink.viceDatabase.role === 1 ? $style.primaryLink : $style.viceLink"
                                 :to="`/db/${databaseType}/${dbLink.viceDatabase.id}`">
                      {{dbLink.viceDatabase.name}}
                    </router-link>
                  </h4>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>实例名</h5>
                  <p>{{ dbLink.viceDatabase.instanceName }}</p>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>登录名</h5>
                  <p>{{ dbLink.viceDatabase.loginName }}</p>
                </el-col>
                <el-col :span="3"
                        :class="$style.dbInfoCol">
                  <h5>状态</h5>
                  <p>
                    <el-tag :type="databaseStateStyle(dbLink.viceDatabase.state)"
                            size="mini">{{ dbLink.viceDatabase.state | databaseStateFilter }}</el-tag>
                  </p>
                </el-col>
                <el-col :span="3">
                  <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryRole : $style.viceRole">
                    <span style="font-size: 3vw;">{{ dbLink.viceDatabase.role | databaseRoleFilter}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
    <switch-modal :visible="switchModalVisible"
                  :host-link-ready-to-switch="hostLinkReadyToSwitch"
                  :database-links-ready-to-switch="databaseLinksReadyToSwitch"
                  @cancel="cancelSwitch"
                  :btn-loading="btnLoading"
                  @confirm="confirmSwitch"></switch-modal>
    <database-link-create-modal :production-hosts="availableProductionHosts"
                                :ebackup-hosts="availableEbackupHosts"
                                :visible.sync="linkCreateModalVisible"
                                :type="databaseType"
                                :btn-loading="btnLoading"
                                @confirm="createLink"></database-link-create-modal>
  </section>
</template>
<script>
import SwitchModal from '../modal/SwitchModal';
import IIcon from '@/components/IIcon';
import DatabaseLinkCreateModal from '@/components/modal/DatabaseLinkCreateModal';
import {
  fetchAll as fetchAllOracle,
  fetchLinks as fetchLinksOracle,
  createLinks as createLinksOracle,
  createSwitches as switchOracle,
} from '../../api/oracle';
import {
  fetchAll as fetchAllSqlserver,
  fetchLinks as fetchLinksSqlserver,
  createLinks as createLinksSqlserver,
  createSwitches as switchSqlserver,
} from '../../api/sqlserver';
import {
  createSwitches as switchHostIp,
  fetchAll,
  deleteLinks,
} from '../../api/host';
import { validatePassword } from '../../api/user';
import {
  databaseStateMapping,
  databaseRoleMapping,
  linkStateMapping,
  switchStateMapping,
  switchManualMapping,
} from '../../utils/constant';
import takeoverMixin from '../mixins/takeoverMixins';
// 模拟数据
import { items, links, hosts, hosts2 } from '../../utils/mock-data';

const fetchDatabaseMethod = {
  oracle: fetchAllOracle,
  sqlserver: fetchAllSqlserver,
};
const fetchLinksMethod = {
  oracle: fetchLinksOracle,
  sqlserver: fetchLinksSqlserver,
};
const createLinksMethod = {
  oracle: createLinksOracle,
  sqlserver: createLinksSqlserver,
};
const createSwitchMethod = {
  oracle: switchOracle,
  sqlserver: switchSqlserver,
};
export default {
  name: 'TakeOver',
  mixins: [takeoverMixin],
  data() {
    return {
      items: [], // 所有的数据库
      links: [], // 数据库连接
      linkCreateModalVisible: false,
      switchModalVisible: false,
      databaseLinkIdsReadyToSwitch: [],
      hostLinkIdReadyToSwitch: -1,
      btnLoading: false,
      timer: null,
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.setTimer(this.timer);
  },
  destroyed: function() {
    this.clearTimer(this.timer);
  },
  watch: {
    $route: function() {
      this.items = [];
      this.links = [];
      this.fetchData();
    },
  },
  computed: {
    databaseType: {
      get() {
        const path = this.$route.path;
        // /db/xxx/takeover
        return this.$route.path.substring(4, path.lastIndexOf('/'));
      },
      set(value) {
        this.$router.push({ name: `${value}TakeOverView` });
      },
    },
    // 无奈 0620
    // 判断是不是从菜单进入，有不同的展示形式
    enterFromMenu() {
      return this.$route.path.substring(1, 3) === 'db' ? false : true;
    },
    specialHosts() {
      if (this.databaseType === 'oracle') {
        // return hosts;
        return this.$store.getters.hostsWithOracle;
      } else if (this.databaseType === 'sqlserver') {
        // return hosts2;
        return this.$store.getters.hostsWithSqlServer;
      }
    },
    /**
      设备ID与其下数据库的对应关系
      hostId: {
        databases: [
          {database}, ...
        ]
      }
     */
    hostsDatabaseMap() {
      const res = {};
      this.specialHosts.forEach(host => {
        const databases = this.items.filter(db => db.host.id === host.id);
        res[host.id] = {
          databases,
        };
      });
      return res;
    },
    productionHosts() {
      return this.specialHosts.filter(host => host.hostType === 1);
    },
    ebackupHosts() {
      return this.specialHosts.filter(host => host.hostType === 2);
    },
    // 可以进行初始化连接操作的生产设备
    // 该设备下可能没有数据库／实例 需要进一步筛选
    availableProductionHosts() {
      return this.productionHosts
        .filter(
          host => !this.links.find(link => link.primaryHost.id === host.id)
        )
        .map(host => {
          const databases = this.hostsDatabaseMap[host.id].databases || [];
          return { databases, ...host };
        });
    },
    // 可以进行初始化连接操作的易备设备
    // 该设备可能有数据库／实例 需要进一步筛选
    availableEbackupHosts() {
      return this.ebackupHosts
        .filter(host => !this.links.find(link => link.viceHost.id === host.id))
        .map(host => {
          const databases = this.hostsDatabaseMap[host.id].databases || [];
          return { databases, ...host };
        });
    },
    databaseLinks() {
      return this.links.reduce((accumulator, hostLink) => {
        const links = hostLink.databaseLinks;
        const productionHost = hostLink.primaryHost;
        const ebackupHost = hostLink.viceHost;
        links.forEach(link => {
          link.primaryDatabase.host = productionHost;
          link.viceDatabase.host = ebackupHost;
        });
        return [...accumulator, ...links];
      }, []);
    },
    // 即将切换的数据库连接
    databaseLinksReadyToSwitch() {
      return this.databaseLinks.filter(
        link => this.databaseLinkIdsReadyToSwitch.indexOf(link.id) >= 0
      );
    },
    // 即将切换的设备连接
    hostLinkReadyToSwitch() {
      return this.links.find(
        hostLink => hostLink.id === this.hostLinkIdReadyToSwitch
      );
    },
    instanceName() {
      if (this.databaseType === 'oracle') {
        return '实例名';
      } else if (this.databaseType === 'sqlserver') {
        return '数据库名';
      }
    },
  },
  methods: {
    fetchData() {
      fetchDatabaseMethod[this.databaseType]()
        .then(res => {
          const { data } = res.data;
          this.items = data;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchLinksMethod[this.databaseType]()
        .then(res => {
          const { data: links } = res.data;
          this.links = links;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    refreshData() {
      const opt = {
        type: 'info',
        message: '正在更新中，请等待...',
        duration: 0,
      };
      const { close } = this.$message(opt);
      Promise.all([
        fetchDatabaseMethod[this.databaseType](),
        fetchLinksMethod[this.databaseType](),
      ])
        .then(resArr => {
          const { data } = resArr[0].data;
          const { data: links } = resArr[1].data;
          this.items = data;
          this.links = links;
        })
        .then(() => {
          opt.type = 'success';
          opt.message = '更新成功';
          setTimeout(close, 1000);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    displayLinkCreateModal() {
      this.linkCreateModalVisible = true;
    },
    cancelSwitch() {
      this.databaseLinkIdsReadyToSwitch = [];
      this.hostLinkIdReadyToSwitch = -1;
      this.switchModalVisible = false;
    },
    confirmSwitch(formData) {
      /**
       * 1.验证密码；
       * 2.判断是切换IP还是切换实例，调用不用的请求
       * 3.1.切换IP：修改该设备连接的最近切换记录
       * 3.2.切换实例：遍历修改数据库连接的最近切换记录（直接修改了计算属性的引用）
       */
      if (!!~this.hostLinkIdReadyToSwitch) {
        this.btnLoading = true;
        switchHostIp(this.hostLinkIdReadyToSwitch, formData)
          .then(res => {
            const { data } = res.data;
            this.links.find(
              link => link.id === this.hostLinkIdReadyToSwitch
            ).latestSwitch = data;
            this.switchModalVisible = false;
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = true;
        createSwitchMethod[this.databaseType]({
          linkIds: this.databaseLinkIdsReadyToSwitch,
        })
          .then(res => {
            const { data } = res.data;
            // 修改的是computed数据的引用，引用指向的就是data中的数据
            this.databaseLinks.forEach(link => {
              if (this.databaseLinkIdsReadyToSwitch.includes(link.id)) {
                link.latestSwitch = data.find(s => s.linkId === link.id);
              }
            });
            this.switchModalVisible = false;
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.btnLoading = false;
          });
      }
    },
    switchDatabase(databaseLinkId) {
      this.databaseLinkIdsReadyToSwitch = [databaseLinkId];
      this.switchModalVisible = true;
    },
    switchMultiDatabasesToProduction(hostLink) {
      const links = hostLink.databaseLinks
        .filter(dbLink => dbLink.primaryDatabase.role === 2)
        .map(dbLink => dbLink.id);
      this.databaseLinkIdsReadyToSwitch = links;
      this.switchModalVisible = true;
    },
    switchMultiDatabaseToEbackup(hostLink) {
      const links = hostLink.databaseLinks
        .filter(dbLink => dbLink.viceDatabase.role === 2)
        .map(dbLink => dbLink.id);
      this.databaseLinkIdsReadyToSwitch = links;
      this.switchModalVisible = true;
    },
    switchHostIp(hostLink) {
      this.hostLinkIdReadyToSwitch = hostLink.id;
      this.switchModalVisible = true;
    },
    switchModalClosed() {
      this.databaseLinkIdsReadyToSwitch = [];
      this.hostLinkIdReadyToSwitch = -1;
    },
    jumpToLinkDetail(linkId) {
      if (this.databaseType === 'oracle') {
        this.$router.push({
          name: 'oracleLinkDetail',
          params: { id: String(linkId) },
        });
      } else if (this.databaseType === 'sqlserver') {
        this.$router.push({
          name: 'sqlserverLinkDetail',
          params: { id: String(linkId) },
        });
      }
    },
    createLink(data) {
      this.btnLoading = true;
      createLinksMethod[this.databaseType](data)
        .then(res => {
          const { data: link } = res.data;
          this.linkCreateModalVisible = false;
          this.links.push(link);
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.btnLoading = false;
        });
    },
    removeHostLink(hostLink) {
      this.$confirm('此操作将取消设备连接，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteLinks(hostLink.id)
            .then(res => {
              // this.links.splice(
              //   this.links.findIndex(link => link.id === hostLink.id),
              //   1
              // );
              // this.$message.success('连接解除成功');
              const { data: cancelOperation } = res.data;
              this.links.find(
                link => link.id === hostLink.id
              ).latestSwitch = cancelOperation;
              this.$message.info('正在尝试解除连接，请等待');
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(error => {});
    },
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        Promise.all([
          fetchDatabaseMethod[this.databaseType](),
          fetchLinksMethod[this.databaseType](),
        ]).then(resArr => {
          const { data } = resArr[0].data;
          const { data: links } = resArr[1].data;
          this.items = data;
          this.links = links;
        });
      }, 20000);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
  },

  components: {
    IIcon,
    SwitchModal,
    DatabaseLinkCreateModal,
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
@import '../../style/color.scss';
$primary-color: #409eff;
$vice-color: #6d6d6d;

.envHeader {
  text-align: center;
  h2 {
    margin: 5px 0;
  }
}
.envIcon {
  vertical-align: -0.3em;
}
.hostIcon {
  vertical-align: -0.3em;
  width: 2em;
}

.hostLinkContainer {
  padding: 5px;
  margin: 10px 0;
  // border: 1px solid #ababab;
  border-radius: 5px;
  background-color: #ffffff;
}
.hostInfo {
  text-align: center;
  margin: 1em 0;
}
.serviceIcon {
  position: absolute;
  margin-left: 30px;
  margin-top: -0.5em;
  width: 2em;
  height: 2em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.hostIpIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.3em;
  margin-top: 10px;
}
.hostIp {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
}
.hostSwitch {
  text-align: center;
  margin: 5px 0 0;
}
.removeHostLink {
  color: $delete-color;
  padding: 2px 0 3px;
  &:focus {
    color: $delete-color;
  }
  &:hover {
    color: lighten($delete-color, 10%);
  }
}
.primaryDatabaseInfo {
  border: 1px solid $primary-color;
  border-radius: 5px;
  transition: box-shadow 0.5s;
  &:hover {
    box-shadow: 0px 0px 2px 1px $primary-color;
  }
}
.viceDatabaseInfo {
  border: 1px solid $vice-color;
  border-radius: 5px;
  transition: box-shadow 0.5s;
  &:hover {
    box-shadow: 0px 0px 2px 1px $vice-color;
  }
}

.primaryDatabaseInfo,
.viceDatabaseInfo {
  padding: 5px 0 5px 10px;
  margin: 8px 0;
  min-height: 100px;
}
.dbInfoCol {
  text-align: center;
  h5 {
    margin: 10px 0;
  }
  p {
    margin: 8px 0;
  }
}
.databaseSwitch {
  text-align: center;
  margin: 20px 0;
}
.primaryRole {
  text-align: center;
  background-color: $primary-color;
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px -1px;
  border-radius: 0 3px 3px 0;
}
.viceRole {
  text-align: center;
  background-color: $vice-color;
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px -1px;
  border-radius: 0 3px 3px 0;
}
.hostSwitchIcon {
  width: 3em;
  height: 1.4em;
  // cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.switchIcon {
  width: 3em;
  height: 3em;
  // cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.dbLinkInfoItem {
  margin-bottom: 10px;
  label {
    display: inline-block;
    padding-right: 12px;
    text-align: right;
    color: #a0a0a0;
    width: 58px;
  }
}
.switchFormItem {
  margin-bottom: 5px !important;
  label {
    color: #a0a0a0;
  }
}

// 切换modal
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
