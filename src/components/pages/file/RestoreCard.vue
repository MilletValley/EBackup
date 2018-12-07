<template>
  <el-card :class="$style.restoreCard"
           v-if="restorePlan.id && restorePlan.id">
    <div slot="header">
      <el-tag size="mini"
              color="#fa4211"
              style="color: #ffffff">恢复</el-tag>
      <span>{{restorePlan.name}}</span>
      <el-button style="float: right; padding: 3px 0; color: #f56c6c;"
                 type="text"
                 @click="planDeleteBtnClick">删除</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="18">
        <el-form label-width="100px"
                 size="mini">
          <el-form-item label="计划创建时间">
            <span>{{ restorePlan.startTime }}</span>
          </el-form-item>
          <el-form-item label="恢复设备IP">
            <span>{{ restorePlan.targetFileHost.hostIp }}</span>
          </el-form-item>
          <el-form-item label="恢复类型"
                        style="40%">
            <div>{{ restoreType }}</div>
          </el-form-item>
          <el-form-item label="恢复方向"
                        v-if="restorePlan.restoreType === 2"
                        style="100%">
            <el-tooltip :content="restorePlan.sourcePath"
                        placement="top"
                        effect="dark">
              <span :class="$style.pathOverFlow">{{ restorePlan.sourcePath }}</span>
            </el-tooltip>
            <i class="el-icon-d-arrow-right"
               :class="$style.pathDirection"></i>
            <el-tooltip :content="restorePlan.targetPath"
                        placement="top"
                        effect="dark">
              <span :class="$style.pathOverFlow">{{ restorePlan.targetPath }}</span>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="挂载点路径"
                        v-if="restorePlan.restoreType === 2"
                        style="100%">
            <span>{{ restorePlan.pointPath }}</span>
          </el-form-item>
          <el-form-item label="恢复排除文件"
                        v-if="restorePlan.restoreType === 1 && restorePlan.excludeFiles.length>0"
                        style="100%">
            <span v-for="(excludeFile, index) in restorePlan.excludeFiles"
                 :key="excludeFile">
              {{ excludeFile }}<i v-if="index<restorePlan.excludeFiles.length-1">、</i>
            </span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6"
              :class="$style.operationInfo">
        <ul>
          <li>
            <h5>当前状态</h5>
            <div>
              <div>
                <span v-if="restorePlan.restoreType === 2" :class="operationStateStyle">{{ restorePlan.diskInfo || '-' }}</span>
              </div>
              <el-tooltip :content="operationState"
                          placement="top-end"
                          effect="light">
                <i :class="formatIcon(restorePlan.state)" style="float:right"></i>
              </el-tooltip>
              <el-progress style="margin-right:20px" :percentage="restorePlan.percentage" :status="progressStatus" :text-inside="true" :stroke-width="17">
              </el-progress>
            </div>
          </li>
          <li>
            <h5>恢复开始时间</h5>
            <div>{{restorePlan.startTime }}</div>
          </li>
          <li v-if="restorePlan.restoreType === 2">
            <h5>已持续时间</h5>
            <div v-if="restorePlan.consume">
              <timer :val="Number(restorePlan.consume)"></timer>
            </div>
            <div v-else>-</div>
          </li>
          <li>
            <h5>{{type === 'windows' ? '总大小' : '已恢复大小'}}
              <el-tooltip class="item" effect="dark"
                          :content="type === 'windows' ? '恢复源总大小' : '已恢复文件总大小，非本次恢复大小'"
                          placement="left">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </h5>
            <div>{{restoreSize || '-'}}</div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row v-show="isShow"
            :class="$style.more"
            :gutter="10">
      <el-col :span="8"
              v-for="(restoreFile, index) in restorePlan.restoreFiles"
              :key="index">
        <el-card shadow="always">
          <el-row>
            <el-col :span="12">
              <el-tooltip :content="`文件备份源路径: ${restoreFile.sourcePath}`"
                          placement="right"
                          :open-delay="300">
                <div :class="$style.wordsOverFlow">
                  <i-icon name="fileSourcePath"
                          :class="$style.restoreFileInfoIcon"></i-icon>
                  <span>{{restoreFile.sourcePath}}</span>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="12" :class="$style.restoreFileState">
              <span v-if="restoreFile.operateResult === 0"><i :class="formatIcon(restoreFile.operateResult)"></i>未开始</span>
              <span v-else-if="restoreFile.operateResult === 1">
                <el-progress :percentage="fmtProgress(restoreFile)"></el-progress>
              </span>
              <span v-else><i :class="formatIcon(restoreFile.operateResult)"></i>已结束</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-tooltip :content="`备份集存放路径: ${restoreFile.targetPath}`"
                          placement="right"
                          :open-delay="300">
                <div :class="$style.wordsOverFlow">
                  <i-icon name="fileTargetPath"
                      :class="$style.restoreFileInfoIcon"></i-icon>
                  <span>{{restoreFile.targetPath}}</span>
                </div>
              </el-tooltip>
            </el-col>
            <el-col :span="12"
                    v-if="[1,2].includes(restoreFile.operateResult)"
                    :class="$style.restoreFileState">
              <el-tooltip content="开始时间"
                          placement="top"
                          :open-delay="300">
                <span>{{ restoreFile.startTime }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <i-icon name="size"
                      :class="$style.restoreFileInfoIcon"></i-icon>
              <el-tooltip content="文件大小"
                          placement="right"
                          :open-delay="300">
                <span>{{restoreFile | sizeFormat(type) }}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="12"
                    v-if="[1,2].includes(restoreFile.operateResult)"
                    :class="$style.restoreFileState">
              <el-tooltip content="已持续时间"
                          placement="top"
                          :open-delay="300">
                <timer :val="Number(restoreFile.consumeTime)" v-if="restoreFile.operateResult === 1"></timer>
                <span v-else>{{ restoreFile.consumeTime | durationFilter }}</span>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :class="$style.showMore"
            :style="isShow?'':'margin-top: -35px'"
            v-if="restorePlan.restoreType === 1">
      <el-button type="text"
                 @click="showMore">{{showTxt}}<i :class="showIcon"></i></el-button>
    </el-row>
  </el-card>
</template>
<script>
import {
  filehostRestoreStrategyMapping,
  timeStrategyMapping,
  weekMapping,
  operationStateMapping,
  filehostRestoreTypeMapping
} from '@/utils/constant';
import baseMixin from '@/components/mixins/baseMixins';
import Timer from '@/components/Timer';
import IIcon from '@/components/IIcon';
import { fmtSizeFn } from '@/utils/common';
import throttle from 'lodash/throttle';
export default {
  name: 'RestoreCard',
  mixins: [baseMixin],
  props: {
    id: {
      type: Number,
      required: true
    },
    restorePlan: {
      type: Object,
      required: true
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  created() {
    console.log(this.id);
  },
  mounted() {
    // console.log(this.restorePlan);
    // console.log(this.restorePlan);
  },
  computed: {
    // restorePlan() {
    //   const { config, ...operation } = this.restorePlan;
    //   return operation;
    // },
    // restorePlan() {
    //   console.log(this.restorePlan);
    //   return this.restorePlan.config;
    // },
    operationState() {
      return operationStateMapping[this.restorePlan.state];
    },
    restoreType() {
      return filehostRestoreTypeMapping[this.restorePlan.restoreType];
    },
    operationStateStyle() {
      if (this.restorePlan.state === 0) {
        return this.$style.waitingColor;
      } else if (this.restorePlan.state === 1) {
        return this.$style.loadingColor;
      } else if(this.restorePlan.state === 3) {
        return this.$style.errorColor;
      } else return '';
    },
    progressStatus(){
      if(this.restorePlan.state === 2){
        return 'success';
      }else if(this.restorePlan.state === 3){
        return 'exception';
      }else if(this.restorePlan.state === 0 && this.restorePlan.percentage !== 0){
        return 'success';
      }else return 'text';
    },
    diskInfo(){
      let str = '';
      if(this.type === 'windows'){
        if(this.restorePlan.state === 0){
          str = '未开始';
        }else if(this.restorePlan.state === 2){
          str = '已完成';
        }else if(this.restorePlan.state === 1){
          str = `正在恢复卷(${this.disk})`;
        }
      }
      return str;
    },
    progressNum(){
      const {process: data, size, state} = this.restorePlan;
      if(state === 2){
        return 100;
      }
      if(this.type === 'windows'){
        if(!data){
          return 0;
        }
        const reg = /.*\(([^\(\)]*)\).*\(([^\(\)]*)\).*/;
        const result = data.match(reg);
        if(!result){
          return 0;
        }
        if(result[1]){
          this.disk = result[1];
        }
        if(result[2]){
          let num = Number(result[2].substring(0,result[2].length - 1));
          return num || num === 0 ? num : 0;
        }
      }else if(this.type === 'linux'){
        if(data && size){
          if(Number(size)){
            // 取百分比
            let num = (Number(data) / Number(size)) * 100;
            if (state === 0 && num >= 100) {
              num = 100;
            }else if(num > 0 && num < 1){
              num = 1;
            }else{
              // 此处不能作四舍五入
              num = parseInt(num > 99 ? 99 : num);
            }
            return num || num === 0 ? num : 0;
          }
        }
      }
    },
    restoreSize(){
      let {process, size, state} = this.restorePlan;
      let fmtSize = 0;
      if(this.type === 'linux'){
        process = Number(process);
        fmtSize = fmtSizeFn(process);
      }else if(this.type === 'windows'){
        fmtSize = fmtSizeFn(Number(size));
      }
      return !fmtSize ? (state !== 0 ? 0 : '-') : fmtSize;
    },
    showTxt() {
      return this.isShow?'收起':'查看更多'
    },
    showIcon() {
      return this.isShow?'el-icon-arrow-up':'el-icon-arrow-down';
    }
  },
  filters:{
    sizeFormat(data, type){
      let fmtSize = null;
      const { state } = data;
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
      return !fmtSize ? (state !== 0 ? 0 : '-') : fmtSize;
    }
  },
  methods: {
    // 刷新单个备份计划
    refreshBtnClick() {
    },
    planDeleteBtnClick() {

    },
    planUpdateBtnClick() {

    },
    formatIcon(data){
      if (data === 0) {
        return this.$style.waitingColor + ' el-icon-time';
      } else if (data === 1) {
        return this.$style.loadingColor + ' el-icon-loading';
      } else if(data === 3) {
        return this.$style.errorColor + ' el-icon-warning';
      } else if(data === 2){
        return this.$style.successColor + ' el-icon-success';
      }else return '';
    },
    showMore() {
      this.isShow = !this.isShow;
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
    }
  },
  components: {
    Timer,
    IIcon
  }
}
</script>
<style lang="scss" module>
@import '@/style/color.scss';
.restoreCard {
  margin-bottom: 15px;
}
/* 标签之间的间隔在for循环下消失了 */
.infoTag {
  margin: 0 2px;
}
.stateRefresh {
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: rotate(180deg);
  }
}
.operationInfo {
  h5 {
    font-weight: 400;
    color: #888888;
    margin: 4px 0;
    text-align: right;
  }
  div {
    // margin-left: 5px;
    text-align: right;
  }
  ul {
    list-style: none;
    margin: 0;
  }
  li {
    margin: 20px 0;
  }
}
.restoreFileInfoIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.2em;
}
.more {
  font-size: 14px;
  height: 110px;
  overflow: auto;
  col {
    height: 110px;
  }
}
.showMore {
  text-align: center;
}
.wordsOverFlow {
  white-space:nowrap;
  overflow: hidden;
  max-width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
}
.pathOverFlow {
  white-space:nowrap;
  overflow: hidden;
  max-width: 230px;
  display: inline-block;
  text-overflow: ellipsis;
}
.pathDirection {
  vertical-align: 0.5em;
}
.restoreFileState {
  font-size: 0.8em;
  line-height: 1.8em;
  color: #999999;
  text-align: right;
}
</style>

