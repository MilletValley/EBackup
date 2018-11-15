<template>
  <section>
    <el-row>
      <el-row>
        <el-col>
          <el-button type="text" :icon="buttonIcon" @click="showFilter = !showFilter">过滤</el-button>
        </el-col>
      </el-row>
      <el-row v-show="showFilter">
        <el-form ref="filterForm" :model="filterForm" label-width="150px" size="small">
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
    <el-table :data="handleData|NotNullfilter|filterFn(filterValue)"
              style="width: 100%; margin-top: 15px"
              :default-sort="{ prop: 'endTime', order: 'descending' }">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form inline
                   label-width="100px"
                   size="small"
                   class="result-detail-form">
            <!-- <el-form-item :class="$style.detailFormItem"
                          label="ID">
              <span>{{ scope.row.id }}</span>
            </el-form-item> -->
            <!-- <el-form-item :class="$style.detailFormItem"
                          label="备份类型">
              <span>{{scope.row.backupType |backupTypeFilter}}</span>
            </el-form-item> -->
            <el-form-item :class="$style.detailFormItem"
                          label="存储目标路径">
              <span>{{ scope.row.path }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="开始时间">
              <span>{{ scope.row.startTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="源文件路径">
              <span>{{ scope.row.fileResource }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="结束时间">
              <span>{{ scope.row.endTime }}</span>
            </el-form-item>
            <el-form-item :class="$style.detailFormItem"
                          label="NFS目标路径"
                          v-if="type==='linux'">
              <span>{{ scope.row.nfsTargetPath }}</span>
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
      <el-table-column label="文件标识符"
                       prop="identifier"
                       v-if="type==='windows'"
                       min-width="180px"
                       align="center"></el-table-column>
      <el-table-column label="源文件路径"
                       prop="fileResource"
                       min-width="180px"
                       align="center"
                       header-align="center"></el-table-column>
      <!-- <el-table-column  label="备份类型"
                       prop="backupType"
                       min-width="100px"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.backupType |backupTypeFilter}}</span>
        </template>
      </el-table-column> -->
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
                       min-width="100px"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     :disabled="scope.row.state === 1"
                     v-show="scope.row.allowRestore !== 0"
                     @click="restoreBtnClick(scope.row)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import baseMixin from '@/components/mixins/baseMixins';
import { backupResultMapping, backupTypeMapping, yesOrNoMapping } from '@/utils/constant';
import { fmtSizeFn } from '@/utils/common';

export default {
  name: 'BackupResultList',
  mixins: [baseMixin],
  props: {
    data: {
      type: Array,
      required: true,
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      singleRestoreModalVisible: false,
      selectedId: -1,
      showFilter: false,
      filterValue: '',
      filterForm: {
        fileName: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        shortcuts: [{
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
      }
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
    filterFn(data,filter){
      let tData = data.filter( e => {
        let flag = true;
        for( let i in filter){
          if(filter[i]){
            if(i.includes('Time')){
              if(dayjs(e[i]) < dayjs(filter[i][0]) || dayjs(e[i]) > dayjs(filter[i][1])){
                flag = false;
                break;
              }
            }else{
              if(!e[i].includes(filter[i])){
                flag = false;
                break;
              }
            }
          }
        }
        return flag;
      })
      return tData
    },
    backupTypeFilter(val){
      return backupTypeMapping[val];
    },
    logTypeFilter(val){
      return yesOrNoMapping[val];
    }
  },
  methods: {
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    // 点击恢复按钮
    restoreBtnClick({ id }) {
      this.$emit('single-restore-btn-click', id);
    },
    endTimeSortMethod(a, b) {
      return dayjs(a) - dayjs(b);
    },
    filterHandler(){
      this.filterValue = Object.assign({},this.filterForm);
    },
    resetFn(){
      this.$refs.filterForm.resetFields();
      this.filterHandler();
    }
  },
  computed: {
    buttonIcon(){
      return this.showFilter ? 'el-icon-arrow-down' : 'el-icon-arrow-right';
    },
    // 文件服务器备份集中 只有最新对备份集才能用于恢复
    handleData() {
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
        if (!map[result.fileResource]) {
          map[result.fileResource] = {
            index: index,
            id:result.id
          };
        } else {
          const lastIndex = map[result.fileResource].index;
          if (dayjs(data[lastIndex].endTime) < dayjs(result.endTime)) {
            map[result.fileResource] = {
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
        if (map[result.fileResource].id === result.id) {
          return Object.assign({}, result, { allowRestore: 1 });
        } else {
          return Object.assign({}, result, { allowRestore: 0 });
        }
      });
    },
  },
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
