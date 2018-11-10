<template>
  <section>
    <el-dialog :visible.sync="modalVisible"
              :before-close="beforeModalClose"
              @open="modalOpen"
              @close="modalClosed">
      <span slot="title">
        {{disabled ? `更新数据库(ID:${data.id})` : "添加数据库"}}
      </span>
      <el-form :model="formData"
               :rules="rules"
               label-width="110px"
               ref="itemCreateForm"
               size="small">
        <el-form-item label="名称"
                      prop="name">
          <el-input v-model="formData.name"
                    placeholder="请输入一个标识名称"></el-input>
        </el-form-item>
        <el-form-item label="所属设备" v-if="!disabled"
                      prop="hostId">
          <span slot="label">所属设备
              <el-popover placement="top" trigger="hover"
                  content="类型为生产环境的设备"
                  >
                  <i class="el-icon-info" slot="reference"></i>
              </el-popover>
          </span>            
          <el-select v-model="formData.hostId" 
                     style="width: 100%;">
            <el-option v-for="host in availableHosts"
                       :key="host.id"
                       :label="`${host.name}(${host.hostIp})`"
                       :value="host.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属设备"  v-if="disabled"
                      prop="host">
          <span slot="label">所属设备
              <el-popover placement="top" trigger="hover"
                  content="类型为生产环境的设备"
                  >
                  <i class="el-icon-info" slot="reference"></i>
              </el-popover>
          </span>            
          <el-input disabled
                    :value=" formData.host ? `${formData.host.name || ''}(${formData.host.hostIp || ''})` : ''"></el-input>
        </el-form-item>
        <el-form-item label="数据库名"
                      prop="dbName">
          <el-input v-model="formData.dbName"
                    placeholder="请输入要备份的数据库名"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="端口号"
                          prop="dbPort">
              <el-input v-model.number="formData.dbPort"
                        placeholder="请输入端口号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据库登录名"
                          prop="loginName">
              <el-input v-model="formData.loginName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据库密码"
                          prop="password">
              <input-toggle v-model="formData.password"
                            :hidden.sync="hiddenPassword"></input-toggle>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading">确定</el-button>
        <el-button @click="cancelBtnClick()">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import isEqual from 'lodash/isEqual';
import InputToggle from '@/components/InputToggle';
import validate from '@/utils/validate';
const rules = {
  name: validate.name,
  dbPort: validate.dbPort,
  hostId: validate.selelctHost,
  dbName: validate.dbName,
  loginName: validate.dbLoginName,
  password: validate.dbPassword,
};
const vm = {
  name: 'DatabaseModal',
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    btnLoading: {
      type: Boolean,
      // required: true,
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      type: 'dm',
      defaultData: {
        name: '',
        hostId: '',
        dbName: '',
        dbPort: '',
        loginName: '',
        password: ''
      },
      formData: {},
      currentData: {},
      rules: rules,
      hiddenPassword: true
    };
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
    },
    disabled(){
      if(this.data){
        return true
      }
    },
    // 区分不同数据库都提示信息
    databaseOrInstance() {
      return this.type === 'oracle' || this.type === 'dm' ? '实例名' : '数据库名';
    },
    availableHosts() {
      return this.$store.getters.dmHosts.filter(
        h => h.hostType === 1
      );
    },
  },
  methods: {
    // 点击确认按钮触发
    confirm() {
      this.$refs.itemCreateForm.validate(valid => {
        console.log(this.formData)
        if (valid) {
          const {
            id,
            dbName,
            name,
            loginName,
            password,
            hostId,
            dbPort
          } = this.formData;
          this.$emit('confirm', {
            id,
            dbName,
            name,
            loginName,
            password,
            dbPort,
            // 创建对象 传入host对象 0609
            host: this.availableHosts.find(host => host.id === hostId),
          }, this.data ? 'update':'create');
        } else {
          return false;
        }
      });
    },
    modalOpen(){
      if(this.data){
        this.formData = Object.assign({},this.defaultData, this.data);
      }else{
        this.formData = {...this.defaultData}
      }
      console.log(this.formData)
      this.currentData = {...this.formData}
    },
    modalClosed() {
      this.$refs.itemCreateForm.clearValidate();
      this.hiddenPassword = true;
    },
    // 点击取消按钮触发
    cancelBtnClick() {
      this.hasModifiedBeforeClose(() => {
        this.$emit('update:visible', false); // 关闭modal
      });
    },
    beforeModalClose(done){
      this.hasModifiedBeforeClose(done);
    },
    // 关闭之前 验证是否有修改
    hasModifiedBeforeClose(fn) {
      if (isEqual(this.formData, this.currentData)) {
        fn();
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            fn();
          })
          .catch(() => {});
      }
    },
  },
  components: {
    InputToggle,
  },
};
export default vm;
</script>
<style>
</style>
