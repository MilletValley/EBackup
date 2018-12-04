<template>
  <section>
    <el-table :data="processedTableData|NotNullfilter" size="small"
              :default-sort="{ prop: 'endTime', order: 'descending' }">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form inline
                   label-width="130px"
                   size="small"
                   class="result-detail-form">
            <el-form-item :class="$style.detailFormItem"
                          label="备份文件名">
              <span>{{ scope.row.fileName }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="备份文件存放路径">
              <span>{{ scope.row.targetPath }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="备份文件源路径">
              <span>{{ scope.row.sourcePath }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="结束时间">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="NFS挂载点路径"
                          v-if="type==='linux'">
              <span>{{ scope.row.pointPath }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="文件标识符"
                          v-if="type==='windows'">
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
      <el-table-column label="备份文件名"
                       prop="fileName"
                       min-width="180px"
                       align="center"
                       header-align="center"></el-table-column>
      <el-table-column label="开始时间"
                       prop="startTime"
                       min-width="150px"
                       align="center"></el-table-column>
      <el-table-column label="结束时间"
                       prop="endTime"
                       min-width="150px"
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
             class="el-icon-success"
             :class="$style.successColor"></i>
          <i v-else
             class="el-icon-error"
             :class="$style.errorColor"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       min-width="80px"
                       align="left">
        <template slot-scope="scope">
            <el-button type="text"
                        size="small"
                        
                        @click="del(scope.row)">删除</el-button>
          <el-button type="text"
                     size="small"
                     :disabled="scope.row.state === 1"
                     v-show="scope.row.allowRestore !== 0"
                     @click="restoreBtnClick(scope.row)">恢复</el-button>
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
  </section>
</template>
<script>
import dayjs from 'dayjs';
import baseMixin from '@/components/mixins/baseMixins';
import backupResultMixin from '@/components/mixins/backupResultMixin';
import { paginationMixin } from '@/components/mixins/commonMixin';
import { fmtSizeFn } from '@/utils/common';
import {deleteResultById} from '@/api/fileHost';

export default {
  name: 'BackupResult',
  mixins: [baseMixin, backupResultMixin, paginationMixin],
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      pageSize: 5
    }
  },
  computed: {
    // 文件服务器备份集中 只有最新对备份集才能用于恢复
    tableData() {
      const data = this.data.map((r, i, arr) => {
        return Object.assign({}, r);
      });
      const map = {};
      data.forEach((result, index) => {
        const {size} = result;
        let fmtSize = 0;
        fmtSize = fmtSizeFn(size);
        result.size = fmtSize ? fmtSize : 0;
        // 当索引为0时，!0等于true，此处不建议用索引，可以绑定id进行唯一标识
        if (!map[result.fileName]) {
          map[result.fileName] = {
            index: index,
            id:result.id
          };
        } else {
          const lastIndex = map[result.fileName].index;
          if (dayjs(data[lastIndex].endTime) < dayjs(result.endTime)) {
            map[result.fileName] = {
              index: index,
              id:result.id
            };
          }
        }
      });
      return data.map((result, index) => {
        for(let i in result) {
          result[i]=(result[i]===null||result[i]==='null')?'':result[i];
        }
        if (map[result.fileName].id === result.id) {
          return Object.assign({}, result, { allowRestore: 1 });
        } else {
          return Object.assign({}, result, { allowRestore: 0 });
        }
      });
    },
  },
  methods: {
    del(row) {
      this.$confirm('请确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const id = row.id;
          deleteResultById(id).then(res => {
            const {message} = res.data;
            this.$message.success(message)
          }).catch( error => {
            this.$message.error(error);
          });
        })
        .catch(() => { });
    }
  }
};
</script>
<style lang="scss" module>
@import '@/style/color.scss';
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
<style scoped>
.margin-top10{
  margin-top: 10px;
}
.text-right{
  text-align: right;
}
</style>

