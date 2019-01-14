<template>
  <section >
    <template style="height: 100%">
      <el-row :gutter="20" class="pieChart-row">
        <el-col :span="8">
          <div id="backupTotal" :style="{marginTop: '0px', width: '100%', height: '100%'}" @click="goMore('backupState')"></div>
        </el-col>
        <el-col :span="8">
          <div id="restoreTotal" :style="{marginTop: '0px', width: '100%', height: '100%'}" @click="goMore('restoreState')"></div>
        </el-col >
        <el-col :span="8">
          <div id="initConn" :style="{marginTop: '0px', width: '100%', height: '100%'}" @click="goMore('takeoverState')"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10" >
        <el-col>
          <div class="text item" v-show="Object.keys(spaceDetail).length">
            <el-row class="cylinder-row">
              <el-col :span="Object.keys(spaceDetail).length > 1 ? 12 : 24" ref="col">
                <el-col :span="12">
                  <div ref="space1" class="cylinder-content">
                    <cylinder :data="spaceChartData[0]"></cylinder>
                  </div>
                </el-col>
                <el-col :span="12" style="padding-top:15px">
                  <div class="list-title">存储1</div>
                  <div class="list-row">
                    <div>总空间：</div>
                    <div>100G</div>
                  </div>
                  <div class="list-row">
                    <div>已使用：</div>
                    <div>70G</div>
                  </div>
                  <div class="list-row">
                    <div style="text-align: right">剩余空间：</div>
                    <div>30G</div>
                  </div>
                </el-col>
              </el-col>
              <el-col :span="12" v-if="Object.keys(spaceDetail).length > 1">
                <div  ref="space2" class="cylinder-content">
                  <cylinder :data="spaceChartData[1]"></cylinder>
                </div>
              </el-col>
            </el-row>
          </div>
          <div :class="$style.nfsNotUsed" v-show="!Object.keys(spaceDetail).length">
            <span>暂未使用</span>
          </div>
        </el-col>
        <el-col>
          <!-- <el-card class="box-card" style="width: 100%"> -->
            <!-- <div slot="header" class="clearfix">
              <span class="card-title">存储1已使用空间分配情况</span>
            </div> -->
            <div class="barChart-content" v-show="nfsAssignedSpace&&nfsAssignedSpace.length>0">
              <div id="spaceRatio" :style="{width: '100%', height: '100%', margin: '0 auto'}"></div>
            </div>
            <div :class="$style.nfsNotUsed" v-show="!(nfsAssignedSpace&&nfsAssignedSpace.length>0)">
              <span>暂未使用</span>
            </div>
          <!-- </el-card> -->
        </el-col>
      </el-row>
    </template>
  </section>
</template>
<script>
import { fetchAll, fetchSpaceUse } from '../../api/home';
import { fmtSizeFn } from '../../utils/common';
import baseMixin from '../mixins/baseMixins';
import DashboardTab from '../mixins/DashboardTabMixins';
import Cylinder from '@/components/common/CylinderNotTitle';
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
        .catch(error => {
          this.$message.error(error);
        })
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
          width: (this.$refs.space1.innerWidth || this.$refs.space1.clientWidth) -20,
          height: this.$refs.space1.innerHeight || this.$refs.space1.clientHeight / 2,
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
            height: this.$refs.space2.innerHeight || this.$refs.space2.clientHeight,
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
          grid: {
            left: 0,
            right: 10,
            top: 40,
            bottom: 0,
            containLabel: true,
          },
          title: {
            text: '存储1已使用空间分配情况',
            left: 'center',
            textStyle: {
              fontSize: 14
            }
          },
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
                rotate:40,
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
        title: {
          text: this.calcPercent(this.total.totalBackupNumSuccess, this.total.totalBackupNumSuccess+this.total.totalBackupNumFail)+'%',
          subtext: '数据备份',
          x: 'center',
          y: '40%',
          itemGap: 0,
          textStyle: {
            color: '#1abb9c',
            fontSize: 14,
          },
          subtextStyle: {
            fontSize: 10,
          }
        },
        series: [
          {
            name: '数据备份',
            type: 'pie',
            radius: ['75%', '95%'],
            hoverAnimation: false,
            color: ['#1abb9c', '#7F7F7F'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: this.total.totalBackupNumSuccess,
                name: '成功',
                dataType: 1,
              },
              {
                value: this.total.totalBackupNumFail,
                name: '失败',
              }
            ]
          }
        ]
      }
      let restoreOption = {
        title: {
          text: this.calcPercent(this.total.totalRestoreNumSuccess, this.total.totalRestoreNumSuccess+this.total.totalRestoreNumFail)+'%',
          subtext: '恢复演练',
          x: 'center',
          y: '40%',
          itemGap: 0,
          textStyle: {
            color: '#1abb9c',
            fontSize: 14
          },
          subtextStyle: {
            fontSize: 10
          }
        },
        series: [
          {
            name: '恢复演练',
            type: 'pie',
            radius: ['75%', '95%'],
            hoverAnimation: false,
            color: ['#1abb9c', '#7F7F7F'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: this.total.totalRestoreNumSuccess,
                name: '成功',
                dataType: 1,
              },
              {
                value: this.total.totalRestoreNumFail,
                name: '失败',
              }
            ]
          }
        ]
      }
      let initConnOption = {
        title: {
          text: this.calcPercent(this.total.initConnNumSuccess, this.total.initConnNumSuccess+this.total.initConnNumFail)+'%',
          subtext: '一键接管',
          itemGap: 0,
          x: 'center',
          y: '40%',
          textStyle: {
            color: '#1abb9c',
            fontSize: 14
          },
          subtextStyle: {
            fontSize: 10
          }
        },
        series: [
          {
            name: '一键接管',
            type: 'pie',
            radius: ['75%', '95%'],
            hoverAnimation: false,
            color: ['#1abb9c', '#7F7F7F'],
            label: {
              show: false
            },
            labelLine: {
              show:false
            },
            data: [
              { value: this.total.initConnNumSuccess, name: '成功' },
              { value: this.total.initConnNumFail, name:'失败' }
            ]
          }
        ]
      }
      backupTotal.setOption(backupOption),
      backupTotal.on('legendselectchanged', params => {
        this.jumpToMoreState(params, this.clickPieJumpTo.bs, this.clickPieJumpTo.bf);
      });
      restoreTotal.setOption(restoreOption),
      initConn.setOption(initConnOption),
      // backupTotal.on('click', params => {
      //   this.jumpToMoreState(params, this.clickPieJumpTo.bs, this.clickPieJumpTo.bf);
      // }),
      // restoreTotal.on('legendselectchanged', params => {
      //   this.jumpToMoreState(params, this.clickPieJumpTo.rs, this.clickPieJumpTo.rf);
      // }),
      // initConn.on('legendselectchanged', params => {
      //   this.jumpToMoreState(params, this.clickPieJumpTo.ics, this.clickPieJumpTo.icf);
      // }),
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
    },
    linkTo(scope) {
      this.$router.push({ name: `${this.dbDetailRouter(scope)}`, params: { id: String(scope.id), type: 'backup' }});
    },
    goMore(type) {
      this.$router.push({name: type});
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
  height: 250px;
  /* height: 50%; */
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
/* .el-row {
  margin-bottom: 10px;
} */
.el-row:last-child {
  margin-bottom: 0;
}
.cardDiv section{
  font-size: 12px;
  display: flex;
  padding-left:30px;
}
.left-tag{
  flex-grow: 1;
}
.name-section{
  display: flex;
  margin-bottom: 10px;
}
.listDiv {
  display: flex;
}
.listDiv ul {
  padding-bottom: 1.333333vw;
  overflow-x: scroll;
  white-space: nowrap;
  list-style: none;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 1.066667rem;
  height: 10.666667vw;
  padding-left: .4rem;
  padding-left: 4vw;
  padding-bottom: .133333rem;
  padding-bottom: 1.333333vw;
  overflow-x: scroll;
  white-space: nowrap;
  background-color: #E7F5F4
}
.listDiv li {
  display: inline-block;
  margin-right: .746667rem;
  margin-right: 7.466667vw;
  padding: .346667rem 0 .16rem;
  padding: 3.466667vw 0 1.6vw;
  font-size: 14px;
  line-height: 1;
  color: #909399;
  opacity: .7;
}
.active-li {
  font-weight: 700;
  color:#409eff !important;
  border-bottom: .053333rem solid #409eff;
  border-bottom: .533333vw solid #409eff;
  opacity: 1;
}
.pieChart-row{
  width: 100%;
  height: 45.2vw;
  padding-top: 20px;
  margin-left: 0px !important;
}
.pieChart-row .el-col{
  height: 100%;
}
.cylinder-row{
  width: 100%;
  height: 40.2vw;
  padding-top: 20px;
  margin-left: 0px !important;
}
.cylinder-row .el-col{
  height: 100%;
}
.cylinder-content{
  height: 100%;
  padding-top: 15px;
}
.barChart-content{
  width: 100%;
  height: 70vw;
  /* padding-top: 20px; */
  margin-left: 0px !important;
}
.list-title{
  font-size: 14px;
  font-weight: bold;
}
.list-row{
  display: flex;
  font-size: 12px;
}
</style>
