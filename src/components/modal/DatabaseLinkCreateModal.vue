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
            <el-form-item label="主库监听名">
              <el-input v-model="multiFormData[index].primaryLsn"></el-input>
            </el-form-item>
            <el-form-item label="备库监听名">
              <el-input v-model="multiFormData[index].viceLsn"></el-input>
            </el-form-item>
            <el-form-item label="临时端口">
              <el-input-number v-model="multiFormData[index].port"></el-input-number>
            </el-form-item>
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
  },
  data() {
    return {
      selectedProductionHostId: '',
      selectedEbackupHostId: '',
      currentTab: '',
      multiFormData: [],
      originRequestData: [],
    };
  },
  watch: {
    selectedProductionHostId(value) {
      this.multiFormData = this.databaseTabs.map(db => ({
        primaryDatabaseId: db.id,
        primaryLsn: '',
        viceLsn: '',
        port: '',
      }));
      this.currentTab = String(
        (this.databaseTabs[0] && this.databaseTabs[0].id) || ''
      );
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
