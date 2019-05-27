<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
               title="修改部署信息"
               custom-class="min-width-dialog"
               @open="modalOpen">
      <el-form ref="form"
                v-model="formData"
                size="small"
                label-width="120px">
        <el-form-item label="代理IP"
                      prop="agentIp">
          <el-input v-model="formData.agentIp"
                    disabled></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署版本"
                          prop="versionId">
              <el-select v-model="formData.versionId">
                <el-option v-for="version in versions"
                          :key="version.id"
                          :label="version.versionCode"
                          :value="Number(version.id)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部署包"
                          prop="packageId">
              <el-select v-model="formData.packageId">
                <el-option v-for="pack in availPackages"
                          :key="pack.id"
                          :label="pack.packageName"
                          :value="Number(pack.id)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作系统"
                          prop="agentOs">
              <el-select v-model="formData.agentOs">
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
              <el-select v-model="formData.auto">
                <el-option v-for="type in Object.keys(switchManualMapping)"
                          :key="type"
                          :label="switchManualMapping[type]"
                          :value="Number(type)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="安装路径"
                      prop="installPath">
          <el-input v-model="formData.installPath"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统用户名"
                          prop="user">
              <el-input v-model="formData.user"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码"
                          prop="pass">
              <el-input v-model="formData.pass"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import { switchManualMapping } from '@/utils/constant';

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
  name: 'UpdateDeployModal',
  props: ['visible', 'versions', 'btnLoading', 'selectData'],
  data() {
    return {
      formData: {},
      originFormData: {},
      switchManualMapping
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
    availPackages() {
      const version = this.versions.find(v => v.id === this.formData.versionId);
      return version ? vesion.package : [];
    }
  },
  methods: {
    modalOpen() {
      const { depPackage } = this.selectData;
      const packageId = depPackage.id;
      const versionId = depPackage.version.id;
      this.formData = Object.assign({ ...basicData, packageId, versionId }, this.selectData);
      this.originFormData = Object.assign({ ...basicData, packageId, versionId }, this.selectData);
    },
    confirm() {
      let { versionId, packageId, depPackage, ...other } = this.formData;
      const version = this.versions.find(version => version.id === versionId);
      const newDepPackage = version ? version.packages.find(pack => pack.id === packageId) : {};
      newDepPackage.version = version;
      this.$emit('confirm', { depPackage: newDepPackage, ...other });
    },
    cancelButtonClick() {
      this.modalVisible = false;
    }
  }
}
</script>

