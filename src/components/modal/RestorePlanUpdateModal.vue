<template>
  <el-dialog custom-class="min-width-dialog"
             :visible.sync="modalVisible"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed">
    <span slot="title">
      更新恢复计划
      <span style="color: #999999"> (ID: {{restorePlan.id}})</span>
    </span>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="restorePlanUpdateForm">
      <el-row>
        <el-form-item label="计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="恢复设备"
                        prop="hostIp">
            <el-input disabled
                      :value="`${formData.hostName}(${formData.hostIp})`"></el-input>
            <!-- <el-select v-model="formData.hostIp"
                       style="width: 100%;">
              <el-option v-for="host in selectionHosts"
                         :key="host.id"
                         :value="host.hostIp"
                         :label="host.name">
                <span style="float: left">{{ host.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="detailInfoDisplayName"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo"
                      disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录名"
                        prop="loginName"
                        disabled>
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录密码"
                        prop="password">
            <input-toggle v-model="formData.password"></input-toggle>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="时间策略"
                    style="width: 100%">
        <el-radio-group v-model="formData.timeStrategy">
          <el-radio :label="Number(s)"
                    v-for="s in Object.keys(strategys)"
                    :key="s">{{ strategys[s] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="恢复时间"
                    prop="singleTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-show="formData.timeStrategy == 1">
        <el-date-picker type="datetime"
                        v-model="formData.singleTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="计划时间"
                    prop="startTime"
                    v-show="[2,3].indexOf(formData.timeStrategy) !== -1">
        <el-date-picker type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formData.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="选择星期"
                    prop="weekPoints"
                    v-show="formData.timeStrategy == 2">
        <el-checkbox-group v-model="formData.weekPoints">
          <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                              :label="Number(w)"
                              :key="w">{{ weekMapping[w] }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择日期"
                    prop="datePoints"
                    v-show="formData.timeStrategy == 3">
        <el-select v-model="formData.datePoints"
                   multiple
                   style="width: 60%;">
          <el-option v-for="day in Array.from(new Array(31), (val, index) => index + 1)"
                     :key="day"
                     :value="day"
                     :label="day + '号'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`时间点${index+1}`"
                    style="width: 100%"
                    v-for="(p, index) in formData.timePoints"
                    :key="p.key"
                    v-show="[2,3].indexOf(formData.timeStrategy) !== -1">
        <el-time-select v-model="formData.timePoints[index].value"
                        :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
        <el-button icon="el-icon-delete"
                   type="danger"
                   v-show="formData.timePoints.length !== 1"
                   @click="formData.timePoints.splice(index, 1)"></el-button>
        <el-button icon="el-icon-plus"
                   type="primary"
                   v-show="index + 1 === formData.timePoints.length"
                   @click="formData.timePoints.push({ value: '00:00', key: Date.now() })"></el-button>
      </el-form-item>

    </el-form>
    <span slot="footer">
      <el-button @click="cancelButtonClick">取消</el-button>
      <el-button type="primary"
                 @click="confirmBtnClick">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep';
import modalMixin from '../mixins/restorePlanModalMixins';

export default {
  name: 'RestorePlanUpdateModal',
  mixins: [modalMixin],
  props: {
    restorePlan: {
      type: Object,
      required: true,
    },
  },
  methods: {
    confirmBtnClick() {
      this.$refs.restorePlanUpdateForm.validate(valid => {
        if (valid) {
          this.pruneData(this.formData)
            .then(({ name, config }) => {
              console.log({ name, config });
              this.$emit('confirm', {
                id: this.restorePlan.id,
                name,
                config,
              });
            })
            .catch(error => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      const {
        id,
        singleTime,
        startTime,
        timePoints,
        weekPoints,
        datePoints,
        timeStrategy,
        database,
      } = this.restorePlan.config;
      const { instanceName: detailInfo, loginName, host } = database;
      const { name: hostName, hostIp } = host;
      this.originFormData = {
        name: this.restorePlan.name,
        id,
        singleTime,
        startTime: timeStrategy === 1 ? '' : startTime,
        timePoints,
        weekPoints,
        datePoints,
        timeStrategy,
        detailInfo,
        loginName,
        hostName,
        hostIp,
      };
      // 时间点类型是对象数组[{value, key},{},...]，使用cloneDeep的方式复制一份新的数组对象
      // 避免引用到一个数组对象引起的BUG
      this.formData = {
        ...this.originFormData,
        ...{ timePoints: cloneDeep(timePoints) },
      };
    },
    modalClosed() {
      this.$refs.restorePlanUpdateForm.clearValidate();
    },
  },
};
</script>
<style>
</style>
