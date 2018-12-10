<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
               :before-close="beforeModalClose"
               @close="modalClosed"
               @open="modalOpened"
               :visible.sync="modalVisible">
      <span slot="title">
        执行恢复操作
      </span>
      <el-form size="small"
              label-position="right"
              label-width="110px"
              :model="formData"
              ref="singleRestorePlanForm">
        <el-form-item label="恢复主机"
                      :rules="{ required: true, message: '请选择主机', trigger: 'blur' }"
                      prop="hostIp">
          <el-select  v-model="formData.targetHostId"
                      @change="selectHostChange"
                      style="width: 100%;">
            <el-option v-for="host in selectionHosts"
                       :key="host.id"
                       :value="host.id"
                       :label="`${host.hostName}(${host.hostIp})`">
              <span style="float: left">{{ host.hostName}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="恢复源路径"
                      prop="restorePath">
          <el-button type="primary"
                      size="small"
                     @click="selectSourceFiles">选择文件</el-button>
        </el-form-item>
        <el-form-item label="存放路径"
                      prop="targetPath">
          <el-button type="primary"
                     :disabled="!hasFetchedTargetPath"
                     size="small"
                     @click="selectTargetFiles">选择路径</el-button>
        </el-form-item>
        <el-form-item label="恢复排除文件"
                      v-if="restoreType === 1">
          <el-tag :key="tag.id"
                  :class="$style.tags"
                  type="danger"
                  v-for="tag in formData.excludeFiles"
                  closable
                  @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input v-if="inputTagVisible"
                    :class="$style.buttonNewTag"
                    ref="saveTagInput"
                    v-model="tagInputValue"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"></el-input>
          <el-button v-else @click="showInputTag">+ 排除文件</el-button>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名"
                          prop="loginName">
              <el-input v-model="formData.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码"
                          prop="password">
              <input-toggle v-model="formData.password"
                            :hidden.sync="hiddenPassword"></input-toggle>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                  @click="confirmBtnClick"
                  :loading="btnLoading">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
    <plan-source-path :visible.sync="filePlanTree"
                      :host-id="hostId"
                      :fatherNodes="sourcePath"
                      @selectNodes="selectSourceNodes"></plan-source-path>
    <result-source-path :visible.sync="fileResultTree"
                        :host-id="hostId"
                        :fatherNodes="sourcePath"
                        @selectNodes="selectSourceNodes"></result-source-path>
    <target-tree :visible.sync="fileTargetTree"
                 :host-id="hostId"
                 :fatherNodes="targetNodes"
                 @selectNodes="selectTargetNodes"></target-tree>
  </section>
</template>
<script>
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import cloneDeep from 'lodash/cloneDeep';
import ResultSourcePath from '@/components/pages/file/ResultSourcePath';
import PlanSourcePath from '@/components/pages/file/PlanSourcePath';
import TargetTree from '@/components/pages/file/TargetTree';
import {
  fetchAll,
  fetchPathByHostId,
  fetchPathByPlanId,
  fetchPathByResultId
} from '@/api/file';
const basicFormData = {
  targetHostId: null,
  targetPath: null,
  restorePath: null,
  excludeFiles: [],
  loginName: '',
  password: ''
};
const fetchSourcePath = {
  1: fetchPathByPlanId,
  2: fetchPathByResultId
}
export default {
  name: 'SingleRestoreModal',
  mixins: [restorePlanModalMixin],
  props: {
    btnLoading: {
      type: Boolean
    },
    visible: {
      type: Boolean
    },
    restoreType: {
      type: Number
    },
    id: {
      type: Number
    },
    hostId: {
      type: Number
    },
    sourcePath: {
      type: Array,
      default: function() {
        return [];
      }
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      selectionHosts: null,
      tagInputValue: null, // 恢复排除文件
      inputTagVisible: false,
      filePlanTree: false,
      fileResultTree: false,
      fileTargetTree: false,
      targetNodes: null,
      hasFetchedTargetPath: false,
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
      },
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data: infos } = res.data;
          this.selectionHosts = infos;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    modalClosed() {
      this.$refs.singleRestorePlanForm.clearValidate();
      this.hiddenPassword = true;
      this.hasFetchedTargetPath = false;
    },
    modalOpened() {
      const baseFormData = cloneDeep(basicFormData);
      this.originFormData = Object.assign({}, baseFormData);
      this.formData = Object.assign({}, this.originFormData);
    },
    selectSourceNodes(nodes) {
      this.formData.restorePath = nodes.map(node => node.sourcePath).concat();
    },
    selectTargetNodes(nodes) {
      this.formData.targetPath = nodes.map(node => node.sourcePath).concat()[0];
    },
    selectHostChange(hostId) {
      this.hasFetchedTargetPath = false;
      fetchPathByHostId(hostId)
        .then(res => {
          const { data: nodes } = res.data;
          this.targetNodes = nodes;
          this.hasFetchedTargetPath = true;
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    handleClose(tag) {
      this.formData.excludeFiles.splice(this.formData.excludeFiles.indexOf(tag), 1);
    },
    showInputTag() {
      this.inputTagVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    handleInputConfirm() {
      let tagInputValue = this.tagInputValue;
      if(tagInputValue) {
        this.formData.excludeFiles.push(tagInputValue);
      }
      this.inputTagVisible = false;
      this.tagInputValue = '';
    },
    confirmBtnClick() {
      if(this.restoreType !== 1) {
        const { excludeFiles,restorePath, ...other } = this.formData;
        this.$emit('confirm', this.id, other);
      } else {
        this.$emit('confirm', this.id, this.formData);
      }
    },
    selectSourceFiles() {
      if(this.type === 'restoreResult') {
        this.fileResultTree = true;
      } else {
        this.filePlanTree = true;
      }
    },
    selectTargetFiles() {
      this.fileTargetTree = true;
    }
  },
  components: {
    ResultSourcePath,
    PlanSourcePath,
    TargetTree
  }
}
</script>
<style lang="scss" module>
.tags {
  margin-right: 8px;
}
.buttonNewTag {
  width: 100px;
}
</style>


