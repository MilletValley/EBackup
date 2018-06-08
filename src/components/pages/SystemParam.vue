<template>
  <section>
    <el-form inline
             size="small">
      <el-form-item style="float: right;">
        <el-button type="primary"
                   @click="createModalVisible = true">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="systemParameters"
              style="width: 100%">
      </el-table-column>
            <el-table-column prop="sysType"
                       label="系统类别"
                       :formatter="judgeSystem"
                       width="150"
                       align="center"></el-table-column>
      </el-table-column>
            <el-table-column prop="useType"
                       label="使用类别"
                       :formatter="judgeUse"
                       width="140"
                       align="center"></el-table-column>
      <el-table-column prop="shareUrl"
                       label="地址"
                       width="190"
                       align="center"></el-table-column>
      <el-table-column prop="mountUrl"
                       label="路径"
                       width="240"
                       align="center"></el-table-column>
      <el-table-column prop="loginName"
                       label="登录账号"
                       width="140"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       width="190"
                       header-align="center"
                       align="center"
                       prop="state">
        <template slot-scope="scope">
          <el-button type="success"
                     icon="el-icon-check"
                     circle
                     v-if="scope.row.state==0"
                     :class="$style.miniCricleIconBtn"
                     @click="changeState(scope.$index, scope.row)"
                     size="mini"></el-button>
          <el-button type="info"
                     icon="el-icon-check"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="changeState(scope.$index, scope.row)"
                     v-else></el-button>
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="handleUpdate(scope.$index, scope.row)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     :class="$style.miniCricleIconBtn"
                     @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改 -->
    <el-dialog :visible.sync="updateModalVisible"
               @close="updateClose">
      <span slot="title">
        修改设备
        <span style="color: #999999">（ID: {{updateRow.id}}）</span>
      </span>
      <el-form :model="updateRow"
               ref="updateRow"
               :rules="rules"
               label-width="110px"
               size="small">
        <el-form-item label="系统类别"
                      prop="sysType">
          <el-radio v-model="updateRow.sysType" :label="0">通用</el-radio>
          <el-radio v-model="updateRow.sysType" :label="1">Windows</el-radio>
          <el-radio v-model="updateRow.sysType" :label="2">Linux</el-radio>
        </el-form-item>
        <el-form-item label="使用类别"
                      prop="useType">
          <el-radio v-model="updateRow.useType" :label="1">oracle</el-radio>
          <el-radio v-model="updateRow.useType" :label="2">sqlserver</el-radio>
          <el-radio v-model="updateRow.useType" :label="3">文件</el-radio>
          <el-radio v-model="updateRow.useType" :label="4">虚拟机</el-radio>
        </el-form-item>
        <el-form-item label="地址"
                      prop="shareUrl">
          <el-input v-model="updateRow.shareUrl"></el-input>
        </el-form-item>
        <el-form-item label="路径"
                      prop="mountUrl">
          <el-input v-model="updateRow.mountUrl"></el-input>
        </el-form-item>
        <el-form-item label="状态"
                      prop="state">
          <el-radio v-model="updateRow.state" :label="0">启用</el-radio>
          <el-radio v-model="updateRow.state" :label="1">禁用</el-radio>
        </el-form-item>
        <el-form-item label="系统登录名"
                      prop="loginName">
          <el-input v-model="updateRow.loginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码"
                      prop="password">
          <input-toggle v-model="updateRow.password"></input-toggle>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="updateConfirm">确定</el-button>
        <el-button @click="updateModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 添加 -->
    <el-dialog :visible.sync="createModalVisible"
               @close="createClose">
      <span slot="title">
        添加参数
      </span>
      <el-form :model="createRow"
               ref="createRow"
               :rules="rules"
               label-width="110px"
               size="small">
        <el-form-item label="系统类别"
                      prop="sysType">
          <el-radio v-model="createRow.sysType" :label="0">通用</el-radio>
          <el-radio v-model="createRow.sysType" :label="1">Windows</el-radio>
          <el-radio v-model="createRow.sysType" :label="2">Linux</el-radio>
        </el-form-item>
        <el-form-item label="使用类别"
                      prop="useType">
          <el-radio v-model="createRow.useType" :label="1">oracle</el-radio>
          <el-radio v-model="createRow.useType" :label="2">sqlserver</el-radio>
          <el-radio v-model="createRow.useType" :label="3">文件</el-radio>
          <el-radio v-model="createRow.useType" :label="4">虚拟机</el-radio>
        </el-form-item>
        <el-form-item label="地址"
                      prop="shareUrl">
          <el-input v-model="createRow.shareUrl"></el-input>
        </el-form-item>
        <el-form-item label="路径"
                      prop="mountUrl">
          <el-input v-model="createRow.mountUrl"></el-input>
        </el-form-item>
        <el-form-item label="状态"
                      prop="state">
          <el-radio v-model="createRow.state" :label="0">启用</el-radio>
          <el-radio v-model="createRow.state" :label="1">禁用</el-radio>
        </el-form-item>
        <el-form-item label="系统登录名"
                      prop="loginName">
          <el-input v-model="createRow.loginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码"
                      prop="password">
          <input-toggle v-model="createRow.password"></input-toggle>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="createConfirm">确定</el-button>
        <el-button @click="createModalVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { fetchAll, modifyOne, createOne, deleteOne } from '../../api/systemParam';
import { sysTypeMapping, useTypeMapping } from '../../utils/constant';
import InputToggle from '@/components/InputToggle';

export default {
  name: 'SystemParam',
  data() {
    return {
      systemParameters: [],
      createModalVisible: false,
      updateModalVisible: false,
      listIndex: '',
      updateRow: {
        id: -1,
        shareUrl: '',
        loginName: '',
        password: '',
        mountUrl: '',
        useType: -1,
        sysType: -1,
        state: -1,
      },
      createRow: {
        shareUrl: '',
        loginName: '',
        password: '',
        mountUrl: '',
        useType: 1,
        sysType: 0,
        state: 0,
      },
      rules: {
        shareUrl: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          {
            pattern:
              '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          },
        ],
        mountUrl: [
          { required: true, message: '请输入路径', trigger: 'blur' },
          {
            pattern: '(^//.|^/|^[a-zA-Z])?:?/.+(/$)?',
            message: '路径格式不正确',
            trigger: 'blur',
          },
        ],
        loginName: [
          {
            required: true,
            message: '请输入登录账号',
            trigger: 'blur',
          },
          { length: 20, message: '长度在20个字符以内', trigger: 'blur' },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur',
          },
          {
            pattern: '^[^\\s]*$',
            message: '不能包含空格',
            trigger: ['blur'],
          },
        ],
      },
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchAll()
        .then(res => {
          const { data } = res.data;
          this.systemParameters = data;
          this.systemParameters.sort((a,b) =>
            {return b.sysType-a.sysType});
        })
        .catch(error => {
          error => Promise.reject(error);
        });
    },
    judgeSystem(data) {
      return sysTypeMapping[data.sysType];
    },
    judgeUse(data) {
      return useTypeMapping[data.useType];
    },
    changeState(index, row) {
      let newRow = Object.assign({},this.systemParameters.find(list => list.id === row.id));
      newRow.state = newRow.state===0?1:0;
      modifyOne(newRow)
        .then(response => {
          this.systemParameters.splice(index, 1, response.data.data);
        })
        .catch(error => {
          this.$message.error(error);
        })
    },
    handleUpdate(index, row) {
      const newRow = Object.assign({},this.systemParameters.find(list => list.id === row.id));
      this.updateRow = newRow;
      this.listIndex = index;
      this.updateModalVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm(
        `此操作将永久删除此参数 ，是否继续？`,
        '提示',
        { type: 'warning' }
      )
      .then(() => {
        deleteOne(row.id)
          .then(response => {
            this.$message.success(
              '删除成功'
            );
            this.systemParameters.splice(index, 1);
          })
          .catch(error => {
            this.$message.error(error);
          });
      })
      .catch(() => {
        this.$message.info('已取消操作!');
      });
    },
    updateConfirm() {
      this.$refs.updateRow.validate(valid => {
        if (valid) {
          modifyOne(this.updateRow)
          .then(response => {
            this.$message.success(response.data.message);
            this.updateModalVisible = false;
            this.systemParameters.splice(this.listIndex, 1, response.data.data);
          })
          .catch(error => {
            this.$message.error(error);
          })
        } else {
          return false;
        }
      });
    },
    createConfirm() {
      this.$refs.createRow.validate(valid => {
        if (valid) {
          createOne(this.createRow)
            .then(response => {
              this.$message.success(response.data.message);
              this.createModalVisible = false;
              this.systemParameters.push(response.data.data);
            })
            .catch(error => {
              this.$message.error(error);
            });
        } else {
          return false;
        }
      });
    },
    createClose() {
      this.$refs['createRow'].resetFields();
    },
    updateClose() {
    this.$refs['updateRow'].clearValidate();
    },
  },
  components: {
    InputToggle,
  }
};
</script>
<style lang="scss" module>
@import '../../style/common.scss';
</style>
