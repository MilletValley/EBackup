<template>
  <el-dialog :visible.sync="modalVisible"
             :before-close="beforeModalClose"
             custom-class="min-width-dialog"
             @open="modalOpen"
             @close="modalClose">
    <span slot="title">
      {{ title }}
    </span>
    <el-form :model="formData"
             label-position="right"
             label-width="120px"
             ref="form"
             size="small"
             :rules="rules">
      <el-form-item prop="emailServer"
                    label="邮箱服务器">
        <el-select v-model="formData.emailServer"
                   style="width: 100%"
                   placeholder="请选择">
          <el-option v-for="email in emailServerList"
                     :key="email.value"
                     :label="email.label"
                     :value="email.value"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="emailProtocol"
                        label="协议">
            <el-input v-model="formData.emailProtocol"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="emailPort"
                        label="端口">
            <el-input v-model="formData.emailPort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="senderEmail"
                        label="发件人"
                        class="is-required">
            <el-input v-model="formData.senderEmail"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="senderPassword"
                        label="邮箱密码"
                        class="is-required">
            <el-input v-model="formData.senderPassword"
                      show-password></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="receiverEmail"
                    label="收件人"
                    class="is-required">
        <el-tag v-for="(receiver, index) in formData.receiverEmail"
                effect="plain"
                class="tag"
                :key="index"
                closable
                :disable-transitions="false"
                @close="deleteReceiver(receiver)">{{ receiver }}</el-tag>
        <el-input class="input-new-tag"
                  v-if="receiverInputVisible"
                  v-model="receiverInputValue"
                  size="small"
                  ref="receiverInput"
                  @keyup.enter.native="addReceiverConfirm"
                  @blur="addReceiverConfirm"></el-input>
        <el-button v-else
                   class="button-new-tag"
                   size="mini"
                   @click="showReceiverInput"> + 添加</el-button>
      </el-form-item>
      <el-form-item prop="carbonCopy"
                    label="抄送">
        <el-tag v-for="(cc, index) in formData.carbonCopy"
                effect="plain"
                type="warning"
                class="tag"
                :key="index"
                closable
                :disable-transitions="true"
                @close="deleteCarbonCopy(cc)">{{ cc }}</el-tag>
        <el-input class="input-new-tag"
                  v-if="ccInputVisible"
                  v-model="ccInputValue"
                  size="small"
                  ref="ccInput"
                  @keyup.enter.native="addCarbonCopyConfirm"
                  @blur="addCarbonCopyConfirm"></el-input>
        <el-button v-else
                   class="button-new-tag"
                   size="mini"
                   @click="showCarbonCopyInput"> + 添加</el-button>
      </el-form-item>
      <el-form-item prop="timeStrategy"
                    label="时间策略">
        <el-radio-group v-model="formData.timeStrategy">
          <el-radio v-for="strategy in Object.keys(emailConfigTimeStrategyMapping)"
                    :key="strategy"
                    :label="Number(strategy)">{{ emailConfigTimeStrategyMapping[strategy] }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择星期"
                    class="is-required"
                    prop="weekPoints"
                    v-show="formData.timeStrategy === 2">
        <el-checkbox-group v-model="formData.weekPoints">
          <el-checkbox-button v-for="w in Object.keys(weekMapping)"
                              :label="w"
                              :key="w">{{ weekMapping[w] }}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择日期"
                    class="is-required"
                    prop="datePoints"
                    v-show="formData.timeStrategy === 3">
        <el-select v-model="formData.datePoints"
                   multiple
                   style="width: 60%;">
          <el-option v-for="day in Array.from(new Array(31), (val, index) => String(index + 1))"
                     :key="day"
                     :value="day"
                     :label="day + '号'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间"
                    prop="sendTime">
          <el-time-picker v-model="formData.sendTime"
                          value-format="HH:mm:ss"
                          placeholder="请选择发送时间点"></el-time-picker>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirm"
                 :loading="btnLoading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dialogMixin from '@/components/mixins/dialogMixins';
import { weekMapping, emailConfigTimeStrategyMapping } from '@/utils/constant';
import cloneDeep from 'lodash/cloneDeep';
import { createOne, modifyOne } from '@/api/emailConfig';
import validate from '@/utils/validate';
import { callbackify } from 'util';
const basicFormData = {
  id: -1,
  emailServer: '',
  emailProtocol: 'SMTP',
  emailPort: 25,
  senderEmail: '',
  senderPassword: '',
  receiverEmail: [],
  carbonCopy: [],
  timeStrategy: 1,
  weekPoints: [],
  datePoints: [],
  sendTime: ''
};
const emailServerList = [
  {
    value: 'smtp.163.com',
    label: '163邮箱(smtp.163.com)'
  },
  {
    value: 'smtp.sina.com',
    label: '新浪邮箱(smtp.sina.com)'
  },
  {
    value: 'smtp.qq.com',
    label: 'QQ邮箱(smtp.qq.com)'
  }
];
const operateOne = {
  create: createOne,
  modify: modifyOne
};
export default {
  name: 'OperateEmailConfigModal',
  mixins: [dialogMixin],
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    action: {
      required: true,
      type: String
    },
    emailConfig: {
      required: true,
      type: Object
    }
  },
  data() {
    const validateReceiver = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请输入收件人'));
      } else {
        callback();
      }
    };
    const validateWeekPoints = (rule, value, callback) => {
      if (this.formData.timeStrategy === 2 && !value.length) {
        callback(new Error('请选择发送星期'));
      } else {
        callback();
      }
    };
    const validateDatePoints = (rule, value, callback) => {
      if (this.formData.timeStrategy === 3 && !value.length) {
        callback(new Error('请选择发送日期'));
      } else {
        callback();
      }
    };
    const rules = {
      emailServer: [
        { required: true, message: '请选择邮箱服务器', triggle: 'blur' }
      ],
      emailPort: validate.dbPort,
      senderEmail: [
        { required: true, message: '请输入发件邮箱', triggle: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', triggle: ['blur', 'change'] }
      ],
      receiverEmail: [
        { validator: validateReceiver, triggle: 'blur' }
      ],
      weekPoints: [
        { validator: validateWeekPoints, triggle: 'blur' }
      ],
      datePoints: [
        { validator: validateDatePoints, triggle: 'blur' }
      ],
      senderPassword: [
        { required: true, message: '请输入邮箱密码', triggle: 'blur' }
      ],
      sendTime: [
        { required: true, message: '请选择发送时间',  triggle: 'blur'}
      ]
    };
    return {
      formData: Object.assign({}, basicFormData),
      originFormData: Object.assign({}, basicFormData),
      rules,
      weekMapping,
      emailConfigTimeStrategyMapping,
      btnLoading: false,
      emailServerList,
      receiverInputVisible: false,
      receiverInputValue: '',
      ccInputVisible: false,
      ccInputValue: ''
    }
  },
  computed: {
    title() {
      if (this.action === 'create') {
        return '添加邮箱配置';
      } else if (this.action === 'modify') {
        return '修改邮箱配置';
      }
      return '';
    }
  },
  methods: {
    modalOpen() {
      if (this.action === 'modify') {
        this.originFormData = cloneDeep(Object.assign({}, basicFormData, this.emailConfig));
      } else {
        const { id, ...others } = basicFormData;
        this.originFormData = cloneDeep(others);
      }
      this.formData = cloneDeep(this.originFormData);
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    modalClose() {
      this.$refs.form.clearValidate();
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          operateOne[this.action](this.formData)
            .then(res => {
              const { message } = res.data;
              this.$message.success(message);
              this.modalVisible = false;
              this.$emit('refresh');
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading = false;
            })
        } else {
          return false;
        }
      })
    },
    deleteReceiver(tag) {
      this.formData.receiverEmail.splice(
        this.formData.receiverEmail.indexOf(tag),
        1
      );
    },
    addReceiverConfirm() {
      if (this.receiverInputValue) {
        this.formData.receiverEmail.push(this.receiverInputValue);
      }
      this.receiverInputVisible = false;
      this.receiverInputValue = '';
    },
    showReceiverInput() {
      this.receiverInputVisible = true;
      this.$nextTick(() => {
        this.$refs.receiverInput.$refs.input.focus();
      })
    },
    deleteCarbonCopy(tag) {
      this.formData.carbonCopy.splice(
        this.formData.carbonCopy.indexOf(tag),
        1
      );
    },
    addCarbonCopyConfirm() {
      if (this.ccInputValue) {
        this.formData.carbonCopy.push(this.ccInputValue);
      }
      this.ccInputVisible = false;
      this.ccInputValue = '';
    },
    showCarbonCopyInput() {
      this.ccInputVisible = true;
      this.$nextTick(() => {
        this.$refs.ccInput.$refs.input.focus();
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tag {
  margin-right: 10px;
}
.input-new-tag {
  margin-right: 10px;
  width: 150px;
  vertical-align: bottom;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
