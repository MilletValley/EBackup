<template>
  <section>
    <el-dialog title="接管初始化"
               custom-class="min-width-dialog"
               :visible.sync="modalVisible"
               @close="modalClosed"
               @open="modalOpened">
      <el-form size="small"
               :rules="rules"
               ref="selectHostForm"
               :model="formData"
               label-width="100px">
        <el-form-item label="选择主设备"
                      prop="primaryHostId">
          <el-select v-model="formData.primaryHostId"
                     style="width: 100%;"
                     placeholder="请选择主设备">
            <el-option v-for="host in productionHosts"
                       :key="host.id"
                       :label="`${host.name}(${host.hostIp})`"
                       :value="host.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择备设备"
                      prop="viceHostId">
          <el-select v-model="formData.viceHostId"
                     style="width: 100%;"
                     placeholder="请选择备设备">
            <el-option v-for="host in ebackupHosts"
                       :key="host.id"
                       :label="`${host.name}(${host.hostIp})`"
                       :value="host.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择生产库"
                      prop="primaryDatabaseIds">
          <el-select v-model="formData.primaryDatabaseIds"
                     style="width: 100%;"
                     multiple
                     placeholder="请选择生产库">
            <el-option v-for="app in databaseOnProductionHost"
                       :key="app.id"
                       :label="app.name"
                       :value="app.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户密码"
                      prop="password">
          <el-input v-model="formData.password"
                    placeholder="请输入用户密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelButtonClick()">取消</el-button>
        <el-button type="primary"
                   :loading="btnLoading"
                   @click="confirmBtnClick">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { baseModalMixin } from '@/components/mixins/backupPlanModalMixin';
import { sortMixin } from '@/components/mixins/commonMixin';
const baseData = {
  primaryHostId: '',
  viceHostId: '',
  primaryDatabaseIds: '',
  password: ''
}
const rules = {
  primaryHostId: [
    { required: true, message: '请选择主设备', trigger: 'blur' }
  ],
  viceHostId: [
    { required: true, message: '请选择备设备', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' }
  ],
  primaryDatabaseIds: [
    { required: true, message: '请选择生产库', trigger: 'blur' }
  ]
}
export default {
  name: 'AppLinkCreateModal',
  mixins: [baseModalMixin, sortMixin],
  props: {
    productionHosts: {
      type: Array,
    },
    ebackupHosts: {
      type: Array,
    },
    links: {
      type: Array
    },
    visible: {
      type: Boolean,
    },
    btnLoading: {
      type: Boolean,
    },
  },
  data() {
    return {
      formData: {},
      originFormData: {},
      rules
    }
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
      return (this.productionHosts.find(
          host => host.id === this.formData.primaryHostId
        ) || {}
      );
    },
    databaseOnProductionHost() {
      const data = this.selectedProductionHost.databases || [];
      return this.sortFn(data, 'createTime');
    },
  },
  methods: {
    modalOpened() {
      this.originFormData = {...baseData};
      this.formData = {...this.originFormData};
    },
    modalClosed() {
      this.$refs.selectHostForm.clearValidate();
      this.modalVisible = false;
    },
    confirmBtnClick() {
      this.$refs.selectHostForm.validate(valid => {
        if(valid) {
          this.$emit('confirm', this.formData);
        }
      })
    }
  }
}
</script>

