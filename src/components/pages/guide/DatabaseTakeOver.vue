<template>
  <el-container style="height: 100%;">
    <el-header>
      <my-header></my-header>
    </el-header>
    <div id="box" class="el-main custom-scrollbar">
      <div id="content">
        <el-form inline
                  size="small"
                  style="position: relative; z-index: 3"
                  v-show="!links.length">
          <el-form-item style="float: right;"
                        >
            <div :class="{ 'btn-mask': fingerVisible }">
              <i-icon name="finger" class="finger" v-show="fingerVisible"></i-icon>
              <el-button type="primary"
                        @click="displayLinkCreateModal"
                        size="small">添加</el-button>
            </div>
          </el-form-item>
        </el-form>
        <section style="clear: both; margin-top: 20px;">
          <el-row>
            <el-col :span="10">
              <div class="envHeader">
                <h2>
                  <i-icon name="production-env" class="envIcon"></i-icon>
                  <span>生产环境</span>
                </h2>
              </div>
            </el-col>
            <el-col :span="10"
                    :offset="4">
              <div class="envHeader">
                <h2>
                  <i-icon name="ebackup-env" class="envIcon"></i-icon>
                  <span>易备环境</span>
                </h2>
              </div>
            </el-col>
          </el-row>
          <div v-for="hostLink in links"
              :key="hostLink.id">
            <div class="hostLinkContainer">
              <fieldset class="hostLinkInOs">
                <legend>
                  <span>{{ osType(hostLink.primaryHost) }}</span>
                </legend>
                <el-row type="flex"
                        justify="space-around">
                  <el-col :span="10">
                    <div class="hostInfo">
                      <div class="wordHover">
                        <i-icon name="host-production" class="hostIcon"></i-icon>
                        <span>{{ hostLink.primaryHost.name }}</span>
                      </div>
                      <div>
                        <el-row>
                          <el-col :span="8"
                                  style="min-height: 1px;">
                            <div v-show="hostLink.vipIpMark && hostLink.vipIpMark === 1"
                                class="wordHover">
                              <i-icon name="vip" class="ipIcon"></i-icon>
                              <span class="hostIp">{{ hostLink.primaryHost.vip }}</span>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <i-icon name="ip" class="ipIcon"></i-icon>
                            <span class="hostIp">{{ hostLink.primaryHost.hostIp }}</span>
                          </el-col>
                          <el-col :span="8"
                                  v-show="hostLink.serviceIpMark === 1 && ['Linux', 'RAC'].includes(osType(hostLink.primaryHost))">
                            <el-tooltip content="提供服务中"
                                        effect="light"
                                        placement="right"
                                        :open-delay="200">
                              <div class="wordHover">
                                <i-icon name="service" class="ipIcon"></i-icon>
                                <span class="hostIp">{{ hostLink.primaryHost.serviceIp }}</span>
                              </div>
                            </el-tooltip>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="hostSwitch">
                      <div>
                        <el-popover placement="right"
                                    trigger="hover"
                                    width="300"
                                    :open-delay="200">
                          <h4 style="margin: 5px 0; padding: 3px 0;">最近操作</h4>
                          <p v-if="(!hostLink.latestSwitch || [1, 4, 5, 6].includes(hostLink.latestSwitch.type))">暂无操作</p>
                          <!-- 切换IP, 单切IP -->
                          <el-form v-else-if="[2, 7].includes(hostLink.latestSwitch.type)"
                                  size="mini"
                                  label-width="70px">
                            <el-form-item class="switchFormItem"
                                          label="切换内容">
                              <span>{{ hostLink.latestSwitch.content }}</span>
                            </el-form-item>
                            <el-form-item class="switchFormItem"
                                          label="切换方式">
                              <span>{{ hostLink.latestSwitch.manual | switchManualFilter }}</span>
                            </el-form-item>
                            <el-form-item class="switchFormItem"
                                          label="状态">
                              <el-tag :type="hostLink.latestSwitch.state === 2 ? 'success' : 'danger' "
                                      size="mini">
                                {{ hostLink.latestSwitch.state | switchStateFilter }}
                              </el-tag>
                            </el-form-item>
                            <el-form-item class="switchFormItem"
                                          v-if="hostLink.latestSwitch.state !== 1"
                                          label="完成时间">
                              <span>{{ hostLink.latestSwitch.switchTime }}</span>
                            </el-form-item>
                          </el-form>
                          <!-- 解除连接 -->
                          <el-form v-else-if="hostLink.latestSwitch.type === 3"
                                  size="mini"
                                  label-width="70px">
                            <el-form-item class="switchFormItem"
                                          label="解除信息">
                              <span>{{ hostLink.latestSwitch.content }}</span>
                            </el-form-item>
                            <el-form-item class="switchFormItem"
                                          label="状态">
                              <el-tag :type="switchStateStyle(hostLink.latestSwitch.state)"
                                      size="mini">
                                {{ hostLink.latestSwitch.state | switchStateFilter }}
                              </el-tag>
                            </el-form-item>
                            <el-form-item class="switchFormItem"
                                          v-if="hostLink.latestSwitch.state !== 1"
                                          label="完成时间">
                              <span>{{ hostLink.latestSwitch.switchTime }}</span>
                            </el-form-item>
                          </el-form>
                          <i-icon name="link" class="hostSwitchIcon" slot="reference"></i-icon>
                        </el-popover>
                      </div>
                      <div v-if="hostLink.latestSwitch && hostLink.latestSwitch.state === 1 && [2, 3, 7].includes(hostLink.latestSwitch.type)"
                          style="margin-top: 12px;">
                        <i class="el-icon-loading"></i>
                        <span style="font-size: 0.9em; vertical-align: 0.1em;"
                              class="switch-text">{{ hostLink.latestSwitch.type | switchTypeFilter }}中...</span>
                      </div>
                      <template v-else>
                        <div style="margin: -3px 0 -6px;">
                          <el-button type="text"
                                      :disabled="disableClick"
                                      @click="switchMultiDatabasesToProduction(hostLink)">切主</el-button>
                          <el-button type="text"
                                      :disabled="disableClick"
                                      @click="switchHostIp(hostLink)">切IP</el-button>
                          <el-button type="text"
                                      :disabled="disableClick"
                                      @click="switchMultiDatabaseToEbackup(hostLink)">切备</el-button>
                        </div>
                        <el-button type="text"
                                    :disabled="disableClick"
                                    @click="removeHostLink(hostLink)"
                                    class="removeHostLink">解除连接</el-button>
                      </template>
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div class="hostInfo">
                      <div>
                        <i-icon name="host-ebackup" class="hostIcon"></i-icon>
                        <span>{{ hostLink.viceHost.name }}</span>
                        <el-dropdown style="position: absolute; right: 0px; top: -9px;" size="small">
                          <el-button size="mini">
                            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="singleSwitchIp(hostLink)"
                                              :disabled="disableClick">单切IP</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                      <div>
                        <el-row>
                          <el-col :span="8"
                                  style="min-height: 1px;">
                            <div v-show="hostLink.vipIpMark && hostLink.vipIpMark === 2"
                                class="wordHover">
                              <i-icon name="vip" class="ipIcon"></i-icon>
                              <span class="hostIp">{{ hostLink.primaryHost.vip }}</span>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <i-icon name="ip" class="ipIcon"></i-icon>
                            <span class="hostIp">{{ hostLink.viceHost.hostIp }}</span>
                          </el-col>
                          <el-col :span="8"
                                  v-show="hostLink.serviceIpMark === 2 && ['Linux', 'RAC'].includes(osType(hostLink.primaryHost))">
                            <el-tooltip content="提供服务中"
                                        effect="light"
                                        placement="right"
                                        :open-delay="200">
                              <div class="wordHover">
                                <i-icon name="service" class="ipIcon"></i-icon>
                                <span class="hostIp">{{ hostLink.primaryHost.serviceIp }}</span>
                              </div>
                            </el-tooltip>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <!-- 数据库连接的排列 -->
                <el-row v-for="dbLink in hostLink.databaseLinks"
                        :key="dbLink.id"
                        style="position: relative; display: flex">
                  <el-col :span="10">
                    <div :class="dbLink.primaryDatabase.role === 1 ? 'primaryDatabaseInfo' : 'viceDatabaseInfo'">
                      <el-row type="flex"
                              align="middle">
                        <el-col :span="8">
                          <h4>
                            <router-link :class="dbLink.primaryDatabase.role === 1 ? 'primaryLink' : 'viceLink'"
                                          to="">
                              {{dbLink.primaryDatabase.name}}
                            </router-link>
                          </h4>
                        </el-col>
                        <el-col :span="5"
                                class="dbInfoCol">
                          <h5>实例名</h5>
                          <p>{{ dbLink.primaryDatabase.instanceName }}</p>
                        </el-col>
                        <el-col :span="5"
                                class="dbInfoCol">
                          <h5>登录名</h5>
                          <p>{{ dbLink.primaryDatabase.loginName }}</p>
                        </el-col>
                        <el-col :span="3"
                                class="dbInfoCol">
                          <h5>状态</h5>
                          <p>
                            <el-tag :type="databaseStateStyle(dbLink.primaryDatabase.state)"
                                    size="mini">{{ dbLink.primaryDatabase.state | databaseStateFilter }}</el-tag>
                          </p>
                        </el-col>
                        <el-col :span="3">
                          <div :class="dbLink.primaryDatabase.role === 1 ? 'primaryRole' : 'viceRole'">
                            <span style="font-size: 3vw;">{{ dbLink.primaryDatabase.role | databaseRoleFilter}}</span>
                          </div>
                        </el-col>
                      </el-row>

                    </div>
                  </el-col>
                  <el-col :span="4" style="align-items: center; align-self: center;">
                    <div class="databaseSwitch">
                      <el-popover placement="right"
                                  trigger="hover"
                                  width="300"
                                  :open-delay="200">
                        <el-form size="mini"
                                label-width="70px">
                          <el-form-item class="switchFormItem"
                                        label="连接状态">
                            <el-tag :type="databaseLinkStateStyle(dbLink.state)"
                                    size="mini">{{ dbLink.state | linkStateFilter }}</el-tag>
                          </el-form-item>
                          <el-form-item class="switchFormItem"
                                        label="信息">
                            <span>{{ dbLink.errMsg }}</span>
                          </el-form-item>
                        </el-form>
                        <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">最近操作</h4>
                        <p v-if="!dbLink.latestSwitch || ![1, 4, 5, 6].includes(dbLink.latestSwitch.type)">暂无操作</p>
                        <el-form v-else
                                size="mini"
                                label-width="70px">
                          <el-form-item class="switchFormItem"
                                        label="切换内容">
                            <span>{{ dbLink.latestSwitch.content }}</span>
                          </el-form-item>
                          <el-form-item class="switchFormItem"
                                        label="切换方式">
                            <span>{{ dbLink.latestSwitch.manual | switchManualFilter }}</span>
                          </el-form-item>
                          <el-form-item class="switchFormItem"
                                        label="状态">
                            <el-tag size="mini"
                                    :type="switchStateStyle(dbLink.latestSwitch.state)">
                              {{ dbLink.latestSwitch.state | switchStateFilter }}
                            </el-tag>
                          </el-form-item>
                          <el-form-item class="switchFormItem"
                                        v-if="dbLink.latestSwitch.consume"
                                        label="持续时间">
                            <timer v-if="dbLink.latestSwitch.state === 1" :val="dbLink.latestSwitch.consume"></timer>
                            <span v-else>{{ dbLink.latestSwitch.consume | durationFilter }}</span>
                          </el-form-item>
                          <el-form-item class="switchFormItem"
                                        v-if="dbLink.latestSwitch.state !== 1"
                                        label="完成时间">
                            <span>{{ dbLink.latestSwitch.switchTime }}</span>
                          </el-form-item>
                        </el-form>
                        <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                            v-if="dbLink.state === 1">
                          <div class="rightMask"></div>
                          <i-icon name="transportationRight" class="transportationIcon"></i-icon>
                        </div>
                        <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                            v-else-if="dbLink.state === 6">
                          <div class="leftMask"></div>
                          <i-icon name="transportationLeft" class="transportationIcon"></i-icon>
                        </div>
                        <div slot="reference" style="display: inline-block"
                              v-else>
                          <i-icon :name="`switch-${dbLink.state}`" class="switchIcon"></i-icon>
                        </div>
                      </el-popover>
                      <div v-if="dbLink.latestSwitch && dbLink.latestSwitch.state === 1 && [1, 4, 5, 6].includes(dbLink.latestSwitch.type)"
                          style="margin-top: 6px;">
                        <i class="el-icon-loading"></i>
                        <span style="font-size: 0.9em; vertical-align: 0.1em;"
                              class="switch-text">
                          <template v-if="dbLink.latestSwitch.type === 1">切换实例中...</template>
                          <template v-else>{{ dbLink.latestSwitch.type | switchTypeFilter}}中...</template>
                        </span>
                      </div>
                      <div v-else-if="dbLink.failOverOnGoing"
                          style="margin-top: 6px;">
                        <i class="el-icon-loading"></i>
                        <span style="font-size: 0.9em; vertical-align: 0.1em;"
                              class="switch-text">
                          {{ dbLink.failOverState === 1 ? '关闭故障转移' : '开启故障转移'}}中...
                        </span>
                      </div>
                      <div v-else>
                        <div>
                          <el-button type="text"
                                      :disabled="disableClick"
                                      @click="failOver(dbLink)"
                                      class="failOver">{{dbLink.failOverState === 1?'关闭故障转移':'开启故障转移'}}</el-button>
                        </div>
                        <div>
                          <el-dropdown>
                            <span class="dropdownLink">
                              切换操作<i class="el-icon-arrow-down el-icon--right" style="font-size: 12px; margin-left: 0"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="switchDatabase()"
                                                :disabled="disableClick">切换实例</el-dropdown-item>
                              <el-dropdown-item @click.native="singleSwitchDatabase()"
                                                :disabled="disableClick">单切实例</el-dropdown-item>
                              <el-dropdown-item @click.native="restoreSingleSwitch(hostLink, false, [dbLink])"
                                                :disabled="disableClick">单切恢复</el-dropdown-item>
                              <el-dropdown-item @click.native="readyToCutBack(hostLink, false, [dbLink])"
                                                :disabled="disableClick">回切初始化</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div :class="dbLink.viceDatabase.role === 1 ? 'primaryDatabaseInfo' : 'viceDatabaseInfo'">
                      <el-row type="flex"
                              align="middle">
                        <el-col :span="8">
                          <h4>
                            <router-link :class="dbLink.viceDatabase.role === 1 ? 'primaryLink' : 'viceLink'"
                                          to=''>
                              {{dbLink.viceDatabase.name}}
                            </router-link>
                          </h4>
                        </el-col>
                        <el-col :span="5"
                                class="dbInfoCol">
                          <h5>实例名</h5>
                          <p>{{ dbLink.viceDatabase.instanceName }}</p>
                        </el-col>
                        <el-col :span="5"
                                class="dbInfoCol">
                          <h5>登录名</h5>
                          <p>{{ dbLink.viceDatabase.loginName }}</p>
                        </el-col>
                        <el-col :span="3"
                                class="dbInfoCol">
                          <h5>状态</h5>
                          <p>
                            <el-tag :type="databaseStateStyle(dbLink.viceDatabase.state)"
                                    size="mini">{{ dbLink.viceDatabase.state | databaseStateFilter }}</el-tag>
                          </p>
                        </el-col>
                        <el-col :span="3">
                          <div :class="dbLink.viceDatabase.role === 1 ? 'primaryRole' : 'viceRole'">
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
        <section v-show="links.length"
                  class="hostLinkContainer"
                  style="padding: 20px 40px">
          <div style="font-weight: 700; font-size: 20px; margin-bottom: 5px">操作说明</div>
          <div v-for="(action, index) in Object.keys(actionMapping)"
                :key="index">
            <div class="instruction-title line-space"
                  style="font-weight: 700">
              <i class="el-icon-location-information"></i>
              {{ actionMapping[action].title }}
            </div>
            <div class="text-indentation line-space">
              说明：{{ actionMapping[action].explain }}
            </div>
            <div class="text-indentation"
                v-if="actionMapping[action].instructions.length">
                <div v-for="(instruction, i) in actionMapping[action].instructions"
                      :key="i"
                      class="line-space">
                <span v-if="i === 0">前提条件：</span>
                <i-icon name="instruction" class="instruction-icon" style="width: 1.5em" :style="{ marginLeft: i === 0 ? 0 : '85px' }"></i-icon>
                {{ instruction }}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <el-dialog :visible.sync="linkCreateModalVisible"
              title="接管初始化"
              custom-class="min-width-dialog">
      <el-form size="small"
              label-width="100px"
              disabled>
        <el-row>
          <el-col :span="12">
            <el-form-item disabled>
              <span slot="label">选择主设备
                <el-tooltip placement="top"
                            content="生产设备" >
                    <i class="el-icon-info"></i>
                </el-tooltip>
              </span>
              <el-select style="width: 90%;"
                        v-model="primaryHost.name">
                <el-option value="145.170.32.20主"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item disabled>
              <span slot="label">选择备设备
                <el-tooltip placement="top"
                            content="易备设备" >
                    <i class="el-icon-info"></i>
                </el-tooltip>
              </span>
              <el-select style="width: 90%;"
                        v-model="viceHost.name">
                <el-option value="145.170.32.14备"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择端口号">
              <el-select style="width: 90%;"
                        v-model="primaryDatabase.dbPort">
                <el-option :value="1521"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <section class="configureTabContainer">
        <el-tabs type="border-card">
          <el-tab-pane :label="primaryDatabase.name">
            <el-form label-width="120px"
                    size="small"
                    disabled>
              <template>
                <el-form-item label="主库监听名">
                  <el-input v-model="primaryDatabase.lsn"></el-input>
                </el-form-item>
                <el-form-item label="备库监听名">
                  <el-input v-model="viceDatabase.lsn"></el-input>
                </el-form-item>
                <el-form-item label="临时端口">
                  <el-input-number v-model="databaseLink.tempPort"></el-input-number>
                </el-form-item>
              </template>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </section>
      <span slot="footer">
        <el-button @click="linkCreateModalVisible = false">取消</el-button>
        <el-button type="primary"
                  @click="createLink">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog custom-class="min-width-dialog"
              :visible.sync="availableConditionModalVisible"
              title="操作提示">
      <el-row>
        <el-col :span="6">
          <i-icon name="warning" class="switchModalIcon"></i-icon>
        </el-col>
        <el-col :span="18">
          <div style="height: 220px;max-height: 220px; overflow: auto;"
              v-if="action">
            <div>
              <div class="condition-title">{{ actionMapping[action].title }}适用条件：</div>
              <div v-for="(instruction, index) in actionMapping[action].instructions"
                  :key="index">
                <i-icon name="instruction" class="instruction-icon"></i-icon>{{ instruction }}
              </div>
              <div class="condition-title" style="margin-top: 10px">操作结果</div>
              <div>
                <i-icon name="lightBulp" class="light-bulp-icon"></i-icon>{{ actionMapping[action].result }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="availableConditionCancelBtn">取消</el-button>
        <el-button type="primary"
                  @click="switchConfirm">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep';
import { pageMixin } from '@/components/mixins/guideMixins';
import {
  primaryHost,
  viceHost,
  primaryDatabase,
  viceDatabase,
  databaseLink,
  hostLinkLatestSwitch,
  simpleSwitch
} from '@/utils/guide/database-takeover';
import { setTimeout, clearTimeout } from 'timers';
import MyHeader from '@/components/MyHeader';
import {
  databaseStateMapping,
  databaseRoleMapping,
  linkStateMapping,
  switchStateMapping,
  switchManualMapping,
  switchTypeMapping,
  serviceIpMarkMapping,
} from '@/utils/constant';
const actionMapping = {
  switchHostIp: {
    title: '切IP',
    instructions: ['主设备和备设备IP不同'],
    result: '生产设备、易备设备IP交换',
    explain: `Windows环境下，将生产设备物理IP与易备设备物理IP交换;
              Linux环境下，服务IP在生产设备与易备设备间漂移。`
  },
  switchMultiDatabasesToProduction: {
    title: '切主',
    instructions: ['生产库角色是备，状态正常', '易备库角色是主，状态正常', '连接正常'],
    result: '生产库切换成主库，易备库切换成备库',
    explain: '将设备下的所有生产库切换成主库，所有易备库切换成备库。'
  },
  switchMultiDatabasesToEbackup: {
    title: '切备',
    instructions: ['生产库角色是主，状态正常', '易备库角色是备，状态正常', '连接正常'],
    result: '生产库切换成备库，易备库切换成主库',
    explain: '将设备下的所有生产库切换成备库，所有易备库切换成主库。'
  },
  switchDatabase: {
    title: '切换实例',
    instructions: ['生产库正常', '易备库正常', '连接正常'],
    result: '生产库、易备库角色交换',
    explain: '将生产库角色与易备库角色对调'
  },
  singleSwitchDatabase: {
    title: '单切实例',
    instructions: ['生产库角色是主，状态异常', '易备库角色是备，状态正常', '连接状态异常', '故障转移关闭状态'],
    result: '生产库切换成备库，易备库切换成主库',
    explain: '生产环境故障，连接异常时，将业务转移到易备环境。'
  },
  readyToCutBack: {
    title: '回切初始化',
    instructions: ['生产库角色是备，状态异常', '易备库角色是主，状态正常', '连接状态异常', '故障转移关闭状态'],
    result: '生产库状态正常，连接状态正常',
    explain: '生产环境故障，单切恢复不可恢复时，可恢复重建生产实例。'
  },
  restoreSingleSwitch: {
    title: '单切恢复',
    instructions: ['生产库角色是备，状态异常', '易备库角色是主，状态正常', '连接状态异常', '故障转移关闭状态'],
    result: '生产库状态正常，连接状态正常',
    explain: '当生产故障恢复后，需要将业务重新转移到生产环境时，则进行单切恢复，会将故障期间，备库的数据同步到主库。'
  },
  failOver: {
    title: '开启故障转移',
    instructions: [],
    explain: '开启故障转移后，当生产环境故障时，可自动将业务转移到易备环境上。'
  },
  cancleLink: {
    title: '解除连接',
    instructions: [],
    explain: '解除一键接管连接'
  },
  singleSwitchIp: {
    title: '单切IP',
    instructions: [],
    explain: `Windows系统下，将生产环境的物理IP切换到易备环境设备上;
              Linux系统下，将生产环境设备上的服务IP替换到易备环境的设备上。`
  }
};
/* eslint-disable */
export default {
  name: 'DatabaseTakeOver',
  mixins: [pageMixin],
  components: {
    MyHeader
  },
  data() {
    return {
      links: [],
      fingerVisible: false,
      linkCreateModalVisible: false,
      availableConditionModalVisible: false,
      primaryHost: cloneDeep(primaryHost),
      viceHost: cloneDeep(viceHost),
      primaryDatabase: cloneDeep(primaryDatabase),
      viceDatabase: cloneDeep(viceDatabase),
      databaseLink: cloneDeep(databaseLink),
      latestSwitch: cloneDeep(hostLinkLatestSwitch),
      simpleSwitch: cloneDeep(simpleSwitch),
      disableClick: true,
      action: null,
      actionMapping,
      opt: {
        type: 'info',
        message: '',
        duration: 0
      },
      close: null,
      timer: null
    }
  },
  mounted() {
    this.fingerVisible = true;
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.closePrompt();
  },
  filters: {
    databaseStateFilter(value) {
      return databaseStateMapping[value];
    },
    databaseRoleFilter(value = 0) {
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
    serviceIpMarkFilter(value) {
      return serviceIpMarkMapping[value];
    },
    switchTypeFilter(value) {
      return switchTypeMapping[value];
    }
  },
  computed: {
    hostLink() {
      return {
        databaseLinks: [
          this.databaseLink
        ],
        id: 448,
        primaryHost: this.primaryHost,
        latestSwitch: this.latestSwitch,
        serviceIpMark: 1,
        simpleSwitch: this.simpleSwitch,
        startTime: '2019-09-11 14:45:09',
        viceHost: this.viceHost,
        vipIpMark: 0
      }
    },
  },
  methods: {
    databaseLinkStateStyle(value) {
      switch (value) {
        case 1:
        case 6:
          return 'warning';
        case 2:
          return 'success';
        case 3:
        case 4:
          return 'danger';
        case 5:
          return 'info';
        default:
          return '';
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
        default:
          return '';
      }
    },
    osType(host) {
      if (host.isRacMark === 0) {
        return 'RAC';
      }
      return host.osName; // Windows、AIX、Linux
    },
    databaseStateStyle(value) {
      switch (value) {
        case 0:
          return 'info';
        case 1:
          return 'success';
        case 2:
          return 'danger';
        default:
          return '';
      }
    },
    operationPrompt(type, message, duration) {
      this.opt = {
        dangerouslyUseHTMLString: true,
        offset: 80,
        type,
        message,
        duration
      };
      this.close = this.$message(this.opt).close;
    },
    closePrompt() {
      setTimeout(this.close, 2000);
    },
    displayLinkCreateModal() {
      this.fingerVisible = false;
      this.linkCreateModalVisible = true;
    },
    readyExecute(adjustFunc, executeFunc) {
      this.timer = setTimeout(() => {
        adjustFunc(); // 调整环境状态函数
        [this.opt.type, this.opt.message] = ['success', '环境调整成功'];
        this.closePrompt();
        this.timer = setTimeout(
          executeFunc, // 执行操作函数
          3000
        );
      }, 3000)
    },
    execute(inExecutionFunc, executed) {
      inExecutionFunc(); // 操作中
      this.disableClick = true;
      this.timer = setTimeout(() => {
        this.disableClick = false;
        executed(); // 操作结束
      }, 5000);
    },
    createLink() {
      this.primaryHost = cloneDeep(primaryHost);
      this.viceHost = cloneDeep(viceHost);
      this.primaryDatabase = cloneDeep(primaryDatabase);
      this.viceDatabase = cloneDeep(viceDatabase);
      this.databaseLink = cloneDeep(databaseLink);
      this.latestSwitch = cloneDeep(hostLinkLatestSwitch);
      this.simpleSwitch = cloneDeep(simpleSwitch);
      this.linkCreateModalVisible = false;
      this.links.push(this.hostLink);
      this.operationPrompt('info', '连接正在初始化，请稍候...', 0);
      this.timer = setTimeout(() => {
        [this.databaseLink.errMsg, this.databaseLink.state] = ['初始化成功', 2];
        [this.opt.type, this.opt.message] = ['success', '初始化成功'];
        this.closePrompt();
        this.disableClick = false;
      }, 6000);
    },
    switchConfirm() {
      this.availableConditionModalVisible = false;
      this.operationPrompt('warning', '正在修改当前环境，请稍候...', 0);
      this.disableClick = true;
      if (this.action === 'switchMultiDatabasesToProduction') {
        this.readyExecute(
          () => {
            this.databaseLink.primaryDatabase.role = 2;
            this.databaseLink.viceDatabase.role = 1;
            this.databaseLink.primaryDatabase.state = 1;
            this.databaseLink.viceDatabase.state = 1;
            this.databaseLink.state = 2;
          },
          this.switchMultiDatabasesToProductionConfirm
        );
      } else if (this.action === 'switchMultiDatabasesToEbackup') {
        this.readyExecute(
          () => {
            this.databaseLink.primaryDatabase.role = 1;
            this.databaseLink.viceDatabase.role = 2;
            this.databaseLink.primaryDatabase.state = 1;
            this.databaseLink.viceDatabase.state = 1;
            this.databaseLink.state = 2;
          },
          this.switchMultiDatabasesToEbackupConfirm
        );
      } else if (this.action === 'singleSwitchDatabase') {
        this.readyExecute(
          () => {
            this.databaseLink.primaryDatabase.role = 1;
            this.databaseLink.viceDatabase.role = 2;
            this.databaseLink.primaryDatabase.state = 2;
            this.databaseLink.state = 4;
            this.databaseLink.failOverState = 1;
          },
          this.singleSwitchDatabaseConfirm
        )
      } else if (this.action === 'switchDatabase') {
        this.readyExecute(
          () => {
            this.databaseLink.primaryDatabase.state = 1;
            this.databaseLink.viceDatabase.state = 1;
            this.databaseLink.state = 2;
          },
          this.switchDatabaseConfirm
        );
      } else if (['restoreSingleSwitch', 'readyToCutBack'].includes(this.action)) {
        this.readyExecute(
          () => {
            this.databaseLink.primaryDatabase.state = 2;
            this.databaseLink.primaryDatabase.role = 2;
            this.databaseLink.viceDatabase.state = 1;
            this.databaseLink.viceDatabase.role = 1;
            this.databaseLink.state = 4;
            this.databaseLink.failOverState = 1;
          },
          this.restoreSingleSwitchConfirm
        );
      } else if (this.action === 'switchHostIp') {
        this.readyExecute(
          () => {
            this.viceHost.hostIp = this.simpleSwitch.originIp;
            this.simpleSwitch = cloneDeep(simpleSwitch);
          },
          this.switchHostIpConfirm
        );
      }
    },
    switchDatabase() {
      this.disableClick = true;
      const { primaryDatabase, viceDatabase, state } = this.databaseLink;
      if (primaryDatabase.state !== 1 || viceDatabase.state !== 1 || state !== 2) {
        this.availableConditionModalVisible = true;
        this.action = 'switchDatabase';
      } else {
        this.switchDatabaseConfirm();
      }
    },
    singleSwitchDatabase() {
      const { primaryDatabase, viceDatabase, state, failOverState } = this.databaseLink;
      if (primaryDatabase.role !== 1 || primaryDatabase.state !== 2 || state === 2 || failOverState !== 1) {
        this.action = 'singleSwitchDatabase';
        this.availableConditionModalVisible = true;
      } else {
        this.singleSwitchDatabaseConfirm();
      }
    },
    switchMultiDatabasesToProduction() {
      const { primaryDatabase, viceDatabase, state } = this.databaseLink;
      if (primaryDatabase.role !== 2 || primaryDatabase.state !== 1 || viceDatabase.state !== 1 || state !== 2) {
        this.availableConditionModalVisible = true;
        this.action = 'switchMultiDatabasesToProduction';
      } else {
        this.switchMultiDatabasesToProductionConfirm();
      }
    },
    switchMultiDatabaseToEbackup({ databaseLinks }) {
      const { primaryDatabase, viceDatabase, state } = this.databaseLink;
      if (viceDatabase.role !== 2 || primaryDatabase.state !== 1 || viceDatabase.state !== 1 || state !== 2) {
        this.availableConditionModalVisible = true;
        this.action = 'switchMultiDatabasesToEbackup';
      } else {
        this.switchMultiDatabasesToEbackupConfirm();
      }
    },
    restoreSingleSwitch() {
      const { primaryDatabase, viceDatabase, failOverState, state } = this.databaseLink;
      if (primaryDatabase.role !== 2 || primaryDatabase.state !== 2 || state === 2 || failOverState !== 1) {
        this.availableConditionModalVisible = true;
        this.action = 'restoreSingleSwitch';
      } else {
        this.restoreSingleSwitchConfirm();
      }
    },
    switchHostIp() { //switchIp
      const { primaryHost, viceHost } = this.hostLink;
      if (primaryHost.hostIp === viceHost.hostIp) {
        this.availableConditionModalVisible = true;
        this.action = 'switchHostIp';
      } else {
        this.switchHostIpConfirm();
      }
    },
    readyToCutBack() {
      const { primaryDatabase, viceDatabase, state } = this.databaseLink;
      if (primaryDatabase.role !== 2 || primaryDatabase.state !== 2 || state === 2 || failOverState !== 1) {
        this.availableConditionModalVisible = true;
        this.action = 'readyToCutBack';
      } else {
        this.restoreSingleSwitchConfirm();
      }
    },
    availableConditionCancelBtn() {
      this.availableConditionModalVisible = false;
      this.disableClick = false;
    },
    removeHostLink() {
      this.execute(
        () => {
          [
            this.latestSwitch.content,
            this.latestSwitch.state,
            this.latestSwitch.type
          ] = [
            '正在解除连接',
            1,
            3
          ];
          this.operationPrompt('info', '正在解除连接，请稍候...', 0);
        },
        () => {
          [this.opt.type, this.opt.message] = ['success', '解除连接成功'];
          this.closePrompt();
          [
            this.latestSwitch.content,
            this.latestSwitch.state,
            this.latestSwitch.type
          ] = [
            '解除连接成功',
            2,
            3
          ];
          this.links = [];
        }
      )
    },
    singleSwitchIp({ primaryHost }) {
      this.execute(
        () => {
          [
            this.latestSwitch.content,
            this.latestSwitch.state,
            this.latestSwitch.type
          ] = [
            '正在单切IP',
            1,
            7
          ];
          this.operationPrompt('info', '正在单切IP，请稍候...', 0);
        },
        () => {
          [this.opt.type, this.opt.message] = ['success', '单切IP成功'];
          this.closePrompt();
          [
            this.latestSwitch.content,
            this.latestSwitch.state,
            this.latestSwitch.type
          ] = [
            '单切IP成功',
            2,
            7
          ];
          if (this.osType(primaryHost) === 'Windows') {
            let ip = this.viceHost.hostIp;
            if(!this.simpleSwitch.targetIp) {
              this.simpleSwitch.originIp = this.viceHost.hostIp;
              this.simpleSwitch.targetIp = this.primaryHost.hostIp;
            } else {
              let ip = this.simpleSwitch.originIp;
              this.simpleSwitch.originIp = this.simpleSwitch.targetIp;
              this.simpleSwitch.targetIp = ip;
            }
            this.viceHost.hostIp = this.simpleSwitch.targetIp;
          }
        }
      )
    },
    failOver() {
      this.execute(
        () => {
          this.$set(this.databaseLink, 'failOverOnGoing', true);
          this.operationPrompt('info', '正在进行故障转移，请稍候...', 0);
        },
        () => {
          [this.opt.type, this.opt.message] = ['success', '故障转移操作成功'];
          this.closePrompt();
          this.databaseLink.failOverState = this.databaseLink.failOverState === 0 ? 1 : 0;
          this.$delete(this.databaseLink, 'failOverOnGoing');
        }
      );
    },
    switchHostIpConfirm() {
      this.execute(
        () => {
          let msg = null;
          [
            this.latestSwitch.content,
            this.latestSwitch.state,
            this.latestSwitch.type
          ] = [
            '正在切换IP',
            1,
            2
          ];
          if (this.osType(primaryHost) === 'Windows') {
            msg = `生产设备IP与易备设备IP正在交换，请稍候...`;
          } else if (this.osType(primaryHost) === 'Linux') {
            if (serviceIpMark === 1) {
              msg = `服务IP<strong>${primaryHost.serviceIp}</strong>正在从
                主设备切换至备设备，请稍候...`;
            } else {
              msg = `服务IP<strong>${primaryHost.serviceIp}</strong>正在从
                备设备切换至主设备， 请稍候...`;
            }
          } else if (this.osType(primaryHost) === 'RAC') {
            if (serviceIpMark === 1) {
              msg = `scanIp<strong>${primaryHost.serviceIp}</strong>正在从
                主设备切换至备设备，请稍候...`;
            } else {
              msg = `scanIp<strong>${primaryHost.serviceIp}</strong>正在从
                备设备切换至主设备，请稍候...`;
            }
          }
          this.operationPrompt('info', msg, 0);
        },
        () => {
          [this.opt.type, this.opt.message] = ['success', '切换IP成功'];
          this.closePrompt();
          [
            this.latestSwitch.content,
            this.latestSwitch.state,
            this.latestSwitch.type
          ] = [
            '切换IP成功',
            2,
            2
          ];
          if (this.osType(primaryHost) === 'Windows') {
            let ip = this.primaryHost.hostIp;
            this.primaryHost.hostIp = this.viceHost.hostIp;
            this.viceHost.hostIp = ip;
          } else {
            this.hostLink.serviceIpMark = this.hostLink.serviceIpMark === 1 ? 2 : 1;
          }
        }
      );
    },
    switchMultiDatabasesToProductionConfirm() {
      this.execute(
        () => {
          this.operationPrompt('info', '正在执行切主操作, 请稍候...', 0);
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '正在切换实例中',
            1,
            1
          ];
        },
        () => {
          this.databaseLink.primaryDatabase.role = 1;
          this.databaseLink.viceDatabase.role = 2;
          [this.opt.type, this.opt.message] = ['success', '主备切换成功'];
          this.closePrompt();
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '切换实例成功',
            1,
            2
          ];
        }
      );
    },
    switchMultiDatabasesToEbackupConfirm() {
      this.execute(
        () => {
          this.operationPrompt('info', '正在执行切备操作, 请稍候...', 0);
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '正在切换实例中',
            1,
            1
          ];
        },
        () => {
          this.databaseLink.primaryDatabase.role = 2;
          this.databaseLink.viceDatabase.role = 1;
          [this.opt.type, this.opt.message] = ['success', '主备切换成功'];
          this.closePrompt();
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '切换实例成功',
            1,
            2
          ];
        }
      )
    },
    singleSwitchDatabaseConfirm() {
      this.execute(
        () => {
          this.operationPrompt('info', '正在执行单切实例操作, 请稍候...', 0);
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '正在切换实例中',
            6,
            1
          ];
        },
        () => {
          this.databaseLink.primaryDatabase.role = 2;
          this.databaseLink.viceDatabase.role = 1;
          [this.opt.type, this.opt.message] = ['success', '单切实例成功'];
          this.closePrompt();
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '单切实例成功',
            6,
            2
          ];
        }
      );
    },
    switchDatabaseConfirm() {
      this.execute(
        () => {
          this.operationPrompt('info', '正在执行切换实例操作, 请稍候...', 0);
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '正在切换实例中',
            1,
            1
          ];
        },
        () => {
          let role = this.databaseLink.primaryDatabase.role;
          this.databaseLink.primaryDatabase.role = this.databaseLink.viceDatabase.role;
          this.databaseLink.viceDatabase.role = role;
          [this.opt.type, this.opt.message] = ['success', '切换实例成功'];
          this.closePrompt();
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            '切换实例成功',
            1,
            2
          ];
        }
      );
    },
    restoreSingleSwitchConfirm() {
      let operation = this.action === 'readyToCutBack' ? '回切初始化' : '单切恢复';
      let type = this.action === 'readyToCutBack' ? 5 : 4;
      this.execute(
        () => {
          this.operationPrompt('info', `正在执行${operation}操作, 请稍候...`, 0);
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            `正在${operation}中`,
            type,
            1
          ];
        },
        () => {
          this.databaseLink.primaryDatabase.state = 1;
          this.databaseLink.state = 2;
          [this.opt.type, this.opt.message] = ['success', `${operation}成功`];
          this.closePrompt();
          [
            this.databaseLink.latestSwitch.content,
            this.databaseLink.latestSwitch.type,
            this.databaseLink.latestSwitch.state
          ] = [
            `${operation}成功`,
            type,
            2
          ];
        }
      );
    },
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/guide.scss';
@import '@/style/color.scss';
@import '@/assets/theme/variable.scss';
.primaryLink,
.viceLink {
  text-decoration: none;
}
.primaryLink {
  @include primary-color;
}
.viceLink {
  color: #6d6d6d;
}
.condition-title {
  font-weight: 700;
}
#box {
  padding: 30px 80px;
  @include main-background-color;
  #content {
    min-height: 100%;
    .btn-mask {
      box-shadow: 0px 0px 0px 10000px rgba(0,0,0,.75);
      padding: 10px;
      position: relative;
      .finger {
        position: absolute;
        z-index: 4;
        width: 2.5em;
        height: 2.5em;
        animation: indicate 1s infinite ease-in-out;
        bottom: 0;
        right: 0;
      }
    }
  }
}
@keyframes indicate {
  from {
    transform: translate(calc(100% - 10px), calc(100% - 10px));
  }
  to {
    transform: translate(calc(100% - 15px), calc(100% - 15px));
  }
}
.envHeader {
  text-align: center;
  h2 {
    margin: 5px 0;
  }
}
.envIcon {
  vertical-align: -0.3em;
  height: 2em;
}
.wordHover {
  display: inline-block;
  cursor: pointer;
  transition: all 0.5s ease;
}
.hostIcon {
  vertical-align: -0.3em;
  width: 2em;
}

.hostLinkContainer {
  margin: 10px 0;
  border-radius: 5px;
  @include content-background-color;
}
.hostLinkInOs {
  @include themeify {
    border: 1px dotted themed('primary-color');
  }
  border-radius: 5px;
  & legend {
    @include primary-color;
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
  width: 1.6em;
  display: inline-block;
  vertical-align: -0.3em;
  margin-top: 10px;
}
.restoreSingleSwitchDb {
  position: absolute;
  margin-top: -0.3em;
  right: 10px;
  width: 2em;
  height: 2em;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  } 
}
.dropdownLink {
  cursor: pointer;
  @include primary-color;
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
  color: $delete-color!important;
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
  @include themeify {
    border: 1px solid themed('primary-color');
  }
  border-radius: 5px;
  transition: box-shadow 0.5s;
  &:hover {
    @include themeify {
      box-shadow: 0px 0px 2px 1px themed('primary-color');
    }
  }
}
.viceDatabaseInfo {
  @include themeify {
    border: 1px solid themed('vice-color');
  }
  border-radius: 5px;
  transition: box-shadow 0.5s;
  &:hover {
    @include themeify {
      box-shadow: 0px 0px 2px 1px themed('vice-color');
    }
  }
}

.primaryDatabaseInfo,
.viceDatabaseInfo {
  padding: 5px 0 5px 10px;
  margin: 8px 0;
  min-height: 100px;
  text-align: center;
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
}
.primaryRole {
  text-align: center;
  @include themeify {
    background-color: themed('primary-color')
  }
  color: #ffffff;
  font-size: 2.8em;
  line-height: 2.3em;
  height: 111px;
  margin: -5px -1px;
  border-radius: 0 3px 3px 0;
}
.viceRole {
  text-align: center;
  @include themeify {
    background-color: themed('vice-color')
  }
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
.switchIcon,
.transportationIcon {
  width: 3em;
  height: 3em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.rightMask,
.leftMask {
  animation: move 2s infinite;
  position: absolute;
  height: 3em;
  width: 100px;
  right: -20px;
  @include content-background-color;
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
.configureTabContainer {
  // height: 260px;
  margin: {
    top: 10px;
  }
}
.instruction-icon {
  height: 1.8em;
  width: 2em;
  vertical-align: -0.6em;
}
.light-bulp-icon {
  width: 1.7em;
  height: 2em;
  vertical-align: -0.6em;
}
.instruction-icon,
.light-bulp-icon {
  margin-right: 5px;
}
.instruction-title {
  @include primary-color;
}
.text-indentation {
  text-indent: 35px;
}
.line-space {
  height: 30px;
  line-height: 30px;
}
</style>
