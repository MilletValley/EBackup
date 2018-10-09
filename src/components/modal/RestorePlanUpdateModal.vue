<template>
  <el-dialog custom-class="min-width-dialog"
             :visible.sync="modalVisible"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             v-if="restorePlan">
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
      <el-row v-if="!isVMware">
        <el-col :span="12" v-if="!this.isHW">
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
        <el-col :span="this.isHW?24:12">
          <el-form-item :label="detailInfoDisplayName"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo"
                      :disabled="!this.isHW"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isVMware">
        <el-col :span="12">
          <el-form-item label="恢复主机IP"
                        prop="hostIp">
            <el-input v-model="formData.hostIp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新虚拟机名"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!this.isHW && !isVMware">
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
            <input-toggle v-model="formData.password"
                          :hidden.sync="hiddenPassword"></input-toggle>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="时间策略"
                    style="width: 100%">
        <el-radio-group v-model="formData.timeStrategy">
          <el-radio :label="Number(s)"
                    v-for="s in Object.keys(strategys)"
                    v-if="type!=='vm'||s==='1'"
                    :key="s">{{ strategys[s] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="恢复时间"
                    prop="singleTime"
                    v-show="formData.timeStrategy == 1">
        <el-date-picker type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
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
                              :label="w"
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
      <el-form-item label="时间点"
                    style="width: 100%"
                    v-for="(p, index) in formData.timePoints"
                    :key="p.key"
                    prop="timePoints"
                    v-show="[2,3].indexOf(formData.timeStrategy) !== -1">
        <el-time-select v-model="formData.timePoints[index].value"
                        :picker-options="{start: '00:00', end: '23:45', step: '00:15'}"></el-time-select>
        <!-- <el-button icon="el-icon-delete"
                   type="danger"
                   v-show="formData.timePoints.length !== 1"
                   @click="formData.timePoints.splice(index, 1)"></el-button>
        <el-button icon="el-icon-plus"
                   type="primary"
                   v-show="index + 1 === formData.timePoints.length"
                   @click="formData.timePoints.push({ value: '00:00', key: Date.now() })"></el-button> -->
      </el-form-item>

    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading="btnLoading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep';
import { restorePlanModalMixin } from '../mixins/planModalMixins';
import { fetchRestoreOperation} from '../../api/virtuals';
export default {
  name: 'RestorePlanUpdateModal',
  mixins: [restorePlanModalMixin],
  props: {
    restorePlan: {
      type: Object,
      // required: true,
    },
  },
  methods: {
    confirmBtnClick() {
      this.$refs.restorePlanUpdateForm.validate(valid => {
        if (valid) {
          this.pruneData(this.formData)
            .then(({ name, config }) => {
              const { loginName, detailInfo} = config;
              let conf = Object.assign({},config);
              conf.loginName = detailInfo;
              conf.detailInfo = loginName;
              this.$emit('confirm', {
                id: this.restorePlan.id,
                name,
                config: conf,
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
      //查询详情获取新虚拟机名称，loginName=新虚拟机名
      let lName;
      if(this.isVMware){
        fetchRestoreOperation(this.restorePlan.id).then( res => {
          lName = res.data.data.config.loginName;
          this.format(lName)
        })
      }else{
        this.format(lName)
      }
    },
    format(lName){
      if (this.restorePlan.config.timePoints.length === 0) {
        this.restorePlan.config.timePoints.push({ value: '00:00', key: Date.now() })
      }
      const {
        id,
        singleTime,
        startTime,
        timePoints,
        weekPoints,
        datePoints,
        timeStrategy,
        database,
        hostIp: configHostIp
      } = this.restorePlan.config;
      const { instanceName, vmName, loginName, host } = database;
      const detailInfo = this.isVMware ? lName : instanceName;
      const { name: hostName, hostIp: hostHostIp } = host;
      let curHostIp = this.isVMware ? configHostIp : hostHostIp
      let curLoginName = this.isVMware ? vmName : loginName
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
        loginName: curLoginName,
        hostName,
        hostIp: curHostIp,
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
      this.hiddenPassword = true;
      this.$emit('cancel');
    },
  },
};
</script>
<style>
</style>
