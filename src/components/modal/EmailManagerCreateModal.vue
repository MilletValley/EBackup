<template>
  <section>
    <el-dialog
      title="添加邮箱"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      @close="modalClose">
      <el-form :model="formData"
          label-width="110px"
          ref="formData"
          size="small">
        <el-form-item label="主机名"
                      prop="mailHost">
          <el-input v-model="formData.mailHost"></el-input></el-form-item>
        <el-form-item label="协议名"
                      prop="mailTransportProtocol">
          <el-select v-model="formData.mailTransportProtocol"
                     placeholder="请选择">
            <el-option v-for="item in ['pop3', 'SMTP']"
                       :key="item.value"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="端口"
                      prop="mailSmtpPort">
          <el-input v-model="formData.mailSmtpPort"></el-input>
        </el-form-item>
        <el-form-item label="状态"
                      prop="emailStatus">
          <el-radio v-model="formData.emailStatus" :label="'0'">启用</el-radio>
          <el-radio v-model="formData.emailStatus" :label="'1'">禁用</el-radio>
        </el-form-item>
        <el-form-item label="邮箱登录名"
                      prop="emailLoginName">
          <el-input v-model="formData.emailLoginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码"
                      prop="emailPassword">
          <input-toggle v-model="formData.emailPassword"
                        :hidden.sync="hiddenPassword"></input-toggle>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" :loading="btnLoading">确 定</el-button>
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
export default {
  name: 'EmailManagerCreateModal',
  data() {
    const baseFormData = {
      emailId: -1,
      mailHost: '',
      mailTransportProtocol: '',
      mailSmtpPort: '25',
      emailLoginName: '',
      emailPassword: '',
      emailStatus: '0',
    };
    return {
      formData: Object.assign({}, baseFormData),
      originFormData: Object.assign({}, baseFormData),
      hiddenPassword: true
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    btnLoading: {
      type: Boolean,
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
  },
  methods: {
    confirm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.formData);
        } else {
          return false;
        }
      });
    },
    handleClose(done) {
      if (!isEqual(this.formData, this.originFormData)) {
        this.$confirm('有未保存的修改，是否退出？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      } else {
        this.dialogVisible = false;
      }
    },
    modalClose() {
      this.formData = { ...this.originFormData };
      this.$refs.formData.clearValidate();
      this.hiddenPassword = true;
    },
  },
  components: {
    InputToggle,
  }
}
</script>
