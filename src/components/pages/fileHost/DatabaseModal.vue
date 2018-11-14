<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               @open="modalOpen"
               @close="modalClosed">
      <span slot="title">
        {{title}}
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="createForm"
               size="small">
        <el-form-item label="主机名"
                      prop="hostName">
          <el-input v-model="formData.hostName"></el-input>
        </el-form-item>
        <el-form-item label="主机IP"
                      prop="hostIp">
          <el-input v-model="formData.hostIp"></el-input>
        </el-form-item>
        <el-form-item label="操作系统"
                      style="width: 100%"
                      prop="osName">
          <el-select v-model="formData.osName"
                     placeholder="请选择">
            <el-option v-for="item in ['Windows', 'Linux']"
                       :key="item.value"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属业务系统"
                      prop="application">
          <el-input v-model="formData.application"></el-input>
        </el-form-item>
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
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import validate from '@/utils/validate';
import { baseModalMixin } from '@/components/mixins/backupPlanModalMixin';
const rules = {
  hostName: validate.hostName,
  hostIp: validate.hostIp,
  osName: validate.osName,
  application: validate.application,
  loginName: validate.fileLoginName,
  password: validate.filePassword
};


const vm = {
  name: 'DatabaseModal',
  mixins: [baseModalMixin],
  props: {
    btnLoading: {
      type: Boolean,
      // required: true,
    },
    data: {
      type: Object
    },
    action: {
      type: String
    }
  },
  data() {
    return {
      type: 'filehost',
      rules: rules,
      hiddenPassword: true,
      baseData: {
        hostName: '',
        hostIp: '',
        osName: '',
        application: '',
        loginName: '',
        password: ''
      },
    };
  },
  computed: {
    title() {
      if (this.action === 'update') {
        return '更新服务器';
      } else if (this.action === 'query') {
        return '查看服务器';
      }
      return '添加服务器';
    },
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      console.log({...this.formData})
      this.$refs.createForm.validate(valid => {
        console.log({...this.formData})
        if (valid) {
          const {
            id,
            hostName,
            hostIp,
            osName,
            application,
            loginName,
            password
          } = this.formData;
          this.$emit('confirm', {
            id,
            hostName,
            hostIp,
            osName,
            application,
            loginName,
            password
          }, this.action);
        } else {
          return false;
        }
      });
    },
    modalOpen(){
      console.log(this.data)
      if(this.action === 'update'){
        this.originFormData = Object.assign({},this.baseData, this.data);
      }else{
        this.originFormData = {...this.baseData}
      }
      this.formData = {...this.originFormData}
      console.log({...this.formData})
    },
    modalClosed() {
      this.$refs.createForm.clearValidate();
      this.hiddenPassword = true;
    },
  },
  components: {
    InputToggle,
  },
};
export default vm;
</script>
<style>
</style>
