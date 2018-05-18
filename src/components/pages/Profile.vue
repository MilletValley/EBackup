<template>
    <div>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="21">个人中心</el-col>
        <el-col :span="3">
          <!-- 操作 -->
          <el-button type="primary"
              @click="update()">修改信息</el-button>
        </el-col>
      </el-row>
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="用户ID">
            <span>{{ userId }}</span>
        </el-form-item>
        <el-form-item label="登录名">
          <span>{{ loginName }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <span>{{ roles[0].name+" "+roles[1].name }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ state==1?'启用':'禁用' }}</span>
        </el-form-item>
        <el-form-item label="用户名">
          <span>{{ userName }}</span>
        </el-form-item>
      </el-form>
          <el-dialog title="更改信息"
                    :visible.sync="dialogVisible"
                    width="30%"
                    @close="closeDialog('form')">
              <el-form ref="form"
                      status-icon
                      :model="form"
                      :rules="rules"
                      label-width="80px">
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
                  <el-form-item>
                    <el-button type="primary"
                              @click="submitForm('form')">提 交</el-button>
                    <el-button @click="resetForm('form')">重 置</el-button>
                  </el-form-item>
              </el-form>
          </el-dialog>
      </div>
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
      form: {
        newUsername: '',
        newPassword: '',
        oldPassword: '',
      },
      rules: {
        newUsername: [
          {
            validator:checkName,
            trigger: 'blur'
          },
        ],
        oldPassword: [
          {
            validator:checkOldpass,
            trigger: 'blur'
          },
        ],
        newPassword: [
          { 
            validator: validatePass,
            trigger: 'blur' 
          },
        ],
        checkPass: [
          {
            validator: validatePass2,
            trigger: 'blur'
          },
        ],
      },
    };
  },
  methods: {
    update(){
      if(this.$store.getters.state==0)
        this.$message.error('无法修改');
      else
        this.dialogVisible = true;
    },
    closeDialog(form) {
      this.dialogVisible=false;
      this.$refs['form'].resetFields();
    },
    submitForm(form) {
      this.dialogVisible = false;
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$store.dispatch("updateUserInfo");
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
  },
  computed:{
    ...mapGetters(['userId','loginName','roles','state','userName']),
  }
};
</script>
<style>
  .demo-table-expand {
    font-size: 0;
    background-color: #fff;
  }
  .demo-table-expand label {
    width: 150px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    display: block;
    margin:0 auto;
  }
</style>
