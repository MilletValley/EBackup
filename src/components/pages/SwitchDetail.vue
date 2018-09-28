<template>
  <section>
    <h4>{{ item.name }}</h4>
    <el-card v-for="link in links"
             :key="link.id"
             style="margin-bottom: 20px;">
      <div slot="header" :class="$style.clearfix">
        <el-row type="flex"
                justify="space-around">
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <i-icon name="ip"
                      :class="$style.hostIpIcon"></i-icon>
              <el-tooltip :content="'生产设备：'+`${link.primaryHost.name}`"
                          placement="right"
                          effect="light">
                <span :class="$style.hostIp">{{ link.primaryHost.hostIp }}</span>
              </el-tooltip>
              <el-tooltip v-show="link.serviceIpMark === 1 && link.primaryHost.osName === 'Linux'"
                          placement="right"
                          effect="light">
                <div slot="content">
                  提供服务中
                  <br/>服务IP：{{ link.primaryHost.serviceIp }}
                </div>
                <i-icon :class="$style.serviceIcon"
                        name="service"></i-icon>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <el-tooltip v-show="link.serviceIpMark === 1 && link.primaryHost.osName === 'Windows'"
                        placement="right"
                        effect="light">
              <div slot="content">
                提供服务中
                <br/>临时IP：{{ link.primaryHost.serviceIp }}
              </div>
              <i-icon :class="$style.templateIcon"
                      name="service"></i-icon>
            </el-tooltip>
          </el-col>
          <el-col :span="10">
            <div :class="$style.hostInfo">
              <i-icon name="ip"
                      :class="$style.hostIpIcon"></i-icon>
              <el-tooltip :content="'易备设备：'+`${link.viceHost.name}`"
                          placement="right"
                          effect="light">
                <span :class="$style.hostIp">{{ link.viceHost.hostIp }}</span>
              </el-tooltip>
              <el-tooltip v-show="link.serviceIpMark === 2 && link.viceHost.osName === 'Linux'"
                          placement="right"
                          effect="light">
                <div slot="content">
                  提供服务中
                  <br/>服务IP：{{ link.viceHost.serviceIp }}
                </div>
                <i-icon :class="$style.serviceIcon"
                        name="service"></i-icon>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>
      <div :class="$style.item">
        <el-row v-for="record in link.switch"
                :key="record.id">
          <el-col :span="7">
            <el-tooltip :content="record.type===1?'切实例':'切IP'"
                        placement="right">
              <span>
                <i-icon name="switchDatabase"
                        v-if="record.type===1"
                        :class="$style.switchType"></i-icon>
                <i-icon name="switchIp"
                        v-else
                        :class="$style.switchType"></i-icon>
                <span>{{ record.name }}</span>
              </span>
            </el-tooltip>
          </el-col>
          <el-col :span="8">{{ record.content }}</el-col>
          <el-col :span="9">
            <span :class="$style.switchRecordTime"><i :class="switchStateIconClass(record.state)"></i></span>
            <span :class="$style.switchRecordState">{{ record.switchTime }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </section>
</template>
<script>
import { fetchOne } from '../../api/switch'
import { switchTypeMapping } from '../../utils/constant'
import IIcon from '../IIcon'
export default {
  name: 'SwitchDetail',
  data() {
    return {
      item: {},
      timer: null,
    }
  },
  computed: {
    links() {
      return this.item?this.item.alreadySwitch:[]
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.setTimer();
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    fetchData() {
      const path = this.$route.path
      const id = path.substring(path.lastIndexOf('/')+1)
      fetchOne(id)
        .then(res => {
          const { data } = res.data;
          this.item = data
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
    switchStateIconClass(value) {
      switch (value) {
        case 0:
          return ['el-icon-time'];
        case 1:
          return ['el-icon-loading'];
        case 2:
          return ['el-icon-success', this.$style.successColor];
        case 3:
          return ['el-icon-error', this.$style.errorColor];
      }
    }
  },
  components: {
    IIcon
  }
}
</script>

<style lang="scss" module>
@import '../../style/common.scss';
@import '../../style/color.scss';
$primary-color: #409eff;
$vice-color: #6d6d6d;
.item {
  font-size: 14px;
}
.clearfix {
  margin-top: -20px;
  margin-bottom: -20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.hostInfo {
  text-align: center;
  margin: 1em 0;
}
.hostIcon {
  vertical-align: -0.3em;
  width: 2em;
}
.hostIpIcon {
  width: 2em;
  display: inline-block;
  vertical-align: -0.3em;
  margin-top: 10px;
}
.hostIp {
  color: #909399;
  font-style: italic;
  font-size: 0.9em;
}
.serviceIcon {
  position: absolute;
  margin-left: 30px;
  margin-top: 0.5em;
  width: 1.5em;
  height: 1.5em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.templateIcon {
  margin-top: 1.5em;
  margin-left: 0;
  width: 1.5em;
  height: 1.5em;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}
.switchRecordTime {
  float: right;
  display: inline-block;
  width: 30px;
}
.switchRecordState {
  float: right;
  display: inline-block;
  width: 150px;
}
.switchType {
  vertical-align: middle;
}
</style>


