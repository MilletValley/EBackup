<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed"
               @open="modalOpened">
      <span slot="title">
        添加主机
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="createForm"
               size="small">
        <el-form-item label="主机名："
                    prop="serverName">
            <el-input v-model="formData.serverName"></el-input>
        </el-form-item>
        <el-form-item label="类型："
                      prop="underlyingType"
                      class="is-required">
          <el-radio-group v-model="formData.underlyingType">
            <el-radio v-for="type in Object.keys(underlyingTypeMapping)"
                      :key="type"
                      :label="Number(type)">{{ underlyingTypeMapping[type] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!showDevice && formData.underlyingType === 1" label="选择设备：" prop="hostName">
            <el-input v-model="hostName" readonly>
                <el-button slot="append" @click="selectHostFn">...</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="存储方式："
                      prop="storeType"
                      class="is-required"
                      v-show="formData.underlyingType === 2">
          <el-radio-group v-model.number="formData.storeType">
            <el-radio v-for="type in Object.keys(storeTypeMapping)"
                      :key="type"
                      :label="Number(type)">{{ storeTypeMapping[type] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="存储盘符"
                      prop="storagePath"
                      v-if="formData.underlyingType === 2 && formData.storeType === 2">
          <el-select v-model="formData.storagePath"
                     style="width: 100%">
            <el-option v-for="item in Array.from(new Array(24), (val, index) => String.fromCharCode(index + 67))"
                      :key="item"
                      :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机IP："
                    prop="serverIp">
            <el-input v-model="formData.serverIp"></el-input>
        </el-form-item>
        <el-form-item label="登录账号："
                    prop="serverLoginName">
        <el-input v-model="formData.serverLoginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码："
                    prop="serverPassword">
        <input-toggle v-model="formData.serverPassword"
                        :hidden.sync="hiddenPassword"></input-toggle>
        </el-form-item>
        <el-form-item label="主机类型："
                    prop="serverType">
          <el-radio-group v-model="formData.serverType">
            <el-radio v-for="(serverType, index) in serverTypeMapping[vmType]"
                      :key="index"
                      :label="serverType">{{ virtualHostServerTypeMapping[serverType] }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <select-device-modal @confirm="selectedhandler"
                           :selected="{ hostId:this.formData.hostId, hostName: this.formData.hostName }"
                           :visible.sync="deviceModalVisible"
                           :vm-type="vmType"></select-device-modal>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelBtnClick" v-show="!btnLoading">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import SelectDeviceModal from '@/components/modal/SelectDeviceModal';
import { validateLength } from '../../utils/common';
import {
  virtualMapping,
  serverTypeMapping,
  virtualHostServerTypeMapping,
  storeTypeMapping
} from '@/utils/constant';

export default {
  name: '',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    btnLoading: {
      type: Boolean,
    },
    type: {},
  },
  data() {
    let data = {
      serverName: '',
      hostId: null,
      hostName: '',
      serverIp: '',
      serverLoginName: '',
      serverPassword: '',
      serverType: 1,
      underlyingType: 1,
      storeType: 1,
      storagePath: ''
    };
    const underlyingTypeMapping = {
      1: 'veeam',
      2: 'vddk'
    }
    return {
      originFormData: data,
      formData: Object.assign({}, data),
      hiddenPassword: true,
      deviceModalVisible: false,
      serverTypeMapping,
      virtualHostServerTypeMapping,
      virtualMapping,
      underlyingTypeMapping,
      storeTypeMapping,
      rules: {
        serverName: [
          {
            required: true,
            message: `请输入主机名`,
            trigger: 'blur',
          },
          {
            validator: validateLength(30),
            trigger: 'blur',
          },
        ],
        hostName: [
          {
            required: true,
            message: `请选择设备`,
            trigger: ['blur'],
          },
        ],
        serverIp: [
          {
            required: true,
            message: '请输入主机IP',
            trigger: 'blur',
          },
          {
            validator: validateLength(20),
            trigger: 'blur',
          },
          {
            pattern:
              '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          },
        ],
        serverLoginName: [
          {
            required: true,
            message: `请输入主机登录账号`,
            trigger: 'blur',
          },
          {
            validator: validateLength(100),
            trigger: 'blur',
          },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        serverPassword: [
          {
            required: true,
            message: `请输入主机登录密码`,
            trigger: 'blur',
          },
          {
            validator: validateLength(100),
            trigger: 'blur',
          },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        storagePath: [
          {
            required: true,
            message: '请选择存储盘符',
            trigger: 'blur'
          }
        ]
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
    hostName() {
      return this.formData.hostName;
    },
    showDevice() {
      return this.type === 'device';
    },
    vmType() {
      return Number(Object.keys(virtualMapping).find(type =>
        this.$route.name.toLowerCase().includes(virtualMapping[type].toLowerCase())
      ));
    },
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          const { underlyingType, storeType, storagePath, hostName, ...others } = this.formData;
          this.$emit('confirm', {
            underlyingType,
            storeType: underlyingType === 1 ? 1 : storeType,
            storagePath: underlyingType === 1 ? '' : storagePath,
            hostName: underlyingType === 1 ? hostName : null,
            ...others
          });
        }
      });
    },
    modalOpened() {
      const serverType = serverTypeMapping[this.vmType][0];
      this.formData.serverType = serverType;
      this.originFormData.serverType = serverType;
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      // this.$refs.createForm.resetFields();
      this.$refs.createForm.clearValidate();
      this.hiddenPassword = true;
    },
    // 点击取消按钮触发
    cancelBtnClick() {
      this.hasModifiedBeforeClose(() => {
        this.$emit('update:visible', false); // 关闭modal
      });
    },
    // 退出之前，判断是否有未保存的修改
    beforeModalClose(done) {
      this.hasModifiedBeforeClose(done);
    },
    // 关闭之前 验证是否有修改
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.formData, this.originFormData)) {
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            fn();
          })
          .catch(() => {});
      }
    },
    selectHostFn() {
      this.deviceModalVisible = true;
    },
    selectedhandler(data) {
      const { id: hostId, name: hostName } = data;
      this.formData = Object.assign(this.formData, { hostId, hostName });
      this.deviceModalVisible = false;
    },
  },
  components: {
    InputToggle,
    SelectDeviceModal,
  },
};
</script>
<style scoped>
.titleClass {
  font-size: 18px;
}
</style>
