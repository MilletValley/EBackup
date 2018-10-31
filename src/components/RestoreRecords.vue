<template>
  <section>
    <div>
      <h4>正在执行的恢复操作
        <i class="el-icon-refresh"
           :class="$style.stateRefresh"
           @click="$emit('restoreinfo:refresh')"></i>
      </h4>
      <div v-show="plans.length === 0"
           :class="$style.noRestoreTip">
        <span>暂无操作</span>
      </div>
      <el-row v-show="plans.length > 0"
              :gutter="20"
              style="min-height: 144px;">
        <el-col :span="8"
                v-for="item in plans"
                :key="item.id">
          <el-card shadow="hover"
                   :class="$style.ongoingRestoreCard">
            <div>
              <span>
                <!-- <i :class="['el-icon-loading', $style.successColor]"></i> {{ item.consume | durationFilter }}</span> -->
                <i :class="['el-icon-loading', $style.successColor]"></i> <timer :val="item.consume"></timer> </span>
              <span :class="[$style.restoreStartTime, 'hidden-']">{{item.startTime}}</span>
            </div>

            <!-- <p>
              <i-icon name="ip"
                      :class="$style.ongoingRestoreIcon"></i-icon>
              <el-tooltip content="目标设备IP"
                          placement="right"
                          :open-delay="300">
                
                <span v-if="isFile || isVMware" >{{ item.config.hostIp }}</span>
                <span v-else>{{ item.config.database ? item.config.database.host.hostIp : '' }}</span>
              </el-tooltip>
            </p> -->
            <el-row v-if="true" :class="$style.margin14">
              <el-col :span="12">
                <i-icon name="ip"
                        :class="$style.ongoingRestoreIcon"></i-icon>
                <el-tooltip content="目标设备IP"
                            placement="right"
                            :open-delay="300">
                  
                  <span v-if="isFile || isVMware" >{{ item.config.hostIp }}</span>
                  <span v-else>{{ item.config.database ? item.config.database.host.hostIp : '' }}</span>
                </el-tooltip>
              </el-col>
              <el-col v-if="isFile" :span="12">
                <el-progress  :percentage="fmtProgress(item)" :text-inside="true" :stroke-width="17">
                </el-progress>
              </el-col>
            </el-row>

            <!-- <p>
              <i-icon name="instance"
                      :class="$style.ongoingRestoreIcon"></i-icon>
              <el-tooltip :content="detailInfoDisplayName"
                          placement="right"
                          :open-delay="300">
                <span v-if="isVMware">{{item.config.newName }}</span>
                <span v-else-if="isFile">{{ item.config.detailInfo }}</span>
                <span v-else>{{item.config.database ? item.config.database.instanceName : '' }}</span>
              </el-tooltip>
            </p> -->
            <el-row :class="$style.margin14">
              <el-col :span=12>
                <i-icon :name="type==='linux'?'nfsPath':'instance'"
                        :class="$style.ongoingRestoreIcon"></i-icon>
                <el-tooltip :content="type==='linux'?'源NFS路径':detailInfoDisplayName"
                            placement="right"
                            :open-delay="300">
                  <span v-if="isVMware">{{item.config.newName }}</span>
                  <span v-else-if="isFile">{{ type==='linux'?item.config.nfsSourcePath:item.config.detailInfo }}</span>
                  <span v-else>{{item.config.database ? item.config.database.instanceName : '' }}</span>
                </el-tooltip>
              </el-col>
              <el-col :span=12 style="text-align:right" v-if="isFile">
                <i-icon name="size"
                        :class="$style.ongoingRestoreIcon"></i-icon>
                <el-tooltip content="已恢复大小"
                            placement="right"
                            :open-delay="300">
                  <span>{{ item | sizeFormat(type) }}</span>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row :class="$style.margin14"
                    v-if="type==='linux'">
              <el-col :span=24>
                <i-icon name="instance"
                        :class="$style.ongoingRestoreIcon"></i-icon>
                <el-tooltip content="恢复方向"
                            placement="right"
                            :open-delay="300">
                  <span>{{ item.config.pointSourcePath }}=>{{item.config.detailInfo}}</span>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <h4>已完成恢复记录</h4>
      <el-table :data="records"
                :default-sort="{ prop: 'startTime', order: 'descending' }">
        <el-table-column prop="startTime"
                         label="开始时间"
                         align="center"
                         width="150px">
        </el-table-column>
        <el-table-column prop="endTime"
                         label="结束时间"
                         align="center"
                         width="150px">
        </el-table-column>
        <el-table-column prop="hostIp"
                         :label="isVMware ? '恢复主机IP' : '恢复设备IP'"
                         align="center"
                         min-width="150px">
        </el-table-column>
        <el-table-column v-if="!isVMware"
                         prop="detailInfo"
                         :label="detailInfoDisplayName"
                         align="center"
                         min-width="150px"></el-table-column>
        <el-table-column v-if="type==='linux'"
                         prop="pointSourcePath"
                         label="恢复源路径"
                         align="center"
                         min-width="150px"></el-table-column>
        <el-table-column v-if="type==='linux'"
                         prop="nfsSourcePath"
                         label="恢复源NFS路径"
                         align="center"
                         min-width="150px"></el-table-column>
        <el-table-column v-if="isVMware" 
                         prop="newName"
                         label="新虚拟机名"
                         align="center"
                         min-width="200px">
        </el-table-column>
        <el-table-column v-if="isFile" 
                         prop="backupResult.size"
                         :formatter="sizeFmt"
                         label="大小"
                         align="center"
                         width="70px">
        </el-table-column>
        <el-table-column prop="state"
                         label="状态"
                         align="center"
                         width="70px">
          <template slot-scope="scope">
            <el-tooltip :disabled="scope.row.state === 0"
                        :content="scope.row.errorMsg"
                        placement="right"
                        effect="light">
              <i v-if="scope.row.state === 0"
                 class="el-icon-success"
                 :class="$style.successColor"></i>
              <i v-else
                 class="el-icon-error"
                 :class="$style.errorColor"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
<script>
import IIcon from './IIcon';
import Timer from './Timer';
import baseMixin from './mixins/baseMixins';
import { fmtSizeFn } from '../utils/common';

export default {
  name: 'RestoreRecords',
  mixins: [baseMixin],
  props: {
    type: {
      type: String,
      validator(value) {
        return ['oracle', 'sqlserver', 'mysql', 'windows', 'linux', 'vm', ''].includes(value);
      },
    },
    plans: {
      type: Array,
      required: true,
    },
    records: {
      type: Array,
      required: true,
    },
  },
  computed: {
    detailInfoDisplayName() {
      const mapping = {
        oracle: '实例',
        sqlserver: '数据库',
        mysql: '数据库',
        windows: '恢复目标路径',
        linux: '恢复目标路径',
        vm: '虚拟机',
      };
      return mapping[this.type] ? mapping[this.type] : '';
    },
    isVMware() {
      if(this.type === 'vm'){
        return true;
      }
      return false;
    },
    isFile() {
      if (this.type === 'windows' || this.type === 'linux') {
        return true;
      }
      return false;
    },
  },
  filters:{
    sizeFormat(data, type){
      let fmtSize = null;
      if(type === 'linux'){
        const process = Number(data.progress);
        const size = Number(data.size);
        if(process > size){
          fmtSize = fmtSizeFn(size);
        }else{
          fmtSize = fmtSizeFn(process);
        }
      }else if(type === 'windows'){
        const process = Number(data.progress.replace(/[^0-9]/ig,""));
        const size = Number(data.size);
        const restoreSize = size * process / 100;
        fmtSize = fmtSizeFn(restoreSize);
      }
      return fmtSize ? fmtSize : '-';
    }
  },
  methods: {
    sizeFmt(row, column, cellValue, index){
      let fmtSize = null;
      const process = Number(cellValue);
      fmtSize = fmtSizeFn(process);
      return fmtSize ? fmtSize : '-';
    },
    fmtProgress(data){
      let process = 0;
      if(this.type === 'linux'){
        const progress = Number(data.progress);
        const size = Number(data.size);
        process = Math.round((progress / size) * 100);
      }else if(this.type === 'windows'){
        process = Number(data.progress.replace(/[^0-9]/ig,""));
      }
      if(process > 99){
        process = 99;
      }
      return process ? process : 0;
    },
  },
  components: {
    IIcon,
    Timer
  },
};
</script>
<style lang="scss" module>
@import '../style/color.scss';
.noRestoreTip {
  font-size: 4em;
  color: #c0c4cc;
  min-height: 144px;
  margin: auto;
  width: 280px;
  span {
    line-height: 2.2em;
  }
}
.ongoingRestoreCard {
  font-size: 14px;
}
.restoreStartTime {
  font-size: 0.8em;
  line-height: 1.8em;
  color: #999999;
  float: right;
}
.stateRefresh {
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
.ongoingRestoreIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.2em;
}
.margin14{
  margin-top: 1em;
  margin-bottom: 1em
}
</style>
