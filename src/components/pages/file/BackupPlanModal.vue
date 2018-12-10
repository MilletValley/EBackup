<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
							 @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
				{{ title }}
				<span style="color: #999999" v-if="action === 'update' || action === 'query'"> (ID: {{backupPlan.id}})</span>
      </span>
      <el-form :model="formData"
               label-width="110px"
               ref="form"
							 :disabled="action === 'query'"
               :rules="rules"
               size="small">
        <el-form-item label="备份计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="备份类型"
                      prop="backupType">
          <el-radio-group v-model="formData.backupType">
            <el-radio v-for="type in backupTypeSelect"
                      :key="type.label"
                      :label="type.label">
              {{ type.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份文件"
                      v-if="formData.backupType === 1">
          <el-row :class="$style.wordsOverFlow">
            <el-button type="primary"
                       size="small"
                       @click="selectBackupFiles">选择文件</el-button>
            <!-- <el-tag v-for="tag in nodes"
                  :key="tag.sourcePath"
                  closable
                  type="success">
                  {{tag.sourcePath}}</el-tag> -->
          </el-row>
        </el-form-item>
        <el-form-item label="备份排除文件"
                      v-if="formData.backupType === 1">
          <el-tag :key="tag.id"
                  :class="$style.tags"
                  type="danger"
                  v-for="tag in formData.excludeFiles"
                  closable
                  @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input v-if="inputTagVisible"
                    :class="$style.buttonNewTag"
                    ref="saveTagInput"
                    v-model="tagInputValue"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"></el-input>
          <el-button v-else @click="showInputTag">+ 排除文件</el-button>
        </el-form-item>
        <el-form-item label="备份卷"
                      v-if="formData.backupType === 2">
          <el-radio-group v-model="formData.backupFiles">
            <el-radio v-for="(volume, index) in volumes"
                      :key="index"
                      :label="volume">
              {{ volume }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份系统"
                      v-if="formData.backupType === 3">
          <el-radio-group v-model="formData.backupFiles">
            <el-radio label="systems">{{ systems }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="限速(bps)"
                      prop="bwlimit">
          <el-input v-model.number="formData.bwlimit"></el-input>
        </el-form-item>
        <el-form-item label="备份策略"
                      class="is-required"
                      prop="backupStrategy">
					<el-radio-group v-model="formData.backupStrategy">
						<el-radio v-for="(backupStrategy, index) in backupStrategySelect"
                      :key="index"
                      :label="backupStrategy.label">
              {{ backupStrategy.text }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
				<!-- 时间策略 -->
				<time-strategy :form-data="formData" :type="type" ref="timeStrategyComponent"></time-strategy>
      </el-form>
      <span slot="footer">
        <el-button type="primary" v-if="action !== 'query'"
                   :loading="btnLoading"
                   @click="confirmBtnClick">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
    <backup-file-tree :visible.sync="fileTreeVisible"
                      :host-id="hostId"
                      :fatherNodes="filePath"
                      @selectNodes="selectNodes"></backup-file-tree>
  </section>
</template>
<script>
import { backupPlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import TimeStrategy from '@/components/common/TimeStrategy';
import BackupFileTree from '@/components/pages/file/BackupFileTree';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import validate from '@/utils/validate';
import {
  filehostBackupStrategyMapping,
  filehostBackupTypeMapping
} from '@/utils/constant';
import { backupStrategyMapping } from '../../../utils/constant';
const basicFormData = {
  name: '',
  backupType: 1,
  backupFiles: null,
  excludeFiles: [],
  bwlimit: null,
  startTime: '',
  singleTime: '',
  datePoints: [],
  timePoints: [{ value: '00:00', key: Date.now() }],
  weekPoints: [], // 必须初始化为数组，checkbox group才能识别
  hourInterval: 1,
  minuteInterval: 10,
  backupStrategy: 1,
  timeStrategy: 0,
}
export default {
  name: 'BackupPlanModal',
  mixins: [backupPlanModalMixin],
  props: {
    btnLoading: {
      type: Boolean
    },
    type: {
      type: String
    },
    visible: {
      type: Boolean
    },
    action: {
      type: String
    },
    backupPlan: {
      type: Object
    },
    systems: {
      type: String
    },
    volumes: {
      type: Array
    },
    filePath: {
      type: Array,
      default: function() {
        return [];
      }
    },
    hostId: {
      type: Number
    }
  },
  data() {
    return {
      formData: {},
      originFormData: {},
      fileTreeVisible: false,
      tagInputValue: null, // 备份排除文件
      inputTagVisible: false,
      backupDriver: null,
      rules: {
        name: validate.planName
      }
    }
  },
  computed: {
    title() {
      if (this.action === 'update') {
        return '更新备份计划';
      } else if (this.action === 'query') {
        return '查看备份计划';
      }
      return '添加备份计划';
    },
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      }
    },
    backupTypeSelect() {
      if(this.type === 'windows') {
        return Object.keys(filehostBackupTypeMapping).map(backupType => {
          return {
            label: Number(backupType),
            text: filehostBackupTypeMapping[backupType]
          }
        })
      } else if (this.type === 'linux') {
        return [{
          label: 1,
          text: '文件备份'
        }]
      }
    },
    backupStrategySelect() {
      return Object.keys(filehostBackupStrategyMapping).map(backupStrategy=> {
          return {
            label: Number(backupStrategy),
            text: filehostBackupStrategyMapping[backupStrategy]
          }
      })
    }
  },
  methods: {
    fmtData(backupData) {
      // 当备份策略时间点为空时（非按天、周、月）需要初始化才会显示
      if (backupData.config.timePoints.length === 0) {
        backupData.config.timePoints.push({ value: '00:00', key: Date.now() });
      }
      const { name, config, backupType, bwlimit, backupFiles, excludeFiles, ...other} = backupData;
      const { id, timeInterval, timePoints, ...otherConfig } = config;
      let hourInterval = 1,
          minuteInterval = 10,
          sourcePaths = null;
      if (otherConfig.timeStrategy === 1) {
        minuteInterval = timeInterval;
      } else if (otherConfig.timeStrategy === 2) {
        hourInterval = Math.round(timeInterval / 60);
      }
      if(backupType === 1) {
        sourcePaths = backupFiles.map(file => file.sourcePath);
      } else {
        sourcePaths = backupFiles;
      }
      return {
        name,
        backupType,
        bwlimit,
        backupFiles: sourcePaths,
        excludeFiles,
        minuteInterval,
        hourInterval,
        timePoints: cloneDeep(timePoints),
        ...otherConfig,
      };
    },
    handleClose(tag) {
      this.formData.excludeFiles.splice(this.formData.excludeFiles.indexOf(tag), 1);
    },
    showInputTag() {
      this.inputTagVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    handleInputConfirm() {
      let tagInputValue = this.tagInputValue;
      if(tagInputValue) {
        this.formData.excludeFiles.push(tagInputValue);
      }
      this.inputTagVisible = false;
      this.tagInputValue = '';
    },
    selectNodes(nodes) {
      this.formData.backupFiles = nodes.map(node => node.sourcePath).concat();
    },
    selectBackupFiles() {
      this.fileTreeVisible = true;
    },
    pruneFormData(formData) {
      const {
        name,
        backupType,
        bwlimit,
        excludeFiles,
        backupFiles,
        timeStrategy,
        singleTime,
        startTime,
        datePoints,
        weekPoints,
        timePoints,
        hourInterval,
        minuteInterval,
        ...other
      } = formData;
      let config;
      switch (timeStrategy) {
        case 0:
          config = { timeStrategy, singleTime, ...other };
          break;
        case 1:
          config = {
            timeStrategy,
            startTime,
            timeInterval: minuteInterval,
            ...other,
          };
          break;
        case 2:
          config = {
            timeStrategy,
            startTime,
            timeInterval: hourInterval * 60,
            ...other,
          };
          break;
        case 3:
          config = { timeStrategy, startTime, timePoints, ...other };
          break;
        case 4:
          config = {
            timeStrategy,
            startTime,
            weekPoints,
            timePoints,
            ...other,
          };
          break;
        case 5:
          config = {
            timeStrategy,
            startTime,
            datePoints,
            timePoints,
            ...other,
          };
          break;
        case 6:
          config = {
            timeStrategy,
            ...other
          };
          break;
        default:
      }
      if ([3, 4, 5].includes(timeStrategy)) {
        config.timePoints = this.filteredTimePoints(timePoints);
        // 全备+增备下按星期重排
        if (timeStrategy === 4) {
          config.weekPoints.sort((a, b) => a - b);
        }
      }
      return {
        name,
        backupType,
        bwlimit,
        excludeFiles,
        backupFiles,
        config
      };
    },
    confirmBtnClick() {
      this.$refs.form.validate(valid => {
        this.$refs.timeStrategyComponent
          .validate()
          .then(res => {
            if (valid && res) {
              let data = this.pruneFormData(this.formData);
              if (this.action === 'update') {
                data.id = this.backupPlan.id;
                data.config.id = this.backupPlan.config.id;
              }
              this.$emit('confirm', data, this.action);
            }
          })
          .catch(error => {
            if (error && valid) {
              this.$message.error(error);
            }
          });
      });
    },
    cancelButtonClick() {
      this.hasModifiedBeforeClose(() => {
        this.modalVisible = false;
      });
    },
    modalOpened() {
      const baseFormData = cloneDeep(basicFormData);
      if (this.action === 'update' || this.action === 'query') {
        this.originFormData = Object.assign({}, baseFormData, this.fmtData({ ...this.backupPlan }));
      } else {
        this.originFormData = Object.assign({}, baseFormData);
      }
      this.formData = Object.assign({}, this.originFormData);
    },
    modalClosed() {
      this.$refs.timeStrategyComponent.clearValidate();
      this.$refs.form.clearValidate();
    },
  },
  components: {
    TimeStrategy,
    BackupFileTree
  }
}
</script>
<style lang="scss" module>
.tags {
  margin-right: 8px;
  // max-width: 60px;
  // display: inline-block;
  // white-space:nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
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


