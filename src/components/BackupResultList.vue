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
          <el-form-item v-if="!isFileBackupResult" label="备份文件名：" prop="fileName">
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
    <el-table :data="isFileBackupResult ? handleData : data|NotNullfilter|filterFn(filterValue)"
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
                          >
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
                       :sortable="true"
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
                       v-if="!this.isVM">
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
        return ['oracle', 'sqlserver', 'mysql', 'windows', 'linux', 'vm', ''].includes(
          value
        );
      },
    },
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
    }
  },
  methods: {
    // 备份集状态码转文字
    stateConverter(stateCode) {
      return backupResultMapping[stateCode];
    },
    // 点击恢复按钮
    restoreBtnClick({ id }) {
      console.log(this.handleData)
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
      return this.showFilter ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
    },
    isFileBackupResult() {
      return this.type === 'windows' || this.type === 'linux';
    },
    isVM() {
      const path = this.$route.path;
      // return this.$route.path.substring(4, path.lastIndexOf('/'))==='virtual'
      return false
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
        if(size < 1024){
          fmtSize = size + 'K';
        }else{
          let res = size / 1024 / 1024;
          if(res < 1){
            fmtSize = parseInt( res * 1024) + 'M';
          }else if(res > 1024){
            fmtSize = parseInt(res / 1024) + 'T';
          }else{
            fmtSize = parseInt(res) + 'G';
          }
        }
        result.size = fmtSize;
        // 当索引为0时，!0等于true，此处不建议用索引，可以绑定id进行唯一标识
        if (!map[result.fileResource]) {
          // map[result.fileResource] = index;
          map[result.fileResource] = {
            index: index,
            id:result.id
          };
        } else {
          const lastIndex = map[result.fileResource].index;
          // const lastIndex = map[result.fileResource];
          if (dayjs(data[lastIndex].endTime) < dayjs(result.endTime)) {
            // map[result.fileResource] = index;
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
        // if (map[result.fileResource] === index) {
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
