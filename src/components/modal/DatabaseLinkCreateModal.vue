<template>
  <el-dialog title="接管初始化"
             :visible.sync="modalVisible"
             @open="modalOpened"
             @close="modalClosed">
    <el-form inline>
      <el-form-item label="选择主设备">
        <el-select v-model="selectedProductionHostId"
                   placeholder="选择主设备">
          <el-option v-for="host in productionHosts"
                     :key="host.id"
                     :label="host.name"
                     :value="host.id"
                     :disabled="!host.databases.length"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择备设备">
        <el-select v-model="selectedEbackupHostId"
                   placeholder="选择备设备">
          <el-option v-for="host in ebackupHosts"
                     :key="host.id"
                     :label="host.name"
                     :value="host.id"
                     :disabled="!!host.databases.length"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <section :class="$style.configureTabContainer">
      <el-tabs value="default"
               type="border-card"
               :class="$style.defaultTabs"
               v-show="!selectedProductionHostId">
        <el-tab-pane name="default"
                     label="实例">
          请选择主设备
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
            <template v-if="type === 'oralce'">
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
                <el-input :disabled="keep"
                          type="password"
                          v-model="multiFormData[index].vicePassword"></el-input>
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
                 @click="confirmBtnClick">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'DatabaseLinkCreateModal',
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
  },
  data() {
    return {
      selectedProductionHostId: '', // 选择的生产设备ID
      selectedEbackupHostId: '', // 选择的易备设备ID
      currentTab: '', // 当前Tab页name
      multiFormData: [], // 多个tab页内的表单数据
      originRequestData: [],
      keep: false,
    };
  },
  watch: {
    /**
     * 主设备变更时，清空表单数据，重制tab页
     */
    selectedProductionHostId(value) {
      this.multiFormData = this.databaseTabs.map(db => ({
        primaryDatabaseId: db.id,
        // primaryLsn: '',
        // viceLsn: '',
        // port: '',
      }));
      this.currentTab = String(
        (this.databaseTabs[0] && this.databaseTabs[0].id) || ''
      );
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
    databaseTabs() {
      return this.selectedProductionHost.databases || [];
    },
    requestData() {
      return {
        primaryHostId: this.selectedProductionHostId,
        viceHostId: this.selectedEbackupHostId,
        detail: this.multiFormData,
      };
    },
  },
  methods: {
    cancelBtnClick() {
      this.$emit('update:visible', false);
    },
    confirmBtnClick() {
      this.$emit('confirm', this.requestData);
    },
    modalOpened() {
      this.originRequestData = { ...this.requestData };
    },
    modalClosed() {
      this.selectedProductionHostId = '';
      this.selectedEbackupHostId = '';
      this.currentTab = '';
    },
  },
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
</style>
