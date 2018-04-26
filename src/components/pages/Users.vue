<template>
  <div id="app">
    <el-row type="flex" class="row-bg" justify="end">
      <el-col :span="19">用户管理</el-col>
      <el-col :span="5">
        <!-- 操作 -->
        <el-button type="primary" @click="dialogCreateVisible = true">添加用户</el-button>
        <el-button type="primary" icon="el-icon-delete" :disabled="delDisabled" @click="delAll()">删除
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中..."
          :data="tableUsers"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange">

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="loginName"
            label="账户"
            width="180">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            width="180"
            :filters="[{ text: '启用', value: 1 }, { text: '禁用', value: 0 }]"
            :filter-method="filterState"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 1">
                <!-- <el-tooltip content="Bottom center" placement="bottom" effect="light"> -->
                  <i class="el-icon-circle-check" style="color: #67C23A;font-size: 18px">
                  </i>
                <!-- </el-tooltip> -->
              </span>
              <span v-else>
                <i class="el-icon-remove" style="color: #909399;font-size: 18px"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="角色"
            width="300">
            <template slot-scope="scope">
              <span  v-for="item in scope.row.roles"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">&nbsp;&nbsp;{{ item.name }}&nbsp;&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 编辑用户 begin-->
    <el-dialog title="修改用户信息"
               :visible.sync="dialogUpdateVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#update" :model="update" ref="update" label-width="100px">
        <el-form-item label="账户" prop="loginName">
          <el-input v-model="update.loginName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="update.userName"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="update.roles" multiple collapse-tags placeholder="请选择">
                <el-option
                  v-for="item in rolesAll"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-radio-group v-model="update.state">
                <el-radio  :label="1">启用</el-radio>
                <el-radio  :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="密码">
          <el-tooltip content="重置后密码为：111111" placement="right">
            <el-button
              @click="handlereset(update.id)" :disabled="passDisable">重置密码</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
        <el-button type="primary" :loading="updateLoading" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 end-->
    <!-- 创建用户 begin-->
    <el-dialog title="创建用户"
               :visible.sync="dialogCreateVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#create"
               :model="create"
               status-icon :rules="rules"
               ref="create" label-width="100px">
        <el-form-item label="账户" prop="loginName">
          <el-input v-model="create.loginName" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="create.userName"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-col :span="12">
            <el-form-item>
              <el-select v-model="create.roles" multiple collapse-tags placeholder="请选择">
                <el-option
                  v-for="item in rolesAll"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-radio-group v-model="create.state">
                <el-radio  :label="1">启用</el-radio>
                <el-radio  :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="create.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input v-model="create.checkpass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" :loading="createLoading"  @click="createUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 创建用户 end-->
  </div>
</template>

<script>
import { createUserInfo, getUsersInfo, updateUserInfo, resetPassword, deleteUserInfo, deleteUsersInfo } from '../../api/user';

const rolesUser = [
  {
    id: 'role1',
    name: '普通1'
  },
  {
    id: 'role2',
    name: '普通'
  },
  {
    id: 'admin',
    name: '超级管理员'
  },
  {
    id: 'oracle-dba',
    name: 'oracle管理员'
  }
];

export default {
  created() {
    this.getUsers();
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.create.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      const data = this.tableUsers;
      let j = 0;
      for (let i = 0; i < data.length; i++) {
        if (value === data[i].loginName) {
          callback(new Error('账户已存在!'));
          j = 1;
        }
      }
      if (j === 0) {
        callback();
      }
    };

    return {
      loading: true,
      delDisabled: false,
      passDisable: false,
      createLoading: false,
      updateLoading: false,
      dialogCreateVisible: false, // 创建弹框的显示状态
      dialogUpdateVisible: false, // 编辑弹框的显示状态
      listIndex: '', // s索引
      rules: {
        loginName: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符' },
          { pattern: /^[A-Za-z0-9]+$/, message: '账户只能为字母和数字' },
          { validator: validateName }
        ],
        userName: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 25, message: '长度在 6 到 25 个字符' }
        ],
        checkpass: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ]
      },
      rolesAll: rolesUser,
      tableUsers: [],
      multipleSelection: [], // 列表复选框
      update: {
        id: '',
        loginName: '',
        userName: '',
        state: '',
        roles: []
      },
      create: {
        loginName: '',
        userName: '',
        state: 1,
        password: '',
        checkpass: '',
        roles: []
      }
    };
  },
  methods: {
    // 筛选状态
    filterState(value, row) {
      return row.state === value;
    },
    // 编辑
    handleEdit(index, row) {
      this.update.id = row.id;
      this.update.loginName = row.loginName;
      this.update.userName = row.userName;
      this.update.state = row.state;
      this.dialogUpdateVisible = true;
      this.passDisable = false;
      const data = row.roles;
      const arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].id);
      }
      this.update.roles = arr;
      // console.log(index, row);
      // 记录索引
      this.listIndex = index;
    },
    // 重置密码
    handlereset(value) {
      this.$confirm(`此操作将对账户 ${this.update.loginName} 的密码重置，是否继续？`, '提示', { type: 'warning' })
        .then(() => {
          // 向请求服务端删除
          const password = '111111';
          resetPassword(value, password).then((response) => {
            console.log(response.data.message);
            this.$message.success('重置密码成功!');
            this.passDisable = true;
          }).catch((error) => {
            console.log(error);
          });
        })
        .catch(() => {
          this.$message.info('已取消操作!');
        });
    },
    // 删除单个
    handleDelete(index, row) {
      this.$confirm(`此操作将永久删除账户 ${row.loginName} ，是否继续？`, '提示', { type: 'warning' })
        .then(() => {
          // 向请求服务端删除
          deleteUserInfo(row.id).then((response) => {
            console.log(response.data.message);
            this.$message.success(`成功删除了用户 ${row.loginName}!`);
            this.tableUsers.splice(index, 1);
            // this.getUsers();
          }).catch((error) => {
            console.log(error);
          });
        })
        .catch(() => {
          this.$message.info('已取消操作!');
        });
      // console.log(index, row);
    },
    // 复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取用户列表
    getUsers() {
      this.loading = true;
      getUsersInfo().then((response) => {
        console.log(response.data.message);
        console.log(response);
        this.tableUsers = response.data.data;
        // this.pagination.tableRows = this.tableUsers.length;
        this.loading = false;
      }).catch((error) => {
        console.log('获取用户列表失败:')
        console.log(error);
        this.loading = false;
      });
    },
    // 重置表单
    resetCreateUser() {
      this.$refs.create.resetFields();
      this.create.roles = [];
    },
    // 创建用户
    createUser() {
      this.$refs.create.validate((valid) => {
        if (valid) {
          this.createLoading = true;
          // console.log("创建用户数据:")
          // console.log(this.create);
          createUserInfo(this.create)
            .then((response) => {
              console.log(response.data.message);
              this.$message.success('创建用户成功！');
              this.dialogCreateVisible = false;
              this.createLoading = false;
              const data = response.data.data;
              const user = {
                id: data.id,
                loginName: data.loginName,
                userName: data.userName,
                state: data.state,
                roles: data.roles
              };
              this.tableUsers.push(user);
              console.log(user)
              this.resetCreateUser();
            }).catch((error) => {
              console.log('创建用户失败:')
              console.log(error);
              this.createLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 编辑用户
    updateUser() {
      this.updateLoading = true;
      // console.log("编辑用户数据:")
      // console.log(this.update);
      updateUserInfo(this.update.id, this.update).then((response) => {
        console.log(response.data.message);
        this.$message.success('编辑用户成功！');
        this.dialogUpdateVisible = false;
        this.updateLoading = false;
        // 根据索引，赋值到list制定的数
        let index = this.listIndex
        let data = response.data.data;
        // this.tableUsers[index] = data;
        this.tableUsers[index].id = data.id;
        this.tableUsers[index].loginName = data.loginName;
        this.tableUsers[index].userName = data.userName;
        this.tableUsers[index].state = data.state;
        this.tableUsers[index].roles = data.roles;
      }).catch((error) => {
        console.log('编辑用户失败:')
        console.log(error);
        this.updateLoading = false;
      });
    },
    // 批量删除
    delAll() {
      this.$confirm(`此操作将永久删除 ${this.multipleSelection.length} 条用户信息, 是否继续?`, '提示', {
        type: 'warning'
      })
        .then(() => {
          let ids = [];
          this.multipleSelection.map((item)=> {
            ids.push(item.id);
          })
          // 向请求服务端删除
          deleteUsersInfo(ids).then((response) => {
            // console.log("删除用户成功:")
            console.log(response.data.message);
            this.$message.success(`删除了 ${this.multipleSelection.length} 条用户信息!`);
            this.getUsers();
          }).catch((error) => {
            console.log('删除用户失败:')
            console.log(error);
            this.$message.error('删除失败!');
          });
        })
        .catch(() => {
          this.$message.info('已取消操作!');
        });
    }
  },
};
</script>
