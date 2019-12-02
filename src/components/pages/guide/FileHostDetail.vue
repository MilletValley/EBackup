<!-- eslint-disable -->
<template>
  <section>
    <div class="step-help" v-show="nextStep === 'stop'" @click="forwardStep">
      <i-icon name="guide-help" style="height: 70%; vertical-align: middle"></i-icon>
      <div class="step-help-text">指引帮助</div>
    </div>
    <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="guide-file" class="detail-icon" style="vertical-align: -1.8em"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{detail.hostName}}</h1>
              </el-col>
              <el-col :span="12"
                      :offset="4"
                      class="action">
                <div :class="{ 'btn-mask': nextStep === 'createBackupPlan' }">
                  <el-button size="mini" @click="createBackupPlan"
                             style="float: right"
                             :disabled="!['stop', 'createBackupPlan'].includes(nextStep)">添加备份计划</el-button>
                  <div v-show="nextStep === 'createBackupPlan'">
                    <div class="balloons" style="top: -15px; left: 20px; transform: translateY(-100%)">
                      <div class="bottom-arrow-bubble">
                        {{ promptText(nextStep) }}
                        <p class="bubble-btn">
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
                <el-col :span="8">
                  <el-form-item label="主机IP：">
                    <span>{{ detail.hostIp }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作系统：">
                    <span>{{ detail.osName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="别名：">
                    <span>{{ detail.hostAlias }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="登录名：">
                    <span>{{ detail.loginName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </header>
    <div :class="{ 'card-mask' : !['stop', 'createBackupPlan'].includes(nextStep) }">
      <transition name="el-zoom-in-center">
        <div v-show="['showResults', 'resultsToRestore', 'showRecords'].includes(nextStep)">
          <div class="balloons" :style="{ left: `${parseInt(promptLeft) + 20}px`, top: promptTop }">
            <div class="left-arrow-bubble">
              {{ promptText(nextStep) }}
              <p class="bubble-btn">
                <span type="text" @click="cancelStep">取消</span>
              </p>
            </div>
          </div>
          <i-icon name="finger" class="finger" :style="{ left: `${parseInt(fingerLeft) + 20}px`, top: fingerTop }"></i-icon>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="['showPlans', 'showBackupPlans', 'showRestorePlans'].includes(nextStep)">
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
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="nextStep === 'waiting'"
              class="balloons"
              style="top: 200px; right: -15px; transform: translateX(100%)">
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
          <file-host-backup-card :id="plan.id"
                        type="windows"
                        :next-step="nextStep"
                        v-for="plan in filteredBackupPlans"
                        :key="plan.id"
                        :backup-plan="plan"
                        @deletePlan="deleteBackupPlan"
                        @updatePlan="selectBackupPlan(plan.id)"></file-host-backup-card>
          <template>
            <!-- 恢复计划面板 -->
            <file-host-restore-card :id="plan.id"
                          type="windows"
                          :next-step="nextStep"
                          v-for="plan in filteredRestorePlans"
                          :key="plan.id"
                          :restore-plan="plan"
                          @deletePlan="deleteRestorePlan"
                          @updatePlan="selectRestorePlan(plan.id)"></file-host-restore-card>
          </template>
        </el-tab-pane>
        <el-tab-pane label="备份记录"
                      name="results"
                      :disabled="!['stop', 'showResults', 'resultsToRestore', 'createSingleRestorePlan'].includes(nextStep)">
          <!-- 备份集列表-->
          <file-host-backup-result-list :data="results"
                                        :next-step="nextStep"
                                        type="windows"
                                        @single-restore-btn-click="initSingleRestoreModal"
                                        @delete-result-by-id="deleteResultById"
                                        @delete-result-by-plan-id="deleteResultByPlanId"
                                        @cancel-step="cancelStep"></file-host-backup-result-list>
        </el-tab-pane>
        <el-tab-pane label="恢复记录"
                      name="records"
                      :disabled="!['stop', 'showRecords'].includes(nextStep)">
          <!-- 恢复记录列表-->
          <file-host-restore-records :records="records"
                            :next-step="nextStep"
                            type="windows"></file-host-restore-records>
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
        <el-form-item label="备份类型"
                      prop="backupType">
          <el-radio-group v-model="backupPlanFormData.backupType">
            <el-radio v-for="type in Object.keys(filehostBackupTypeMapping)"
                      :key="type"
                      :label="Number(type)">
              {{ filehostBackupTypeMapping[type] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份文件"
                      prop="backupFiles">
          <el-button type="primary"
                     size="small">+选择文件</el-button>
          <span v-if="!backupPlanFormData.backupFiles.length"
                style="color: #f56c6c; font-size: 12px">
            <i class="el-icon-warning"></i>未选择文件
          </span>
          <el-popover placement="right"
                      width="400"
                      trigger="hover"
                      v-else>
            <div style="max-height: 400px; overflow: auto;">
              <p v-for="(file, index) in backupPlanFormData.backupFiles"
                :key="index"
                style="margin-top: 0; margin-bottom: 5px">
                <el-tag size="small"
                        class="fileTags">
                  <span>{{ file.targetPath }}</span>
                </el-tag>
              </p>
            </div>
            <span style="color: #409EFF; font-size: 12px; cursor: pointer"
                  slot="reference">
              <i class="el-icon-question"></i>查看已选文件
            </span>
          </el-popover>
        </el-form-item>
        <el-form-item label="备份排除文件">
          <el-tag :key="tag.id"
                  class="tags"
                  type="danger"
                  v-for="tag in backupPlanFormData.excludeFiles">{{tag}}</el-tag>
          <el-button>+ 排除文件</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="限速"
                          prop="bwlimit">
              <el-select v-model="backupPlanFormData.bwlimit"
                         clearable
                         placeholder="请选限速值">
                <el-option v-for="(item, index) in [1, 2, 4, 10, 20, 50, 100, 200, 500, 800]"
                           :key="index"
                           :label="item"
                           :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位"
                          prop="unit">
              <el-select v-model="backupPlanFormData.unit"
                         clearable
                         placeholder="请选单位">
                <el-option v-for="(item, index) in ['Kbps', 'Mbps', 'Gbps']"
                           :key="index"
                           :label="item"
                           :value="index"></el-option>
              </el-select>            
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备份策略"
                      class="is-required"
                      prop="backupStrategy">
					<el-radio-group v-model="backupPlanFormData.backupStrategy">
						<el-radio v-for="(backupStrategy, index) in Object.keys(filehostBackupStrategyMapping)"
                      :key="index"
                      :label="Number(backupStrategy)">
              {{ filehostBackupStrategyMapping[backupStrategy] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <time-strategy :form-data="backupPlanFormData"
                       type="windows"
                       ref="timeStrategyComponent"
                       :disable="true"></time-strategy>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="createBackupPlanConfirm">确定</el-button>
        <el-button @click="backupPlanModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog custom-class="min-width-dialog"
               title="执行恢复操作"
               :visible.sync="restorePlanModalVisible"
               @opened="dialogOpened">
      <el-form size="small"
               label-position="right"
               label-width="110px"
               :model="singleRestorePlanFormData"
               disabled>
        <el-form-item label="计划名">
          <el-input v-model="singleRestorePlanFormData.planName"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label">恢复主机
            <el-tooltip placement="top"
                        content="可选择同机或异机恢复" >
                <i class="el-icon-info"></i>
            </el-tooltip>
          </span>
          <el-select  v-model="singleRestorePlanFormData.targetFileHost.hostIp"
                      style="width: 100%;">
            <el-option v-for="host in [targetFileHost]"
                       :key="host.hostIp"
                       :value="host.hostIp"
                       :label="`${host.hostName}(${host.hostIp})`">
              <span style="float: left">{{ host.hostName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="恢复源路径">
          <el-button type="primary"
                     size="small">+选择文件</el-button>
          <el-popover placement="right"
                      width="400"
                      trigger="hover">
            <div style="max-height: 400px; overflow: auto;">
              <p v-for="(restore, index) in singleRestorePlanFormData.restorePath"
                :key="index"
                style="margin-top: 0; margin-bottom: 5px">
                <el-tag size="small"
                        class="fileTags">
                  <span>{{ restore.sourcePath }}</span>
                </el-tag>
              </p>
            </div>
            <span style="color: #409EFF; font-size: 12px; cursor: pointer"
                  slot="reference">
              <i class="el-icon-question"></i>查看已选文件
            </span>
          </el-popover>
        </el-form-item>
        <el-form-item label="存放路径">
          <el-button type="primary"
                     style="float: left; margin-right: 4px"
                     size="small">选择路径</el-button>
          <el-tag class="targetPathTag">
            <span>{{ singleRestorePlanFormData.targetPath }}</span>
          </el-tag>
        </el-form-item>
        <el-form-item label="恢复排除文件">
          <el-tag :key="tag.id"
                  type="danger"
                  v-for="tag in singleRestorePlanFormData.excludeFiles">{{tag}}</el-tag>
          <el-button>+ 排除文件</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务器登录名">
              <el-input v-model="singleRestorePlanFormData.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码">
              <el-input v-model="singleRestorePlanFormData.password"
                        show-password></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="createSingleRestorePlanConfirm">确定</el-button>
        <el-button @click="restorePlanModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import {
  detail,
  result,
  record,
  targetFileHost
} from '@/utils/guide/filehost-backup';
import { detailMixin } from '@/components/mixins/guideMixins';
import FileHostBackupCard from '@/components/pages/guide/FileHostBackupCard';
import FileHostBackupResultList from '@/components/pages/guide/FileHostBackupResultList';
import FileHostRestoreCard from '@/components/pages/guide/FileHostRestoreCard';
import FileHostRestoreRecords from '@/components/pages/guide/FileHostRestoreRecords';
import TimeStrategy from '@/components/common/TimeStrategy';
import {
  filehostBackupStrategyMapping,
  filehostBackupTypeMapping
} from '@/utils/constant';
import { setInterval, setTimeout, clearInterval } from 'timers';
import cloneDeep from 'lodash/cloneDeep';
/* eslint-disable */
export default {
  name: 'FileHostDetail',
  mixins: [detailMixin],
  components: {
    FileHostBackupCard,
    FileHostBackupResultList,
    FileHostRestoreCard,
    FileHostRestoreRecords,
    TimeStrategy
  },
  data() {
    return {
      detail,
      targetFileHost,
      filehostBackupStrategyMapping,
      filehostBackupTypeMapping,
      backupPlanModalVisible: false,
      restorePlanModalVisible: false,
      type: 'filehost',
      steps: {
        'backupPlan': ['createBackupPlan', 'waiting', 'showResults', 'confirm'],
        'restorePlan': ['resultsToRestore', 'createSingleRestorePlan', 'showPlans', 'showRestorePlans', 'waiting', 'showRecords', 'confirm'],
        'stop': ['stop']
      }
    };
  },
  computed: {
    operation() {
      return this.$route.name === 'guideFilehostRestore' ? 'restore' : 'backup';
    }
  },
  methods: {
    toStart(files, state) { // 未开始状态-持续3s
      setTimeout(() => {
        files.forEach(file => file.state = 1);
        state = 1;
      }, 3000);
    },
    doing(files, plan) { // 进行状态-3s后，持续10s
      setTimeout(() => {
        plan.state = 1;
        plan.timer = setInterval(() => {
          files.forEach(file => {
            file.consume = file.consume + 1;
            file.percentage = file.percentage + 20;
            file.progress = file.percentage * file.sourceSize / 100;
          })
          plan.percentage = plan.percentage + 20;
          plan.progress = plan.percentage * plan.size / 100;
        }, 1000);
      }, 2000);
    },
    finished(plan, files, id, type) { // 已完成状态，13s后
      setTimeout(() => {
        const plans = type === 'backupPlan' ? this.backupPlans : this.restorePlans;
        const diffTime = dayjs().diff(this.forwardStepTime, 'second');
        if (plans.find(plan => plan.id === id)) {
          clearInterval(plan.timer);
          files.forEach(file => file.state = 2);
          plan.state = 2;
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
    deleteResultById(id) {
      this.results = this.results.filter(result => result.id !== id);
      this.$message({
        type: 'success',
        message: '成功删除备份集',
        offset: this.messageOffset
      });
    },
    deleteResultByPlanId(id) {
      this.results = this.results.filter(result => result.id !== id);
      this.$message({
        type: 'success',
        message: '成功删除备份集',
        offset: this.messageOffset
      });
    },
    selectRestorePlan() {
      this.restorePlanModalVisible = true;
      this.action = 'update';
    },
    initSingleRestoreModal() {
      this.restorePlanModalVisible = true;
      this.action = 'create';
    },
    createBackupPlan() {
      this.backupPlanModalVisible = true;
      this.action = 'create';
    },
    selectBackupPlan() {
      this.backupPlanModalVisible = true;
      this.action = 'update';
    },
    createBackupPlanConfirm() {
      if (this.action === 'create') {
        const { name, startTime, createTime, config, backupFiles: planFiles, ...others } = cloneDeep(this.backupPlan);
        const { singleTime, ...otherConfig } = config;
        const id = dayjs().unix();
        const { backupFiles, ...otherResultConfig } = cloneDeep(this.resultConfig);
        backupFiles.forEach(file => {
          file.id = id;
          file.startTime = this.startTime;
          file.endTime = this.endTime;
        });
        planFiles.forEach(file => {
          file.startTime = this.startTime
        })
        this.waitingList.push({
          ...otherResultConfig,
          id,
          backupFiles,
          startTime: this.startTime,
          endTime: this.endTime,
          createTime: this.startTime,
        });
        this.backupPlans.unshift({
          id,
          name: `${name}${this.backupPlans.length + 1}`,
          createTime: this.startTime,
          startTime: this.startTime,
          backupFiles: planFiles,
          config: {
            id,
            singleTime: this.startTime,
            ...otherConfig
          },
          ...others
        });
        this.$message({
          type: 'success',
          message: '添加备份计划成功',
          offset: this.messageOffset
        });
        const plan = this.backupPlans.find(plan => plan.id === id);
        this.toStart(plan.backupFiles, plan.state);
        this.doing(plan.backupFiles, plan);
        this.finished(plan, plan.backupFiles, id, 'backupPlan');
        this.scrollTabToTop();
        this.stepContinue();
      }
      this.backupPlanModalVisible = false;
    },
    createSingleRestorePlanConfirm() {
      if (this.action === 'create') {
        const id = dayjs().unix();
        const { planName, startTime, restorePath, ...others } = cloneDeep(this.singleRestorePlan);
        const { filePaths, ...otherRecordConfig } = cloneDeep(this.recordConfig);
        filePaths.forEach(file => {
          file.id = id;
          file.startTime = this.startTime;
          file.endTime = this.endTime;
        });
        restorePath.forEach(file => {
          file.startTime = this.startTime
        })
        this.waitingList.push({
          ...otherRecordConfig,
          id,
          filePaths,
          startTime: this.startTime,
          endTime: this.endTime,
          createTime: this.startTime,
        });
        this.restorePlans.unshift({
          id,
          ...others,
          planName: `${planName}${this.restorePlans.length + 1}`,
          name: `${planName}${this.restorePlans.length + 1}`,
          startTime: this.startTime,
          restorePath
        });
        this.$message({
          type: 'success',
          message: '添加恢复计划成功',
          offset: this.messageOffset
        });
        const plan = this.restorePlans.find(plan => plan.id === id);
        this.toStart(plan.restorePath, plan.state);
        this.doing(plan.restorePath, plan);
        this.finished(plan, plan.restorePath, id, 'singleRestorePlan');
        this.scrollTabToTop();
        this.stepContinue();
      }
      this.restorePlanModalVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/guide.scss';
.tags {
  margin-right: 8px;
}
.fileTags {
  display: inline-block;
  max-width: 380px;
  span {
    max-width: 340px;
    display: inline-block;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  i {
    vertical-align: 0.4em !important;
  }
}
.buttonNewTag {
  width: 100px;
}
.wordsOverFlow {
  white-space:nowrap;
  overflow: hidden;
  max-width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
}
</style>
