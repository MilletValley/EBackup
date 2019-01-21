<template>
  <section class="context">
    <el-row class="head-row">
      <section class="listDiv">
        <ul>
          <li :class="{'active-li': activeName === 'databaseRestore'}" @click="switchTab('databaseRestore')">数据库恢复</li>
          <li :class="{'active-li': activeName === 'filehostRestore'}" @click="switchTab('filehostRestore')">文件恢复</li>
          <li :class="{'active-li': activeName === 'vmRestore'}" @click="switchTab('vmRestore')">虚拟机恢复</li>
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
        <li v-for="(scope, key) in curTableData" :key="key"
            style="margin-top: 5px">
          <card>
            <div slot="header" style="padding: 0 20px;">
              <h4 class="name-section">
                <div>{{activeName === 'databaseRestore' ? scope.ascription : scope.name}}</div>
                <div style="margin-left: 10px">
                  <i v-if="scope.restoreState === 0"
                    class="el-icon-success"
                    style="color: #27ca27"></i>
                  <i v-else
                    class="el-icon-error"
                    style="color: #ca2727"></i>
                </div>
                <el-button @click="linkTo(scope)"
                           type="text"
                           style="position: absolute; right: 0; top: -10px">查看详情</el-button>
              </h4>
            </div>
            <div slot="content" class="cardDiv">
              <section v-if="activeName === 'databaseRestore'">
                <div class="left-tag">数据库名：{{scope.name}}</div>
                <div>数据库类型：{{dbType(scope)}}</div>
              </section>
              <section v-if="activeName === 'filehostRestore'">
                <div class="left-tag">主机IP：{{scope.ascription}}</div>
              </section>
              <section v-if="activeName === 'vmRestore'">
                <div class="left-tag">所属物理主机：{{scope.ascription}}</div>
                <div>虚拟机类型：{{vmType(scope)}}</div>
              </section>
              <section>
                <div class="left-tag">耗时：{{ scope.timeConsuming | durationFilter }}</div>
              </section>
              <section>
                <div class="left-tag">恢复结束时间：<el-tag size="mini">{{ dateFmt(scope.endTime) }}</el-tag></div>
              </section>
            </div>
          </card>
          <!-- <div class="cardDiv"  @click="linkTo(scope)">
            <h4 class="name-section">
              <div>{{activeName === 'databaseRestore' ? scope.ascription : scope.name}}</div>
              <div style="margin-left: 10px">
                <i v-if="scope.backupState === 0"
                  class="el-icon-success"
                  style="color: #27ca27"></i>
                <i v-else
                  class="el-icon-error"
                  style="color: #ca2727"></i>
              </div>
            </h4>
            <section v-if="activeName === 'databaseRestore'">
              <div class="left-tag">数据库名：{{scope.name}}</div>
              <div>数据库类型：{{dbType(scope)}}</div>
            </section>
            <section v-if="activeName === 'filehostRestore'">
              <div class="left-tag">主机IP：{{scope.ascription}}</div>
            </section>
            <section v-if="activeName === 'vmRestore'">
              <div class="left-tag">所属物理主机：{{scope.ascription}}</div>
              <div>虚拟机类型：{{vmType(scope)}}</div>
            </section>
            <section>
              <div class="left-tag">耗时：{{ scope.timeConsuming | durationFilter }}</div>
            </section>
            <section>
              <div class="left-tag">恢复结束时间：<el-tag size="mini">{{ dateFmt(scope.endTime) }}</el-tag></div>
            </section>
          </div> -->
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
import { Card } from 'vux';
export default {
  name: 'MoreState',
  mixins: [baseMixin, DashboardTab, sortMixin, filterMixin],
  components: {
    MultipleSelection,
    SortList,
    Card
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
      activeName: 'databaseRestore',
      activeTab,
      fmtSizeFn,
      infoLoading: true,
      tableFilter: {},
      showContent: '',
      filterItems: {
        databaseRestore: [
          {
            title: '数据库类型',
            key: 'ddvType',
            selected: [],
            items: [
              {
                label: 'oracle',
                value: 2
              },
              {
                label: 'sqlserver',
                value: 1
              },
              {
                label: 'mysql',
                value: 3
              },
              {
                label: 'db2',
                value: 4
              },
              {
                label: '达梦',
                value: 5
              },
            ]
          },
          {
            title: '恢复状态',
            key: 'restoreState',
            selected: [],
            items: [
              {
                label: '成功',
                value: 0
              },
              {
                label: '失败',
                value: 1
              },
            ]
          },
        ],
        filehostRestore: [
          {
            title: '恢复状态',
            key: 'restoreState',
            selected: [],
            items: [
              {
                label: '成功',
                value: 0
              },
              {
                label: '失败',
                value: 1
              },
            ]
          },
        ],
        vmRestore: [
          {
            title: '虚拟机类型',
            key: 'ddvType',
            selected: [],
            items: [
              {
                label: 'VMware',
                value: 1
              },
              {
                label: '华为虚拟机',
                value: 2
              },
            ]
          },
          {
            title: '恢复状态',
            key: 'restoreState',
            selected: [],
            items: [
              {
                label: '成功',
                value: 0
              },
              {
                label: '失败',
                value: 1
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
            prop: 'name',
            order: 'descending'
          }
        },
        {
          label: '结束时间由近及远',
          value: {
            prop: 'endTime',
            order: 'descending'
          }
        },
        {
          label: '结束时间由远及近',
          value: {
            prop: 'endTime',
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
    },
    linkTo() {}
  }
}
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
<style scoped>
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
  top: 0;
  background-color: #fff;
  z-index: 99;
}
.cardDiv {
  padding: 5px 10px 10px;
}
.cardDiv section{
  font-size: 12px;
  display: flex;
  padding: 0 10px 5px;
}
.left-tag{
  flex-grow: 1;
}
.name-section{
  display: flex;
  position: relative;
  font-weight: 400;
  padding-bottom: 10px;
  margin-bottom: 0;
  margin-top: 10px;
  color: #999;
  border-bottom: 1px solid #F0F2F5;
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
