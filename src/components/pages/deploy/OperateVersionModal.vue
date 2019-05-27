<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               custom-class="min-width-dialog"
               @open="modalOpen"
               @close="modalClosed">
      <span slot="title">
        {{ operateType === 'create' ? '添加版本' : '更新版本' }}
      </span>
      <el-form v-model="formData"
               size="small"
               label-width="120px">
        <el-form-item label="版本号"
                      prop="versionCode">
          <el-input v-model="formData.versionCode"></el-input>
        </el-form-item>
        <el-form-item label="版本路径"
                      prop="packagePath">
          <el-input v-model="formData.packagePath"></el-input>
        </el-form-item>
        <el-form-item label="版本信息"
                      prop="versionMsg">
          <el-input type="textarea"
                    v-model="formData.versionMsg"
                    :autosize="{minRows: 5, maxRows: 10}"></el-input>
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
const basicData = {
  versionCode: '',
  packagePath: '',
  versionMsg: ''
}
export default {
  name: 'OperateVersionModal',
  props: ['visible', 'btnLoading', 'selectData', 'operateType'],
  data() {
    return {
      formData: {},
      originFormData: {}
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
      }
    }
  },
  methods: {
    beforeModalClose() {
      this.modalVisible = false;
    },
    cancelButtonClick() {
      this.modalVisible = false;
    },
    modalClosed() {
    },
    modalOpen() {
      if(this.operateType === 'create') {
        this.formData = Object.assign({}, basicData);
        this.originFormData = Object.assign({}, basicData);
      } else {
        this.formData = Object.assign({}, this.selectData);
        this.formData = Object.assign({}, this.selectData);
      }
    },
    confirm() {
      this.$emit('confirm', this.formData);
    }
  }
}
</script>

