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
        <el-button type="primary"
                   @click="batchSwitch">批量切换</el-button>
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
      <div v-for="hostLink in sortByStartTime(links)"
           :key="hostLink.id">
        <div :class="$style.hostLinkContainer">
          <fieldset :class="hostLink.primaryHost.isRacMark === 0&&hostLink.primaryHost.isRacMark === 0 ? $style.hostLinkIsRac : $style.hostLinkNotRac">
            <legend v-if="hostLink.primaryHost.isRacMark === 0&&hostLink.primaryHost.isRacMark === 0">RAC环境</legend>
            <el-row type="flex"
                    justify="space-around">
              <el-col :span="10">
                <div :class="$style.hostInfo">
                  <el-popover placement="right"
                              trigger="hover"
                              width="300"
                              :disabled="!hostLink.vipIpMark"
                              :open-delay="200">
                    <h4 style="margin: 5px 0; padding: 3px 0;">非主节点</h4>
                    <p v-if="!(hostLink.primaryNodes && hostLink.primaryNodes.length)">暂无子节点</p>
                    <div v-else>
                      <p v-for="primaryNode in hostLink.primaryNodes"
                        :key="primaryNode.id">
                        <el-row>
                          <el-col :span="12">{{ primaryNode.name }}</el-col>
                          <el-col :span="12"
                                  :class="$style.hostIp">{{ primaryNode.hostIp }}</el-col>
                        </el-row>
                      </p>
                    </div>
                    <div slot="reference" style="display: inline-block">
                      <i-icon name="host-production"
                              :class="$style.hostIcon"></i-icon>
                      <span>{{ hostLink.primaryHost.name }}</span>
                    </div>
                  </el-popover>
                  <div>
                    <el-row>
                      <el-col :span="8"
                              style="min-height: 1px;">
                        <el-popover placement="right"
                                    trigger="hover"
                                    width="150"
                                    :open-delay="200">
                          <h4 style="margin: 5px 0; padding: 3px 0;">非主节点VIP</h4>
                          <p v-if="!sonNodeVip(hostLink).length">暂无</p>
                          <div v-else>
                            <p v-for="vip in sonNodeVip(hostLink)"
                              :key="vip.id"
                              :class="$style.hostIp">{{ vip }}</p>
                          </div>
                          <div v-show="hostLink.vipIpMark && hostLink.vipIpMark === 1"
                               style="display: inline-block"
                               slot="reference">
                            <i-icon :class="$style.ipIcon"
                                    name="vip"></i-icon>
                            <span :class="$style.hostIp">{{ hostLink.primaryHost.vip }}</span>
                          </div>
                        </el-popover>
                      </el-col>
                      <el-col :span="8">
                        <i-icon name="ip"
                                :class="$style.ipIcon"></i-icon>
                        <span :class="$style.hostIp">{{ hostLink.primaryHost.hostIp }}</span>
                      </el-col>
                      <el-col :span="8"
                              v-show="hostLink.serviceIpMark === 1 && hostLink.primaryHost.osName === 'Linux'">
                        <i-icon :class="$style.ipIcon"
                                name="service"></i-icon>
                        <span :class="$style.hostIp">{{ hostLink.primaryHost.serviceIp }}</span>
                      </el-col>
                    </el-row>
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
                    <el-tooltip v-if="simpleSwitchGoing(hostLink)"
                                content="易备设备切换IP中"
                                effect="light"
                                placement="right"
                                :open-delay="200">
                      <i class="el-icon-loading"
                        :class="$style.simpleSwitchGoing"></i>
                    </el-tooltip>
                    <el-popover placement="right"
                                trigger="hover"
                                width="300"
                                v-else
                                :open-delay="200">
                      <el-form size="mini"
                              label-size="70px">
                        <el-form-item :class="$style.switchFormItem"
                                      v-if="osIsWindows(hostLink.viceHost.osName)"
                                      label="易备IP">
                          {{ simpleSwitchOriginIp(hostLink) }}<i class="el-icon-d-arrow-right"></i>{{ simpleSwitchTargetIp(hostLink) }}
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      v-else
                                      label="服务IP">
                          {{ simpleSwitchOriginIp(hostLink) }}<i class="el-icon-d-arrow-right"></i>
                          {{ hostLink.serviceIP === 1 ? '易备设备' : '生产设备' }}
                        </el-form-item>
                      </el-form>
                      <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">最近操作</h4>
                      <p v-if="!hasSimpleSwitch(hostLink.simpleSwitch)">暂无操作</p>
                      <el-form v-else
                                size="mini"
                                label-width="70px">
                        <el-form-item :class="$style.switchFormItem"
                                      :label="osIsWindows(hostLink.viceHost.osName)?'易备IP':'服务IP'">
                          {{ hostLink.simpleSwitch.originIp }}<i class="el-icon-d-arrow-right"></i>{{ hostLink.simpleSwitch.targetIp }}
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="状态">
                          <el-tag :type="switchStateStyle(hostLink.simpleSwitch.state)"
                                  size="mini">
                            {{ hostLink.simpleSwitch.state | switchStateFilter }}
                          </el-tag>
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="切换信息">
                          {{ hostLink.simpleSwitch.message }}
                        </el-form-item>
                        <el-form-item :class="$style.switchFormItem"
                                      label="完成时间">
                          {{ hostLink.simpleSwitch.switchTime }}
                        </el-form-item>
                      </el-form>
                      <i-icon :class="$style.simpleSwitch"
                              slot="reference"
                              name="simpleSwitch"
                              @click.native="simpleSwitchIp(hostLink)"></i-icon>  
                    </el-popover>
                    <span v-if="databaseType==='oracle'">
                      <i-icon name="notSimpleSwitchDb"
                              :class="$style.simpleSwitchDb"
                              v-if="!hostLink.databaseLinks.some(dbLink => dbLink.viceDatabase.role === 2)"></i-icon>
                      <el-tooltip v-else
                                  content="易备实例单切"
                                  effect="light"
                                  placement="right"
                                  :open-delay="200">
                        <i-icon name="simpleSwitchDb"
                                :class="$style.simpleSwitchDb"
                                @click.native="simpleSwitchMultiDatabases(hostLink)"></i-icon>
                      </el-tooltip>
                    </span>
                  </div>
                  <div>
                    <el-row>
                      <el-col :span="8"
                              style="min-height: 1px;">
                        <el-popover placement="right"
                                    trigger="hover"
                                    width="150"
                                    :open-delay="200">
                          <h4 style="margin: 5px 0; padding: 3px 0;">非主节点VIP</h4>
                          <p v-if="!sonNodeVip(hostLink).length">暂无</p>
                          <div v-else>
                            <p v-for="vip in sonNodeVip(hostLink)"
                              :key="vip.id"
                              :class="$style.hostIp">{{ vip }}</p>
                          </div>
                          <div v-show="hostLink.vipIpMark && hostLink.vipIpMark === 2"
                               style="display: inline-block"
                              slot="reference">
                            <i-icon :class="$style.ipIcon"
                                    name="vip"></i-icon>
                            <span :class="$style.hostIp">{{ hostLink.primaryHost.vip }}</span>
                          </div>
                        </el-popover>
                      </el-col>
                      <el-col :span="8">
                        <i-icon name="ip"
                                :class="$style.ipIcon"></i-icon>
                        <span :class="$style.hostIp">{{ hostLink.viceHost.hostIp }}</span>
                      </el-col>
                      <el-col :span="8"
                              v-show="hostLink.serviceIpMark === 2 && hostLink.viceHost.osName === 'Linux'">
                        <i-icon :class="$style.ipIcon"
                                name="service"></i-icon>
                        <span :class="$style.hostIp">{{ hostLink.viceHost.serviceIp }}</span>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 数据库连接的排列 -->
            <el-row v-for="dbLink in sortByCreateTime(hostLink.databaseLinks)"
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
                  <div v-if="dbLink.latestSwitch && dbLink.latestSwitch.state === 1 && dbLink.latestSwitch.type === 1 "
                      style="margin-top: 6px;">
                    <i class="el-icon-loading"></i>
                    <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">切换{{instanceName.substring(0, instanceName.length-1)}}中...</span>
                  </div>
                  <div v-else-if="dbLink.latestSwitch && dbLink.latestSwitch.state === 1 && dbLink.latestSwitch.type === 4">
                    <i class="el-icon-loading"></i>
                    <span style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">
                      {{dbLink.failOverState===0?'关闭故障转移':'开启故障转移'}}中...
                    </span>
                  </div>
                  <div v-else>
                    <!-- <el-button type="text"
                               @click="switchDatabase(dbLink.id)">切换{{instanceName.substring(0, instanceName.length-1)}}</el-button>
                    <el-button type="text"
                               @click="jumpToLinkDetail(dbLink.id)">查看详情</el-button> -->
                    <div v-if="databaseType==='oracle'">
                      <!-- <div v-if="hostLink.primaryHost.oracleVersion===1">
                        <el-button type="text"
                                @click="failOver(dbLink)"
                                :class="$style.failOver">{{dbLink.failOverState===0?'关闭故障转移':'开启故障转移'}}</el-button>
                      </div> -->
                      <el-button type="text"
                                @click="switchDatabase(dbLink.id)">双切</el-button>
                      <el-button type="text"
                                :disabled="dbLink.primaryDatabase.role === 2"
                                @click="simpleSwitchDatabase(dbLink.id)">单切</el-button>
                      <el-button type="text"
                                @click="jumpToLinkDetail(dbLink.id)">详情</el-button>
                    </div>
                    <div v-else>
                      <el-button type="text"
                                @click="switchDatabase(dbLink.id)">切换{{instanceName.substring(0, instanceName.length-1)}}</el-button>
                      <el-button type="text"
                                @click="jumpToLinkDetail(dbLink.id)">查看详情</el-button>
                    </div>
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
                      <h5>{{instanceName}}</h5>
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
          </fieldset>
        </div>
      </div>
    </section>
    <switch-modal :visible="switchModalVisible"
                  :host-link-ready-to-switch="hostLinkReadyToSwitch"
                  :ready-to-simple-switch="readyToSimpleSwitch"
                  :ready-to-remove-host-link="readyToRemoveHostLink"
                  :database-links-ready-to-switch="databaseLinksReadyToSwitch"
                  :is-simple-switch="isSimpleSwitch"
                  @cancel="cancelSwitch"
                  :btn-loading="btnLoading"
                  @confirm="confirmSwitch"></switch-modal>
    <database-link-create-modal :production-hosts="availableProductionHosts"
                                :ebackup-hosts="availableEbackupHosts"
                                :visible.sync="linkCreateModalVisible"
                                :type="databaseType"
                                :btn-loading="btnLoading"
                                @confirm="createLink"></database-link-create-modal>
    <batch-switch-modal :visible.sync="switchDialog"
                        :originLinks="switchLinks"
                        :flag="flag"
                        :btn-loading="btnLoading"
                        :databaseType="databaseType"
                        @confirm="addSwitchPlan"></batch-switch-modal>
  </section>
</template>
<script>
import SwitchModal from '../modal/SwitchModal';
import BatchSwitchModal from '../modal/BatchSwitchModal';
import IIcon from '@/components/IIcon';
import DatabaseLinkCreateModal from '@/components/modal/DatabaseLinkCreateModal';
import dayjs from 'dayjs';
import {
  fetchAll as fetchAllOracle,
  fetchLinks as fetchLinksOracle,
  createLinks as createLinksOracle,
  createSwitches as switchOracle,
  createSimpleSwitches as simpleSwitchOracle,
  failOver as failOverOracle
} from '../../api/oracle';
import {
  fetchAll as fetchAllSqlserver,
  fetchLinks as fetchLinksSqlserver,
  createLinks as createLinksSqlserver,
  createSwitches as switchSqlserver,
} from '../../api/sqlserver';
import {
  createSwitches as switchHostIp,
  vipSwitches as switchVip,
  fetchAll,
  deleteLinks,
  simpleSwitch
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
import batchSwitchMinxin from '../mixins/batchSwitchMixins'
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
const createSimpleSwitchMethod = {
  oracle: simpleSwitchOracle
}
const switchMethod = {
  true: createSimpleSwitchMethod,
  false: createSwitchMethod
}
export default {
  name: 'TakeOver',
  mixins: [takeoverMixin, batchSwitchMinxin],
  data() {
    return {
      items: [], // 所有的数据库
      links: [], // 数据库连接
      linkCreateModalVisible: false,
      switchModalVisible: false,
      databaseLinkIdsReadyToSwitch: [],
      hostLinkIdReadyToSwitch: -1,
      readyToSimpleSwitch: {},
      readyToRemoveHostLink: {},
      btnLoading: false,
      isSimpleSwitch: false, // 标记单切还是双切
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
      } else {
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
      this.readyToSimpleSwitch = {};
      this.readyToRemoveHostLink = {};
      this.hostLinkIdReadyToSwitch = -1;
      this.switchModalVisible = false;
      this.isSimpleSwitch = false;
    },
    confirmSwitch(formData) {
      /**
       * 1.验证密码；
       * 2.判断是切换IP还是切换实例，调用不用的请求
       * 3.1.切换IP：修改该设备连接的最近切换记录
       * 3.2.切换实例：遍历修改数据库连接的最近切换记录（直接修改了计算属性的引用）
       * 3.3 易备库单切IP
       * 3.4 rac环境下切IP
       * 3.5 解除连接
       */
      if (!!~this.hostLinkIdReadyToSwitch) {
        this.btnLoading = true;
        // 切vip
        if(formData === 'vip') {
          switchVip(this.hostLinkIdReadyToSwitch)
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
          //  切服务IP、scanIP、临时IP
          switchHostIp(this.hostLinkIdReadyToSwitch)
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
        }
      } else if(Object.keys(this.readyToSimpleSwitch).length > 0) {
        this.btnLoading = true;
        const req = {
          originViceIp: this.simpleSwitchOriginIp(this.readyToSimpleSwitch),
          targetViceIp: this.simpleSwitchTargetIp(this.readyToSimpleSwitch)
        };
        const id = this.readyToSimpleSwitch.id;
        simpleSwitch(id, req)
          .then(res => {
            const { data } = res.data
            if(this.osIsWindows(this.readyToSimpleSwitch.viceHost.osName)) {
              this.links.find(
                link => link.id === id
              ).simpleSwitch = data;
            } else { // 切换成功，Linux下服务IP位置发生变化
              if(data.state === 2) {
                if(this.links.find(link => link.id).serviceIpMark === 1) {
                  this.links.find(link => link.id).serviceIpMark = 2;
                } else {
                  this.links.find(link => link.id).serviceIpMark = 1;
                }
              }
            }
            this.$message({message: data.message, type: this.messageType(data.state)})
            this.switchModalVisible = false;
          })
          .catch(error => {
            this.$message.error(error)
          })
          .then(() => {
            this.btnLoading = false;
          })
      } else if(Object.keys(this.readyToRemoveHostLink).length > 0) {
        this.btnLoading = true;
        deleteLinks(this.readyToRemoveHostLink.id)
          .then(res => {
            const { data: cancelOperation } = res.data;
            this.links.find(
              link => link.id === this.readyToRemoveHostLink.id
            ).latestSwitch = cancelOperation;
            this.switchModalVisible = false;
            this.$message.info('正在尝试解除连接，请等待');
          })
          .catch(error => {
            this.$message.error(error);
          })
          .then(() => {
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = true;
        switchMethod[this.isSimpleSwitch][this.databaseType]({
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
    // 双切
    switchDatabase(databaseLinkId) {
      this.databaseLinkIdsReadyToSwitch = [databaseLinkId];
      this.switchModalVisible = true;
    },
    // 单切
    simpleSwitchDatabase(databaseLinkId) {
      this.switchDatabase(databaseLinkId);
      this.isSimpleSwitch = true;
    },
    // 解除连接
    removeHostLink(hostLink) {
      this.switchModalVisible = true;
      this.readyToRemoveHostLink = hostLink;
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
    // 单切备库
    simpleSwitchMultiDatabases(hostLink) {
      this.switchMultiDatabaseToEbackup(hostLink);
      this.isSimpleSwitch = true;
    },
    switchHostIp(hostLink) {
      this.hostLinkIdReadyToSwitch = hostLink.id;
      this.switchModalVisible = true;
    },
    simpleSwitchIp(hostLink) {
      this.readyToSimpleSwitch = hostLink;
      this.switchModalVisible = true;
    },
    // 单切进行中
    simpleSwitchGoing(hostLink) {
      return this.hasSimpleSwitch(hostLink.simpleSwitch) && hostLink.simpleSwitch.state === 1
    },
    // 单切返回的提示信息类型
    messageType(state) {
      switch(state) {
        case 1:
          return 'info'
        case 2:
          return 'success'
        case 3:
          return 'error'
        default:
          return ''
      }
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
    failOver(dbLink) {
      this.$confirm(`此操作${dbLink.failOverState===0?'关闭故障转移':'开启故障转移'}，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          failOverOracle(dbLink.id)
            .then(res => {
              const { data: failOverOperation } = res.data;
              this.databaseLinks.find(
                link => link.id === dbLink.id
              ).latestSwitch = failOverOperation;
              this.fetchData(); // 用于刷新此实例连接中failOverState的状态
              this.$message.info(`正在尝试${dbLink.failOverState===0?'关闭故障转移':'开启故障转移'}，请等待`);
            })
            .catch(error => {
              this.$message.error(error);
            });
        })
        .catch(error => {});
    },
    // 非主节点VIP集合
    sonNodeVip(hostLink) {
      if(hostLink.primaryNodes)
        return hostLink.primaryNodes.map(node => node.vip)
      return []
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
    sortByCreateTime(data){
      return data.slice().sort( (a, b) => {
        const val1 = a.primaryDatabase.createTime;
        const val2 = b.primaryDatabase.createTime;
        // 默认是时间排序
        if(dayjs(val1) < dayjs(val2)){
            return 1;
        }else if(dayjs(val1) > dayjs(val2)){
            return  -1;
        }else{
            return 0;
        }
      });
    },
    sortByStartTime(data){
      return data.slice().sort( (a, b) => {
        const val1 = a.startTime;
        const val2 = b.startTime;
        // 默认是时间排序
        if(dayjs(val1) < dayjs(val2)){
            return 1;
        }else if(dayjs(val1) > dayjs(val2)){
            return  -1;
        }else{
            return 0;
        }
      });
    }
  },

  components: {
    IIcon,
    SwitchModal,
    DatabaseLinkCreateModal,
    BatchSwitchModal,
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
  // padding: 5px;
  margin: 10px 0;
  // border: 1px solid #ababab;
  border-radius: 5px;
  background-color: #ffffff;
}
.hostLinkIsRac {
  border: 1px dotted $primary-color;
  border-radius: 5px;
  & legend {
    color: $primary-color
  }
}
.hostLinkNotRac {
  border: 0;
}
.hostInfo {
  position: relative;
  text-align: center;
  margin: 1em 0;
}
.vipIcon {
  position: absolute;
  margin-top: 0.5em;
  left: 100px;
  width: 2em;
  height: 2em;
}
.serviceIcon {
  position: absolute;
  // margin-left: 30px;
  right: 80px;
  margin-top: -1em;
  width: 2em;
  height: 2em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.ipIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.3em;
  margin-top: 10px;
}
.simpleSwitchDb {
  position: absolute;
  margin-top: -0.3em;
  right: 90px;
  width: 2em;
  height: 2em;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.simpleSwitch {
  position: absolute;
  // margin-left: 75px;
  margin-top: -0.3em;
  right: 50px;
  width: 2em;
  height: 2em;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
.simpleSwitchGoing {
  position: absolute;
  // margin-left: 75px;
  right: 50px;
  margin-top: -0.2em;
  color: $primary-color;
  font-size: 34px;
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
.removeHostLink,
.failOver {
  color: $delete-color;
  padding: 2px 0 3px;
  &:focus {
    color: $delete-color;
  }
  &:hover {
    color: lighten($delete-color, 10%);
    transform:scale(1.2);
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
