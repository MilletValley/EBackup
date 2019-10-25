<template>
  <section>
    <el-dialog custom-class="min-width-dialog"
              :before-close="beforeModalClose"
              @open="modalOpened"
              @close="modalClosed"
              :visible.sync="modalVisible">
      <span slot="title">
        {{ title }}
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
        <el-row v-if="action === 'create'">
          <el-col :span="12">
            <el-form-item label="存储位置"
                          prop="recoveryStorageId">
              <el-select v-model="formData.recoveryStorageId"
                        @change="fetchServerHostsByStorage"
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
                         @change="fetchACloudPaths"
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
                      prop="path"
                      v-if="action === 'create'">
          <el-input v-model="formData.path"
                    :placeholder="aCloudPathsLoading ? '加载中...' : '请选择分组'"
                    :disabled="!formData.nodeId"
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
        path: [
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
          const { nodeId, ...others } = this.formData;
          let data = null;
          if (this.action === 'create') {
            data = {
              node: this.aCloudServerHosts.find(n => n.nodeId === nodeId),
              ...others
            };
          } else {
            data = { ...this.formData };
          }
          this.$emit('confirm', data, this.action);
        }
      });
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
        })
        .then(() => {
          this.aCloudServerHostsLoading = false;
        });
    },
    fetchACloudPaths() {
      this.aCloudPathsLoading = true;
      fetchACloudPaths(this.formData.nodeId)
        .then(res => {
          const { data } = res.data;
          this.aCloudPaths = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .then(() => {
          this.aCloudPathsLoading = false;
        })
    },
    fetchACloudStorages() {
      this.aCloudStoragesLoading = true;
      fetchACloudStorages(this.latestResult.id)
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
      if (this.action === 'update' || this.action === 'query') {
        const { id, name, config } = this.restorePlan;
        const { newName,startTime } = config;
        this.originFormData = Object.assign(
          {},
          {
            id,
            planName: name,
            newName,
            startTime,
            oldName: this.details.vmName,
            hostId: this.details.hostId
          }
        )
      } else {
        const { vmName } = this.details;
        this.originFormData = Object.assign({}, baseFormData, { oldName: vmName, hostId: this.details.hostId });
      }
      this.formData = Object.assign({}, this.originFormData);
    },
    modalClosed() {
      this.$refs.restorePlanCreateForm.clearValidate();
    },
    selectACloudPath() {
      this.pathTreeModalVisible = true;
    },
    selectACloudPathConfirm(node) {
      this.formData.path = node.path;
    }
  },
  computed: {
    latestResult() {
      const normalResults = this.results.filter(result => result.state === 0);
      if (normalResults.length) {
        return normalResults.sort((a, b) => dayjs(b.startTime) - dayjs(a.startTime))[0];
      }
      return {};
    }
  }
};
</script>
