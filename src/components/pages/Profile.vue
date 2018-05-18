<template>
    <div>
      <div style="overflow: hidden; margin-top: -10px; margin-bottom: 10px;">
        <el-button type="primary"
            @click="update()" style="float: right; padding: 10px 15px;">修改信息</el-button>
      </div>
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
                              @click="submitForm('form')">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
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
          },{
            required: true,
            message: '请输入新用户名',
          }, {
              pattern: /^[\u4E00-\u9FA5]+$/,
              message: '用户名只能为中文'
          }, {
              min: 2,
              max: 4,
              message: '长度在 2 到 4 个字符'
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
          this.$store.dispatch("updateUserInfo",this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
    width: 280px;
    display: block;
    margin:0 auto;
  }
</style>
