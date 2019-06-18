<template>
  <section>
    <header class="detail-header header"
            v-if="link">
      <el-row type="flex"
              justify="space-around">
        <el-col :span="7">
          <section>
            <h4 class="title">
              <router-link :class="$style.primaryLink"
                           :to="`/virtual/${type}/${link.sourceVirtual.id}`">
                {{link.sourceVirtual.vmName}}
              </router-link>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="right"
                     class="item-info">
              <el-row>
                <el-col :offset="4"
                        :span="18">
                  <el-form-item label="虚拟机IP">
                    <span>{{ link.sourceVirtual.ip }}</span>
                  </el-form-item>
                  <el-form-item label="虚拟机类型">
                    <span>{{ link.sourceVirtual.type | vmTypeFilter }}</span>
                  </el-form-item>
                  <el-form-item label="所属物理主机">
                    <span>{{ link.sourceVirtual.vmHostName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-col>
        <el-col :span="10">
          <section class="linkSection">
            <div style="position: relative; height: 3em; display: inline-block"
                 v-if="link.state === 2">
                <div class="rightMask"></div>
                <i-icon :name="link.state | linkIconFilter"
                        class="linkIcon"></i-icon>
              </div>
            <div style="position: relative; height: 3em; display: inline-block"
                 v-else-if="[1, 3].includes(link.state)">
                <div class="leftMask"></div>
                <i-icon :name="link.state | linkIconFilter"
                        class="linkIcon"></i-icon>
            </div>
            <i-icon :name="link.state | linkIconFilter"
                    class="linkIcon"
                    v-else></i-icon>
            <div>
              <el-tag :type="link.state | linkStateStyleFilter"
                      style="margin-left: 10px"
                      size="mini">{{ link.state | linkStateFilter }}</el-tag>
            </div>
            <div v-if="link.linkMessage">
              <div class="linkMsg">
                {{link.linkMessage}}
              </div>
            </div>
            <el-form size="small"
                     label-width="100px"
                     label-position="right"
                     class="item-info">
              <el-row type="flex"
                      style="text-align: left">
                <el-col :span="16"
                        :offset="8">
                  <el-form-item label="同步策略">
                    <span>{{ link.strategyConfig.syncTimeStrategy | syncStrategyFilter }}</span>
                  </el-form-item>
                  <el-form-item label="同步周期"
                                v-if="[1, 2].includes(link.strategyConfig.syncTimeStrategy)">
                    <span>{{ link.strategyConfig.syncTimeInterval  }}{{ link.strategyConfig.syncTimeStrategy === 1 ? '分钟' : '小时' }}</span>
                  </el-form-item>
                  <el-form-item label="星期"
                                v-if="link.strategyConfig.syncTimeStrategy === 4">
                    <el-tag class="infoTag"
                            v-for="week in link.strategyConfig.weekDays"
                            :key="week"
                            size="mini">{{ weekMapping[week] }}</el-tag>
                  </el-form-item>
                  <el-form-item label="时间"
                                v-if="[3, 4].includes(link.strategyConfig.syncTimeStrategy)">
                    <el-tag class="infoTag"
                            size="mini">{{ link.strategyConfig.syncRunTime }}</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-col>
        <el-col :span="7">
          <section>
            <h4 class="title">
                {{link.targetVirtual.vmName}}
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="right"
                     class="item-info">
              <el-row>
                <el-col :span="18"
                        :offset="4">
                  <el-form-item label="虚拟机IP">
                    <span>{{ link.targetVirtual.ip | ipFilter }}</span>
                  </el-form-item>
                  <el-form-item label="虚拟机类型">
                    <span>{{ link.targetVirtual.type | vmTypeFilter }}</span>
                  </el-form-item>
                  <el-form-item label="所属物理主机">
                    <span>{{ link.targetVirtual.vmHostName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-col>
      </el-row>
    </header>
    <h3>操作记录</h3>
    <el-table :data="records"
              style="width: 100%">
      <el-table-column prop="type"
                       label="类型"
                       align="center"
                       min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.type | syncOperationFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="state"
                       align="center"
                       min-width="60">
        <template slot-scope="scope">
          <i :class="scope.row.state | operationStateIconFilter"></i>
        </template>
      </el-table-column>
      <el-table-column label="信息"
                       prop="content"
                       header-align="center"
                       min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.content ? scope.row.content : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间"
                       prop="time"
                       align="center"
                       min-width="80"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import {
  vmTypeMapping,
  syncLinkMapping,
  weekMapping,
  syncStragegyMapping,
  syncOperationMapping
} from '@/utils/constant';
import { fetchOperationRecords, fetchLinks } from '@/api/virtuals';

export default {
  name: 'VirtualLinkDetail',
  props: ['id'],
  data() {
    return {
      records: [],
      link: null,
      weekMapping
    }
  },
  filters: {
    vmTypeFilter(type) {
      return vmTypeMapping[type];
    },
    linkStateFilter(type) {
      return syncLinkMapping[type];
    },
    ipFilter(value) {
      return value ? value : '暂无';
    },
    syncStrategyFilter(type) {
      return syncStragegyMapping[type];
    },
    syncOperationFilter(type) {
      return syncOperationMapping[type];
    },
    operationStateIconFilter(state) {
      if (state === 0) {
        return 'el-icon-success success-color';
      } else if (state === 1) {
        return 'el-icon-loading waiting-color';
      } else if (state === 2) {
        return 'el-icon-error error-color';
      }
      return '';
    },
    linkStateStyleFilter(type) {
      switch(type) {
        case 0:
        case 1:
          return 'warning';
        case 2:
        case 3:
          return 'danger';
        default:
          return 'primary';
      }
    },
    linkIconFilter(state) {
      switch(state) {
        case 0:
          return 'switch-1';
        case 1:
          return 'transportationRight';
        case 2:
          return 'transportationRight-warning';
        case 3:
          return 'transportationLeft-warning';
        case 4:
          return 'switch-3';
        default:
          return '';
      }
    }
  },
  created() {
    this.fetchData();
  },
  computed: {
    type() {
      const path = this.$route.path;
      return this.$route.path.split('/')[2];
    },
  },
  methods: {
    fetchData() {
      fetchOperationRecords(this.id)
        .then(res => {
          const { data } = res.data;
          this.records = data;
        })
        .catch(error => {
          this.$message.error(error);
        })
      fetchLinks()
        .then(res => {
          const { data: links } = res.data;
          this.link = links.find(link => link.id === this.id);
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
  }
}
</script>
<style lang="scss" module>
@import '@/style/common.scss';
@import '@/style/color.scss';
</style>
<style scoped>
.header {
  padding-bottom: 10px;
}
.linkIcon {
  width: 3em;
  height: 3em;
  vertical-align: -0.5em;
}
.linkSection {
  font-size: 0.8em;
  text-align: center;
}
.linkMsg {
  display: inline-block;
  text-align: left;
  margin-top: 10px;
}
.title {
  text-align: center;
}
.infoTag {
  margin: 0 2px;
}
.waiting-color {
  color: rgb(158, 158, 22);
}
.success-color {
  color: rgb(39, 202, 39);
}
.error-color {
  color: rgb(202, 39, 39);
}
.rightMask,
.leftMask {
  animation: move 2s infinite;
  position: absolute;
  height: 3em;
  width: 100px;
  right: -20px;
  background: #fff;
}
.leftMask {
  left: -20px;
}
@keyframes move {
  from {
    width: 100px;
  }
  to {
    width: 0;
  }
}
</style>
