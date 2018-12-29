<template>
  <section class="context">
    <el-row class="head-row">
      <!-- <span class="title">设备详情</span>
      <el-button type="primary"
                 size="small"
                 style="float:right"
                 @click="$router.push({name: 'dashboard'})">返回</el-button> -->
      <section class="listDiv">
        <ul>
          <li :class="{'active-li': activeName === 'initconnNum'}" @click="switchTab('initconnNum')">一键接管</li>
        </ul>
      </section>
      <section class="filter-sort">
        <div class="sortDiv">
          <div class="sortTotal" >
            <div @click="sortFilterClick('sort')" class="active">{{defaultSortLabel}}<i class="el-icon-caret-bottom"></i></div>
          </div>
          <div @click="sortFilterClick('filter')">过滤</div>
        </div>
      </section>
      <section class="filter-sort-content" v-if="['sort', 'filter'].includes(showContent)">
        <div class="sort-content" v-if="showContent === 'sort'">
          <sort-list :default.sync="defaultSort" :items="sortList" :display.sync="showContent"></sort-list>
        </div>
        <div class="filter-content" v-if="showContent === 'filter'">
          <multiple-selection v-for="(item, key) in filterList" :key="key" :selected.sync="item.selected" :title="item.title" :items="item.items"></multiple-selection>
          <div class="morefilter-oper">
            <div class="clearButton" :class="{haveSelect: hasfilterItem}" @click="clearFilter">清空</div>
            <div class="confirmButton" @click="comfirmFilter">
              <span>确定</span>
            </div>
          </div>
        </div>
      </section>
    </el-row>
    <section style="padding-left:10px;padding-right:10px;">
      <ul>
        <li v-for="(scope, key) in curTableData" :key="key">
          <div class="cardDiv"  @click="linkTo(scope)">
            <h4 class="name-section">
              <div class="">{{scope.instanceName}}</div>
              <div style="margin-left: 10px">
                <el-tag :type="linkTagType(scope.overState)"
                        size="mini">
                  {{ linkTypeConverter(scope.overState) }}
                </el-tag>
              </div>
            </h4>
            <section>
              <div class="left-tag">主机IP：{{scope.primaryHostIp}}</div>
              <div>主库状态：
                <el-tag :type="stateTagType(scope.primaryState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.primaryState) }}
                </el-tag>
              </div>
            </section>
            <section>
              <div class="left-tag">备库IP：{{scope.viceHostIp}}</div>
              <div>备库状态：
                <el-tag :type="stateTagType(scope.viceState)"
                        size="mini">
                  {{ databaseTypeConverter(scope.viceState) }}
                </el-tag>
              </div>
            </section>
            <section>
              <div class="left-tag">初始化完成时间：<el-tag size="mini">{{ scope.initFinishTime }}</el-tag></div>
            </section>
          </div>
        </li>
      </ul>
    </section>
    
  </section>
</template>
<script>
import { backupStrategyMapping } from '../../utils/constant';
import DashboardTab from '../mixins/DashboardTabMixins';
import baseMixin from '../mixins/baseMixins';
import {filterMixin, sortMixin } from '../mixins/commonMixin';
import MultipleSelection from '@/components/base/MultipleSelection';
import SortList from '@/components/base/SortList';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { fmtSizeFn } from '@/utils/common';
export default {
  name: 'MoreState',
  mixins: [baseMixin, DashboardTab, sortMixin, filterMixin],
  components: {
    MultipleSelection,
    SortList
  },
  data() {
    const activeTab = {
      'backupSuccess': 'databaseBackup',
      'backupFail': 'databaseBackup',
      'restoreSuccess': 'databaseRestore',
      'restoreFail': 'databaseRestore',
      'initConnSuccess': 'initconnNum',
      'initConnFail': 'initconnNum'
    }
    return {
      activeName: 'initconnNum',
      defaultSort: {
        prop: 'instanceName',
        order: 'descending'
      },
      activeTab,
      fmtSizeFn,
      infoLoading: true,
      tableFilter: {},
      showContent: '',
      filterItems: {
        initconnNum: [
          {
            title: '主库状态',
            key: 'primaryState',
            selected: [],
            items: [
              {
                label: '正常',
                value: 1
              },
              {
                label: '异常',
                value: 2
              },
              {
                label: '未知',
                value: 3
              },
              {
                label: '监听异常',
                value: 4
              },
            ]
          },
          {
            title: '备库状态',
            key: 'viceState',
            selected: [],
            items: [
              {
                label: '正常',
                value: 1
              },
              {
                label: '异常',
                value: 2
              },
              {
                label: '未知',
                value: 3
              },
              {
                label: '监听异常',
                value: 4
              },
            ]
          },
          {
            title: '连接状态',
            key: 'overState',
            selected: [],
            items: [
              {
                label: '正常初始化',
                value: 1
              },
              {
                label: '正常',
                value: 2
              },
              {
                label: '异常不可接管',
                value: 3
              },
              {
                label: '异常可接管',
                value: 4
              },
              {
                label: '待修复',
                value: 5
              },
            ]
          },
        ],
      },
      filterList: [],
      sortList: [
        {
          label: '名称',
          value: {
            prop: 'instanceName',
            order: 'descending'
          }
        },
        {
          label: '结束时间由近及远',
          value: {
            prop: 'initFinishTime',
            order: 'descending'
          }
        },
        {
          label: '结束时间由远及近',
          value: {
            prop: 'initFinishTime',
            order: 'ascending'
          }
        },
      ]
    }
  },
  created() {
    this.fetchTabData();
    this.filterList = cloneDeep(this.filterItems[this.activeName]);
  },
  computed: {
    tableData() {
      return this[this.activeName];
    },
    defaultSortLabel() {
      return this.sortList.find(e => isEqual(this.defaultSort, e.value)).label;
    },
    hasfilterItem() {
      return this.filterList.filter(e => {
        return e.selected.length;
      }).length;
    }
  },
  methods: {
    filterFn(item, i){
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0){
        return this.filter[i].includes(Number(item[i]));
      } else {
        return item[i].includes(this.filter[i]);
      }
    },
    switchTab(type) {
      this.activeName = type;
      this.filterList = cloneDeep(this.filterItems[type]);
      this.filter = {};
      this.tableFilter = {};
    },
    sortFilterClick(type) {
      if (this.showContent === type) {
        this.showContent = '';
      } else {
        this.showContent = type;
      }
    },
    clearFilter() {
      this.filterList = this.filterList.map(e => {
        e.selected = [];
        return e;
      })
    },
    comfirmFilter() {
      this.filterList.map(e => {
        this.tableFilter[e.key] = cloneDeep(e.selected);
      });
      this.filter = Object.assign({}, this.filter, this.tableFilter);
      this.showContent = '';
    }
  }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style>
ul{
  list-style: none;
  font-size: 13px;
  padding-left: 0;
  /* margin: 0; */
}
.context{
  padding-top: 24vw;
}
.title {
  font-weight: 400;
  color: #606266;
  padding-top: 0.5em;
  display: inline-block;
}
.selectTag{
  color: rgb(49, 144, 232);
  font-weight: 700;
  background-color: #edf5ff !important;
}
.active{
  color: #3190e8;
  font-weight: 700;
  /* background-color: #edf5ff !important; */
}
.el-row {
  margin-bottom: 10px;
}
.head-row{
  position: fixed;
  width: 100%;
  top: 50px;
  background-color: #fff;
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
  width: 100%;
}
.filter-sort-content{
  /* position: absolute; */
  width:100%;
  border-top: 1px solid #ccc;
}
.sort-content{
  /* position: absolute; */
  opacity: 1;
  visibility: visible;
  z-index: 101;
  background-color: #fff;
  /* width: 100%; */
  padding-left:4vw;
  /* margin-left:  */
}

.filter-content{
  /* position: absolute; */
  opacity: 1;
  visibility: visible;
  z-index: 101;
  /* overflow: auto; */
  width: 100%;
  height: 100%;
  /* background-color: #fff; */
  /* padding: 0 .266667rem;
  padding: 0 2.666667vw; */
  background: #fff;
  -webkit-overflow-scrolling: touch;
  line-height: normal;
}

.morefilter-oper{
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: space-around;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fafafa;
  -webkit-box-shadow: 0 -0.026667rem 0.053333rem 0 #ededed;
  -webkit-box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
  box-shadow: 0 -0.026667rem 0.053333rem 0 #ededed;
  box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
  line-height: 1.146667rem;
  line-height: 11.466667vw;
}
.clearButton, .confirmButton{
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.clearButton{
  background-color: #fff;
  color: #ddd;
  /* color: #333; */
}
.haveSelect{
  color: #333 !important;
}

.confirmButton{
    opacity: .5;
    color: #fff;
    background-color: #00d762;
    border: .013333rem solid #00d762;
    border: .133333vw solid #00d762;
        opacity: 1;
}
.listDiv ul {
  margin-top: 0vw;
  margin-bottom: 1vw;
  /* padding-bottom: 1.333333vw; */
  white-space: nowrap;
  list-style: none;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  flex-grow: 1;
  height: 1.066667rem;
  height: 10.666667vw;
  /* padding-left: .4rem;
  padding-left: 4vw; */
  padding-left: 3vw;
  padding-bottom: .133333rem;
  padding-bottom: 1.333333vw;
  overflow-x: auto;
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
.filter-sort{
  display: flex;
  font-size: 14px;
  padding-left:3vw;
  padding-bottom: 2vw;
  /* border-bottom: 1px solid #ccc; */
}
.sortDiv{
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
}
.sortTotal{
  flex-grow: 1;
  /* flex-flow: 1; */
}
.sortDiv div{
  padding-right: 10px;
} 
</style>
