<template>
  <section>
    <header class="detail-header">
      <div class="detail-panel">
        <el-row type="flex"
                justify="end">
          <el-col :span="1">
            <i-icon :name="systemType"></i-icon>
          </el-col>
          <el-col :span="23">
            <el-row type="flex"
                    align="middle">
              <el-col :span="8"
                      class="title">
                <h1>{{details.hostName}}</h1>
              </el-col>
              <el-col :span="12"
                      :offset="12"
                      class="action">
                <el-dropdown size="mini"
                             trigger="click"
                             placement="bottom"
                             @command="addPlanBtnClick">
                  <el-button size="mini"
                             plain>添加计划
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 文件系统备份计划 可以多次添加 -->
                    <el-dropdown-item command="backup">备份计划</el-dropdown-item>
                    <el-dropdown-item disabled
                                      command="restore">恢复计划</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button size="mini"
                           type="primary"
                           @click="detailsEditModal = true">编辑</el-button>
              </el-col>
            </el-row>
            <el-form v-loading="infoLoading"
                     label-position="left"
                     label-width="100px"
                     inline
                     size="small"
                     class="detail-form">
              <el-form-item label="操作系统：">
                <span>{{ details.osName }}</span>
              </el-form-item>
              <el-form-item label="主机IP：">
                <span>{{ details.hostIp }}</span>
              </el-form-item>
              <el-form-item label="服务器账号：">
                <span>{{ details.loginName }}</span>
              </el-form-item>
              <el-form-item label="服务器密码：">
                <!-- <span-toggle :value="oracle.password"></span-toggle> -->
                <span>●●●●●●●●</span>
              </el-form-item>
              <el-form-item label="所属系统：">
                <span>{{ details.application }}</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <file-host-update-modal host-type="windows"
                                :visible.sync="detailsEditModal"
                                @confirm="details = arguments[0]"
                                :file-host-info="details"></file-host-update-modal>
      </div>
    </header>
    <tab-panels :id="Number(id)"
                :type="systemType"
                :backup-plans="backupPlans"
                :restore-plans="restorePlans"
                :results="results"
                @backupplan:update="updateBackupPlan"
                @backupplan:delete="deleteBackupPlan"
                @restoreplan:add="addRestorePlan"
                @restoreplan:update="updateRestorePlan"
                @restoreplan:delete="deleteRestorePlan"
                :restoreRecords="restoreRecords"></tab-panels>
    <add-backup-plan :type="systemType"
                     :id="Number(id)"
                     :visible.sync="backupPlanCreateModalVisible"
                     @confirm="addBackupPlan"></add-backup-plan>
  </section>
</template>
<script>
import FileHostUpdateModal from '@/components/modal/FileHostUpdateModal';
import { detailPageMixin } from '../mixins/detailPageMixins';
import {
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
  fetchRestorePlans,
  fetchRestoreRecords,
} from '../../api/fileHost';

export default {
  name: 'FileHostDetail',
  mixins: [detailPageMixin],
  data() {
    return {
      updateResults: this.throttleMethod(fetchBackupResults),
    };
  },
  methods: {
    fetchData() {
      fetchOne(this.id)
        .then(res => {
          const { data: db } = res.data;
          this.details = db;
          this.infoLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
          this.$router.push({ name: 'fileHostList' });
        });

      fetchBackupPlans(this.id)
        .then(res => {
          const { data: plans } = res.data;
          this.backupPlans = plans;
        })
        .catch(error => {
          this.$message.error(error);
        });

      fetchBackupResults(this.id)
        .then(res => {
          const { data: result } = res.data;
          this.results = result;
        })
        .catch(error => {
          this.$message.error(error);
        });
      fetchRestorePlans(this.id).then(res => {
        const { data: plans } = res.data;
        this.restorePlans = plans;
      });
      fetchRestoreRecords(this.id).then(res => {
        const { data: records } = res.data;
        this.restoreRecords = records;
      });
    },
  },
  computed: {
    systemType() {
      return this.details && this.details.osName
        ? this.details.osName.toLowerCase()
        : '';
    },
  },
  components: {
    FileHostUpdateModal,
  },
};
</script>
<style scoped>
.detail-header {
  background-color: #ffffff;
  margin: -20px -20px 0 -20px;
  padding: 10px 10px 50px 10px;
}
.icon {
  position: relative;
  top: 17px;
  right: 0;
  font-size: 1.7em;
}
.detail-panel {
  margin-left: 20px;
}
.action {
  text-align: right;
}
.detail-form .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 40%;
}
.el-tabs {
  margin-top: -39px;
}
.filter-form {
  /* background-color: #ffffff; */
  padding-left: 20px;
}
.filter-form .el-form-item {
  margin-bottom: 0;
}
</style>
