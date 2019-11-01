<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
              :before-close="beforeModalClose"
              @open="modalOpened"
              @close="modalClosed"
              :visible.sync="modalVisible">
      <span slot="title">
        {{ title }}
        <el-popover placement="right" width="400" trigger="hover">
          <div>
            <p>
              1、将从该备份点新建一台全新的虚拟机，原有的虚拟机将不受影响。
            </p>
            <p>
              2、验证确认内部数据正确之后，可以手动将这台虚拟机替换为生产虚拟机。
            </p>
            <p>
              3、为了避免IP地址和现有的虚拟机冲突，需要手动将虚拟机连接到网络中。新生成的虚拟机将会有新的硬件特征，如果虚拟机操作系统或者软件绑定了硬件信息进行授权，需要重新授权，或者使用覆盖原虚拟机方式
            </p>
          </div>
          <i class="el-icon-info" slot="reference"></i>
        </el-popover>
      </span>
      <el-form size="small"
               label-position="right"
               label-width="100px"
               :model="formData"
               :rules="rules"
               ref="restorePlanCreateForm">
        <el-form-item label="计划名称"
                      prop="planName">
          <el-input v-model="formData.planName"></el-input>
        </el-form-item>
        <el-form-item label="新虚拟机名"
                      prop="newName">
          <el-input v-model="formData.newName"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="存储位置"
                          prop="recoveryStorageId">
              <el-select v-model="formData.recoveryStorageId"
                        @change="recoveryStorageIdChange"
                        style="width: 100%"
                        :disabled="!aCloudStorages.length"
                        :placeholder="aCloudStoragesLoading ? '加载中...' : '请选择存储位置'">
                <el-option v-for="storage in aCloudStorages"
                          :key="storage.recoveryStorageId"
                          :label="storage.recoveryStorageName"
                          :value="storage.recoveryStorageId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="恢复主机"
                          prop="nodeId">
              <el-select v-model="formData.nodeId"
                         style="width: 100%"
                         :disabled="!formData.recoveryStorageId"
                         :placeholder="aCloudServerHostsLoading ? '加载中...' : '请选择恢复主机'">
                <el-option v-for="host in aCloudServerHosts"
                          :key="host.nodeId"
                          :value="host.nodeId"
                          :label="host.nodeName">
                  <span style="float: left">{{ host.nodeName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13p">{{ host.ip }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分组"
                      prop="pathName">
          <el-input v-model="formData.pathName"
                    :placeholder="aCloudPathsLoading ? '加载中...' : '请选择分组'"
                    :disabled="!aCloudPaths.length"
                    @focus="selectACloudPath">
            <el-button slot="append"
                      @click="selectACloudPath">...</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="恢复时间" class="is-required"
                      prop="startTime">
          <el-date-picker type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          v-model="formData.startTime"></el-date-picker>
          <span v-show="formData.startTime"
                style="color: rgb(223, 77, 77); margin-left: 10px; font-size: 12px">
                注：默认恢复当前最新的备份集
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirmBtnClick"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelButtonClick">取消</el-button>
      </span>
    </el-dialog>
    <path-tree-modal :visible.sync="pathTreeModalVisible"
                     :paths="aCloudPaths"
                     :selected-path="formData.path"
                     @confirm="selectACloudPathConfirm"></path-tree-modal>
  </section>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep';
import { restorePlanModalMixin } from '@/components/mixins/backupPlanModalMixin';
import validate from '@/utils/validate';
import dayjs from 'dayjs';
import { fetchACloudStorages, fetchServerHostsByStorage, fetchACloudPaths } from '@/api/virtuals';
import PathTreeModal from '@/components/pages/virtual/PathTreeModal';

const aCloudBasicFormData = {
  planName: '',
  startTime: '',
  hostId: -1,
  recoveryStorageId: '',
  newName: '',
  path: '',
  pathName: '',
  nodeId: ''
};

export default {
  name: 'ACloudRestorePlanModal',
  mixins: [restorePlanModalMixin],
  components: {
    PathTreeModal
  },
  props: {
    vmType: {
      type: Number
    },
    results: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      type: 'vm',
      rules: {
        planName: validate.planName,
        newName: validate.newVmName,
        recoveryStorageId: [
          { required: true, message: '请选择存储位置', trigger: 'blur' }
        ],
        nodeId: [
          { required: true, message: '请选择恢复主机', trigger: 'blur' }
        ],
        pathName: [
          { required: true, message: '请选择分组', trigger: 'blur' }
        ]
      },
      pathTreeModalVisible: false,
      aCloudStorages: [],
      aCloudServerHosts: [],
      aCloudPaths: [],
      aCloudStoragesLoading: false,
      aCloudServerHostsLoading: false,
      aCloudPathsLoading: false
    };
  },
  methods: {
    confirmBtnClick() {
      this.$refs.restorePlanCreateForm.validate(valid => {
        if (valid) {
          const { nodeId, pathName, ...others } = this.formData;
          this.$emit('confirm', {
            node: this.aCloudServerHosts.find(n => n.nodeId === nodeId),
            ...others
          }, this.action);
        }
      });
    },
    getPathNode(path, nodes) {
      const flattern = nodes =>
        nodes.reduce(
          (flat, next) => {
            if (next.data && next.data.length) {
              return flat.concat(flattern(next.data), next);
            }
            return flat.concat(next);
          },
          []
        );
      return flattern(nodes).find(node => node.path === path);
    },
    recoveryStorageIdChange() {
      this.formData.nodeId = '';
      this.fetchServerHostsByStorage();
    },
    fetchServerHostsByStorage() {
      this.aCloudServerHostsLoading = true;
      fetchServerHostsByStorage(
          this.formData.recoveryStorageId,
          this.details.hostId
        )
        .then(res => {
          const { data } = res.data;
          this.aCloudServerHosts = data;
        })
        .catch(error => {
          this.$message.error(error);
          this.aCloudServerHosts = [];
        })
        .then(() => {
          this.aCloudServerHostsLoading = false;
        });
    },
    fetchACloudPaths() {
      this.aCloudPathsLoading = true;
      this.formData.pathName = '';
      fetchACloudPaths(this.details.hostId)
        .then(res => {
          const { data } = res.data;
          this.aCloudPaths = data;
          if (this.action === 'update') {
            const pathMsg = this.getPathNode(this.formData.path, this.aCloudPaths);
            this.originFormData.pathName = pathMsg && pathMsg.name ? pathMsg.name : '';
            this.formData.pathName = this.originFormData.pathName;
          }
        })
        .catch(error => {
          this.$message.error(error);
          this.aCloudPaths = [];
        })
        .then(() => {
          this.aCloudPathsLoading = false;
        })
    },
    fetchACloudStorages() {
      this.aCloudStoragesLoading = true;
      fetchACloudStorages(this.resultId)
      .then(res=> {
        const { data } = res.data;
        this.aCloudStorages = data;
      })
      .catch(error => {
        this.$message.error(error);
      })
      .then(() => {
        this.aCloudStoragesLoading = false;
      });
    },
    modalOpened() {
      let baseFormData = cloneDeep(aCloudBasicFormData);
      this.fetchACloudStorages();
      this.fetchACloudPaths();
      if (this.action === 'update' || this.action === 'query') {
        const { id, name, config, } = this.restorePlan;
        const { newName, startTime, recoveryStorageId, path, nodeId } = config;
        this.originFormData = Object.assign(
          {},
          baseFormData,
          {
            id,
            planName: name,
            newName,
            startTime,
            oldName: this.details.vmName,
            hostId: this.details.hostId,
            recoveryStorageId,
            path,
            nodeId
          }
        )
        this.formData = Object.assign({}, this.originFormData);
        this.fetchServerHostsByStorage();
      } else {
        const { vmName } = this.details;
        this.originFormData = Object.assign({}, baseFormData, { oldName: vmName, hostId: this.details.hostId });
        this.formData = Object.assign({}, this.originFormData);
      }
    },
    modalClosed() {
      this.$refs.restorePlanCreateForm.clearValidate();
    },
    selectACloudPath() {
      this.pathTreeModalVisible = true;
    },
    selectACloudPathConfirm(node) {
      this.formData.path = node.path;
      this.formData.pathName = node.name;
    }
  },
  computed: {
    latestResult() {
      const normalResults = this.results.filter(result => result.state === 0);
      if (normalResults.length) {
        return normalResults.sort((a, b) => dayjs(b.startTime) - dayjs(a.startTime))[0];
      }
      return {};
    },
    resultId() {
      if (this.action === 'create') {
        return this.latestResult.id ? this.latestResult.id : -1;
      } else {
        return this.restorePlan.config ? this.restorePlan.config.backupId : -1;
      }
    }
  }
};
</script>
