<!-- eslint-disable -->
<template>
  <div>
    <div class="step-help" v-show="nextStep === 'stop'" @click="forwardStep">
      <i-icon name="guide-help" style="height: 70%; vertical-align: middle"></i-icon>
      <div class="step-help-text">指引帮助</div>
    </div>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="guide-db" class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{ detail.name }}</h1>
              </el-col>
              <el-col :span="12"
                      :offset="4"
                      class="action">
                <div :class="{ 'btn-mask': ['createBackupPlan', 'createRestorePlan'].includes(nextStep) }">
                  <el-dropdown size="mini"
                                trigger="click"
                                placement="bottom"
                                @command="createPlanBtnClick"
                                style="float: right">
                    <el-button size="mini"
                                plain>添加计划
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="backup"
                                        :disabled="!['stop', 'createBackupPlan'].includes(nextStep)">备份计划</el-dropdown-item>
                      <el-dropdown-item command="restore"
                                        :disabled="!['stop', 'createRestorePlan'].includes(nextStep)">恢复计划</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <div v-show="['createBackupPlan', 'createRestorePlan'].includes(nextStep)">
                    <div class="balloons"
                         style="top: -15px; left: 20px; transform: translateY(-100%)">
                      <div class="bottom-arrow-bubble">
                        {{ promptText(nextStep) }}
                        <p class="bubble-btn">
                          <span type="text" @click="skipStep"
                                            v-show="nextStep === 'createRestorePlan'">跳过</span>
                          <span type="text" @click="cancelStep">取消</span>
                        </p>
                      </div>
                    </div>
                    <i-icon name="finger" class="finger" style="top: 40px; right: -30px;"></i-icon>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-form label-position="left"
                     label-width="100px"
                     size="small"
                     class="item-info">
              <el-row style="margin-right: 5px;">
                <el-col :span="16">
                  <el-col :span="12">
                    <el-form-item label="实例名：">
                      <span>{{ detail.instanceName }}</span>
                    </el-form-item>
                    <el-form-item label="端口号：">
                      <span>{{ detail.dbPort }}</span>
                    </el-form-item>
                    <el-form-item label="数据库状态：">
                      <el-tag size="mini"
                              type="success">{{ databaseStateMapping[detail.state] }}</el-tag>
                    </el-form-item>
                    <el-form-item label="设备IP：">
                      <span>{{ detail.host.hostIp }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="主机名：">
                      <span>{{ detail.host.name }}</span>
                    </el-form-item>
                    <el-form-item label="操作系统：">
                      <span>{{ detail.host.osName }}</span>
                    </el-form-item>
                    <el-form-item label="所属设备：">
                      <span>{{ detail.host.name }}</span>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </header>
    <div :class="{ 'card-mask' : !['stop',  'createRestorePlan', 'createBackupPlan'].includes(nextStep) }">
      <transition name="el-zoom-in-center">
        <div v-show="['showPlans', 'showBackupPlans', 'showRestorePlans', 'resultsToRestore', 'showResults', 'showRecords'].includes(nextStep)">
          <div class="balloons" :style="{ left: promptLeft, top: promptTop }">
            <div class="left-arrow-bubble">
              {{ promptText(nextStep) }}
              <p class="bubble-btn">
                <span type="text" @click="cancelStep">取消</span>
              </p>
            </div>
          </div>
          <i-icon name="finger" class="finger" :style="{ left: fingerLeft, top: fingerTop }"></i-icon>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div class="balloons"
            style="top: 55px; left: -15px; transform: translateX(-100%)"
            v-show="nextStep === 'showFilters'">
          <div class="right-arrow-bubble">
            点击‘过滤’文字按钮，可按条件筛选备份集
            <p class="bubble-btn">
              <span type="text" @click="filterResults">继续</span>
              <span type="text" @click="cancelStep">取消</span>
            </p>
          </div>
        </div>
      </transition>
      <div v-show="nextStep === 'confirm'"
          class="balloons"
          style="top: 5px; right: -15px; transform: translateX(100%)">
        <div class="left-arrow-bubble">
          操作已完成
          <p class="bubble-btn">
            <span type="text" @click="cancelStep">我知道了</span>
          </p>
        </div>
      </div>
      <transition name="el-zoom-in-center">
        <div v-show="nextStep === 'selectToSingleRestorePlan'"
            class="balloons"
            style="top: 5px; right: -15px; transform: translateX(100%)">
          <div class="left-arrow-bubble">
            计划恢复操作完成，选择是否进入立即恢复功能操作
            <p class="bubble-btn">
              <span type="text" @click="stepType = 'singleRestorePlan'">确定</span>
              <span type="text" @click="cancelStep">取消</span>
            </p>
          </div>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="nextStep === 'waiting'"
              class="balloons"
              :style="`top: ${operation === 'backup' ? '200px' : '250px'}; right: -15px; transform: translateX(100%)`">
          <div class="left-arrow-bubble">
            {{ promptText(nextStep) }}
            <p class="bubble-btn">
              <span type="text" @click="cancelStep">取消</span>
            </p>
          </div>
        </div>
      </transition>
      <el-tabs class="tabs"
                v-model="activeTab"
                @tab-click="switchPane">
        <el-tab-pane label="操作计划"
                     name="plans"
                     :disabled="!['stop', 'showPlans', 'showBackupPlans'].includes(nextStep)">
          <el-form inline
                  size="small"
                  :model="planFilterForm"
                  class="filterForm">
            <el-form-item class="filterFormItem">
              <el-radio border
                        v-model="planFilterForm.planType"
                        :disabled="!['stop', 'showBackupPlans'].includes(nextStep)"
                        label="backup"
                        @change="switchPlan">备份计划</el-radio>
              <el-radio border
                        v-model="planFilterForm.planType"
                        :disabled="!['stop', 'showRestorePlans'].includes(nextStep)"
                        label="restore"
                        @change="switchPlan">恢复计划</el-radio>
            </el-form-item>
            <el-form-item class="filterFormItem"
                          label="隐藏已完成计划">
              <el-switch v-model="planFilterForm.hiddenCompletePlan"></el-switch>
            </el-form-item>
          </el-form>
          <!-- 备份计划面板 -->
          <database-backup-card :id="plan.id"
                                v-for="plan in filteredBackupPlans"
                                :key="plan.id"
                                :backup-plan="plan"
                                @deletePlan="deleteBackupPlan"
                                @updatePlan="selectBackupPlan(plan.id)"></database-backup-card>
          <template>
            <!-- 恢复计划面板 -->
            <database-restore-card :id="plan.id"
                                    v-for="plan in filteredRestorePlans"
                                    :key="plan.id"
                                    :restore-plan="plan"
                                    @deletePlan="deleteRestorePlan"
                                    @updatePlan="selectRestorePlan(plan.id)"></database-restore-card>
          </template>
        </el-tab-pane>
        <el-tab-pane label="备份集"
                     name="results"
                     :disabled="!['stop', 'showResults', 'resultsToRestore'].includes(nextStep)">
          <!-- 备份集列表-->
          <database-backup-result-list :data="results"
                                        :next-step="nextStep"
                                        @single-restore-btn-click="initSingleRestoreModal"
                                        @filter-results="filterResults"
                                        @cancel-step="cancelStep"></database-backup-result-list>
        </el-tab-pane>
        <el-tab-pane label="恢复记录"
                      name="records"
                      :disabled="!['stop', 'showRecords'].includes(nextStep)">
          <!-- 恢复记录列表-->
          <database-restore-records :restore-plan="restorePlans"
                                    :records="records"></database-restore-records>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="backupPlanModalVisible"
               title="添加备份计划"
               @opened="dialogOpened">
      <el-form :model="backupPlanFormData"
               label-width="110px"
               size="small"
               disabled>
        <el-form-item label="备份计划名称" 
                      prop="name">
          <el-input v-model="backupPlanFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="备份策略" class="is-required"
                      prop="backupStrategy">
					<el-radio-group v-model="backupPlanFormData.backupStrategy">
						<el-radio :label="1">全备+增备</el-radio>
            <el-radio :label="2">全备+日志备份</el-radio>
          </el-radio-group>
        </el-form-item>
				<time-strategy :form-data="backupPlanFormData"
                       type="sqlserver"
                       :disable="true"></time-strategy>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="createBackupPlanConfirm">确定</el-button>
        <el-button @click="backupPlanModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="restorePlanModalVisible"
               @opened="dialogOpened"
               title="添加恢复计划">
      <el-form :model="restorePlanFormData"
               label-width="100px"
               size="small"
               disabled>
        <el-form-item label="恢复计划名称" 
                      prop="name">
          <el-input v-model="restorePlanFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="恢复设备"
                      prop="hostIp">
          <el-input v-model="restorePlanFormData.hostIp"></el-input>
        </el-form-item>
        <el-row>
					<el-col :span="12" >
						<el-form-item label="数据库名"
													prop="detailInfo">
							<el-input v-model="restorePlanFormData.detailInfo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="端口号"
													prop="dbPort">
							<el-input v-model.number="restorePlanFormData.dbPort"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
        <time-interval :form-data="restorePlanFormData"
                       type="sqlserver"
                       :disable="true"></time-interval>
        <el-row>
					<el-col :span="12">
						<el-form-item label="登录名"
													prop="loginName">
							<el-input v-model="restorePlanFormData.loginName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="登录密码"
													prop="password">
							<el-input v-model="restorePlanFormData.password"
                        type="password"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="createRestorePlanConfirm">确定</el-button>
        <el-button @click="restorePlanModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="singleRestoreCreateModalVisible"
               @opened="dialogOpened"
               title="执行恢复操作">
      <el-form :model="singleRestorePlanFormData"
               label-width="100px"
               size="small"
               disabled>
        <el-form-item label="恢复计划名称" 
                      prop="name">
          <el-input v-model="restorePlanFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="恢复设备"
                      prop="hostIp">
          <el-input v-model="restorePlanFormData.hostIp"></el-input>
        </el-form-item>
        <el-row>
					<el-col :span="12" >
						<el-form-item label="数据库名"
													prop="detailInfo">
							<el-input v-model="restorePlanFormData.detailInfo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="端口号"
													prop="dbPort">
							<el-input v-model.number="restorePlanFormData.dbPort"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row>
					<el-col :span="12">
						<el-form-item label="登录名"
													prop="loginName">
							<el-input v-model="restorePlanFormData.loginName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="登录密码"
													prop="password">
							<el-input v-model="restorePlanFormData.password"
                        type="password"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="createSingleRestorePlanConfirm">确定</el-button>
        <el-button @click="singleRestoreCreateModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { databaseStateMapping } from '@/utils/constant';
import { detailMixin } from '@/components/mixins/guideMixins';
import baseMixin from '@/components/mixins/baseMixins';
import DatabaseBackupCard from '@/components/pages/guide/DatabaseBackupCard';
import DatabaseBackupResultList from '@/components/pages/guide/DatabaseBackupResultList';
import DatabaseRestoreCard from '@/components/pages/guide/DatabaseRestoreCard';
import DatabaseRestoreRecords from '@/components/pages/guide/DatabaseRestoreRecords';
import TimeStrategy from '@/components/common/TimeStrategy';
import TimeInterval from '@/components/common/TimeInterval';
import { fmtSizeFn } from '@/utils/common';
import {
  detail,
  result,
  record
} from '@/utils/guide/database-backup';
import { setInterval, setTimeout, clearInterval } from 'timers';
export default {
  name: 'DatabaseDetail',
  mixins: [baseMixin, detailMixin],
  components: {
    DatabaseBackupCard,
    DatabaseBackupResultList,
    DatabaseRestoreCard,
    DatabaseRestoreRecords,
    TimeStrategy,
    TimeInterval
  },
  data() {
    return {
      databaseStateMapping,
      detail,
      type: 'database',
      steps: {
        'backupPlan': ['createBackupPlan', 'waiting', 'showResults', 'showFilters', 'confirm'],
        'restorePlan': ['createRestorePlan', 'showRestorePlans', 'waiting', 'showRecords', 'selectToSingleRestorePlan'],
        'singleRestorePlan': ['resultsToRestore', 'createSingleRestorePlan', 'showPlans', 'showRestorePlans', 'waiting', 'showRecords', 'confirm'],
        'stop': ['stop']
      }
    };
  },
  computed: {
    operation() {
      return this.$route.name === 'guideDatabaseRestore' ? 'restore' : 'backup';
    }
  },
  methods: {
    toStart(plan) { // 未开始状态-持续3s
      setTimeout(() => {
        [plan.state, plan.consume] = [1, 1];
      }, 3000);
    },
    doing(plan) { // 进行状态-3s后，持续5s结束
      setTimeout(() => {
        plan.consumeTime = 0;
        plan.percent = 0;
        plan.timer = setInterval(() => {
          plan.consumeTime += 1;
          plan.percent += 1 / 5;
          plan.size = fmtSizeFn(plan.sourceSize * plan.percent);
        }, 1000);
      }, 2000);
    },
    finished(plan, id, type) {
      setTimeout(() => {
        const plans = type === 'backupPlan' ? this.backupPlans : this.restorePlans;
        const diffTime = dayjs().diff(this.forwardStepTime, 'second');
        if (plans.find(plan => plan.id === id)) {
          [plan.state, plan.consume] = [2, 5];
          clearInterval(plan.timer);
          if (type === 'backupPlan') {
            this.results.unshift(
              this.waitingList.find(item => item.id === plan.id)
            );
          } else {
            this.records.unshift(
              this.waitingList.find(item => item.id === plan.id)
            );
          }
          this.$message({
            type: 'success',
            message: `${plan.name}执行成功`,
            offset: this.messageOffset
          });
          if ((isNaN(diffTime) || diffTime > 8) && this.nextStep !== 'stop') {
            this.nextStep = type === 'backupPlan' ? 'showResults' : 'showRecords';
          }
        }
      }, 8000);
    },
    createBackupPlanConfirm() {
      if (this.action === 'create') {
        const { config, startTime, name, ...others } = this.backupPlan;
        const { singleTime, ...otherConfig } = config;
        const id = dayjs().unix();
        this.waitingList.push({
          id,
          startTime: this.startTime,
          endTime: this.endTime,
          ...this.resultConfig
        });
        this.backupPlans.unshift({
          id,
          name: `${name}${this.backupPlans.length + 1}`,
          startTime: this.startTime,
          ...others,
          config: {
            id,
            singleTime: this.startTime,
            ...otherConfig
          }
        });
        this.$message({
          type: 'success',
          message: '添加备份计划成功',
          offset: this.messageOffset
        });
        const plan = this.backupPlans.find(plan => plan.id === id);
        this.toStart(plan);
        this.doing(plan);
        this.finished(plan, id, 'backupPlan');
        this.scrollTabToTop();
        this.stepContinue();
      }
      this.backupPlanModalVisible = false;
    },
    createRestorePlanConfirm() {
      if (this.action === 'create') {
        const { config, startTime, name, ...others } = this.restorePlan;
        const { singleTime, ...otherConfig } = config;
        const id = dayjs().unix();
        this.waitingList.push({
          id,
          startTime: this.startTime,
          endTime: this.endTime,
          ...this.recordConfig
        });
        this.restorePlans.unshift({
          id,
          name: `${name}${this.restorePlans.length + 1}`,
          startTime: this.startTime,
          ...others,
          config: {
            id,
            singleTime: this.startTime,
            ...otherConfig
          }
        });
        this.$message({
          type: 'success',
          message: '成功添加循环执行的恢复计划',
          offset: this.messageOffset
        });
        const plan = this.restorePlans.find(plan => plan.id === id);
        this.toStart(plan);
        this.doing(plan);
        this.finished(plan, id, 'restorePlan');
        this.scrollTabToTop();
        this.stepContinue();
      }
      this.restorePlanModalVisible = false;
    },
    createSingleRestorePlanConfirm() {
      const { config, name, startTime, ...others } = this.singleRestorePlan;
      const { singleTime, ...otherConfig } = config;
      const id = dayjs().unix();
      this.waitingList.push({
        id,
        startTime: this.startTime,
        endTime: this.endTime,
        ...this.recordConfig
      });
      this.restorePlans.unshift({
        id,
        name: this.startTime.replace(/\D/g, ''),
        startTime: this.startTime,
        ...others,
        config: {
          id,
          singleTime: this.startTime,
          ...otherConfig
        }
      });
      this.$message({
        type: 'success',
        message: '成功添加立即执行的恢复计划',
        offset: this.messageOffset
      });
      const plan = this.restorePlans.find(plan => plan.id === id);
      this.toStart(plan);
      this.doing(plan);
      this.finished(plan, id, 'singleRestorePlan');
      this.scrollTabToTop();
      if (this.stepType !== 'stop') {
        this.stepContinue();
        this.planFilterForm.planType = 'backup';
      }
      this.singleRestoreCreateModalVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/style/guide.scss';
</style>
