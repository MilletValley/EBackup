<template>
  <el-dialog :visible.sync="modalVisible">
    <span slot="title">
      添加恢复计划
    </span>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="restorePlanCreateForm">
      <el-form-item label="计划名称"
                    prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="恢复设备IP"
                    prop="hostIp">
        <el-input v-model="formData.hostIp"></el-input>
      </el-form-item>
      <el-form-item :label="detailInfoLabelName">
        <el-input v-model="formData.detailInfo"></el-input>
      </el-form-item>
      <el-form-item label="登录名"
                    prop="loginName">
        <el-input v-model="formData.loginName"></el-input>
      </el-form-item>
      <el-form-item label="登录密码"
                    prop="password">
        <el-input v-model="formData.password"
                  type="password"></el-input>
      </el-form-item>
      <el-form-item label="时间策略">
        <el-radio-group v-model="formData.timeStrategy">
          <el-radio :label="Number(s)"
                    v-for="s in Object.keys(strategys)"
                    :key="s">{{ strategys[s] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="恢复时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-show="formData.timeStrategy == 1">
        <el-date-picker type="datetime"
                        v-model="formData.singleTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="计划时间"
                    v-show="[2,3].indexOf(formData.timeStrategy) !== -1">
        <el-date-picker type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formData.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择星期"
                    v-show="formData.timeStrategy == 2">
        <el-checkbox-group v-model="formData.weekPoints">
          <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                              :label="Number(w)"
                              :key="w">{{ weekMapping[w] }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择日期"
                    v-show="formData.timeStrategy == 3">
        <el-select v-model="formData.datePoints"
                   multiple>
          <el-option v-for="day in Array.from(new Array(31), (val, index) => index + 1)"
                     :key="day"
                     :value="day"
                     :label="day + '号'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`时间点${index+1}`"
                    v-for="(p, index) in formData.timePoints"
                    :key="index"
                    v-show="[2,3].indexOf(formData.timeStrategy) !== -1">
        <el-time-select v-model="formData.timePoints[index]"
                        :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
        <el-button icon="el-icon-delete"
                   type="danger"
                   v-show="formData.timePoints.length !== 1"
                   @click="formData.timePoints.splice(index, 1)"></el-button>
        <el-button icon="el-icon-plus"
                   type="primary"
                   v-show="index + 1 === formData.timePoints.length"
                   @click="formData.timePoints.push('00:00')"></el-button>
      </el-form-item>

    </el-form>
    <span slot="footer">
      <el-button>取消</el-button>
      <el-button type="primary"
                 @click="confirmBtnClick">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  restoreTimeStrategyMapping as strategys,
  weekMapping,
} from '../../utils/constant';
import { createRestorePlan } from '../../api/sqlserver';

const requestMapping = {
  sqlserver: createRestorePlan,
};

export default {
  name: 'RestorePlanCreateModal',
  props: {
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'hostfile'].indexOf(value) !== -1;
      },
    },
    id: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        timePoints: ['00:00'],
        weekPoints: [], // 必须初始化为数组，checkbox group才能识别
        timeStrategy: 1, // 默认单次执行
      },
      strategys,
      weekMapping,
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
        hostIp: [{ required: true, message: '请输入主机IP', trigger: 'blur' }],
        loginName: [
          { required: true, message: '请输入登陆名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
    detailInfoLabelName() {
      const mapping = {
        oracle: '实例',
        sqlserver: '数据库',
        filehost: '恢复路径',
      };
      return mapping[this.type];
    },
  },
  methods: {
    createPlan() {},
    confirmBtnClick() {
      this.$refs.restorePlanCreateForm.validate(valid => {
        console.log(valid);
        if (valid) {
          const {
            name,
            timeStrategy,
            startTime,
            singleTime,
            timePoints,
            weekPoints,
            datePoints,
            ...other
          } = this.formData;
          let config;
          if (timeStrategy === 1) {
            config = { timeStrategy, singleTime, ...other };
          } else if (timeStrategy === 2) {
            config = {
              timeStrategy,
              startTime,
              timePoints,
              weekPoints,
              ...other,
            };
          } else if (timeStrategy === 3) {
            config = {
              timeStrategy,
              startTime,
              timePoints,
              datePoints,
              ...other,
            };
          }
          // @TODO:timePoints 去重排序

          requestMapping[this.type]({ id: this.id, data: { name, config } })
            .then(res => {
              const { data: plan } = res.data;
            })
            .catch(error => {
              this.$message.error(error);
              return false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style>
</style>
