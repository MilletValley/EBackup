<template>
  <section>
    <el-dialog :visible.sync="dialogVisible"
               title="添加计划"
               width="900px"
               @open="openDialog">
      <el-table :data="links"
                style="margin-top: -30px"
                ref="multipleTable"
                default-expand-all
                @select="handleSelection"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-checkbox-group v-model="props.row.linkIds">
              <div v-for="databaseLink in props.row.databaseLinks"
                   :key="databaseLink.id"
                   style="margin: 10px 50px">
                <el-checkbox style="display: block"
                             :label="databaseLink.id">
                  <span>
                    <span :class="$style.switchModalDetail">{{ databaseLink.primaryDatabase.instanceName}}</span>
                    <span>{{ databaseLink.primaryDatabase.role | databaseRoleFilter}}</span>
                  </span>
                  <i-icon name="readySwitch"
                          :class="$style.readySwitch"></i-icon>
                  <span>
                    <span>{{ databaseLink.viceDatabase.role | databaseRoleFilter}}</span>
                    <span :class="$style.switchModalDetail" style="text-align: right">{{ databaseLink.viceDatabase.instanceName}}</span>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="生产设备IP"
                         align="center"
                         min-width="220px"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip :content="`${scope.row.primaryHost.name}`"
                        effect="light"
                        placement="right">
              <span>{{ scope.row.primaryHost.hostIp }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="易备设备IP"
                         align="center"
                         min-width="220">
          <template slot-scope="scope">
            <el-tooltip :content="`${scope.row.viceHost.name}`"
                        effect="light"
                        placement="right">
              <span>{{ scope.row.viceHost.hostIp }}</span>
            </el-tooltip>      
          </template>
        </el-table-column>
        <el-table-column label="服务/临时IP"
                         align="center"
                         min-width="220">
          <template slot-scope="scope">
            <!-- 服务IP -->
            <span v-if="scope.row.primaryHost.osName==='Linux'">
              服务IP({{scope.row.serviceIpMark===1?'生产':'易备'}})：
              {{ scope.row.primaryHost.serviceIp }}
            </span>
            <!-- 临时 -->
            <span v-else-if="scope.row.primaryHost.osName==='Windows'">
              临时IP：{{ scope.row.primaryHost.serviceIp }}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="切IP"
                         align="center"
                         min-width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.flag"
                       :active-value="1"
                       :inactive-value="0"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-form inline
               :class="$style.planForm"
               size="small">
        <el-row :gutter="20">
          <el-col :span="9" :offset="3">
            <el-form-item label="计划名称">
              <el-input v-model="name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="用户密码">
              <el-input v-model="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" :class="$style.dialogFooter">
        <el-button type="primary"
                   @click="confirm"
                   :loading="btnLoading"
                   :disabled="confirmBtnDisiable">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import takeoverMixin from '../mixins/takeoverMixins';
import { validatePassword } from '../../api/user';
import IIcon from '@/components/IIcon'
export default {
  name: 'BatchSwitchModal',
  mixins: [takeoverMixin],
  props: {
    originLinks: Array,
    visible: Boolean,
    flag: Number,
    btnLoading: Boolean
  },
  data() {
    return {
      name: '',
      password: '',
      multipleSelection: [],
      links: []
    }
  },
  methods: {
    // 表格多选与实例多选联动
    handleSelection(selection, row) {
      if(selection.length===0) { // 表格取消选择
        row.flag = this.flag
        row.linkIds = []
      } else {
        const lastItemId = selection[selection.length-1].id;
        if(lastItemId === row.id) { // 表格勾选
          row.linkIds = this.originLinks.find(element => element.id===lastItemId).linkIds
        } else { // 表格取消选择
          row.flag = this.flag;
          row.linkIds = [];
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openDialog() {
      // 对象数组的深拷贝
      this.links = [].concat(JSON.parse(JSON.stringify(this.originLinks)));
      this.password = '';
      this.name = '';
      // 默认全选
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleAllSelection()
      })
    },
    confirm() {
      if(this.multipleSelection.length>0) {
        validatePassword(this.password)
          .then(() => {
            const data = {
              name: this.name,
              createTime: this.createTime,
              switchIds: this.switchIds
            }
            this.$emit('confirm', data);
          })
          .catch(error => {
            this.$message.error(error);
          });
      } else {
        this.$message.warning('请选择需要执行切换的设备')
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit('update:visible', value);
        }
      },
    },
    // 获取当前时间，yyyy-mm-dd hh-mm-ss
    createTime () {
      return new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toTimeString().substr(0, 8)
    },
    confirmBtnDisiable() {
      return !this.password || !this.name
    },
    switchIds() {
      if(this.multipleSelection.length===0) {
        return []
      } else {
        return this.multipleSelection.map(item => {
          return {
            hostLinkId: item.id,
            flag: item.flag,
            linkIds: item.linkIds
          }
        })
      }
    }
  },
  components: {
    IIcon
  }
}
</script>
<style lang="scss" module>
@import '../../style/color.scss';
.switchModalName {
  display: inline-block;
  width: 8em;
  margin-left: 0.5em;
}
.readySwitch {
  vertical-align: -0.3em;
  width: 2em;
  display: inline-block;
}
.switchModalDetail {
  display: inline-block;
  width: 7em;
}
.planForm {
  margin-top: 20px;
}
.dialogFooter {
  margin-top: -20px;
}
</style>



