<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item style="float: right;">
        <el-button type="info"
                   @click="$router.push({name: 'oracleList'})">数据库列表</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="displayLinkCreateModal">添加</el-button>
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
              <i-icon name="host-production"
                      :class="$style.hostIcon"></i-icon>
              <span>{{ hostLink.primaryHost.name }}</span>
              <el-tag size="small">{{ hostLink.primaryHost.hostIp }}</el-tag>
            </div>
          </el-col>
          <el-col :span="4">
            <div :class="$style.hostSwitch">
              <div>
                <el-popover placement="right"
                            trigger="hover"
                            width="300"
                            :open-delay="200">
                  <h4 style="margin: 5px 0; padding: 3px 0;">最近操作</h4>
                  <el-form size="mini"
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
                  <i-icon name="link"
                          :class="$style.hostSwitchIcon"
                          slot="reference"></i-icon>
                </el-popover>
              </div>
              <div v-if="hostLink.latestSwitch.state === 1"
                   style="margin-top: 6px;">
                <i class="el-icon-loading"></i>
                <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">切换IP中...</span>
              </div>
              <div v-else>
                <el-button type="text"
                           :disabled="!hostLink.databaseLinks.some(dbLink => dbLink.primaryDatabase.role === 2)"
                           @click="switchMultiDatabasesToProduction(hostLink)">切主</el-button>
                <el-button type="text"
                           @click="switchHostIp(hostLink)">切IP</el-button>
                <el-button type="text"
                           :disabled="!hostLink.databaseLinks.some(dbLink => dbLink.viceDatabase.role === 2)"
                           @click="switchMultiDatabaseToEbackup(hostLink)">切备</el-button>
              </div>

            </div>
          </el-col>
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <i-icon name="host-ebackup"
                      :class="$style.hostIcon"></i-icon>
              <span>{{ hostLink.viceHost.name }}</span>
              <el-tag size="small">{{ hostLink.viceHost.hostIp }}</el-tag>
            </div>
          </el-col>
        </el-row>
        <el-row v-for="dbLink in hostLink.databaseLinks"
                :key="dbLink.id">
          <el-col :span="10">
            <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
              <el-row type="flex"
                      align="middle">
                <el-col :span="8">
                  <h4>
                    {{ dbLink.primaryDatabase.name }}
                  </h4>
                </el-col>
                <el-col :span="5"
                        :class="$style.dbInfoCol">
                  <h5>实例名</h5>
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
                  <div :class="dbLink.primaryDatabase.role === 1 ? $style.primaryRole : $style.viceRole">{{ dbLink.primaryDatabase.role | databaseRoleFilter}}</div>
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
                <label>连接状态</label>
                <el-tag :type="databaseLinkStateStyle(dbLink.state)"
                        style="margin-left: 10px"
                        size="mini">{{ dbLink.state | linkStateFilter }}</el-tag>
                <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">最近操作</h4>
                <el-form size="mini"
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
              <div v-if="dbLink.latestSwitch.state === 1"
                   style="margin-top: 6px;">
                <i class="el-icon-loading"></i>
                <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">切换实例中...</span>
              </div>
              <div v-else>
                <el-button type="text"
                           @click="switchDatabase(dbLink.id)">切换实例</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryDatabaseInfo : $style.viceDatabaseInfo">
              <el-row type="flex"
                      align="middle">
                <el-col :span="8">
                  <h4>
                    {{ dbLink.viceDatabase.name }}
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
                  <div :class="dbLink.viceDatabase.role === 1 ? $style.primaryRole : $style.viceRole">{{ dbLink.viceDatabase.role | databaseRoleFilter}}</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
    <el-dialog :visible.sync="switchModalVisible"
               @close="switchModalClosed">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning"
                  :class="$style.switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 200px;max-height: 200px;">
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
                <span :class="$style.switchModalIp">{{hostLinkReadyToSwitch.viceHost.hostIp}}</span>
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

          <el-input type="password"
                    v-model="password"
                    placeholder="请输入用户密码以执行此操作"></el-input>
        </el-col>
      </el-row>

      <span slot="footer">
        <el-button @click="cancelSwitch">取消</el-button>
        <el-button type="primary"
                   :disabled="!this.password"
                   @click="confirmSwitch">确定</el-button>
      </span>
    </el-dialog>
    <database-link-create-modal :production-hosts="availableProductionHosts"
                                :ebackup-hosts="availableEbackupHosts"
                                :visible.sync="linkCreateModalVisible"></database-link-create-modal>
  </section>
</template>
<script>
import IIcon from '@/components/IIcon';
import DatabaseLinkCreateModal from '@/components/modal/DatabaseLinkCreateModal';
import {
  fetchAll,
  fetchLinks,
  createLinks,
  createSwitches as switchOracle,
} from '../../api/oracle';
import { createSwitches as switchHostIp } from '../../api/host';
import { validatePassword } from '../../api/user';
import {
  databaseStateMapping,
  databaseRoleMapping,
  linkStateMapping,
  switchStateMapping,
  switchManualMapping,
} from '../../utils/constant';
// 模拟数据
import { items, links, oracleHosts } from '../../utils/mock-data';
export default {
  name: 'OracleTakeOver',
  data() {
    return {
      items,
      links,
      linkCreateModalVisible: false,
      switchModalVisible: false,
      databaseLinkIdsReadyToSwitch: [],
      hostLinkIdReadyToSwitch: -1,
      password: '',
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    oracleHosts() {
      return oracleHosts;
      // return this.$store.getters.hostsWithOracle;
    },
    // 设备ID与其下Oracle的对应关系
    hostsWithOracle() {
      const res = {};
      this.oracleHosts.forEach(host => {
        const databases = this.items.filter(db => db.host.id === host.id);
        res[host.id] = {
          databases,
        };
      });
      return res;
      // return this.items.reduce((accumulator, db) => {
      //   const { host, ...info } = db;
      //   if (accumulator[db.host.id]) {
      //     accumulator[db.host.id].databases.push(info);
      //   } else {
      //     accumulator[db.host.id] = {
      //       databases: [info],
      //     };
      //   }
      //   return accumulator;
      // }, {});
    },
    productionOracleHosts() {
      return this.oracleHosts.filter(host => host.hostType === 1);
    },
    ebackupOracleHosts() {
      return this.oracleHosts.filter(host => host.hostType === 2);
    },
    // 可以进行初始化连接操作的生产设备
    // 该设备下可能没有数据库／实例 需要进一步筛选
    availableProductionHosts() {
      return this.productionOracleHosts
        .filter(
          host => !this.links.find(link => link.primaryHost.id === host.id)
        )
        .map(host => {
          const databases = this.hostsWithOracle[host.id].databases || [];
          return { databases, ...host };
        });
    },
    // 可以进行初始化连接操作的易备设备
    // 该设备可能有数据库／实例 需要进一步筛选
    availableEbackupHosts() {
      return this.ebackupOracleHosts
        .filter(host => !this.links.find(link => link.viceHost.id === host.id))
        .map(host => {
          const databases = this.hostsWithOracle[host.id].databases || [];
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
    databaseLinksReadyToSwitch() {
      return this.databaseLinks.filter(
        link => this.databaseLinkIdsReadyToSwitch.indexOf(link.id) >= 0
      );
    },
    hostLinkReadyToSwitch() {
      return this.links.find(
        hostLink => hostLink.id === this.hostLinkIdReadyToSwitch
      );
    },
  },
  methods: {
    fetchData() {
      // fetchAll()
      //   .then(res => {
      //     const { data: oracles } = res.data;
      //     this.items = oracles;
      //   })
      //   .catch(error => {
      //     this.$message.error(error);
      //   });
      // fetchLinks()
      //   .then(res => {
      //     const { data: links } = res.data;
      //     this.links = links;
      //   })
      //   .catch(error => {
      //     this.$message.error(error);
      //   });
    },
    // 数据库连接状态与tag类型的映射
    databaseLinkStateStyle(value) {
      switch (value) {
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case 3:
        case 4:
          return 'danger';
        case 5:
          return 'info';
      }
    },
    databaseStateStyle(value) {
      switch (value) {
        case 0:
          return 'info';
        case 1:
          return 'success';
        case 2:
          return 'danger';
      }
    },
    switchStateStyle(value) {
      switch (value) {
        case 1:
          return 'info';
        case 2:
          return 'success';
        case 3:
          return 'danger';
      }
    },

    displayLinkCreateModal() {
      this.linkCreateModalVisible = true;
    },
    cancelSwitch() {
      this.switchModalClosed();
      this.switchModalVisible = false;
    },
    confirmSwitch() {
      validatePassword(this.password)
        .then(() => {
          if (!!~this.hostLinkIdReadyToSwitch) {
            return switchHostIp(this.hostLinkIdReadyToSwitch);
          } else {
            return switchOracle({
              linkIds: this.databaseLinkIdsReadyToSwitch,
            });
          }
        })
        .then(res => {
          const { data } = res.data;
          console.log(data);
          this.switchModalVisible = false;
        })
        .catch(error => {
          this.$message.error(error);
        });
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
      this.password = '';
    },
  },
  filters: {
    databaseStateFilter(value) {
      return databaseStateMapping[value];
    },
    databaseRoleFilter(value) {
      return databaseRoleMapping[value].substr(0, 1);
    },
    linkStateFilter(value) {
      return linkStateMapping[value];
    },
    switchStateFilter(value) {
      return switchStateMapping[value];
    },
    switchManualFilter(value) {
      return switchManualMapping[value];
    },
  },
  components: {
    IIcon,
    DatabaseLinkCreateModal,
  },
};
</script>
<style lang="scss" module>
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
.hostSwitch {
  text-align: center;
  margin: 5px 0 0;
}

.primaryDatabaseInfo {
  border: 1px solid $primary-color;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 1px $primary-color;
}
.viceDatabaseInfo {
  border: 1px solid $vice-color;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 1px $vice-color;
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
  margin: -5px 0;
  border-radius: 0 3px 3px 0;
}
.viceRole {
  text-align: center;
  background-color: $vice-color;
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px 0;
  border-radius: 0 3px 3px 0;
}
.hostSwitchIcon {
  width: 3em;
  height: 1.4em;
  cursor: pointer;
}
.switchIcon {
  width: 3em;
  height: 3em;
  cursor: pointer;
}
.switchFormItem {
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
