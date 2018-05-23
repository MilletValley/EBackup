<template>
  <section>
    <!-- 修改数据库备份配置页面 begin-->
    <el-dialog :title="'修改'+type+'备份配置'" :visible.sync="_visible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :id="_id" :model="theData" :rules="rules" ref="theForm" label-width="100px">
        <el-form-item label="备份标题" prop="name">
          <el-input v-model="theData.name"></el-input>
        </el-form-item>
        <el-form-item label="备份路径" prop="backupPath" v-show="type === 'windows' || type === 'linux'">
          <el-input v-model="theData.backupPath"></el-input>
        </el-form-item>
        <el-form-item label="备份系统" prop="backupSystem" v-show="type === 'windows'">
          <el-radio-group v-model="theData.backupSystem">
            <el-radio label="sys">是</el-radio>
            <el-radio label="nosys">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份机制"  prop="backupStrategy">
          <el-radio-group v-model="theData.backupStrategy">
            <el-radio v-for="item in _backupStrategys" :key="item.label" :label="item.label">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备份策略"  prop="timeStrategy" v-show="theData.backupStrategy !== ''">
          <el-radio-group v-model="theData.timeStrategy">
            <el-radio v-for="item in _timeStrategys" :key="item.label" :label="item.label">
              {{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计划时间" prop="startTime" v-show="theData.timeStrategy !== 0">
          <el-date-picker v-model="theData.startTime" type="datetime" placeholder="选择日期时间" default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单次备份" v-show="theData.timeStrategy === 0" prop="singleTime">
          <el-date-picker v-model="theData.singleTime" type="datetime" placeholder="请选择日期时间" default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="每月备份" v-show="theData.timeStrategy === 5" prop="datePoints">
          <el-select v-model="theData.datePoints" multiple placeholder="请选择日期">
            <el-option v-for="item in datePointsInfo" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每周备份" v-show="theData.timeStrategy === 4" prop="weekPoints" min-width="560">
          <el-select v-model="theData.weekPoints" multiple placeholder="请选择周几">
            <el-option v-for="item in weekPointsInfo" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔小时" v-show="theData.timeStrategy === 2">
          <el-input-number v-model="theData.timeIntervalH" :min="1" :max="23"></el-input-number>
        </el-form-item>
        <el-form-item label="间隔分钟" v-show="theData.timeStrategy === 1">
          <el-input-number v-model="theData.timeIntervalM" :step="10" :min="10" :max="60"></el-input-number>
        </el-form-item>
        <el-form-item v-for="(domain, index) in theData.timePoints" :label="'备份时间'" :key="domain.key" prop="timePoints" v-show="theData.timeStrategy === 3 || theData.timeStrategy === 4 || theData.timeStrategy === 5">
          <el-col :span="11">
            <el-time-select v-model="domain.value" :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }" placeholder="请选择时间点">
            </el-time-select>
          </el-col>
          <el-col :span="11">
            <el-button @click.prevent="removeTimePoint(domain)" v-show="index !== 0">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item v-show="theData.timeStrategy === 3 || theData.timeStrategy === 4 || theData.timeStrategy === 5">
          <el-button type="primary" @click="addTimePoint">新增时间点</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="_visible = false">取 消</el-button>
        <el-button type="primary" :loading="theFormLoading" @click="updateBackupPlan">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改数据库备份配置页面 end-->
  </section>
</template>
<script>
import _ from 'lodash';
import { updateOracleBackupPlan } from '../api/oracle';
import { updateSqlServerBackupPlan } from '../api/sqlserver';
import { updateBackupPlan } from '../api/fileHost';
import {
  backupStrategys,
  datePoints,
  weekPoints,
  backupPlanModalMixin,
} from './mixins/backupPlanModalMixins';

const requestMapping = {
  oracle: (id, data) => updateOracleBackupPlan({ id, plan: data }),
  sqlserver: (id, data) => updateSqlServerBackupPlan({ id, plan: data }),
  windows: (id, data) => updateBackupPlan({ id, plan: data }),
  linux: (id, data) => updateBackupPlan({ id, plan: data }),
};

export default {
  props: {
    backupPlan: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  name: 'UpdateBackupPlan',
  mixins: [backupPlanModalMixin],
  computed: {
    _id: function() {
      return this.backupPlan.id;
    },
  },
  methods: {
    // 赋值表单
    initUpdate() {
      if (this.type === 'oracle' || this.type === 'sqlserver') {
        this.theData.backupPath = 'value';
        this.theData.backupSystem = 'sys';
      } else {
        this.theData.backupPath = this.backupPlan.backupPath;
        this.theData.backupSystem = this.backupPlan.backupSystem;
      }
      if (this.theData.timeStrategy === 0){
        this.theData.startTime = this.theData.singleTime;
      }
      const assignObj = Object.assign({}, this.backupPlan);
      const newObj = assignObj.config;
      this.theData.name = this.backupPlan.name;
      this.theData.timeStrategy = newObj.timeStrategy;
      this.theData.backupStrategy = newObj.backupStrategy;
      this.theData.startTime = newObj.startTime;
      this.theData.singleTime = newObj.singleTime;
      this.theData.datePoints = newObj.datePoints;
      this.theData.weekPoints = newObj.weekPoints;
      if (this.theData.timeStrategy === 1) {
        this.theData.timeIntervalM = newObj.timeInterval;
        this.theData.timeIntervalH = 1;
      } else if (this.theData.timeStrategy === 2) {
        this.theData.timeIntervalM = 10;
        this.theData.timeIntervalH = parseInt(newObj.timeInterval / 60);
      } else {
        this.theData.timeIntervalM = 10;
        this.theData.timeIntervalH = 1;
      }
      if (newObj.timePoints.length === 0) {
        this.theData.timePoints = [{ value: '' }];
      } else {
        this.theData.timePoints = newObj.timePoints.map(i => {
          return { value: i };
        });
      }
    },
    // 重置表单清空验证
    resetUpdate() {
      this.$refs['theForm'].clearValidate();
    },
    updateBackupPlan() {
      if (this.type === 'oracle' || this.type === 'sqlserver') {
        this.theData.backupPath = 'value';
        this.theData.backupSystem = 'sys';
      }
      this.$refs['theForm'].validate(valid => {
        if (valid) {
          this.theFormLoading = true;
          if (this.valiTime() === true) {
            const tmpdata = {
              id: this.backupPlan.config.id,
              startTime: this.theData.startTime,
              backupStrategy: this.theData.backupStrategy,
              timeStrategy: this.theData.timeStrategy,
            };
            const tmpdata1 = Object.assign({}, this.emptydata(), tmpdata);
            const postdata = {
              oracle: {
                id: this._id,
                name: this.theData.name,
                config: tmpdata1,
              },
              sqlserver: {
                id: this._id,
                name: this.theData.name,
                config: tmpdata1,
              },
              windows: {
                id: this._id,
                name: this.theData.name,
                backupPath: this.theData.backupPath,
                backupSystem: this.theData.backupSystem,
                config: tmpdata1,
              },
              linux: {
                id: this._id,
                name: this.theData.name,
                backupPath: this.theData.backupPath,
                backupSystem: '',
                config: tmpdata1,
              },
            };
            // 向请求服务端
            requestMapping[this.type](this.backupPlan.id, postdata[this.type])
              .then(response => {
                this.$emit('confirm', response.data.data);
                this.theData.timePoints.splice(
                  1,
                  this.theData.timePoints.length - 1
                );
                this.$message.success(response.data.message);
                this._visible = false;
                this.theFormLoading = false;
                this.resetUpdate();
              })
              .catch(error => {
                this.theFormLoading = false;
                this.$message.error(error);
              });
          }
        } else {
          return false;
        }
      });
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.initUpdate();
      }
    },
  },
};
</script>
<style>
.el-picker-panel__footer .el-button--text {
  display: none;
}
</style>
