<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed">
      <span slot="title">
        添加设备
      </span>
      <el-form :model="formData"
               :rules="hostRules"
               label-width="130px"
               ref="createForm"
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
          <el-radio-group v-model.number="formData.storeType">
            <el-radio v-for="type in Object.keys(storeTypeMapping)"
                      :key="type"
                      :label="Number(type)">{{ storeTypeMapping[type] }}</el-radio>
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
                     v-if="useType !== 'vm'">
            <el-option v-for="item in Object.keys(useTypesMapping[useType])"
                       :key="item"
                       :value="Number(item)"
                       :label="useTypesMapping[useType][item]"></el-option>
          </el-select>
          <el-select v-model="vmType"
                     v-else>
            <el-option v-for="vm in Object.keys(vmTypesMapping)"
                       :key="vm"
                       :value="vm"
                       :label="vmTypesMapping[vm]"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12" v-if="formData.databaseType===1">
            <el-form-item label="oracle版本"
                          prop="oracleVersion">
              <el-select v-model="formData.oracleVersion"
                        placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(oracleVersionMapping)"
                          :key="index"
                          :label="oracleVersionMapping[item]"
                          :value="Number(item)">
                </el-option>
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
                         key="create-host-windows-type">
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
        <el-row v-if="formData.isRacMark === 0 && formData.databaseType === 1">
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
                  (formData.oracleVersion === 1 && formData.databaseType === 1 && formData.osName==='Windows')">
          <el-row>
            <el-col :span="12">
              <el-form-item label="存储盘符"
                            prop="storagePath">
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
        <el-form-item label="登录密码"
                      prop="password">
          <input-toggle v-model="formData.password"
                        :hidden.sync="hiddenPassword"></input-toggle>
        </el-form-item>
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
import { createOne } from '@/api/host';
import { genModalMixin } from '@/components/mixins/modalMixins';
import { oracleVersionMapping, storeTypeMapping } from '@/utils/constant';
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
    14: 'aCloud'
  },
  application: {
    8: '应用服务器'
  }
};

const vmTypesMapping = {
  vmware: 'VMware',
  hyperV: 'hyper-v',
  fusionSphere: '华为虚拟机',
  aCloud: 'aCloud',
};

export default {
  name: 'HostCreateModal',
  mixins: [genModalMixin('host')],
  props: {
    hostNames: {
      type: Array,
      default: []
    }
  },
  data() {
    const validateHostName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入设备名'));
      } else if (!(/^\S*$/.test(value))) {
        callback(new Error('不能包含空格'));
      } else if (this.hostNames.includes(value)) {
        callback(new Error('设备名已存在'));
      } else {
        validateLength(50)(rule, value, callback);
      }
      return false;
    };
    return {
      oracleVersionMapping,
      storeTypeMapping,
      useTypesMapping,
      vmTypesMapping,
      validateHostName,
      vmType: 'vmware'
    }
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          const { databaseType, ...others } = this.formData;
          let type = databaseType;
          if (this.useType === 'vm') {
            type = this.vmType === 'aCloud' ? 14 : 4;
          }
          this.$emit('confirm', {
            databaseType: type,
            ...other
          });
        } else {
          return false;
        }
      });
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.createForm.clearValidate();
      this.hiddenPassword = true;
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
      this.formData.osName = '';
    },
    'formData.oracleVersion': function(newVal, oldVal) {
      this.formData.osName = '';
    }
  },
  components: {
    InputToggle,
  },
};
</script>
<style>
</style>
