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
          <el-radio-group v-model="formData.databaseType">
            <el-radio v-for="db in databaseUseType"
                      v-if="(useType === 'db'&&[1,2,5,6,7].includes(db.value))||(useType === 'vm'&&db.value === 4) || (useType === 'application'&&db.value === 8)"
                      :key="db.value"
                      :label="db.value">{{ db.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="12" v-if="this.formData.databaseType===1">
            <el-form-item label="oracle版本"
                          prop="oracleVersion">
              <el-select v-model="formData.oracleVersion"
                        placeholder="请选择">
                <el-option v-for="(item, index) in Object.keys(oracleVersionMapping)"
                          :key="index"
                          :label="oracleVersionMapping[Number(item)]"
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
                <el-option v-for="(item, index) in ['Windows', 'Linux', 'AIX']"
                          :key="index"
                          v-if="[0, 1].includes(index) || (formData.databaseType === 1 && formData.oracleVersion === 2)"
                          :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.osName === 'Windows' && formData.databaseType === 2">
            <el-form-item label="Windows系统版本"
                          prop="windowsType">
              <el-select v-model="formData.windowsType" placeholder="请选择">
                <el-option v-for="item in [{label: 1, value: '2003'}, {label: 2, value: '2008及以上'}]"
                           :key="item.label"
                           :label="item.value"
                           :value="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="是否Rac环境"
                      v-if="['Linux', 'AIX'].includes(formData.osName)"
                      prop="isRacMark">
          <el-radio v-model="formData.isRacMark"
                    :label="0">是</el-radio>
          <el-radio v-model="formData.isRacMark"
                    :label="1">否</el-radio>
        </el-form-item>
        <el-row v-if="formData.isRacMark===0 && ['Linux', 'AIX'].includes(formData.osName)">
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
        <template v-if="this.formData.oracleVersion===1&&this.formData.databaseType===1&&this.formData.osName==='Windows'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="存储盘符"
                            prop="storagePath">
                <el-select v-model="formData.storagePath">
                  <el-option v-for="item in words"
                            :key="item.value.value"
                            :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
import { createOne } from '../../api/host';
import { genModalMixin } from '../mixins/modalMixins';
import { oracleVersionMapping } from '@/utils/constant';

export default {
  name: 'HostCreateModal',
  mixins: [genModalMixin('host')],
  data() {
    return {
      oracleVersionMapping
    }
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          let data = {...this.formData};
          this.$emit('confirm', data);
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
        switch(this.formData.databaseType) {
          case 1:
          case 2:
          case 5:
          case 6:
          case 7:
            return 'db';
          case 4:
            return 'vm';
          case 8:
            return 'application';
          default:
            return ''
        }
      },
      set(newVal) {
         switch(newVal) {
          case 'db':
            this.formData.databaseType = 1;
            break;
          case 'vm':
            this.formData.databaseType = 4;
            break;
          case 'application':
            this.formData.databaseType = 8;
            break;
          default:
        }
      }
    }
  },
  watch: {
    'formData.databaseType': function(newVal, oldVal) {
      if(oldVal === 1) {
        this.formData.oracleVersion = '';
      }
    },
    'formData.oracleVersion': function(newVal, oldVal) {
      if(oldVal === 2 && this.formData.osName === 'AIX') {
        this.formData.osName = '';
      }
    }
  },
  components: {
    InputToggle,
  },
};
</script>
<style>
</style>
