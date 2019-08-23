<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible"
             title="添加日志恢复计划">
    <el-form size="small"
             label-position="right"
             label-width="120px"
             :model="formData"
             :rules="rules"
             ref="logRestorePlanForm">
      <el-form-item label="恢复设备"
                    prop="hostIp">
        <span slot="label">恢复设备
            <el-tooltip placement="top"
                        content="易备环境设备" >
                <i class="el-icon-info"></i>
            </el-tooltip>
        </span>
        <el-select v-model="formData.hostIp"
                    style="width: 100%;">
          <el-option v-for="host in availableHostsForRestore.filter(host => !hostInLinks.includes(host.id))"
                      :key="host.id"
                      :value="host.hostIp"
                      :label="`${host.name}(${host.hostIp})`">
            <span style="float: left">{{ host.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12" >
          <el-form-item label="实例名"
                        class="is-required"
                        prop="detailInfo">
            <el-input v-model="formData.detailInfo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="端口号"
                        class="is-required"
                        prop="dbPort">
            <el-input v-model.number="formData.dbPort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="恢复至"
                    class="is-required"
                    prop="restoreTimePoint"
                    style="width: 50%">
        <el-date-picker type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="formData.restoreTimePoint"
                        :picker-options="pickerOptions"
                        style="width: 100%"></el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="loginName"
                        class="is-required"
                        label="数据库登录名">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="password"
                        class="is-required"
                        label="数据库登录密码">
            <el-input v-model="formData.password"
                      type="password"
                      show-password></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading.sync="loading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import isEqual from 'lodash/isEqual';
import dayjs from 'dayjs';
import { baseModalMixin } from '@/components/mixins/backupPlanModalMixin';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import { createLogRestorePlan } from '@/api/oracle';
import validate from '@/utils/validate';
const basicFormData = {
  hostIp: '',
  detailInfo: '',
  dbPort: '',
  loginName: '',
  password: '',
  restoreTimePoint: ''
};
export default {
  name: 'LogRestorePlanModal',
  mixins: [baseModalMixin, restorePlanModalMixin],
  props: {
    details: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    hostInLinks: {
      type: Array,
      default: []
    },
    endTime: {
      type: String
    }
  },
  data() {
    const restoreTimePointValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择恢复时间点'));
      } else if (dayjs(value) > dayjs(this.details.CDBTime)) {
        callback(new Error('恢复时间点不能晚于最近一次CDB备份成功时间'));
      } else if (dayjs(value) < dayjs(this.endTime)) {
        callback(new Error('恢复时间点不能早于全备成功时间'));
      } else {
        callback();
      }
    }
    return {
      type: 'oracle',
      formData: {},
      originFormData: {},
      pickerOptions: {},
      rules: {
        detailInfo: validate.instanceName,
        dbPort: validate.dbPort,
        loginName: validate.dbLoginName,
        password: validate.dbPassword,
        restoreTimePoint: [
          {
            validator: restoreTimePointValidate,
            triggle: 'blur'
          }
        ]
      }
    }
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
    loading: {
      get() {
        return this.btnLoading;
      },
      set(value) {
        this.$emit('update:btnLoading', value);
      }
    }
  },
  created() {
    this.pickerOptions = {
      disabledDate: time => {
        console.log(time);
        return dayjs(time) < dayjs(this.details.CDBTime) && dayjs(time) > dayjs(this.endTime);
      }
    }
  },
  methods: {
    modalOpened() {
      this.formData = Object.assign(
        {},
        basicFormData,
        {
          detailInfo: this.details.instanceName,
          dbPort: this.details.dbPort
        }
      );
      this.originFormData = Object.assign({}, this.formData);
      this.$nextTick(() => {
        this.$refs.logRestorePlanForm.clearValidate();
      });
    },
    confirmBtnClick() {
      this.$refs.logRestorePlanForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const name = dayjs().format('YYYYMMDDHHmmss');
          const config = {timeStrategy: 1, singleTime: '', ...this.formData };
          createLogRestorePlan(this.details.id, { name, config })
            .then(res => {
              const { message } = res.data;
              this.$message.success(message);
              this.modalVisible = false;
              this.$emit('refreshAll');
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.loading = false;
            })
        } else {
          return false;
        }
      })
    },
    modalClosed() {
      this.formData = Object.assign({}, basicFormData);
      this.originFormData = Object.assign({}, basicFormData);
    }
  }
}
</script>
