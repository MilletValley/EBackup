<template>
  <section>
    <!-- <header class="detail-header">
      <div class="content">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon name="takeover-plan"
                    class="detail-icon"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>灾备演练</h1>
              </el-col>
              <el-col :span="12"
                      :offset="4"
                      class="action">
                <el-button size="mini"
                           type="primary">添加</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     label-position="left"
                     label-width="110px"
                     size="small"
                     class="item-info">
              <el-row style="margin-right: 5px;">
                <el-col :span="8">
                  <el-form-item label="计划总数：">
                    <span>{{ planNum.totalNum }}</span>
                  </el-form-item>
                  <el-form-item label="实例总数：">
                    <span>{{ planNum.instanceNum }}</span>
                  </el-form-item>
                  <el-form-item label="生产设备总数：">
                    <span>{{ planNum.primaryNum }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="未开始计划数：">
                    <span>{{ planNum.unStartedNum }}</span>
                  </el-form-item>
                  <el-form-item label="进行中计划数：">
                    <span>{{ planNum.onGoingNum }}</span>
                  </el-form-item>
                  <el-form-item label="已完成计划数：">
                    <span>{{ planNum.finishedNum }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </header> -->
    <!-- <el-tabs style="margin-top: -39px"
            v-model="activeTab">
      <el-tab-pane label="灾备计划"
                  name="plans"> -->
        <el-card :class="$style.disasterRecoverCard"
                v-for="plan in switchList"
                :key="plan.id">
          <div slot="header"
              class="clearfix">
            <el-tag size="mini"
                    color="#233FCA"
                    style="color: #ffffff">灾备</el-tag>
            <span>
              <router-link :to="`${plan.id}`"
                          append
                          :class="$style.link">{{ plan.name }}</router-link>
            </span>
          </div>
          <el-row type="flex">
            <el-col :span="18">
              <el-form label-width="100px"
                      size="mini">
                <el-form-item label="计划创建时间"
                              width="40%">
                  <span>{{ plan.createTime }}</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="6"
                    :class="$style.planInfo">
              <ul>
                <li>
                  <h5>当前状态</h5>
                  <div>
                    <div style="display: inline-block">
                      <i v-if="plan.state === 0"
                        class="el-icon-time"
                        :class="operationStateStyle(plan.state)"></i>
                      <i v-else-if="plan.state === 1"
                        class="el-icon-loading"
                        :class="operationStateStyle(plan.state)"></i>
                      <i v-else-if="plan.state === 2"
                        class="el-icon-remove-outline"
                        :class="operationStateStyle(plan.state)"></i>
                      <span :class="operationStateStyle(plan.state)">{{ operationState(plan.state) || '-' }}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <h5>计划开始时间</h5>
                  <div>{{plan.createTime || '备份未开始'}}</div>
                </li>
                <li>
                  <h5>已持续时间</h5>
                  <div v-if="plan.consumeTime">{{plan.consumeTime | durationFilter}}</div>
                  <div v-else>-</div>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-card>        
      <!-- </el-tab-pane>
  </el-tabs> -->
  </section>
</template>
<script>
import { fetchAll, fetchNum } from '../../api/switch'
import IIcon from '@/components/IIcon'
import { operationStateMapping } from '../../utils/constant'
import baseMixin from '../mixins/baseMixins';
export default {
  name: 'SwitchList',
  mixins: [baseMixin],
  data() {
    return {
      switchList: [],
      planNum: {},
      infoLoading: true,
      activeTab: 'plans',
      timer: null
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.setTimer();
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    fetchData() {
      // fetchNum()
      //   .then(res => {
      //     const { data } = res.data
      //     this.planNum = data
      //   })
      //   .catch(error => {
      //     this.$message.error(error)
      //   })
      //   .then(() => {
      //     this.infoLoading = false;
      //   })
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.switchList = data;
        })
    },
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        this.fetchData();
      }, 20000);
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    operationStateStyle(state) {
      if (state === 0) {
        return this.$style.waitingColor;
      } else if (state === 1) {
        return this.$style.loadingColor;
      } else if(state === 2) {
        return this.$style.finishedColor;
      } else return '';
    },
    operationState(state) {
      return operationStateMapping[state];
    },
  },
  components: {
    IIcon
  }
}
</script>
<style lang="scss" module>
@import '../../style/color.scss';
@import '../../style/common.scss';
.disasterRecoverCard {
  margin-bottom: 15px;
  color: #999999;
}
.planInfo {
  h5 {
    font-weight: 400;
    color: #888888;
    margin: 4px 0;
    text-align: right;
  }
  div {
    margin-left: 5px;
    text-align: right;
  }
  ul {
    list-style: none;
    margin: 0;
  }
  li {
    margin: 10px 0;
  }
}
</style>
<style>
.planMore .el-collapse-item__header {
  text-align: center;
  color: #409EFF;
}
.planMore .el-collapse-item__arrow {
  display: none;
}
</style>


