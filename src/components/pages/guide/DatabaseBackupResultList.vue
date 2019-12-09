<template>
  <section>
    <el-row>
      <el-row>
        <el-col>
          <el-button type="text" :icon="buttonIcon" @click="filterResults">过滤</el-button>
        </el-col>
      </el-row>
      <el-row v-show="showFilter">
        <el-form ref="filterForm" :model="filterForm" label-width="150px" size="small">
          <el-form-item label="备份文件名：" prop="fileName">
            <el-input v-model="filterForm.fileName" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="开始时间：" prop="startTime">
            <el-date-picker
              v-model="filterForm.startTime"
              type="datetimerange"
              :unlink-panels="true"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endTime">
            <el-date-picker
              v-model="filterForm.endTime"
              type="datetimerange"
              :unlink-panels="true"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <span style="margin-left:40px">
              <el-button size="mini" type="primary" @click="filterHandler">搜索</el-button>
              <el-button size="mini"  @click="resetFn">重置</el-button>
            </span>
          </el-form-item>
        </el-form>
      </el-row>
    </el-row>
    <div style="position: relative">
      <transition name="el-zoom-in-center">
        <div v-show="nextStep === 'createSingleRestorePlan'"
            class="balloons"
            style="right: -30px; top: 55px; transform: translateX(100%)">
          <div class="left-arrow-bubble">
            选择需要恢复的备份集，点击“恢复”按钮开始立即恢复
            <p class="bubble-btn">
              <span type="text" @click="$emit('cancel-step')">取消</span>
            </p>
          </div>
        </div>
      </transition>
      <el-table :data="data|NotNullfilter|filterFn(filterValue)"
                style="width: 100%; margin-top: 15px"
                default-expand-all
                :default-sort="{ prop: 'endTime', order: 'descending' }">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form inline
                    label-width="100px"
                    size="small"
                    class="result-detail-form">
              <el-form-item class="detailFormItem"
                            label="开始时间">
                <span>{{ scope.row.startTime }}</span>
              </el-form-item>
              <el-form-item class="detailFormItem"
                            label="存储目标路径">
                <span>{{ scope.row.path }}</span>
              </el-form-item>
              <el-form-item class="detailFormItem"
                            label="结束时间">
                <span>{{ scope.row.endTime }}</span>
              </el-form-item>
              <el-form-item class="detailFormItem"
                            label="文件名">
                <span>{{ scope.row.fileName }}</span>
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
        <el-table-column  label="备份文件名"
                          prop="fileName"
                          min-width="180px"
                          align="left"
                          header-align="center"
                          show-overflow-tooltip></el-table-column>
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
              class="el-icon-success successColor"></i>
            <i v-else
              class="el-icon-error errorColor"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                        min-width="100px"
                        align="center">
          <template slot-scope="scope">
            <el-button type="text"
                      size="small"
                      :disabled="scope.row.state === 1"
                      @click="restoreBtnClick(scope.row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script>
import backupResultMixin from '@/components/mixins/backupResultMixin';
import baseMixin from '@/components/mixins/baseMixins';

export default {
  name: 'DatabaseBackupResultList',
  mixins: [backupResultMixin, baseMixin],
  props: ['nextStep'],
  data() {
    return {
    };
  },
  methods: {
    filterResults() {
      this.showFilter = !this.showFilter;
      if (this.nextStep === 'showFilters') {
        this.$emit('filter-results');
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import '@/style/guide.scss';
@import '@/style/color.scss';
.detailFormItem {
  margin: {
    right: 0 !important;
    bottom: 0 !important;
  }
  /deep/
  .el-form-item__content {
    width: calc(100% - 100px);
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  width: 30%;
  &:nth-child(2n) {
    width: 69%;
  }
}
</style>
