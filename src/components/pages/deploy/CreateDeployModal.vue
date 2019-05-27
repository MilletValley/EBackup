<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               :before-close="beforeModalClose"
               title="批量部署"
               custom-class="min-width-dialog"
               @open="modalOpen"
               @close="modalClosed">
      <el-tabs v-model="editableTabsValue"
               type="card"
               @edit="handleTabsEdit"
               addable>
        <el-tab-pane v-for="item in editableTabs"
                     :closable="editableTabs.length > 1"
                     :key="item.name"
                     :label="item.title"
                     :name="item.name">
          <el-form ref="form"
                   v-model="item.formData"
                   size="small"
                   label-width="120px">
            <el-form-item label="代理IP"
                          prop="agentIp">
              <el-input v-model="item.formData.agentIp"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="部署版本"
                              prop="versionId">
                  <el-select v-model="item.formData.versionId">
                    <el-option v-for="version in versions"
                              :key="version.id"
                              :label="version.versionCode"
                              :value="version.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部署包"
                              prop="packageId">
                  <el-select v-model="item.formData.packageId">
                    <el-option v-for="pack in (item.formData.versionId ? versions.find(v => v.id === item.formData.versionId).packages : [])"
                              :key="pack.id"
                              :label="pack.packageName"
                              :value="pack.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="操作系统"
                              prop="agentOs">
                  <el-select v-model="item.formData.agentOs">
                    <el-option v-for="(os, index) in ['Windows', 'Linux', 'AIX']"
                              :key="index"
                              :label="os"
                              :value="os"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部署方式"
                              prop="auto">
                  <el-select v-model="item.formData.auto">
                    <el-option v-for="type in Object.keys(switchManualMapping)"
                              :key="type"
                              :label="switchManualMapping[type]"
                              :value="type"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="安装路径"
                          prop="installPath">
              <el-input v-model="item.formData.installPath"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="系统用户名"
                              prop="user">
                  <el-input v-model="item.formData.user"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码"
                              prop="pass">
                  <el-input v-model="item.formData.pass"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
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
import isEqual from 'lodash/isEqual';
import { switchManualMapping } from '@/utils/constant';
import validate from '@/utils/validate';

const basicData = {
  agentIp: '',
  agentOs: '',
  installPath: '',
  versionId: '',
  packageId: '',
  auto: '',
  user: '',
  pass: ''
};
export default {
  name: 'CreateDeployModal',
  props: ['visible', 'versions', 'btnLoading'],
  data() {
    return {
      editableTabsValue: '1',
      tabIndex: 1,
      switchManualMapping,
      editableTabs: [],
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
  },
  methods: {
    validateProp() {
      const multiFormData = this.editableTabs;
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = String(++this.tabIndex);
        this.editableTabs.push({
          title: `部署${newTabName}`,
          name: newTabName,
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
      this.editableTabs = [{
        title: '部署1',
        name: '1',
        formData: Object.assign({}, basicData)
      }];
      this.editableTabsValue = this.editableTabs[0].name;
      this.tabIndex = 1;
    },
    beforeModalClose(done) {
      // this.hasModifiedBeforeClose(done);
      this.modalVisible = false;
    },
    cancelButtonClick() {
      // this.hasModifiedBeforeClose(() => {
      //   this.modalVisible = false;
      // });
      this.modalVisible = false;
    },
    hasModifiedBeforeClose(fn) {
      // if (isEqual(this.formData, this.originFormData)) {
      //   fn();
      // } else {
      //   this.$confirm('有未保存的修改，是否退出？', {
      //     type: 'warning',
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //   })
      //     .then(() => {
      //       fn();
      //     })
      //     .catch(() => {});
      // }
    },
    modalClosed() {
    },
    confirm() {
      const depRecords = this.editableTabs.map(tab => {
        const { versionId, packageId, ...other } = tab.formData;
        const version = this.versions.find(version => version.id === versionId);
        const { packages, ...another } = version;
        const depPackage = Object.assign({}, version.packages.find(pack => pack.id === packageId));
        depPackage.version = version;
        return { ...other, depPackage };
      })
      this.$emit('confirm', { depRecords });
    }
  }
}
</script>
