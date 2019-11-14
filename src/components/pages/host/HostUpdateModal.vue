<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpened"
               @close="modalClosed">
      <span slot="title">
        更新设备
        <span style="color: #999999">（ID: {{formData.id}}）</span>
      </span>
      <el-form :model="formData"
               :rules="hostRules"
               label-width="130px"
               ref="itemUpdateForm"
               size="small">
        <el-form-item label="设备名"
                      class="is-required"
                      :rules="{validator: validateHostName, trigger: ['blur']}"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="设备IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="设备类型"
                      prop="hostType">
          <el-radio v-model="formData.hostType"
                    :label="1">生产环境</el-radio>
          <el-radio v-model="formData.hostType"
                    :label="2">易备环境</el-radio>
        </el-form-item>
        <el-form-item label="存储方式"
                      prop="storeType">
          <el-radio-group v-model.number="formData.storeType"
                          @change="storeTypeChange">
            <el-radio v-for="type in Object.keys(storeTypeMapping)"
                      :key="type"
                      :label="Number(type)">{{ storeTypeMapping[type] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务器类型"
                      prop="cloudType"
                      v-show="formData.storeType === 2">
          <el-radio-group v-model.number="formData.cloudType">
            <el-radio v-for="type in Object.keys(cloudTypeMapping)"
                      :key="type"
                      :label="Number(type)">{{ cloudTypeMapping[type] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用类别"
                      prop="useType">
          <el-radio-group v-model="useType">
            <el-radio label="db">数据库</el-radio>
            <el-radio label="vm">虚拟机</el-radio>
            <el-radio label="application">应用服务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用途类型"
                      prop="databaseType">
          <el-select v-model="formData.databaseType"
                     style="width: 100%">
            <el-option v-for="item in Object.keys(useTypesMapping[useType])"
                       :key="item"
                       :value="Number(item)"
                       :label="useTypesMapping[useType][item]"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12" v-if="formData.databaseType === 1">
            <el-form-item label="oracle版本"
                          prop="oracleVersion">
              <el-select v-model="formData.oracleVersion"
                        placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(oracleVersionMapping)"
                          :key="index"
                          :label="oracleVersionMapping[Number(item)]"
                          :value="Number(item)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作系统"
                          prop="osName">
              <el-select v-model="formData.osName"
                         placeholder="请选择">
                <el-option v-for="(item, index) in availableOs"
                          :key="index"
                          :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.osName === 'Windows' && [2, 10, 11].includes(formData.databaseType)">
            <el-form-item label="Windows系统版本"
                      prop="windowsType">
          <el-select v-model="formData.windowsType"
                     placeholder="请选择"
                     key="update-host-windows-type">
                <el-option v-for="item in [{label: 1, value: '2003'}, {label: 2, value: '2008及以上'}]"
                           :key="item.label"
                           :label="item.value"
                           :value="item.label"></el-option>
              </el-select>
        </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="是否Rac环境"
                      v-if="formData.databaseType === 1"
                      prop="isRacMark">
          <el-radio v-model="formData.isRacMark"
                    :label="0">是</el-radio>
          <el-radio v-model="formData.isRacMark"
                    :label="1">否</el-radio>
        </el-form-item>
        <el-row v-if="formData.isRacMark===0 && formData.databaseType === 1">
          <el-col :span="12">
            <el-form-item label="VIP"
                          prop="vip">
              <el-input v-model="formData.vip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临时VIP"
                          prop="tempVip">
              <el-input v-model="formData.tempVip"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务IP"
                      v-if="['Linux', 'AIX'].includes(formData.osName)"
                      prop="serviceIp">
          <el-input v-model="formData.serviceIp"></el-input>
        </el-form-item>
        <el-form-item label="临时IP"
                      v-if="formData.osName==='Windows'"
                      prop="serviceIp">
          <el-input v-model="formData.serviceIp"></el-input>
        </el-form-item>
        <!--windows下 10G Oracle版本显示 -->
        <template v-if="formData.storeType === 2 ||
                  (formData.oracleVersion === 1 && formData.databaseType === 1 && formData.osName === 'Windows')">
          <el-row>
            <el-col :span="12">
              <el-form-item label="存储地址"
                            v-if="formData.osName === 'Linux' && formData.storeType === 2"
                            prop="storagePath"
                            :rules="[{ required: true, message: '请输入存储地址', trigger: 'blur' }]">
                <span slot="label">
                  存储地址
                  <el-tooltip :content="`存储地址为: ${formData.storagePath}\\backup\\`"
                              placement="right"
                              effect="light">
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                </span>
                <el-input v-model="formData.storagePath"></el-input>
              </el-form-item>
              <el-form-item label="存储盘符"
                            prop="storagePath"
                            v-else>
                <span slot="label">
                  存储地址
                  <el-tooltip :content="`存储地址为: ${formData.storagePath}:\\backup\\`"
                              placement="right"
                              effect="light">
                  <i class="el-icon-info"></i>
                </el-tooltip>
                </span>
                <el-select v-model="formData.storagePath">
                  <el-option v-for="item in words"
                            :key="item.value.value"
                            :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12"
                    v-if="formData.oracleVersion === 1 && formData.databaseType === 1 && formData.osName === 'Windows'">
              <el-form-item label="共享盘符"
                            prop="sharingPath">
                <el-select v-model="formData.sharingPath">
                  <el-option v-for="item in words"
                            :key="item.value.value"
                            :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-form-item label="系统登录名"
                      prop="loginName">
          <el-input v-model="formData.loginName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="登录密码"
                      prop="password">
          <input-toggle v-model="formData.password"
                        :hidden.sync="hiddenPassword"></input-toggle>
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录密码"
                          prop="password">
              <input-toggle v-model="formData.password"
                            :hidden.sync="hiddenPassword"></input-toggle>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码"
                          class="is-required"
                          :rules="{validator: validateCheckPassword, trigger: ['blur']}"
                          prop="rPassword">
              <input-toggle v-model="formData.rPassword"
                            :hidden.sync="hiddenPassword1"></input-toggle>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelBtnClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import { modifyOne } from '@/api/host';
import { genModalMixin } from '@/components/mixins/modalMixins';
import { oracleVersionMapping, storeTypeMapping, cloudTypeMapping } from '@/utils/constant';
import { validateLength } from '@/utils/common';

const useTypesMapping = {
  db: {
    1: 'oracle',
    2: 'sqlserver',
    5: 'mysql',
    6: 'db2',
    7: '达梦数据库',
    9: 'sybase',
    10: 'cache',
    11: 'insql',
    12: 'informix',
    13: 'postgresql'
  },
  vm: {
    4: '虚拟机',
    14: 'aCloud',
    15: 'VMware主控'
  },
  application: {
    8: '应用服务器'
  }
};

export default {
  name: 'HostUpdateModal',
  mixins: [genModalMixin('host')],
  props: {
    itemInfo: {
      type: Object,
      default: {},
    },
    hostNames: {
      type: Array,
      default: []
    }
  },
  data(){
    const validateCheckPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else {
        if (value !== this.formData.password) {
          callback(new Error('两次输入的密码不一致'));
        }
        callback();
      }
    };
    const validateHostName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入设备名'));
      } else if (!(/^\S*$/.test(value))) {
        callback(new Error('不能包含空格'));
      } else if (this.hostNames.includes(value) && value !== this.originFormData.name) {
        callback(new Error('设备名已存在'));
      } else {
        validateLength(50)(rule, value, callback);
      }
      return false;
    }
    return {
      validateCheckPassword,
      validateHostName,
      hiddenPassword1: true,
      oracleVersionMapping,
      storeTypeMapping,
      useTypesMapping,
      cloudTypeMapping
    }
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemUpdateForm.validate(valid => {
        if (valid) {
          let data = { ...this.formData };
          delete data.rPassword;
          this.$emit('confirm', data);
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      this.originFormData = { ...this.itemInfo, password: '' };
      this.formData = { ...this.itemInfo, password: '' };
    },
    modalClosed() {
      this.$refs.itemUpdateForm.clearValidate();
      this.hiddenPassword = true;
      this.hiddenPassword1 = true;
    },
    storeTypeChange(storeType) {
      if (storeType === 2 && this.formData.osName === 'Windows') {
        this.formData.storagePath = 'C';
      } else if (storeType === 2 && this.formData.osName === 'Linux') {
        this.formData.storagePath = '\\home';
      } else {
        this.formData.storagePath = '';
      }
    },
  },
  computed: {
    useType: {
      get() {
        return Object.keys(useTypesMapping).find(type => {
          const ts = Object.keys(useTypesMapping[type]);
          return ts.includes(String(this.formData.databaseType));
        });
      },
      set(type) {
        const defaultVal = Object.keys(useTypesMapping[type])[0];
        this.formData.databaseType = Number(defaultVal);
      }
    },
    availableOs() {
      if(this.formData.databaseType === 9) {
        return ['Windows'];
      } else if (this.formData.databaseType === 1 && this.formData.oracleVersion === 2) {
        return ['Windows', 'Linux', 'AIX'];
      } else if (this.formData.databaseType === 10) {
        return ['Windows', 'AIX'];
      } else if (this.formData.databaseType === 6) {
        return ['Linux', 'AIX'];
      }
      return ['Windows', 'Linux'];
    }
  },
  watch: {
    'formData.databaseType': function(newVal, oldVal) {
      if(oldVal === 1) {
        this.formData.oracleVersion = '';
      }
      if(newVal === 15) {
        this.$message.warning('设备IP必须填写本机IP地址');
      }
      this.formData.osName = '';
    },
    'formData.oracleVersion': function(newVal, oldVal) {
      this.formData.osName = '';
    },
    'formData.osName': function(newVal, oldVal) {
      if (newVal === 'Linux' && this.formData.storeType === 2) {
        this.formData.storagePath = '\\home';
      } else if (newVal === 'Windows' && this.formData.storeType === 2) {
        this.formData.storagePath = 'C';
      } else {
        this.formData.storagePath = '';
      }
    }
  },
  components: {
    InputToggle,
  },
};
</script>
