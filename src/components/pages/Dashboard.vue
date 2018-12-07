<template>
  <section>
    <template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="bie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">数据备份</span>
            </div>
            <div class="text item">
              <div id="backupTotal" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="bie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">恢复演练</span>
            </div>
            <div class="text item">
              <div id="restoreTotal" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="bie-card">
            <div slot="header" class="clearfix">
              <span class="card-title">一键接管</span>
            </div>
            <div class="text item">
              <div id="initConn" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card" style="width: 100%">
            <div slot="header" class="clearfix">
              <span class="card-title">空间使用情况</span>
            </div>
            <div class="text item" v-show="Object.keys(spaceDetail).length">
              <el-row>
                <el-col :span="Object.keys(spaceDetail).length > 1 ? 12 : 24" ref="col">
                  <div  ref="space1">
                    <cylinder :data="spaceChartData[0]"></cylinder>
                  </div>
                </el-col>
                <el-col :span="12" v-if="Object.keys(spaceDetail).length > 1">
                  <div  ref="space2">
                    <cylinder :data="spaceChartData[1]"></cylinder>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div :class="$style.nfsNotUsed" v-show="!Object.keys(spaceDetail).length">
              <span>暂未使用</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" style="width: 100%">
            <div slot="header" class="clearfix">
              <span class="card-title">存储1已使用空间分配情况</span>
            </div>
            <div class="text item" v-show="nfsAssignedSpace&&nfsAssignedSpace.length>0">
              <div id="spaceRatio" :style="{width: '100%', height: '300%', margin: '0 auto'}"></div>
            </div>
            <div :class="$style.nfsNotUsed" v-show="!(nfsAssignedSpace&&nfsAssignedSpace.length>0)">
              <span>暂未使用</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <el-row>
      <span class="title">设备状态</span>
    </el-row>
    <div style="position:relative">
      <el-button type="info"
                 size="small"
                 plain
                 style="position: absolute; top:3px; right:3px; z-index: 10"
                 @click="$router.push({
                 path: 'morestate',
                 query: { activeName: activeName }})">MORE</el-button>
      <el-tabs type="border-card"
               v-model="activeName">
        <el-tab-pane label="数据库备份"
                     name="databaseBackup">
          <el-table :data="databaseBackup|NotNullfilter"
                    ref="databaseBackup"
                    v-loading="infoLoading"
                    style="width: 100%">
            <el-table-column label="名称"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'backup' }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             align="center"
                             show-overflow-tooltip
                             min-width="100"></el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="ddvType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             :filter-method="filterHandle"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ dateFmt(scope.row.endTime) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据库恢复"
                     name="databaseRestore">
          <el-table :data="databaseRestore"
                    v-loading="infoLoading"
                    ref="databaseRestore"
                    style="width: 100%">
            <el-table-column label="名称"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'restore' }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column label="数据库类型"
                             align="center"
                             prop="ddvType"
                             :formatter="dbType"
                             :filters="dbTypeFilter"
                             :filter-method="filterHandle"
                             min-width="120"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ dateFmt(scope.row.endTime) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             min-width="180"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="一键接管"
                     name="initconnNum">
          <el-table :data="initconnNum"
                    v-loading="infoLoading"
                    ref="initconnNum"
                    style="width: 100%">
            <el-table-column label="实例名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${dbTakeOverRouter(scope.row)}`, params: { id: String(scope.row.id) }}"
                             :class="$style.link">
                  {{ scope.row.instanceName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="primaryHostIp"
                             label="主机IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="主库状态"
                             align="center"
                             min-width="100"
                             prop="primaryState"
                             :filters="dbStateFilter"
                             :filter-method="filterHandle">
              <template slot-scope="scope">
                <el-tag :type="stateTagType(scope.row.primaryState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.row.primaryState) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="viceHostIp"
                             label="备库IP"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备库状态"
                             align="center"
                             :filters="dbStateFilter"
                             prop="viceState"
                             :filter-method="filterHandle"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="stateTagType(scope.row.viceState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.row.viceState) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="连接状态"
                             prop="overState"
                             :filters="dbLinkStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-tag :type="linkTagType(scope.row.overState)"
                        size="mini">
                  {{ linkTypeConverter(scope.row.overState) }}
                </el-tag>
              </template>              
            </el-table-column>
            <el-table-column label="初始化完成时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.initFinishTime }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件备份"
                     name="filehostBackup">
          <el-table :data="filehostBackup|NotNullfilter"
                    v-loading="infoLoading"
                    ref="filehostBackup"
                    style="width: 100%">
            <el-table-column label="主机IP"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id), type: 'backup' }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="主机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             :formatter="sizeFormatter"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="文件恢复"
                     name="filehostRestore">
          <el-table :data="filehostRestore"
                    v-loading="infoLoading"
                    ref="filehostRestore"
                    style="width: 100%">
            <el-table-column label="恢复主机IP"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: 'filehostDetail', params: { id: String(scope.row.id), type: 'restore' }}"
                             :class="$style.link">
                  {{ scope.row.ascription }}
                </router-link>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="name"
                             label="数据库名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column> -->
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>           
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟机备份"
                     name="vmBackup">
          <el-table :data="vmBackup|NotNullfilter"
                    v-loading="infoLoading"
                    ref="vmBackup"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'backup' }}"
                             :class="$style.link">
                  {{ scope.row.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="所属物理主机"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="ddvType"
                             :formatter="vmType"
                             :filters="vmTypeFilter"
                             :filter-method="filterHandle"
                             label="虚拟机类型"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="备份结束时间"
                             align="center"
                             min-width="130">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="100">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column prop="backupSize"
                             label="备份集大小"
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column prop="backupState"
                             label="状态"
                             :filters="filterBackupStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="60">
              <template slot-scope="scope">
                <i v-if="scope.row.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
            <el-table-column prop="backupPath"
                             label="备份存储路径"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"
                             fixed="right"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="虚拟机恢复"
                     name="vmRestore">
          <el-table :data="vmRestore"
                    v-loading="infoLoading"
                    ref="vmRestore"
                    style="width: 100%">
            <el-table-column label="虚拟机名"
                             show-overflow-tooltip
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: `${vmDetailRouter(scope.row)}`, params: { id: String(scope.row.id), type: 'restore' }}"
                             :class="$style.link">
                  {{ scope.row.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="ascription"
                             label="所属物理主机"
                             show-overflow-tooltip
                             align="center"
                             min-width="180"></el-table-column>
            <el-table-column prop="ddvType"
                             :formatter="vmType"
                             :filters="vmTypeFilter"
                             :filter-method="filterHandle"
                             label="虚拟机类型"
                             show-overflow-tooltip
                             align="center"
                             min-width="100"></el-table-column>
            <el-table-column label="恢复结束时间"
                             align="center"
                             min-width="180">
              <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.endTime }}</el-tag>
              </template>           
            </el-table-column>
            <el-table-column label="耗时"
                             align="center"
                             show-overflow-tooltip
                             min-width="180">
              <template slot-scope="scope">
                {{ scope.row.timeConsuming | durationFilter }}
              </template>
            </el-table-column>
            <el-table-column label="状态"
                             prop="restoreState"
                             :filters="filterRestoreStateFilter"
                             :filter-method="filterHandle"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <i v-if="scope.row.restoreState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<script>
import { fetchAll, fetchSpaceUse } from '../../api/home';
import { fmtSizeFn } from '../../utils/common';
import baseMixin from '../mixins/baseMixins';
import DashboardTab from '../mixins/DashboardTabMixins';
import echartsLiquidfill from 'echarts-liquidfill';
import 'echarts-gl';
import Cylinder from '@/components/common/Cylinder';
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/component/legend");
export default {
  name: 'Dashboard',
  mixins: [baseMixin, DashboardTab],
  components: {
    Cylinder
  },
  data() {
    const nfsInUsedTypeMapping= {
      1: 'oracle',
      2: 'sqlserver',
      3: '文件',
      4: '虚拟机',
      5: 'mysql',
      6: 'db2',
      7: '达梦'
    }
    const color = ['', '#D9554B','#F96305','#dcc54d','#1ABB9C','#5faf37','#1a48a5','#660066']
    return {
      total: {},
      spaceDetail: {},
      nfsInUsedTypeMapping,
      color, // nfs环形图颜色
      infoLoading: true, // table动画加载
      spaceData: { // 用于存放空间使用情况的数据，存储二可能不存在
        name: [],
        percentData: [],
        explain: []
      },
      spaceChartData: []
    };
  },
  computed: {
    nfsInUsedPercent() {
      if(this.spaceDetail.nfsData.total===0) {
        return 100;
      }
      return this.calcPercent(this.spaceDetail.nfsData.inUsed, this.spaceDetail.nfsData.total);
    },
    shareInUsedPercent() {
      if(this.spaceDetail.shareData.total===0) {
        return 100;
      }
      return this.calcPercent(this.spaceDetail.shareData.inUsed, this.spaceDetail.shareData.total);
    },
    nfsAssignedSpace() {
      return this.spaceDetail&&this.spaceDetail.nfsData&&this.spaceDetail.nfsData.nfsUseDetails;
    },
    nfsPieColor() {
      if(this.spaceDetail&&this.spaceDetail.nfsData&&this.spaceDetail.nfsData.nfsUseDetails) {
        const color = this.color.filter((c, index) => this.spaceDetail.nfsData.nfsUseDetails.map(detail => detail.nfsUseType).includes(index));
        return color;
      }
      return [];
    },
    nfsPieData() {
      let data = {};
      if (this.spaceDetail && this.spaceDetail.nfsData)
        this.spaceDetail.nfsData.nfsUseDetails.forEach(detail => {
          // return {
          //   value: detail.nfsUseSize,
          //   name: this.nfsInUsedTypeMapping[detail.nfsUseType],
          // };
          data[detail.nfsUseType] = detail.nfsUseSize;
        });
      return data;
    },
  },
  mounted() {
    this.fetchData();
    this.fetchTabData();
    this.activeName = 'databaseBackup'
  },
  methods: {
    fetchData() {
      Promise.all([fetchAll(), fetchSpaceUse()])
        .then(res => {
          const { data: pieData } = res[0].data;
          const { data: spaceData } = res[1].data;
          this.total = pieData;
          this.spaceDetail = spaceData;
          if(this.spaceDetail.nfsData) {
            this.spaceData.name.push('存储1');
          this.spaceData.percentData.push(this.nfsInUsedPercent);
          this.spaceData.explain.push(this.addUnit(this.spaceDetail.nfsData.inUsed)+'/'+this.addUnit(this.spaceDetail.nfsData.total)+'\t\t'+'剩余空间：'+this.addUnit(this.spaceDetail.nfsData.unUsed));
          }
          if(this.spaceDetail.shareData) {
            this.spaceData.name.push('存储2');
            this.spaceData.percentData.push(this.shareInUsedPercent);
            this.spaceData.explain.push(this.addUnit(this.spaceDetail.shareData.inUsed)+'/'+this.addUnit(this.spaceDetail.shareData.total)+'\t\t'+'剩余空间：'+this.addUnit(this.spaceDetail.shareData.unUsed));
          }
        })
        .then(() => {
          this.drawLine();
        })
        // .catch(error => {
        //   this.$message.error(error);
        // })
    },
    calcPercent(diviver, dividend) {
      if(Number(dividend) === 0) {
        return 100;
      }
      return Math.round((diviver/dividend)*100);
    },
    jumpToMoreState(params, successPath, errorPath) {
      if(params.name.includes('成功')) {
        this.$router.push({path: 'morestate', query: { type: successPath } });
      } else if(params.name.includes('失败')) {
        this.$router.push({path: 'morestate', query: { type: errorPath } });
      }
    },
    // 单位由M开始转化
    addUnit(data) {
      return fmtSizeFn(Number(data)*1024*1024);
    },
    tooltipPosition(point, params, dom, rect, size) {
      var x = 0; // x坐标位置
      var y = 0; // y坐标位置
      var pointX = point[0];
      var pointY = point[1];
      // 提示框大小
      var boxWidth = size.contentSize[0];
      var boxHeight = size.contentSize[1];
      // boxWidth > pointX 说明鼠标左边放不下提示框
      if (boxWidth > pointX) {
        x = 150;
      } else { // 左边放的下
        x = pointX - boxWidth-15;
      }
      // boxHeight > pointY 说明鼠标上边放不下提示框
      if (boxHeight > pointY) {
        y = 5;
      } else { // 上边放得下
        y = pointY - boxHeight;
      }
      return [x, y];
    },
    drawLine() {
      let restoreTotal = echarts.init(document.getElementById('restoreTotal'));
      let backupTotal = echarts.init(document.getElementById('backupTotal'));
      let initConn = echarts.init(document.getElementById('initConn'));
      const that = this;
      if(Object.keys(this.spaceDetail).length) {
        this.spaceChartData = [{
          id: 'canvas1',
          value: this.spaceData.percentData[0]/100 > 1 ? 1 : this.spaceData.percentData[0]/100,
          width: this.$refs.space1.innerWidth || this.$refs.space1.clientWidth,
          height: 200,
          color: ['#04C1F9','#C3E9F5'],
          title: {
              show: true,
              text: '存储1',
              style: {
                color: '#333',
                fontSize: '14px',
              }
            },
            subTitle: {
              show: true,
              text: this.spaceData.explain[0],
              style: {
                color: '#04C1F9',
                fontSize: '12px',
              }
            }
        }];
        if(Object.keys(this.spaceDetail).length > 1) {
          this.spaceChartData.push({
            id: 'canvas2',
            value: this.spaceData.percentData[1]/100 > 1 ? 1 : this.spaceData.percentData[1]/100,
            width: this.$refs.space2.innerWidth || this.$refs.space2.clientWidth,
            height: 200,
            color: ['green', '#D1EBD0'],
            title: {
              show: true,
              text: '存储2',
              style: {
                color: '#333',
                fontSize: '14px',
              }
            },
            subTitle: {
              show: true,
              text: this.spaceData.explain[1],
              style: {
                color: 'green',
                fontSize: '12px',
              }
            }
          })
        }
      }
      if (this.nfsAssignedSpace && this.nfsAssignedSpace.length > 0) {
        var spaceRatio = echarts.init(document.getElementById('spaceRatio'));
        const labelObject = {
          oracle: {
            value: 'Oracle',
            color: 'rgb(216, 30, 6)'
          },
          sqlserver: {
            value: 'SQL Server',
            color: 'rgb(0, 65, 152)'
          },
          mysql: {
            value: 'MySql',
            color: 'rgb(0, 117, 143)'
          },
          db2: {
            value: 'DB2',
            color: 'rgb(128, 160, 50)'
          },
          dm: {
            value: '达梦数据库',
            color: '#072D5C'
          },
          filehost: {
            value: '文件',
            color: '#048B41'
          },
          vm: {
            value: '虚拟机',
            color: 'rgb(143, 190, 72)'
          }
        };
        let spacePieOption = {
          // backgroundColor: '#00265f',
          // grid: {
          //   left: '3%',
          //   right: '4%',
          //   bottom: '3%',
          //   containLabel: true,
          // },
          xAxis: [
            {
              type: 'category',
              data: ['oracle', 'sqlserver', 'mysql', 'db2', 'dm', 'filehost', 'vm'],
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#aaa',
                  width: 1,
                  type: 'solid',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                interval: 0,
                color: (value, index) => {
                  return labelObject[value].color;
                },
                formatter: (value, index) => {
                  return labelObject[value].value;
                }
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                show: true,
                formatter: (value, index) => {
                  return this.addUnit(value);
                }
              },
              min: 0,
              max: this.spaceDetail.nfsData.total,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#00c7ff',
                  width: 1,
                  type: 'solid',
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#063374',
                },
              },
            },
          ],
          series: [
            {
              type: 'bar',
              data: [{name: 'oracle', value: this.nfsPieData[1]},
              {name: 'sqlserver', value: this.nfsPieData[2]},
              {name: 'mysql', value: this.nfsPieData[5]},
              {name: 'db2', value: this.nfsPieData[6]},
              {name: 'dm', value: this.nfsPieData[7]},
              {name: 'filehost', value: this.nfsPieData[3]},
              {name: 'vm', value: this.nfsPieData[4]}],
              barWidth: 25, //柱子宽度
              // barGap: 1, //柱子之间间距
              itemStyle: {
                normal: {
                  color: params => {
                    return labelObject[params.name].color;
                  },
                  opacity: 1,
                },
              },
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: params => {
                    return this.addUnit(params.value)
                  }
                }
              },
            },
          ],
        };
        spaceRatio.setOption(spacePieOption);
      }
      let backupOption = {
        tooltip: {
          trigger: 'item',
          backgroundColor:'rgba(255,255,255,0.8)',
          color:'black',
          borderWidth:'1',
          borderColor:'gray',
          textStyle: {
            color: 'black'
          },
          position: this.tooltipPosition,
          formatter: res => {
            const arr = `<p ${res.data.explain.oracle?'style="display: block"':'style="display: none"'}>${res.marker}oracle: <b>${res.data.explain.oracle}</b></p>
                    <p ${res.data.explain.sqlserver?'style="display: block"':'style="display: none"'}>${res.marker}sqlserver: <b>${res.data.explain.sqlserver}</b></p>
                    <p ${res.data.explain.filehost?'style="display: block"':'style="display: none"'}>${res.marker}文件: <b>${res.data.explain.filehost}</b></p>
                    <p ${res.data.explain.vm?'style="display: block"':'style="display: none"'}>${res.marker}VMware: <b>${res.data.explain.vm}</b></p>
                    <p ${res.data.explain.hw?'style="display: block"':'style="display: none"'}>${res.marker}华为虚拟机: <b>${res.data.explain.hw}</b></p>
                    <p ${res.data.explain.mysql?'style="display: block"':'style="display: none"'}>${res.marker}mysql: <b>${res.data.explain.mysql}</b></p>
                    <p ${res.data.explain.dm?'style="display: block"':'style="display: none"'}>${res.marker}达梦: <b>${res.data.explain.dm}</b></p>
                    <p ${res.data.explain.db2?'style="display: block"':'style="display: none"'}>${res.marker}db2: <b>${res.data.explain.db2}</b></p>`
            return `<p>${res.data.explain.total?arr:'无'}</p>`
          }
        },
        title: {
          text: this.calcPercent(this.total.totalBackupNumSuccess, this.total.totalBackupNumSuccess+this.total.totalBackupNumFail)+'%',
          subtext: '成功率',
          x: 'center',
          y: '45%',
          textStyle: {
            color: '#1abb9c',
            fontSize: 30
          }
        },
        series: [
          {
            name: '数据备份',
            type: 'pie',
            radius: ['45%', '55%'],
            hoverAnimation: false,
            color: ['#1abb9c', '#7F7F7F'],
            data: [
              {
                value: this.total.totalBackupNumSuccess,
                name: '成功',
                dataType: 1,
                label: {
                  normal: {
                    formatter: '{b} : {c}',
                    position: 'inner'
                  }
                },
                explain: {
                  'oracle': this.total.oracleBackupNumSuccess,
                  'sqlserver': this.total.sqlserverBackupNumSuccess,
                  'filehost': this.total.fileBackupNumSuccess,
                  'vm': this.total.vmBackupNumSuccess,
                  'hw': this.total.hwvmBackupNumSuccess,
                  'mysql': this.total.mysqlBackupNumSuccess,
                  'dm': this.total.dmBackupNumSuccess,
                  'db2': this.total.db2BackupNumSuccess,
                  'total': this.total.totalBackupNumSuccess
                }
              },
              {
                value: this.total.totalBackupNumFail,
                name: '失败',
                label: {
                  normal: {
                    formatter: '{b} : {c}',
                    position: 'inner'
                  }
                },
                explain: {
                  'oracle': this.total.oracleBackupNumFail,
                  'sqlserver': this.total.sqlserverBackupNumFail,
                  'filehost': this.total.fileBackupNumFail,
                  'vm': this.total.vmBackupNumFail,
                  'hw': this.total.hwvmBackupNumFail,
                  'mysql': this.total.mysqlBackupNumFail,
                  'dm': this.total.dmBackupNumFail,
                  'db2': this.total.db2BackupNumFail,
                  'total': this.total.totalBackupNumFail
                }
              }
            ]
          }
        ]
      }
      let restoreOption = {
        tooltip: {
          trigger: 'item',
          backgroundColor:'rgba(255,255,255,0.8)',
          color:'black',
          borderWidth:'1',
          borderColor:'gray',
          textStyle: {
            color: 'black'
          },
          position: this.tooltipPosition,
          formatter: function(res) {const arr = `<p ${res.data.explain.oracle?'':'style="display: none"'}>${res.marker}oracle: <b>${res.data.explain.oracle}</b></p>
                        <p ${res.data.explain.sqlserver?'':'style="display: none"'}>${res.marker}sqlserver: <b>${res.data.explain.sqlserver}</b></p>
                        <p ${res.data.explain.filehost?'':'style="display: none"'}>${res.marker}文件: <b>${res.data.explain.filehost}</b></p>
                        <p ${res.data.explain.vm?'':'style="display: none"'}>${res.marker}VMware: <b>${res.data.explain.vm}</b></p>
                        <p ${res.data.explain.hw?'':'style="display: none"'}>${res.marker}华为虚拟机: <b>${res.data.explain.hw}</b></p>
                        <p ${res.data.explain.mysql?'':'style="display: none"'}>${res.marker}mysql: <b>${res.data.explain.mysql}</b></p>
                        <p ${res.data.explain.dm?'':'style="display: none"'}>${res.marker}达梦: <b>${res.data.explain.dm}</b></p>
                        <p ${res.data.explain.db2?'':'style="display: none"'}>${res.marker}db2: <b>${res.data.explain.db2}</b></p>`
            return `<p>${res.data.explain.total?arr:'无'}</p>`
          }
        },
        title: {
          text: this.calcPercent(this.total.totalRestoreNumSuccess, this.total.totalRestoreNumSuccess+this.total.totalRestoreNumFail)+'%',
          subtext: '成功率',
          x: 'center',
          y: '45%',
          textStyle: {
            color: '#1abb9c',
            fontSize: 30
          }
        },
        series: [
          {
            name: '恢复演练',
            type: 'pie',
            radius: ['45%', '55%'],
            hoverAnimation: false,
            color: ['#1abb9c', '#7F7F7F'],
            data: [
              {
                value: this.total.totalRestoreNumSuccess,
                name: '成功',
                dataType: 1,
                label: {
                  normal: {
                    formatter: '{b} : {c}',
                    position: 'inner'
                  }
                },
                explain: {
                  'oracle': this.total.oracleRestoreNumSuccess,
                  'sqlserver': this.total.sqlserverRestoreNumSuccess,
                  'filehost': this.total.fileRestoreNumSuccess,
                  'vm': this.total.vmRestoreNumSuccess,
                  'hw': this.total.hwvmRestoreNumSuccess,
                  'mysql': this.total.mysqlRestoreNumSuccess,
                  'dm': this.total.dmRestoreNumSuccess,
                  'db2': this.total.db2RestoreNumSuccess,
                  'total': this.total.totalRestoreNumSuccess
                }
              },
              {
                value: this.total.totalRestoreNumFail,
                name: '失败',
                label: {
                  normal: {
                    formatter: '{b} : {c}',
                    position: 'inner'
                  }
                },
                explain: {
                  'oracle': this.total.oracleRestoreNumFail,
                  'sqlserver': this.total.sqlserverRestoreNumFail,
                  'filehost': this.total.fileRestoreNumFail,
                  'vm': this.total.vmRestoreNumFail,
                  'hw': this.total.hwvmRestoreNumFail,
                  'mysql': this.total.mysqlRestoreNumFail,
                  'dm': this.total.dmRestoreNumFail,
                  'db2': this.total.db2RestoreNumFail,
                  'total': this.total.totalRestoreNumFail
                }
              }
            ]
          }
        ]
      }
      let initConnOption = {
        tooltip: {
          trigger: 'item',
          backgroundColor:'rgba(255,255,255,0.8)',
          color:'black',
          borderWidth:'1',
          borderColor:'gray',
          textStyle: {
            color: 'black'
          },
          formatter: function(params) {
                       return `${params.marker}${params.name}: ${params.value}(${params.percent}%)`
                     }
        },
        title: {
          text: this.calcPercent(this.total.initConnNumSuccess, this.total.initConnNumSuccess+this.total.initConnNumFail)+'%',
          subtext: '成功率',
          x: 'center',
          y: '45%',
          textStyle: {
            color: '#1abb9c',
            fontSize: 30
          }
        },
        series: [
          {
            name: '一键接管',
            type: 'pie',
            radius: ['45%', '55%'],
            hoverAnimation: false,
            color: ['#1abb9c', '#7F7F7F'],
            label: {
              normal: {
                formatter: '{b} : {c}',
                position: 'inner'
              }
            },
            data: [
              { value: this.total.initConnNumSuccess, name: '成功' },
              { value: this.total.initConnNumFail, name:'失败' }
            ]
          }
        ]
      }
      backupTotal.setOption(backupOption),
      restoreTotal.setOption(restoreOption),
      initConn.setOption(initConnOption),
      backupTotal.on('click', params => {
        this.jumpToMoreState(params, this.clickPieJumpTo.bs, this.clickPieJumpTo.bf);
      }),
      restoreTotal.on('click', params => {
        this.jumpToMoreState(params, this.clickPieJumpTo.rs, this.clickPieJumpTo.rf);
      }),
      initConn.on('click', params => {
        this.jumpToMoreState(params, this.clickPieJumpTo.ics, this.clickPieJumpTo.icf);
      }),
      window.addEventListener("resize", () => {
        restoreTotal.resize();
        backupTotal.resize();
        initConn.resize();
        if(Object.keys(that.spaceDetail).length) {
          barChart.resize();
        }
        if(that.nfsAssignedSpace&&that.nfsAssignedSpace.length>0) {
          spaceRatio.resize();
        }
     });
     }
   },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
$success-color: rgba(145, 199, 174, 1);
$error-color: rgba(212, 130, 101, 1);
.nfsNotUsed {
  font-size: 4em;
  color: #c0c4cc;
  min-height: 144px;
  margin: auto;
  width: 280px;
  span {
    line-height: 3.3em;
  }
}
</style>
<style scoped>
.title {
  font-weight: 400;
  color: #606266;
  padding-top: 0.5em;
  display: inline-block;
}

.text {
    font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.bie-card {
  width: 100%;
  height: 350px;
}

.box-card {
  width: 100%;
  height: 420px;
}

#barChart div {
  margin: 0 auto
}

.card-title {
  display: block;
  text-align: center;
  font-weight: 700;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
