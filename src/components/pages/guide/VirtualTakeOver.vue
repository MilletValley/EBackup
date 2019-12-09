<template>
  <el-container style="height: 100%;">
    <el-header>
      <my-header></my-header>
    </el-header>
    <div id="box" class="custom-scrollbar el-main">
      <div id="content">
        <el-steps :active="active"
                  finish-status="success"
                  align-center
                  class="step cp">
          <el-step title="选择虚拟机"
                    @click.native="active = 1"
                    description="从虚拟机列表入口，或者虚拟机主机入口，选择需要做接管的虚拟机（单选/多选）"></el-step>
          <el-step title="同步初始化"
                    @click.native="active = 2"
                    description="据实填入虚拟机一键接管的相关配置信息"></el-step>
          <el-step title="功能操作"
                    @click.native="active = 3"
                    description="初始化过程中，源虚拟机将进行一次全备，复制出一台同步虚拟机，可根据当前虚拟机状态选择相关操作"></el-step>
        </el-steps>
        <el-row v-show="active === 1" style="padding: 0 80px">
          <div style="height: 60px; line-height: 60px;">
            <span style="float: left">选择虚拟机</span>
          </div>
          <el-table :data="virtuals"
                    style="width: 100%"
                    size="small"
                    ref="virtualList">
            <el-table-column type="selection"
                              width="55"></el-table-column>
            <el-table-column label="名称"
                              min-width="200"
                              align="center">
              <template slot-scope="scope">
                <el-button type="text">
                  {{ scope.row.vmName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="vmPath"
                              label="路径"
                              min-width="300"
                              header-align="center"></el-table-column>
            <el-table-column prop="vmHostName"
                              min-width="100"
                              label="所属物理主机"
                              align="center"></el-table-column>
            <el-table-column label="状态"
                              min-width="80"
                              align="center">
              <template slot-scope="scope">
                <el-tag size="mini"
                        :type="scope.row.bootState === 0 ? 'danger' : 'success'">
                  {{ bootStateMapping[scope.row.bootState] }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary"
                      @click="active = 2"
                      class="fr"
                      size="small"
                      style="margin-top: 20px">下一步</el-button>
        </el-row>
        <el-row v-show="active === 2" style="margin-top: 40px">
          <el-col :span="14"
                  :offset="5">
            <el-card class="form-card">
              <el-form :model="createLink"
                      disabled
                      size="small"
                      label-width="100px">
                <span class="form-title">同步初始化</span>
                <el-form-item label="同步主机">
                  <el-select style="width: 100%"
                              v-model="createLink.serverName">
                    <el-option :value="createLink.serverName"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="同步磁盘">
                  <el-select style="width: 100%"
                              v-model="createLink.savePath">
                    <el-option :value="createLink.savePath"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="虚拟机名">
                  <el-input v-model="createLink.vmName"></el-input>
                </el-form-item>
                <el-form-item label="虚拟机IP">
                  <el-input v-model="createLink.ip"></el-input>
                </el-form-item>
                <el-form-item label="同步策略">
                  <el-radio-group v-model.number="createLink.syncTimeStrategy">
                    <el-radio v-for="strategy in Object.keys(syncStragegyMapping)"
                              :key="strategy"
                              :label="Number(strategy)">{{ syncStragegyMapping[strategy] }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="同步周期"
                              class="is-required">
                  <el-input-number v-model="createLink.syncTimeInterval"
                                  :min="1"
                                  :max="24"
                                  :step="1"
                                  contrls-position="right"></el-input-number>
                  <span>（单位：小时）</span>
                </el-form-item>
              </el-form>
              <el-button type="primary"
                          @click="active = 3"
                          class="fr"
                          size="small">下一步</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-show="active === 3"
                style="margin-top: 10px">
          <section v-if="link.id">
            <el-row>
              <el-col :span="10">
                <div class="envHeader">
                  <h2 class="headerTitle">
                    <i-icon name="virtual-source" class="envIcon"></i-icon>
                    <span>源虚拟机</span>
                  </h2>
                </div>
              </el-col>
              <el-col :span="10"
                      :offset="4">
                <div class="envHeader">
                  <h2 class="headerTitle">
                    <i-icon name="virtual-target" class="envIcon"></i-icon>
                    <span>同步虚拟机</span>
                  </h2>
                </div>
              </el-col>
            </el-row>
            <div class="linkContainer">
              <div style="position: relative">
                <el-row style="display: flex">
                  <el-col :span="10">
                    <div :class="link.sourceVirtual.state === 0 ? 'sourceVirtualInfo' : 'errorVirtualInfo'">
                      <i-icon name="alarm" class="alarmInfo" v-if="link.sourceVirtual.state === 1"></i-icon>
                      <el-row type="flex"
                              align="middle"
                              style="align-self: center; width: 100%">
                        <el-col :span="8"
                                class="virtualInfoCol">
                          <h4>
                            <el-tooltip content="提供服务中"
                                        placement="top"
                                        effect="light">
                              <i-icon name="service" class="linkService" v-show="[0, 1].includes(link.state)"></i-icon>
                            </el-tooltip>
                            <el-button type="text">{{ link.sourceVirtual.vmName }}</el-button>
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
                  <el-col :span="4" style="align-items: center; align-self: center">
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
                          <el-form-item label="下次同步时间"
                                        class="syncFormItem"
                                        v-if="link.strategyConfig.nextSyncTime">
                            <span>{{ link.strategyConfig.nextSyncTime }}</span>
                          </el-form-item>
                        </el-form>
                        <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">上次同步状态</h4>
                        <p v-if="!link.syncTime">暂未同步</p>
                        <el-form size="mini"
                                label-width="100px"
                                v-else>
                          <el-form-item class="syncFormItem"
                                        label="同步状态">
                            <el-tag :type="link.syncState | syncStateStyleFilter"
                                    size="mini">{{ link.syncState | syncStateFilter }}</el-tag>
                          </el-form-item>
                          <el-form-item class="syncFormItem"
                                        label="时间">
                            <span>{{ link.syncTime }}</span>
                          </el-form-item>
                        </el-form>
                        <h4 style="margin: 10px 0 5px; padding: 3px 0;border-top: 1px solid;">最近一次操作</h4>
                        <p v-if="!Object.keys(link.latestOperationInfo).length">暂无操作</p>
                        <el-form size="mini"
                                label-width="100px"
                                v-else>
                          <el-form-item class="syncFormItem"
                                        label="操作内容">
                            <span>{{ link.latestOperationInfo.content }}</span>
                          </el-form-item>
                          <el-form-item class="syncFormItem"
                                        label="操作类型">
                            <span>{{ link.latestOperationInfo.type | syncOperationFilter }}</span>
                          </el-form-item>
                          <el-form-item class="syncFormItem"
                                        label="状态">
                            <el-tag :type="link.latestOperationInfo.state | operationStateStyleFilter"
                                    size="mini">
                              {{ link.latestOperationInfo.state | operationStateFilter }}
                            </el-tag>
                          </el-form-item>
                          <el-form-item class="syncFormItem"
                                        label="时间">
                            <span>{{ link.latestOperationInfo.time }}</span>
                          </el-form-item>
                        </el-form>
                        <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                            v-if="link.state === 0 || (link.state === 1 && link.currentSyncStatus === 1)">
                          <div class="rightMask"></div>
                          <i-icon :name="`${linkIcon(link)}`" class="linkIcon"></i-icon>
                        </div>
                        <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                            v-else-if="link.state === 3">
                            <div class="leftMask"></div>
                            <i-icon :name="`${linkIcon(link)}`" class="linkIcon"></i-icon>
                        </div>
                        <div slot="reference" style="position: relative; height: 3em; display: inline-block"
                            v-else>
                          <i-icon :name="`${linkIcon(link)}`" class="linkIcon"></i-icon>
                        </div>
                      </el-popover>
                      <div v-if="link.latestOperationInfo && link.latestOperationInfo.state === 1"
                          style="color: #666666;font-size: 0.9em; vertical-align: 0.1em;">
                        <i class="el-icon-loading"></i>
                        <span class="switch-text">{{ link.latestOperationInfo.type | syncOperationFilter }}中...</span>
                      </div>
                      <div v-else-if="link.state === 0">
                        <i class="el-icon-loading"></i>
                        <span class="switch-text">初始化中...</span>
                      </div>
                      <div v-else>
                        <div>
                          <el-button type="text"
                                      class="deleteLink"
                                      :disabled="disableClick"
                                      @click.native="cancelLink">解除连接</el-button>
                        </div>
                        <div>
                          <el-dropdown>
                            <span class="dropdownLink">
                              同步操作<i class="el-icon-arrow-down el-icon--right" style="font-size: 12px; margin-left: 0"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="failOver"
                                                :disabled="disableClick">故障转移</el-dropdown-item>
                              <el-dropdown-item @click.native="failBack"
                                                :disabled="disableClick">故障恢复</el-dropdown-item>
                              <el-dropdown-item @click.native="updateStrategy"
                                                :disabled="disableClick">修改策略</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div class="targetVirtualInfo">
                      <el-row type="flex"
                              align="middle"
                              style="align-self: center; width: 100%"
                              v-if="link.targetVirtual.vmName">
                        <el-col :span="8"
                                class="virtualInfoCol">
                          <h4>
                            <el-tooltip content="提供服务中"
                                        placement="top"
                                        effect="light">
                              <i-icon name="service" class="linkService" v-show="[2, 3].includes(link.state)"></i-icon>
                            </el-tooltip>
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
                      <h4 v-else class="virtualInfo">暂无信息</h4>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </section>
          <section v-show="link.id"
                   style="padding: 20px 40px"
                   class="linkContainer">
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
        </el-row>
      </div>
    </div>
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
    <el-dialog :visible.sync="updateStrategyModalVisible"
              custom-class="min-width-dialog"
              title="更新策略">
      <el-form size="small"
              label-width="100px"
              ref="refForm"
              :model="strategyFormData"
              disabled>
        <el-form-item label="同步策略">
          <el-radio-group v-model.number="strategyFormData.syncTimeStrategy">
            <el-radio v-for="strategy in Object.keys(syncStragegyMapping)"
                      :key="strategy"
                      :label="Number(strategy)">{{ syncStragegyMapping[strategy] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="同步周期" class="is-required"
                      v-show="strategyFormData.syncTimeStrategy === 1">
          <el-input-number v-model="strategyFormData.minuteInterval"
                          :min="1"
                          :max="60"
                          :step="10"
                          contrls-position="right"></el-input-number>
          <span>（单位：分钟）</span>
        </el-form-item>
        <el-form-item label="同步周期" class="is-required"
                      v-show="strategyFormData.syncTimeStrategy === 2">
          <el-input-number v-model="strategyFormData.hourInterval"
                          :min="1"
                          :max="24"
                          :step="1"
                          contrls-position="right"></el-input-number>
          <span>（单位：小时）</span>
        </el-form-item>
        <el-form-item label="选择星期" class="is-required"
                      v-show="strategyFormData.syncTimeStrategy == 4">
        <el-checkbox-group v-model="strategyFormData.weekDays">
          <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                              :label="Number(w)"
                              :key="w">{{ weekMapping[w] }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
        <el-form-item label="时间点"
                      style="width: 100%"
                      class="is-required"
                      v-show="[3, 4].indexOf(strategyFormData.syncTimeStrategy) !== -1">
        <el-time-select v-model="strategyFormData.syncRunTime"
                        :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
      </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updateStrategyModalVisible = false">取消</el-button>
        <el-button type="primary"
                  @click="updateStrategyConfirm">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import dayjs from 'dayjs';
import { pageMixin } from '@/components/mixins/guideMixins';
import IIcon from '@/components/IIcon';
import MyHeader from '@/components/MyHeader';
import {
  bootStateMapping,
  syncStragegyMapping,
  weekMapping,
  syncLinkMapping,
  syncOperationMapping,
  syncStateMapping,
  syncOperationStateMapping
} from '@/utils/constant';
import {
  sourceVirtual,
  createLink,
  virtualLink,
  targetVirtual,
  latestOperationInfo,
  strategyFormData
} from '@/utils/guide/vm-takeover';
import { setTimeout, clearTimeout } from 'timers';
const actionMapping = {
  failOver: {
    title: '故障转移',
    instructions: ['源虚拟机发生故障', '源虚拟机已关闭', '源虚拟机和同步虚拟机连接处于同步状态'],
    result: '源虚拟机业务转移至同步虚拟机',
    explain: '当源虚拟机故障时，启用同步虚拟机，将业务转移到同步虚拟机'
  },
  failBack: {
    title: '故障恢复',
    instructions: ['源虚拟机恢复正常', '同步虚拟机已关闭', '源虚拟机和同步虚拟机连接处于故障转移状态'],
    result: '业务从同步虚拟机恢复至源虚拟机',
    explain: '当源虚拟机恢复后，将业务恢复到源虚拟机，并关闭同步虚拟机'
  },
  updateStrategy: {
    title: '修改策略',
    instructions: [],
    explain: '在接管过程中，可修改接管同步策略'
  },
  cancelLink: {
    title: '解除连接',
    instructions: [],
    explain: '解除一键接管连接'
  }
};
export default {
  name: 'VirtualTakeOver',
  mixins: [pageMixin],
  components: {
    IIcon,
    MyHeader
  },
  data() {
    return {
      active: 1,
      bootStateMapping,
      syncStragegyMapping,
      weekMapping,
      createLink,
      actionMapping,
      link: {},
      disableClick: true,
      opt: {
        type: 'info',
        message: '',
        duration: 0
      },
      close: null,
      action: null,
      availableConditionModalVisible: false,
      updateStrategyModalVisible: false,
      timer: null,
      initialize: null,
      strategyFormData
    };
  },
  watch: {
    active(val) {
      if (val === 3) {
        this.link = cloneDeep({ ...virtualLink, latestOperationInfo });
        this.operationPrompt('info', '正在同步初始化，请稍候...', 0);
        this.initialize = setTimeout(() => {
          const { strategyConfig } = this.link;
          const presentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
          this.link = Object.assign(this.link, {
            syncState: 0,
            state: 1,
            syncTime: presentTime,
            strategyConfig: Object.assign(
              strategyConfig,
              { nextSyncTime: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss') }
            ),
            targetVirtual
          });
          [this.opt.type, this.opt.message] = ['success', '初始化成功，重新复制出一台同步虚拟机'];
          this.closePrompt();
          this.disableClick = false;
        }, 10000);
      } else {
        this.closePrompt();
        clearTimeout(this.initialize);
        clearTimeout(this.timer);
        this.link = {};
      }
    },
    nextSyncTime(val) {
      const { strategyConfig } = this.link;
      if (strategyConfig) {
        const { syncTimeStrategy } = strategyConfig;
        const hourUnix = 60 * 60 * 1000;
        const timeInterval = syncTimeStrategy === 2 ? hourUnix : 24 * hourUnix;
        this.syncFunc(timeInterval);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.virtualList.toggleAllSelection();
    });
  },
  beforeDestroy() {
    this.closePrompt();
    clearTimeout(this.initialize);
    clearTimeout(this.timer);
  },
  computed: {
    virtuals() {
      return [sourceVirtual];
    },
    nextSyncTime() {
      return this.link.strategyConfig && this.link.strategyConfig.nextSyncTime;
    }
  },
  filters: {
    ipFilter(value) {
      // eslint-disable-next-line
      return value ? value : '暂无';
    },
    linkStateFilter(type) {
      return syncLinkMapping[type];
    },
    syncStrategyFilter(type) {
      return syncStragegyMapping[type];
    },
    syncOperationFilter(type) {
      return syncOperationMapping[type];
    },
    operationStateStyleFilter(state) {
      if (state === 0) {
        return 'success';
      } else if (state === 1) {
        return 'warning';
      } else if (state === 2) {
        return 'danger';
      }
      return '';
    },
    operationStateFilter(state) {
      return syncOperationStateMapping[state];
    },
    linkStateStyleFilter(type) {
      switch (type) {
        case 0:
        case 1:
          return 'warning';
        case 2:
        case 3:
        case 4:
          return 'danger';
        default:
          return 'primary';
      }
    },
    syncStateStyleFilter(state) {
      if (state === 0) {
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
  },
  methods: {
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
    linkIcon(link) {
      if (link.state === 0 || (link.state === 1 && link.currentSyncStatus === 1)) { // 初始化或同步中
        return 'transportationRight';
      } else if (link.state === 1 && link.currentSyncStatus === 0) { // 同步状态
        return 'switch-2';
      } else if (link.state === 2 && link.latestOperationInfo.type === 0 && link.latestOperationInfo.state === 1) {
        return 'link-exchange'; // 故障转移中
      } else if (link.state === 2) { // 故障转移状态
        return 'link-stop';
      } else if (link.state === 3) { // 故障恢复中
        return 'transportationLeft-warning';
      } else if (link.state === 4) {
        return 'switch-3';
      }
      return '';
    },
    readyExecute(adjustFunc, executeFunc) {
      this.initialize = setTimeout(() => {
        adjustFunc(); // 调整环境状态函数
        [this.opt.type, this.opt.message] = ['success', '环境调整成功'];
        this.closePrompt();
        this.initialize = setTimeout(
          executeFunc, // 执行操作函数
          3000
        );
      }, 3000);
    },
    execute(inExecutionFunc, executed) {
      inExecutionFunc(); // 操作中
      this.disableClick = true;
      this.initialize = setTimeout(() => {
        this.disableClick = false;
        executed(); // 操作结束
      }, 5000);
    },
    failOver() {
      this.disableClick = true;
      const { sourceVirtual, state } = this.link;
      if (sourceVirtual.state === 1 && state === 1) {
        this.failOverConfirm();
      } else {
        this.action = 'failOver';
        this.availableConditionModalVisible = true;
      }
    },
    failBack() {
      this.disableClick = true;
      const { sourceVirtual, state } = this.link;
      if (sourceVirtual.state === 0 && state === 2) {
        this.failBackConfirm();
      } else {
        this.action = 'failBack';
        this.availableConditionModalVisible = true;
      }
    },
    cancelLink() {
      this.execute(
        () => {
          this.link.latestOperationInfo = Object.assign(
            { ...this.link.latestOperationInfo },
            {
              content: '正在解除连接中',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              state: 1,
              type: 2
            }
          );
          this.operationPrompt('info', '正在解除连接，请稍候...', 0);
        },
        () => {
          [this.opt.type, this.opt.message] = ['success', '解除连接成功'];
          this.closePrompt();
          this.link = {};
        }
      );
    },
    updateStrategy() {
      this.updateStrategyModalVisible = true;
    },
    updateStrategyConfirm() {
      this.updateStrategyModalVisible = false;
      const { syncTime } = this.link;
      this.link.strategyConfig = Object.assign(
        { ...this.link.strategyConfig },
        {
          ...this.strategyFormData,
          nextSyncTime: `${dayjs(syncTime).add(1, 'day').format('YYYY-MM-DD')} ${this.strategyFormData.syncRunTime}`
        }
      );
      this.$message({
        type: 'success',
        message: '同步策略修改成功',
        offset: this.messageOffset
      });
    },
    failOverConfirm() {
      this.execute(
        () => {
          this.operationPrompt('info', '正在执行故障转移操作, 请稍候...', 0);
          this.link.state = 2;
          this.link.latestOperationInfo = Object.assign(
            { ...this.link.latestOperationInfo },
            {
              content: '正在进行故障转移中',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              state: 1,
              type: 0
            }
          );
        },
        () => {
          [this.opt.type, this.opt.message] = ['success', '故障转移操作成功'];
          this.closePrompt();
          this.link.latestOperationInfo = Object.assign(
            { ...this.link.latestOperationInfo },
            {
              content: '成功将源虚拟机业务切换至同步虚拟机',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              state: 0
            }
          );
        }
      );
    },
    failBackConfirm() {
      this.execute(
        () => {
          this.operationPrompt('info', '正在执行故障恢复操作, 请稍候...', 0);
          this.link.state = 3;
          this.link.latestOperationInfo = Object.assign(
            { ...this.link.latestOperationInfo },
            {
              content: '正在进行故障恢复中',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              state: 1,
              type: 1
            }
          );
        },
        () => {
          [this.opt.type, this.opt.message] = ['success', '故障恢复操作成功'];
          this.closePrompt();
          this.link.state = 1;
          this.link.latestOperationInfo = Object.assign(
            { ...this.link.latestOperationInfo },
            {
              content: '成功将同步虚拟机业务恢复至源虚拟机',
              time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              state: 0
            }
          );
        }
      );
    },
    switchConfirm() {
      this.availableConditionModalVisible = false;
      this.operationPrompt('warning', '正在修改当前环境，请稍候...', 0);
      this.disableClick = true;
      if (this.action === 'failOver') {
        this.readyExecute(
          () => {
            this.link.sourceVirtual.state = 1;
            this.link.state = 1;
          },
          this.failOverConfirm
        );
      } else if (this.action === 'failBack') {
        this.readyExecute(
          () => {
            this.link.sourceVirtual.state = 0;
            this.link.state = 2;
          },
          this.failBackConfirm
        );
      }
    },
    availableConditionCancelBtn() {
      this.availableConditionModalVisible = false;
      this.disableClick = false;
    },
    syncFunc(timeInterval) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.disableClick = true;
        this.operationPrompt('info', '正在同步, 请稍候...', 0);
        this.link.state = 1;
        this.link.currentSyncStatus = 1;
        this.initialize = setTimeout(() => {
          this.disableClick = false;
          [this.opt.type, this.opt.message] = ['success', '同步成功'];
          this.closePrompt();
          this.disableClick = false;
          const { nextSyncTime, syncTimeStrategy } = this.link.strategyConfig;
          this.link = Object.assign(
            { ...this.link },
            {
              currentSyncStatus: 0,
              syncState: 0,
              syncTime: nextSyncTime
            }
          );
          this.link.strategyConfig.nextSyncTime = dayjs(nextSyncTime)
            .add(1, syncTimeStrategy === 2 ? 'hour' : 'day').format('YYYY-MM-DD HH:mm:ss');
        }, 10000);
      }, timeInterval);
    }
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
    min-height: 100%;
    .form-card {
      padding: 30px 30px 30px 20px;
      .form-title {
        margin-top: -25px;
        margin-bottom: 20px;
        display: block;
      }
    }
    .finger {
      position: absolute;
      z-index: 4;
      width: 2.5em;
      height: 2.5em;
      animation: indicate 1s infinite ease-in-out;
      top: 30px;
      right: -30px;
    }
    .btn-mask {
      box-shadow: 0px 0px 0px 10000px rgba(0,0,0,.75);
      padding: 10px;
    }
  }
}
@keyframes indicate {
  from {
    transform: translate(5px, 5px);
  }
  to {
    transform: translate(0, 0);
  }
}
.switchModalIcon {
  width: 9em;
  height: 9em;
  margin: 25% 25%;
}
.condition-title {
  font-weight: 700;
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
.envHeader {
  text-align: center;
}
.headerTitle {
  margin: 5px 0;
}
.envIcon {
  vertical-align: -0.3em;
  height: 1.2em;
}
.linkContainer {
  margin: 10px 0;
  border-radius: 5px;
  @include content-background-color;
}
.sourceVirtualInfo {
  @include themeify {
    border: 1px solid themed('primary-color');
  }
}
.errorVirtualInfo {
  animation: glow 500ms ease-out infinite alternate;
  position: relative;
}
.alarmInfo {
  vertical-align: -0.3em;
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5em;
  animation: alarm 500ms ease-out infinite alternate;
}
@keyframes glow {
  0% {
    border: 1px solid #d61026;
    box-shadow: 0 0 5px rgba(247, 3, 3, 0.6), inset 0 0 5px rgba(247, 3, 3,.4);
  }
  100% {
    border: 1px solid transparent;
    box-shadow: 0 0 0 transparent;
  }
}
@keyframes alarm {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.targetVirtualInfo {
  @include themeify {
    border: 1px solid themed('vice-color');
  }
  position: relative;
}
.sourceVirtualInfo:hover {
  @include themeify {
    box-shadow: 0px 0px 2px 1px themed('primary-color');
  }
}
.targetVirtualInfo:hover {
  @include themeify {
    box-shadow: 0px 0px 2px 1px themed('vice-color');
  }
}
.sourceVirtualInfo,
.targetVirtualInfo,
.errorVirtualInfo {
  border-radius: 5px;
  transition: box-shadow 0.5s;
  padding: 5px 0 5px 10px;
  margin: 8px 0;
  min-height: 100px;
  display: flex;
}
.virtualInfoCol {
  text-align: center;
  line-height: 2em;
  h4 {
    margin: 0;
    padding: 0;
  }
  p {
    margin: 0;
    padding: 0;
  }
}
.virtualInfo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-150%);
}
.virtualSync {
  text-align: center;
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
  color: rgb(223, 77, 77)!important;
  padding: 2px 0 3px;
}
.deleteLink:hover {
  color: lighten(rgb(223, 77, 77), 10%);
  transform:scale(1.2);
}
.dropdownLink {
  cursor: pointer;
  @include primary-color;
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
.linkService {
  vertical-align: -0.3em;
  transition: all 0.5s ease;
  height: 1.8em;
}
.linkService:hover {
  transform: scale(1.2);
  cursor: pointer;
}
@keyframes move {
  from {
    width: 100px;
  }
  to {
    width: 0;
  }
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
