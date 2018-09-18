<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @close="modalClosed">
      <span slot="title">
        添加连接
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="createForm"
               size="small">
        <el-collapse v-model="activeNames" @change="handleChange" style="text-align:left">
          <el-collapse-item title="主机配置" name="1">
              <template slot="title">
                <span class="titleClass">主机配置</span>
              </template>
              <el-form-item label="主机IP："
                      prop="vmManageHostIp">
                <el-input v-model="formData.vmManageHostIp"></el-input>
              </el-form-item>
              <el-form-item label="登录账号："
                            prop="vmManageHostLogin">
                <el-input v-model="formData.vmManageHostLogin"></el-input>
              </el-form-item>
              <el-form-item label="登录密码："
                            prop="vmManageHostPass">
                <input-toggle v-model="formData.vmManageHostPass"
                              :hidden.sync="hiddenPassword"></input-toggle>
              </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="服务配置" name="2">
              <template slot="title">
                <span class="titleClass">服务配置</span>
              </template>
              <el-form-item label="服务IP："
                            prop="vmHostServerIp">
                <el-input v-model="formData.vmHostServerIp"></el-input>
              </el-form-item>
              <el-form-item label="登录账号："
                            prop="vmHostServerUser">
                <el-input v-model="formData.vmHostServerUser"></el-input>
              </el-form-item>
              <el-form-item label="登录密码："
                            prop="vmHostServerPass">
                <input-toggle v-model="formData.vmHostServerPass"
                              :hidden.sync="hiddenPassword"></input-toggle>
              </el-form-item>
              <el-form-item label="服务类型："
                            prop="vmHostServerType">
                <el-radio v-model="formData.vmHostServerType"
                          :label="1">VMware</el-radio>
                <el-radio v-model="formData.vmHostServerType"
                          :label="2">华为虚拟机</el-radio>
              </el-form-item>
          </el-collapse-item>
          
        </el-collapse>
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

export default {
  name: '',
  mixins: [genModalMixin('vmManageCollect')],
  data(){
    return {
      activeNames: ['1', '2'],
      rules: {
        vmManageHostIp: [
          {
            required: true,
            message: '请输入主机IP',
            trigger: 'blur'
          },
          {
            pattern: '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          }
        ],
        vmHostServerIp: [
          {
            required: true,
            message: '请输入服务IP',
            trigger: 'blur'
          },
          {
            pattern: '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          }
        ],
        vmManageHostLogin: [{
          required: true,
          message: `请输入主机登录账号`,
          trigger: 'blur',
        },
        {
          length: 20,
          message: '长度在20个字符以内',
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        vmManageHostPass: [{
          required: true,
          message: `请输入主机登录密码`,
          trigger: 'blur',
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        vmHostServerUser: [{
          required: true,
          message: `请输入服务登录账号`,
          trigger: 'blur',
        },
        {
          length: 20,
          message: '长度在20个字符以内',
          trigger: 'blur'
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
        vmHostServerPass: [{
          required: true,
          message: `请输入服务登录密码`,
          trigger: 'blur',
        },
        {
          pattern: '^[^\\s]*$',
          message: '不能包含空格',
          trigger: ['blur'],
        },
        ],
      }
      // formData: {
      //   vmManageHostIp: '',
      //   vmManageHostLogin: '',
      //   vmManageHostPass: '',
      //   vmHostServerIp: '',
      //   vmHostServerUser: '',
      //   vmHostServerPass: '',
      //   vmHostServerType: 1
      // }
    }
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      console.log(this.formData.vmHostServerUser)
      this.$refs.createForm.validate(valid => {
        if (valid) {
          console.log(this.formData.vmHostServerUser)
          console.log(this.formData)
          this.$emit('confirm', this.formData);
        } else {
          this.activeNames = ['1', '2']
          return false;
        }
      });
    },
    modalClosed() {
      // this.formData = { ...this.originFormData };
      this.$refs.createForm.resetFields();
      this.hiddenPassword = true;
    },
    handleChange(val){
      console.log(val);
    }
  },
  components: {
    InputToggle,
  },
};
</script>
<style scoped>
.titleClass {
  font-size: 18px;
}
</style>
