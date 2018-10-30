<template>
  <el-dialog custom-class="min-width-dialog"
             :visible.sync="modalVisible"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed">
    <span slot="title">执行恢复操作</span>
    <el-form :model="formData"
             :rules="rules"
             label-width="110px"
             ref="singleRestoreForm"
             size="small">
      <el-row v-if="!isVMware">
        <el-form-item label="恢复设备"
                      v-if="!this.isHW"
                      prop="hostIp">
          <span slot="label">恢复设备
              <el-popover placement="top" trigger="hover"
                  content="类型为易备环境的设备"
                  >
                  <i class="el-icon-info" slot="reference"></i>
              </el-popover>
          </span>
          <el-select v-model="formData.hostIp"
                     style="width: 100%;">
            <el-option v-for="host in selectionHosts"
                        :key="host.id"
                        :value="host.hostIp"
                        :label="`${isFileHost ? host.hostName : host.name}(${host.hostIp})`">
              <span style="float: left">{{ isFileHost ? host.hostName : host.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isFileHost"
                      label="恢复源路径"
                      prop="originDetailInfo">
          <el-popover placement="bottom"
                      style="height: 300px"
                      v-model="treeVisible">
            <div :class="$style.tree">
              <el-tree :data="treeData"
                      node-key="id"
                      highlight-current
                      :check-strictly="true"
                      :expand-on-click-node="false"
                      @node-click="nodeClick"
                      ref="tree"
                      :class="$style.treeStyle">
                <div class="custom-tree-node"
                      slot-scope="{ node, data }">
                  <i-icon :name="data.children?'folder':'papers'"
                          :class="$style.fileHostIcon"></i-icon>
                  <span>{{ data.fileName }}</span>
                  <span :class="$style.treeFileSize">{{ data.length | filterToTb }}</span>
                  <span :class="$style.treeFileTime">{{ data.lastUpTime | filterToTime }}</span>
                </div>
              </el-tree>
            </div>
            <el-input v-model="formData.originDetailInfo"
                      slot="reference"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item :label="detailInfoDisplayName"
                      prop="detailInfo">
          <el-input v-model="formData.detailInfo"></el-input>
        </el-form-item>
        <el-form-item label="端口号"
                      prop="dbPort"
                      v-if="['oracle', 'sqlserver', 'mysql'].includes(this.type)">
          <el-input v-model.number="formData.dbPort"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-if="isVMware">
        <el-col :span="12">
          <el-form-item label="恢复主机IP"
                        prop="hostIp">
            <el-input v-model="formData.hostIp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新虚拟机名"
                        :rules="[{ required: true, message: '请输入新虚拟机名', trigger: 'blur' }]"
                        prop="newName">
            <el-input v-model="formData.newName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isVMware">
        <el-form-item label="恢复磁盘名"
                      prop="diskName"
                      :rules="[{ required: true, message: '请输入恢复磁盘名', trigger: 'blur' }]">
          <el-input v-model="formData.diskName"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-if="!this.isHW && !isVMware">
        <el-col :span="12">
          <el-form-item label="登录名"
                        prop="loginName">
            <el-input v-model="formData.loginName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码"
                        prop="password"
                        :rules="[{ required: true, message: '请输入登录密码', trigger: 'blur' },]">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="isFileHost"
                    label="覆盖策略"
                    prop="reveringStrategy">
        <el-radio-group v-model="formData.recoveringStrategy">
          <el-radio v-for="s in Object.keys(recoveringStrategys)"
                    :key="s"
                    :label="Number(s)">{{ recoveringStrategys[s] }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="cancelButtonClick">取消</el-button>
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading="btnLoading">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs';
import { restorePlanModalMixin } from '../mixins/planModalMixins';
import { recoveringStrategyMapping } from '../../utils/constant';
import IIcon from '@/components/IIcon';

export default {
  name: 'SingleRestoreCreateModal',
  props: ['treeData', 'fileHostOriginPath'],
  mixins: [restorePlanModalMixin],
  data() {
    return {
      recoveringStrategys: recoveringStrategyMapping,
      treeVisible: false
    };
  },
  computed: {
    // isHW() {
    //   const path = this.$route.path;
    //   return this.$route.path.substring(4, path.lastIndexOf('/'))==='hwVirtual'
    // },
    // isVMware(){
    //   const path = this.$route.path;
    //   return this.$route.path.substring(4, path.lastIndexOf('/'))==='virtual'
    // }
  },
  filters: {
    // 时间戳转日期
    filterToTime(date) {
      if(!date)
        return '-'
      return new Date(parseInt(date) * 1000).toLocaleDateString().replace(/\//g, '-') + ' ' +
             new Date(parseInt(date) * 1000).toTimeString().substr(0, 8)
    },
    // 单位：b->tb
    filterToTb(size) {
      if(!size)
        return '-'
      return (size / Math.pow(1024, 4)).toFixed(2) + "T"
    }
  },
  methods: {
    confirmBtnClick() {
      this.$refs.singleRestoreForm.validate(valid => {
        if (valid) {
          this.formData.name = dayjs().format('YYYYMMDDHHmmss');
          this.pruneData(this.formData)
            .then(({ name, config }) => {
              // const { loginName, detailInfo} = config;
              // let conf = Object.assign({},config);
              // if(this.isVMware){
              //   conf.loginName = detailInfo;
              //   conf.detailInfo = loginName;
              // }
              this.$emit('confirm', { id: this.id, data: { name, config } });
            })
            .catch(error => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      let customData;
      if(this.isVMware || this.isHW){
        customData = {
          newName: '',
          oldName: this.database.vmName,
          diskName: '',
        }
      }else{
        customData = {
          loginName: '',
          password: '',
          detailInfo: this.database ? this.database.instanceName : '',
        }
        if(['oracle', 'sqlserver', 'mysql'].includes(this.type)) {
          customData.dbPort = this.database.dbPort; // mysql，sqlserver，oracle恢复时需填端口号
        }
        if(this.isFileHost) {
          customData.originDetailInfo = ''; // 文件单次恢复增加源路径
        }
      }
      this.formData = Object.assign({}, this.formData, customData)
      // if(this.isVMware){
      //   this.formData.loginName = this.database.vmName;
      //   this.originFormData.loginName = this.database.vmName;
      // }
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.singleRestoreForm.clearValidate();
      this.$refs.tree.setCheckedKeys([]);
    },
    nodeClick(item, checked, node) {
      if(checked) {
        this.formData.originDetailInfo = item.path
      } else {
        this.formData.originDetailInfo = '';
      }
      this.treeVisible = false;
    }
  },
  components: {
    IIcon
  }
};
</script>
<style lang="scss" module>
.treeFileSize,
.treeFileTime {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
  margin-top: 0.2em;
}
.treeFileSize {
  position: absolute;
  left: 420px;
}
.treeFileTime {
  position: absolute;
  left: 280px;
}
.fileHostIcon {
  vertical-align: -0.2em;
  height: 1.4em;
}
.tree{
  overflow-y: auto;
  // overflow-x: scroll;
  width:500px;
  max-height: 200px;
  .el-tree {
    max-width: 100%;
    display:inline-block !important;
  }
}
.treeStyle {
  .treeStyle .el-tree-node.is-expanded {
    background-color: blue;
    .el-tree-node__children {
      height: 300px;
      overflow: scroll;
    }
  }
}
</style>

