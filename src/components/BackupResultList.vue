<template>
  <section>
    <el-table :data="isFileBackupResult ? handleData : data|NotNullfilter"
              style="width: 100%; margin-top: 15px"
              :default-sort="{ prop: 'endTime', order: 'descending' }">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form inline
                   label-width="90px"
                   size="small"
                   class="result-detail-form">
            <el-form-item :class="$style.detailFormItem"
                          label="ID">
              <span>{{ scope.row.id }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="存储路径">
              <span>{{ scope.row.path }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="原文件路径"
                          v-if="isFileBackupResult">
              <span>{{ scope.row.fileResource }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="文件名"
                          v-else>
              <span>{{ scope.row.fileName }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="结束时间"
                          :sort-method="endTimeSortMethod">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="文件标识符"
                          v-if="isFileBackupResult">
              <span>{{ scope.row.identifier }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="大小">
              <span>{{ scope.row.size }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="状态">
              <span>
                <el-tag size="mini"
                        :type="scope.row.state === 1 ? 'danger' : 'success'">{{ stateConverter(scope.row.state) }}</el-tag>
              </span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="持续时间">
              <span>{{ scope.row.consume | durationFilter }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="错误信息"
                          v-if="scope.row.state === 1">
              <span>{{ scope.row.errorMsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="文件标识符"
                       prop="identifier"
                       v-if="isFileBackupResult"
                       width="200px"
                       align="center"></el-table-column>
      <el-table-column v-if="isFileBackupResult"
                       label="原文件路径"
                       prop="fileResource"
                       min-width="180px"
                       align="left"
                       header-align="center"></el-table-column>
      <el-table-column v-else
                       label="备份文件名"
                       prop="fileName"
                       min-width="180px"
                       align="left"
                       header-align="center"></el-table-column>
      <el-table-column label="开始时间"
                       prop="startTime"
                       min-width="200px"
                       align="center"></el-table-column>
      <el-table-column label="结束时间"
                       prop="endTime"
                       min-width="200px"
                       align="center"></el-table-column>
      <el-table-column label="大小"
                       prop="size"
                       width="120px"
                       align="center"></el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       width="70px"
                       align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.state === 0"
             class="el-icon-success"
             :class="$style.successColor"></i>
          <i v-else
             class="el-icon-error"
             :class="$style.errorColor"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="140px"
                       align="center"
                       v-if="this.type!=='vm'">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     :disabled="scope.row.state === 1"
                     v-show="!(isFileBackupResult && scope.row.allowRestore === 0)"
                     @click="restoreBtnClick(scope.row)">恢复</el-button>
          <!-- <span style="cursor: pointer">
            <i class="el-icon-loading"></i>正在恢复
          </span> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- <single-restore-create-modal :type="type"
                                 :id="selectedId"
                                 :visible.sync="singleRestoreModalVisible"
                                 @confirm="confirmCallback"></single-restore-create-modal> -->
  </section>
</template>
<script>
import dayjs from 'dayjs';
import SingleRestoreCreateModal from '@/components/modal/SingleRestoreCreateModal';
import baseMixin from './mixins/baseMixins';
import { backupResultMapping } from '../utils/constant';

export default {
  name: 'BackupResultList',
  mixins: [baseMixin],
  props: {
    data: {
      type: Array,
      required: true,
    },
    // filebakcup
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['oracle', 'sqlserver', 'windows', 'linux', 'vm', ''].includes(
          value
        );
      },
    },
  },
  data() {
    return {
      singleRestoreModalVisible: false,
      selectedId: -1,
    };
  },
  filters: {
    NotNullfilter(data) {
      data.map((result) => {
        for(let i in result) {
          result[i]=(result[i]===null||result[i]==='null')?'':result[i];
        }
      })
      return data;
    },
  },
  methods: {
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    // 点击恢复按钮
    restoreBtnClick({ id }) {
      this.$emit('single-restore-btn-click', id);
      // this.selectedId = id;
      // this.singleRestoreModalVisible = true;
    },
    // 添加单次恢复的回调
    // confirmCallback(restorePlan) {
    //   this.$emit('add-restore', restorePlan);
    // },
    endTimeSortMethod(a, b) {
      return dayjs(a) - dayjs(b);
    },
  },
  computed: {
    isFileBackupResult() {
      return this.type === 'windows' || this.type === 'linux';
    },
    // 文件服务器备份集中 只有最新对备份集才能用于恢复
    handleData() {
      const data = this.data.map((r, i, arr) => {
        return Object.assign({}, r);
      });
      const map = {};
      data.forEach((result, index) => {
        if (!map[result.fileResource]) {
          map[result.fileResource] = index;
        } else {
          const lastIndex = map[result.fileResource];
          if (dayjs(data[lastIndex].endTime) < dayjs(result.endTime)) {
            map[result.fileResource] = index;
          }
        }
      });
      return data.map((result, index) => {
        for(let i in result) {
          result[i]=(result[i]===null||result[i]==='null')?'':result[i];
        }
        if (map[result.fileResource] === index) {
          return Object.assign({}, result, { allowRestore: 1 });
        } else {
          return Object.assign({}, result, { allowRestore: 0 });
        }
      });
    },
  },
  components: {
    SingleRestoreCreateModal,
  },
};
</script>
<style lang="scss" module>
@import '../style/color.scss';
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  width: 30%;
  &:nth-child(2n) {
    width: 69%;
  }
}
</style>
