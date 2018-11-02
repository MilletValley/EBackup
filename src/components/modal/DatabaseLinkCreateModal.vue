<template>
  <el-dialog title="接管初始化"
             custom-class="min-width-dialog"
             :visible.sync="modalVisible"
             @open="modalOpened"
             @close="modalClosed">
    <el-form size="small"
             ref="selectHostForm"
             label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择主设备">
            <el-select style="width: 90%;"
                       v-model="selectedProductionHostId"
                       placeholder="选择主设备">
              <el-option v-for="host in productionHosts"
                         :key="host.id"
                         :label="host.name"
                         :value="host.id"
                         :disabled="!host.databases.length"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择备设备">
            <el-select style="width: 90%;"
                       v-model="selectedEbackupHostId"
                       placeholder="选择备设备">
              <el-option v-for="host in ebackupHosts"
                         :key="host.id"
                         :label="host.name"
                         :value="host.id"
                         :disabled="!!host.databases.length"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择端口号">
            <el-select style="width: 90%;"
                       v-model="selectedDbPort"
                       placeholder="选择端口号">
              <el-option v-for="port in dbPorts"
                         :disabled="!databaseTabs.length"
                         :key="port.id"
                         :label="port"
                         :value="port"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <section :class="$style.configureTabContainer">
      <el-tabs value="default"
               type="border-card"
               :class="$style.defaultTabs"
               v-show="!selectedProductionHostId">
        <el-tab-pane name="default"
                     :label="instanceName">
          <div :class="$style.tipInfo">请选择主设备</div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="currentTab"
               type="border-card"
               v-show="selectedProductionHostId">
        <el-tab-pane v-for="(database, index) in databaseTabs"
                     :key="database.id"
                     :label="database.name"
                     :name="String(database.id)">
          <el-form :model="multiFormData[index]"
                   label-width="120px"
                   size="small">
            <template v-if="type === 'oracle'">
              <el-form-item label="主库监听名">
                <el-input v-model="multiFormData[index].primaryLsn"></el-input>
              </el-form-item>
              <el-form-item label="备库监听名">
                <el-input v-model="multiFormData[index].viceLsn"></el-input>
              </el-form-item>
              <el-form-item label="临时端口">
                <el-input-number v-model="multiFormData[index].port"></el-input-number>
              </el-form-item>
            </template>
            <template v-if="type === 'sqlserver'">
              <el-form-item label="备库登录名">
                <el-input :disabled="keep"
                          v-model="multiFormData[index].viceLoginName"></el-input>
              </el-form-item>
              <el-form-item label="备库密码">
                <input-toggle v-model="multiFormData[index].vicePassword"
                              :disabled="keep"
                              :hidden.sync="hiddenPassword"></input-toggle>
              </el-form-item>
              <el-form-item label="保持锁定">
                <el-switch :disabled="!multiFormData[0].viceLoginName || !multiFormData[0].vicePassword"
                           v-model="keep"></el-switch>
                <el-tooltip content="所有数据库的用户名/密码与第一个保持一致"
                            placement="right">
                  <i class="el-icon-question"
                     style="margin-left:1em;"></i>
                </el-tooltip>
              </el-form-item>
            </template>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </section>
    <span slot="footer">
      <el-button @click="cancelBtnClick">取消</el-button>
      <el-button type="primary"
                 :disabled="confirmBtnDisable"
                 :loading="btnLoading"
                 @click="confirmBtnClick">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { sortMixin } from '../mixins/commonMixin';
import InputToggle from '@/components/InputToggle';
export default {
  name: 'DatabaseLinkCreateModal',
  mixins: [sortMixin],
  props: {
    productionHosts: {
      type: Array,
    },
    ebackupHosts: {
      type: Array,
    },
    visible: {
      type: Boolean,
    },
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver'].includes(value);
      },
    },
    btnLoading: {
      type: Boolean,
    }
  },
  data() {
    return {
      selectedProductionHostId: '', // 选择的生产设备ID
      selectedEbackupHostId: '', // 选择的易备设备ID
      selectedDbPort: '', // 选择端口号
      currentTab: '', // 当前Tab页name
      multiFormData: [], // 多个tab页内的表单数据
      originRequestData: [],
      keep: false,
      hiddenPassword: true
    };
  },
  watch: {
    /**
     * 主设备变更时，清空表单数据，重制tab页
     */
    selectedProductionHostId(value) {
      this.selectedDbPort = this.dbPorts[0] || ''
    },
    selectedDbPort(value) {
      this.multiFormData = this.databaseTabs.map(db => ({
        primaryDatabaseId: db.id,
        // primaryLsn: '',
        // viceLsn: '',
        // port: '',
      }));
      this.currentTab = String(
        (this.databaseTabs[0] && this.databaseTabs[0].id) || ''
      );
      this.keep = false;
    },
    keep(value) {
      if (!value) return;
      const firstFormData = this.multiFormData[0];
      for (let i = 1, l = this.multiFormData.length; i < l; ++i) {
        this.multiFormData[i].viceLoginName = firstFormData.viceLoginName;
        this.multiFormData[i].vicePassword = firstFormData.vicePassword;
      }
    },
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', false);
      },
    },
    selectedProductionHost() {
      return (
        this.productionHosts.find(
          host => host.id === this.selectedProductionHostId
        ) || {}
      );
    },
    databaseOnProductionHost() {
      const data = this.selectedProductionHost.databases || [];
      return this.sortFn(data, 'createTime');
    },
    dbPorts() {
      return Array.from(new Set(this.databaseOnProductionHost.map(db => db.dbPort)));
    },
    databaseTabs() {
      return this.databaseOnProductionHost.filter(db => db.dbPort === this.selectedDbPort);
    },
    instanceName() {
      if (this.type === 'oracle') {
        return '实例';
      } else if (this.type === 'sqlserver') {
        return '数据库';
      }
    },
    requestData() {
      return {
        primaryHostId: this.selectedProductionHostId,
        viceHostId: this.selectedEbackupHostId,
        detail: this.multiFormData,
      };
    },
    confirmBtnDisable() {
      return (
        this.selectedProductionHostId === '' ||
        this.selectedEbackupHostId === ''
      );
    },
  },
  methods: {
    cancelBtnClick() {
      this.$refs.selectHostForm.clearValidate();
      this.modalVisible = false;
      // this.$emit('update:visible', false);
    },
    // 验证表单中是否有空信息
    validateNullProp() {
      const multiFormData = this.multiFormData;
      const type = this.type;
      return new Promise(function(resolve, reject) {
        const validateProps = {
          oracle: ['primaryLsn', 'viceLsn', 'port'],
          sqlserver: ['viceLoginName', 'vicePassword'],
        };
        let isSuccess = true;
        for (let i = 0, l = multiFormData.length; i < l; ++i) {
          const formData = multiFormData[i];
          let errorProp = validateProps[type].find(prop => {
            return !formData[prop] || formData[prop] === '';
          });
          if (errorProp) {
            isSuccess = false;
            reject(String(formData.primaryDatabaseId));
            return;
          }
        }
        if (isSuccess) resolve();
      });
    },
    confirmBtnClick() {
      this.validateNullProp()
        .then(() => {
          this.$emit('confirm', this.requestData);
        })
        .catch(errorDbId => {
          this.currentTab = errorDbId;
          this.$message.warning('初始化信息不能为空');
        });
    },
    modalOpened() {
      // this.originRequestData = { ...this.requestData };
    },
    modalClosed() {
      this.selectedProductionHostId = '';
      this.selectedEbackupHostId = '';
      this.selectedDbPort = '';
      this.currentTab = '';
      this.hiddenPassword = true;
    },
  },
  components: {
    InputToggle
  }
};
</script>
<style lang="scss" module>
.configureTabContainer {
  height: 210px;
  margin: {
    top: 10px;
  }
}
.defaultTabs {
  height: 221px;
}
.tipInfo {
  width: 310px;
  margin: 60px auto;
  font-size: 3em;
  color: #c0c4cc;
  text-align: center;
}
</style>
