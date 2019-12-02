<template>
  <div style="position: relative">
    <transition name="el-zoom-in-center">
      <div v-show="nextStep === 'createSingleRestorePlan' && index === 0"
          class="balloons"
          style="right: -80px; top: 45px; transform: translateX(100%)">
        <div class="left-arrow-bubble" style="width: 130px">
          选择需要恢复的备份集，点击“恢复”按钮开始立即恢复
          <p class="bubble-btn">
            <span type="text" @click="$emit('cancel-step')">取消</span>
          </p>
        </div>
      </div>
    </transition>
    <el-table :data="processedTableData|NotNullfilter" size="small"
              @sort-change="sortChangeFn"
              :default-sort="defaultSort">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form inline
                   label-width="130px"
                   size="small"
                   class="result-detail-form">
            <el-form-item class="detailFormItem"
                          label="备份文件名">
              <span>{{ scope.row.fileName }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="备份文件存放路径">
              <span>{{ scope.row.targetPath }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="备份文件源路径">
              <el-tooltip :content="scope.row.sourcePath"
                          placement="top"
                          effect="dark">
                <span class="wordsOverFlow">{{ scope.row.sourcePath }}</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="结束时间">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="NFS挂载点路径"
                          v-if="type==='linux'">
              <span>{{ scope.row.pointPath }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="文件标识符"
                          v-if="type==='windows'">
              <span>{{ scope.row.identifier }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="大小">
              <span>{{ scope.row.size }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="状态">
              <span>
                <el-tag size="mini"
                        :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
              </span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="持续时间">
              <span>{{ scope.row.consume | durationFilter }}</span>
            </el-form-item>
            <el-form-item class="detailFormItem"
                          label="错误信息"
                          v-if="scope.row.state === 1">
              <span>{{ scope.row.errorMsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="源文件路径"
                       prop="sourcePath"
                       min-width="80px"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <span @click="queryDetail(scope.row)" class="link">{{scope.row.sourcePath}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备份文件名"
                       prop="fileName"
                       min-width="80px"
                       align="center"
                       header-align="center"></el-table-column>
      <el-table-column label="开始时间"
                       prop="startTime"
                       min-width="140px"
                       align="center"></el-table-column>
      <el-table-column label="结束时间"
                       prop="endTime"
                       min-width="140px"
                       :sortable="true"
                       align="center"></el-table-column>
      <el-table-column label="大小"
                       prop="size"
                       min-width="100px"
                       align="center"></el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       min-width="70px"
                       align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.state === 0"
             class="el-icon-success successColor"></i>
          <i v-else
             class="el-icon-error errorColor"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="80px"
                       align="center">
        <template slot-scope="scope">
            <el-button type="text"
                        class="textBtn"
                        size="small"
                        :disabled="scope.row.state === 1 || backupType === 3 "
                        @click="restoreBtnClick(scope.row)">恢复</el-button>
            <el-button type="text"
                       class="textBtn"
                        size="small"
                        @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="margin-top10 text-right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    <path-result-modal  :visible.sync="modalVisible"
                        :data="selectData"
                        :backupType="backupType"
                        @delete-result-by-id="deleteResultById"
                        @single-restore-btn-click="restoreBtnClick"></path-result-modal>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { paginationMixin, sortMixin } from '@/components/mixins/commonMixin';
import baseMixin from '@/components/mixins/baseMixins';
import PathResultModal from '@/components/pages/guide/PathResultModal';
import { backupResultMapping } from '@/utils/constant';
export default {
  name: 'FileHostBackupResult',
  mixins: [baseMixin, paginationMixin, sortMixin],
  props: {
    type: {
      type: String
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    backupType: {
      type: Number
    },
    nextStep: {
      type: String
    },
    index: {
      type: Number
    }
  },
  components: {
    PathResultModal
  },
  data() {
    return {
      pageSize: 5,
      defaultSort: { prop: 'endTime', order: 'descending' },
      modalVisible: false,
      selectData: [],
      machineType: 2
    };
  },
  computed: {
    // 文件服务器备份集中 只有最新对备份集才能用于恢复
    tableData() {
      return this.data;
    },
  },
  methods: {
    // 点击恢复按钮
    restoreBtnClick({ id }) {
      this.$emit('single-restore-btn-click', id, this.backupType, 'restoreResult');
    },
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    del(row) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('delete-result-by-id', row.id);
        })
        .catch(() => { });
    },
    deleteResultById(id) {
      this.$emit('delete-result-by-id', id);
    },
    queryDetail(row) {
      this.selectData = row.list;
      this.modalVisible = true;
    },
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/guide.scss';
@import '@/style/color.scss';
.margin-top10{
  margin-top: 10px;
}
.text-right{
  text-align: right;
}
.link {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}
.textBtn {
  margin-left: 0;
}
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  /deep/
  .el-form-item__content {
    width: calc(100% - 130px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  width: 40%;
  &:nth-child(2n) {
    width: 59%;
  }
}
.wordsOverFlow {
  white-space:nowrap;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 370px;
}
</style>
