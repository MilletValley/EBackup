<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               custom-class="min-width-dialog"
               title="上传代理包"
               @open="modalOpen"
               @close="modalClosed">
        <el-form v-model="formData"
                  size="small"
                  label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作系统"
                            prop="osType">
                <el-select v-model="formData.osType">
                  <el-option v-for="os in ['Windows', 'Linux', 'AIX']"
                            :key="os"
                            :label="os"
                            :value="os"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型">
                <el-select v-model="formData.hostType">
                  <el-option v-for="type in Object.keys(useTypeMapping)"
                            :key="type"
                            :label="useTypeMapping[type]"
                            :value="Number(type)"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Wrapper部署"
                        prop="isWrapper">
            <el-radio-group v-model="formData.isWrapper">
              <el-radio v-for="type in Object.keys(yesOrNoMapping)"
                        :key="type"
                        :label="Number(type)">{{ yesOrNoMapping[type] }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传">
            <el-upload action=""
                        :limit="1"
                        :auto-upload="false"
                        :on-change="onChange"
                        :on-remove="handleRemove"
                        :fileList="fileList">
              <el-button size="small"
                         type="primary"
                         :disabled="Boolean(upload.get('file'))">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="代理包名"
                        prop="packageName">
            <el-input v-model="formData.packageName"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="代理包信息"
                        prop="updateMsg">
            <el-input type="textarea"
                      v-model="formData.updateMsg"
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
import { yesOrNoMapping, useTypeMapping } from '@/utils/constant';
const basicData = {
  packageName: '',
  osType: '',
  isWrapper: 1,
  hostType: '',
  updateMsg: ''
};
export default {
  name: 'UploadPackagesModal',
  props: ['visible', 'selectData', 'btnLoading'],
  data() {
    return {
      formData: {},
      originFormData: {},
      fileList: [],
      upload: new FormData(),
      params: {},
      editableTabsValue: '1',
      tabIndex: 1,
      editableTabs: [],
      yesOrNoMapping,
      useTypeMapping
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
    },
    activeTab() {
      return this.editableTabs.find(tab => tab.name === this.editableTabsValue);
    }
  },
  methods: {
    beforeModalClose() {},
    modalOpen() {
      this.formData = Object.assign({}, basicData);
      this.upload = new FormData();
      this.fileList = [];
      this.tabIndex = 1;
    },
    modalClosed() {
      this.modalVisible = false;
    },
    confirm() {
      Object.keys(this.formData).forEach(key => {
          this.upload.append(key, this.formData[key])
      });
      this.$emit('confirm', this.upload);
    },
    cancelButtonClick() {
      this.modalVisible = false;
    },
    onChange(file, fileList) {
      this.upload.append('file', file.raw, file.name);
       this.formData.packageName = file.name;
    },
    handleRemove(file, fileList) {
      this.upload.delete('file');
      this.formData.packageName = '';
    }
  }
}
</script>
