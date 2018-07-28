<template>
  <section>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>备份存储策略</span>
        <el-button style="float: right;"
                    type="primary"
                    size="small"
                    @click="dialogVisible=true">修改</el-button>
      </div>
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="6"></el-col>
          <el-col :span="6" class="el-col-left">oracle备份集保留策略：</el-col>
          <el-col :span="6">{{ this.item.oracleBackupStrategy }}</el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="6"></el-col>
          <el-col :span="6" class="el-col-left">sqlserver备份集保留策略：</el-col>
          <el-col :span="6">{{ this.item.sqlserverBackupStrategy }}</el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="6"></el-col>
          <el-col :span="6" class="el-col-left">文件备份集存储策略：</el-col>
          <el-col :span="6">{{ this.item.fileBackupStrategy }}</el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="6"></el-col>
          <el-col :span="6" class="el-col-left">虚拟机备份集保留策略：</el-col>
          <el-col :span="6">{{ this.item.vmBackupStrategy }}</el-col>
          <el-col :span="6"></el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog title="修改策略"
              :visible.sync="dialogVisible"
              :before-close="closeDialog"
              @close="modalClosed"
              @open="modalOpened">
      <el-form ref="updateForm"
               status-icon
               :model="formData"
               label-width="180px"
               size="small">
        <el-form-item label="oracle备份集保留策略" prop="oracleBackupStrategy">
          <el-input-number v-model="formData.oracleBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="sqlserver备份集保留策略" prop="sqlserverBackupStrategy">
          <el-input-number v-model="formData.sqlserverBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="文件备份集存储策略" prop="fileBackupStrategy">
          <el-input-number v-model="formData.fileBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="虚拟机备份集保留策略" prop="vmBackupStrategy">
          <el-input-number v-model="formData.vmBackupStrategy" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary"
                    @click="submitForm"
                    :loading="btnLoading">确定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { fetchAll, modifyOne } from '../../api/backupstrategy';
import isEqual from 'lodash/isEqual';
export default {
  name: 'StrategyManager',
  data() {
    return {
      dialogVisible: false,
      btnLoading: false,
      formData: {},
      originFormData: {},
      items: [],
      item: {},
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data
          this.items = data;
          this.item=this.items[0];
        })
        .catch(error => {
          error => Promise.reject(error);
        })
    },
    submitForm() {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.btnLoading=true;
          modifyOne(this.formData)
            .then(res => {
              this.dialogVisible = false;
              const { data, message } = res.data;
              this.$message.success(message);
              this.items[0]=data;
              this.item=this.items[0];
            })
            .catch(error => {
              this.$message.error(error);
            })
            .then(() => {
              this.btnLoading=false;
            });
        } else {
          return false;
        }
      });
    },
    modalOpened() {
      this.originFormData = { ...this.item };
      this.formData = { ...this.item };
    },
    closeDialog(done) {
      if (!isEqual(this.formData, this.originFormData)) {
        this.$confirm('有未保存的修改，是否退出？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      } else {
        this.dialogVisible = false;
      }
    },
    modalClosed() {
      this.$refs.updateForm.clearValidate();
    },
  }
}
</script>
<style scoped>
.text {
    font-size: 14px;
  }
.box-card {
  width: 100%;
}
.item .el-col {
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
}
.text .el-col-left {
  text-align: right;
}
</style>
