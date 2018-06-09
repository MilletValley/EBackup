<template>
  <section>
    <header class="detail-header"
            :class="$style.header">
      <el-row type="flex"
              justify="space-around">
        <el-col :span="8">
          <section :class="$style.productionSection">
            <h4>
              <router-link :class="productionDatabase.role === 1 ? $style.primaryLink : $style.viceLink"
                           :to="`/db/oracle/${productionDatabase.id}`">
                {{productionDatabase.name}}
              </router-link>
              <i-icon :class="$style.databaseRoleIcon"
                      :name="productionDatabase.role === 1 ? 'zhu' : 'bei'"></i-icon>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="left"
                     class="item-info">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="数据库版本">
                    <span>{{ productionDatabase.dbVersion }}</span>
                  </el-form-item>
                  <el-form-item label="实例名">
                    <span>{{ productionDatabase.instanceName }}</span>
                  </el-form-item>
                  <el-form-item label="登录名">
                    <span>{{ productionDatabase.loginName }}</span>
                  </el-form-item>

                </el-col>
                <el-col :span="12">
                  <el-form-item label="监听名">
                    <span>{{ productionDatabase.lsn }}</span>
                  </el-form-item>
                  <el-form-item label="设备环境">
                    <span>生产环境</span>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-tag :type="databaseStateStyle(productionDatabase.state)"
                            size="mini">{{productionDatabase.state | databaseStateFilter}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-form-item label="所属业务系统">
                  <span>{{ productionDatabase.application }}</span>
                </el-form-item>
              </el-row>
            </el-form>
          </section>
        </el-col>
        <el-col :span="4">
          <section :class="$style.linkSection">
            <i-icon :name="`switch-${linkState.state}`"
                    :class="$style.switchIcon"></i-icon>
            <div>
              <el-tag :type="databaseLinkStateStyle(linkState.state)"
                      style="margin-left: 10px"
                      size="mini">{{ linkState.state | linkStateFilter }}</el-tag>
            </div>
            <p>
              <span>临时端口：</span>
              <span>{{linkState.tempPort}}</span>
            </p>
            <div>
              <div :class="$style.linkMsg">
                {{linkState.errMsg}}
              </div>
            </div>
          </section>
        </el-col>
        <el-col :span="8">
          <section :class="$style.ebackupSection">
            <h4>
              <router-link :class="ebackupDatabase.role === 1 ? $style.primaryLink : $style.viceLink"
                           :to="`/db/oracle/${ebackupDatabase.id}`">
                {{ebackupDatabase.name}}
              </router-link>
              <i-icon :class="$style.databaseRoleIcon"
                      :name="ebackupDatabase.role === 1 ? 'zhu' : 'bei'"></i-icon>
            </h4>
            <el-form size="small"
                     label-width="100px"
                     label-position="left"
                     class="item-info">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="数据库版本">
                    <span>{{ ebackupDatabase.dbVersion }}</span>
                  </el-form-item>
                  <el-form-item label="实例名">
                    <span>{{ ebackupDatabase.instanceName }}</span>
                  </el-form-item>
                  <el-form-item label="登录名">
                    <span>{{ ebackupDatabase.loginName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="监听名">
                    <span>{{ ebackupDatabase.lsn }}</span>
                  </el-form-item>
                  <el-form-item label="设备环境">
                    <span>易备环境</span>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-tag :type="databaseStateStyle(ebackupDatabase.state)"
                            size="mini">{{ebackupDatabase.state | databaseStateFilter}}</el-tag>
                  </el-form-item>
                </el-col>
                <el-form-item label="所属业务系统">
                  <span>{{ ebackupDatabase.application }}</span>
                </el-form-item>
              </el-row>
            </el-form>
          </section>
        </el-col>
      </el-row>
    </header>
    <h3>操作记录</h3>
    <el-table :data="switches">
      <el-table-column label="切换时间"
                       width="220"
                       prop="switchTime"></el-table-column>
      <el-table-column label="切换内容"
                       min-width="200"
                       prop="content"></el-table-column>
      <el-table-column label="切换形式"
                       width="120"
                       :formatter="switchManualFormatter"
                       prop="manual"></el-table-column>
      <el-table-column label="状态"
                       width="120"
                       :formatter="switchStateFormatter"
                       prop="state"></el-table-column>
    </el-table>
  </section>
</template>
<script>
import takeoverMixin from '../mixins/takeoverMixins';
import IIcon from '@/components/IIcon';
import { fetchLinkByLinkId, fetchSwitches } from '../../api/oracle';
export default {
  name: 'DatabaseLinkDetail',
  props: {
    id: {
      type: String,
    },
  },
  mixins: [takeoverMixin],
  data() {
    return {
      linkState: {},
      productionDatabase: {},
      ebackupDatabase: {},
      switches: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchLinkByLinkId(this.id)
        .then(res => {
          const { primaryDatabase, viceDatabase, ...linkState } = res.data.data;
          this.linkState = linkState;
          this.productionDatabase = primaryDatabase;
          this.ebackupDatabase = viceDatabase;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchSwitches(this.id)
        .then(res => {
          const { data: switches } = res.data;
          this.switches = switches;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
  components: {
    IIcon,
  },
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
.header {
  padding-bottom: 10px;
}
.productionSection {
  h4 {
    text-align: center;
  }
}
.databaseRoleIcon {
  vertical-align: -0.2em;
  margin-left: 1em;
}
.linkSection {
  font-size: 0.8em;
  text-align: center;
}
.linkMsg {
  display: inline-block;
  text-align: left;
}
.ebackupSection {
  h4 {
    text-align: center;
  }
}
.switchIcon {
  width: 3em;
  height: 3em;
  cursor: pointer;
}
</style>
