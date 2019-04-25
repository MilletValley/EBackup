<template>
  <section>
    <div :id="id" :style="{marginTop: '-30px', width: '100%', height: '300%'}"></div>
  </section>
</template>

<script>
import { useTypeMapping } from '@/utils/constant';
import { keepTwoDecimalFull } from '@/utils/common';
import DashboardTab from '@/components/mixins/DashboardTabMixins';
import {
  fetchBackupStatistics,
  fetchRestoreStatistics,
  fetchTakeOverStatistics
} from '@/api/home';
const operateMapping = {
  backup: fetchBackupStatistics,
  restore: fetchRestoreStatistics,
  takeover: fetchTakeOverStatistics
}
export default {
  name: 'DrawPie',
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    echartsName: {
      type: String,
      default: ''
    },
  },
  mixins: [DashboardTab],
  data() {
    return {
      sourceData: {},
      chart: null
    }
  },
  created() {
    this.fetchData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.sizeFun);
  },
  methods: {
    fetchData() {
      operateMapping[this.type]()
        .then(res => {
          const { data } = res.data;
          this.sourceData = data;
        })
        .then(() => {
          this.setChart();
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    sizeFun() {
      this.chart&&this.chart.resize();
    },
    calcPercent(diviver, dividend) {
      if(Number(dividend) === 0) {
        return 100;
      }
      if(Number(diviver) < 0) {
        return 0;
      }
      return keepTwoDecimalFull((diviver/dividend)*100);
    },
    jumpToMoreState(params, successPath, errorPath) {
      if(params.name.includes('成功')) {
        this.$router.push({path: 'morestate', query: { type: successPath } });
      } else if(params.name.includes('失败')) {
        this.$router.push({path: 'morestate', query: { type: errorPath } });
      }
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
    draw(option) {
      this.chart = this.$echarts.init(document.getElementById(this.id));
      this.chart.setOption(option);
      window.addEventListener("resize", this.sizeFun);
      this.chart.on('click', params => {
        this.jumpToMoreState(params, `${this.type}Success`, `${this.type}Fail`);
      });
    },
    setChart() {
      let option = {
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
            const total = res.data.explain === 'success' ? this.sourceData.successTotal : this.sourceData.failTotal;
            const num = res.data.explain === 'success' ? 'successNum' : 'failNum';
            if(total <= 0) {
              return `<p>${res.marker}无</p>`;
            } else {
              let rootElement = document.createElement('p');
              rootElement.id = 'rootElement';
              const details = this.sourceData.details;
              for (let i = 0, j = details.length; i < j; i++) {
                if (details[i][num] > 0) {
                  let p = document.createElement('p');
                  p.innerHTML = `${res.marker}${useTypeMapping[details[i].type]}: <b>${details[i][num]}</b>`
                  rootElement.appendChild(p);
                }
              }
              return rootElement.innerHTML;
            }
          }
        },
        title: {
          text: this.calcPercent(this.sourceData.successTotal, this.sourceData.successTotal + this.sourceData.failTotal) + '%',
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
            name: this.echartsName,
            type: 'pie',
            radius: ['45%', '55%'],
            hoverAnimation: false,
            color: ['#1abb9c', '#7F7F7F'],
            data: [
              {
                value: this.sourceData.successTotal,
                name: '成功',
                dataType: 1,
                label: {
                  normal: {
                    formatter: '{b} : {c}',
                    position: 'inner'
                  }
                },
                explain: 'success'
              },
              {
                value: this.sourceData.failTotal,
                name: '失败',
                label: {
                  normal: {
                    formatter: '{b} : {c}',
                    position: 'inner'
                  }
                },
                explain: 'fail'
              }
            ]
          }
        ]
      };
      this.draw(option);
    }
  }
}
</script>