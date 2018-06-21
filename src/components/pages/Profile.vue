<template>
    <section>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
          <el-button style="float: right;"
                     type="primary"
                     size="small"
                     @click="update()">修改</el-button>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6"></el-col>
            <el-col :span="6" class="el-col-left">用户ID：</el-col>
            <el-col :span="6">{{ userId }}</el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6"></el-col>
            <el-col :span="6" class="el-col-left">用户名：</el-col>
            <el-col :span="6">{{ userName }}</el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6"></el-col>
            <el-col :span="6" class="el-col-left">登录名：</el-col>
            <el-col :span="6">{{ loginName }}</el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6"></el-col>
            <el-col :span="6" class="el-col-left">角色：</el-col>
            <el-col :span="6">{{ roles[0].name+" "+roles[1].name }}</el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
        <div class="text item">
          <el-row :gutter="20">
            <el-col :span="6"></el-col>
            <el-col :span="6" class="el-col-left">状态：</el-col>
            <el-col :span="6">{{ state==1?'启用':'禁用' }}</el-col>
            <el-col :span="6"></el-col>
          </el-row>
        </div>
      </el-card>
      <el-dialog title="更改信息"
                :visible.sync = "dialogVisible"
                :before-close = "closeDialog">
          <el-form ref="form"
                  status-icon
                  :model="form"
                  :rules="rules"
                  label-width="110px">
            <el-form-item label="新用户名"
                          prop="newUsername">
              <el-input v-model="form.newUsername"></el-input>
            </el-form-item>
              <el-form-item label="新密码"
                            prop="newPassword">
                <el-input type="password"
                          v-model="form.newPassword"></el-input>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop="checkPass">
                <el-input type="password"
                          v-model="form.checkPass"></el-input>
              </el-form-item>
              <el-form-item label="原始密码"
                            prop="oldPassword">
                <el-input type="password"
                          v-model="form.oldPassword"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button type="primary"
                       @click="submitForm('form')">确定</el-button>
            <el-button @click="cancel('form')">取消</el-button>
          </span>
        </el-dialog>
      </section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { changeUserInfo } from '../../api/user';

export default {
  name: 'Profile',
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入新用户名'));
      } else {
        callback();
      }
    };
    var checkOldpass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入原始密码'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      isEdit: false,
      isClose: false,
      form: {
        newUsername: '',
        newPassword: '',
        oldPassword: '',
        checkPass: '',
      },
      rules: {
        newUsername: [
          {
            validator:checkName,
            trigger: 'blur'
          },{
            required: true,
            message: '请输入新用户名',
          }, {
              pattern: /^[0-9a-zA-Z\u4E00-\u9FA5]+$/,
              message: '只支持数字、大小写字母和中文字符'
          }, {
              min: 2,
              max: 8,
              message: '长度在 2 到 8 个字符'
          }
        ],
        oldPassword: [
          {
            validator:checkOldpass,
            trigger: 'blur'
          }, {
            required: true,
            message: '请输入原始密码',
          },
        ],
        newPassword: [
          {
            validator: validatePass,
            trigger: 'blur'
          }, {
            required: true,
            message: '请输入新密码',
          }, {
            min: 6,
            max: 30,
            message: '长度在 6 到 30 个字符'
          }, {
            pattern: /^(\w){6,20}$/,
            message: '只能输入字母、数字、下划线'
          }
        ],
        checkPass: [
          {
            validator: validatePass2,
            trigger: 'blur'
          }, {
            required: true,
            message: '请确认新密码',
          }
        ],
      },
    };
  },
  methods: {
    update(){
      if(this.$store.getters.state==0)
        this.$message({
          showClose: true,
          message: '无法修改',
          center: true,
          type: 'error'
        });
      else{
        this.dialogVisible = true;
      }
    },
    closeDialog() {
      if(this.isEdit && (this.form.newUsername!=""||this.form.newPassword!=""||this.form.oldPassword!=""||this.form.checkPass!="")){
        this.isEdit = false;
        this.isClose = false;
        this.$confirm('有未保存的修改，是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = false;
          this.$refs['form'].resetFields();
          this.isClose = true;
        }).catch(() => {});
      } else {
        this.dialogVisible = false;
        this.$refs['form'].resetFields();
      }
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.$store.dispatch("updateUserInfo",this.form);
        } else {
          return false;
        }
      });
    },
    cancel(form) {
      this.dialogVisible = false;
      this.$refs['form'].resetFields();
    }
  },
  watch: {
    'form':{
    handler:function(newForm,oldForm){
      if(!this.isClose)
      {
        this.isEdit = true;
      }
      else
        this.isClose = false;
    },
    deep:true,
    }
  },
  computed:{
    ...mapGetters(['userId','loginName','roles','state','userName']),
  }
};
</script>
<style scoped>
.text {
    font-size: 14px;
  }
.box-card {
  width: 100%;
}
.el-col {
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
}
.el-col-left {
  text-align: right;
}
</style>
