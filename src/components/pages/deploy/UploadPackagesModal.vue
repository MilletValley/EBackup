<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               custom-class="min-width-dialog"
               title="批量上传"
               @open="modalOpen"
               @close="modalClosed">
      <!-- <el-form v-model="versionData"
               inline
               size="small"
               label-width="120px">
        <el-form-item label="版本号">
          <el-input v-model="versionData.versionCode"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="versionData.packagePath"
                    disabled></el-input>
        </el-form-item>
      </el-form> -->
      <el-tabs v-model="editableTabsValue"
               type="card"
               @edit="handleTabsEdit"
               addable>
        <el-tab-pane v-for="item in editableTabs"
                     :closable="editableTabs.length > 1"
                     :key="item.name"
                     :label="item.title"
                     :name="item.name">
          <el-form v-model="item.formData"
                   size="small"
                   label-width="120px">
            <!-- <el-form-item label="代理包名"
                          prop="packageName">
              <el-input v-model="item.formData.packageName"></el-input>
            </el-form-item> -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="操作系统"
                              prop="osType">
                  <el-select v-model="item.formData.osType">
                    <el-option v-for="os in ['Windows', 'Linux', 'AIX']"
                              :key="`${os}${item.name}`"
                              :label="os"
                              :value="os"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类型">
                  <el-select v-model="item.formData.hostType">
                    <el-option v-for="type in Object.keys(useTypeMapping)"
                              :key="`${type}${item.name}`"
                              :label="useTypeMapping[type]"
                              :value="Number(type)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Wrapper部署"
                          prop="isWrapper">
              <el-radio-group v-model="item.formData.isWrapper">
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
                            type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="代理包名"
                          prop="packageName">
              <el-input v-model="item.formData.packageName"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="代理包信息"
                          prop="updateMsg">
              <el-input type="textarea"
                        v-model="item.formData.updateMsg"
                        :autosize="{minRows: 5, maxRows: 10}"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
      // versionData: {},
      originFormData: {},
      fileList: [],
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
    },
    upload() {
      return new FormData();
    }
  },
  methods: {
    beforeModalClose() {},
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = String(++this.tabIndex);
        this.editableTabs.push({
          title: `代理包${newTabName}`,
          name: newTabName,
          upload: new FormData(),
          formData: Object.assign({}, basicData)
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        const tabs = this.editableTabs;
        const targetIndex = tabs.findIndex(tab => tab.name === targetName);
        if(this.editableTabsValue === targetName) {
          const nextTab = tabs[targetIndex + 1] || tabs[targetIndex - 1];
          if(nextTab) {
            this.editableTabsValue = nextTab.name;
          }
        }
        this.editableTabs.splice(targetIndex, 1);
      }
    },
    modalOpen() {
      // this.versionData = Object.assign({}, this.selectData);
      this.editableTabs = [{
        title: '代理包1',
        name: '1',
        upload: new FormData(),
        formData: Object.assign({}, basicData)
      }];
      this.editableTabsValue = this.editableTabs[0].name;
      this.tabIndex = 1;
    },
    modalClosed() {
      this.modalVisible = false;
    },
    confirm() {
      const packages = this.editableTabs.map(tab => {
        Object.keys(tab.formData).forEach(key => {
          tab.upload.append(key, tab.formData[key])
        });
        return tab.upload;
      })
      let uploadData = new FormData();
      // uploadData.append('versionCode', this.versionData.versionCode);
      // uploadData.append('packagePath', this.versionData.packagePath);
      // uploadData.append('packages', packages[0]);
      this.$emit('confirm', packages[0]);
    },
    cancelButtonClick() {
      this.modalVisible = false;
    },
    onChange(file, fileList) {
      this.activeTab.upload.append('file', file.raw, file.name);
       this.activeTab.formData.packageName = file.name;
    },
    handleRemove(file, fileList) {
      this.activeTab.upload.delete('file');
      this.activeTab.formData.packageName = '';
    }
  }
}
</script>
