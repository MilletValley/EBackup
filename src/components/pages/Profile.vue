<template>
    <div>
        <div>
            用户名：{{userName}}
        </div>
        <div>
            密码：{{password}}
        </div>
        <el-button type="warning"
                   @click="dialogVisible = true">修改</el-button>

        <el-dialog title="更改信息"
                   :visible.sync="dialogVisible"
                   width="30%">
            <el-form ref="form"
                     :model="form"
                     :rules="rules"
                     label-width="80px">
                <el-form-item label="新用户名"
                              required
                              prop="new_name">
                    <el-input v-model="form.newUsername"></el-input>
                </el-form-item>
                <el-form-item label="新密码"
                              required
                              prop="new_pass">
                    <el-input type="password"
                              v-model="form.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="原始密码"
                              required
                              prop="old_pass">
                    <el-input type="password"
                              v-model="form.oldPassword"></el-input>
                </el-form-item>
                <span slot="footer"
                      class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary"
                               @click="dialogVisible = false;submitForm()">确 定</el-button>
                </span>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      dialogVisible: false,
      form: {
        newUsername: '',
        newPassword: '',
        oldPassword: '',
      },
      rules: {
        new_name: [
          {
            required: 'true',
            message: '请输入新用户名',
            trigger: 'change,blur',
          },
        ],
        new_pass: [
          { required: 'true', message: '请输入新密码', trigger: 'change,blur' },
        ],
        old_pass: [
          {
            required: 'true',
            message: '请输入原始密码',
            trigger: 'change,blur',
          },
        ],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(
        function(result) {
          if (result) {
            // 验证通过,调用module里的updateUserInfo方法
            if (userName == form.oldPassword) {
              this.$store.dispatch('updateUserInfo', this.form);
            } else {
              alert('密码错误');
            }
          } else {
            alert('表达验证不合法');
          }
        }.bind(this)
      );
    },
  },
  computed: {
    ...mapGetters(['userName', 'password']),
  },
};
</script>
