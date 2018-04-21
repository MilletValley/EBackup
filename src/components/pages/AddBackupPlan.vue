<template>
  <section>
    <el-button type="primary" @click="dialogCreateVisible = true">添加数据库备份配置</el-button>
    <!-- 创建数据库备份配置页面 begin-->
    <el-dialog title="添加数据库备份配置"
               :visible.sync="dialogCreateVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-form id="#create"
               :model="create"
               :rules="rules"
               ref="create" label-width="100px">
        <el-form-item label="计划时间" prop="startTime">
          <el-date-picker
            v-model="create.startTime"
            :picker-options="pickerStartTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备份路径">
          <el-input v-model="create.backupUrl"></el-input>
        </el-form-item>
        <el-form-item label="备份机制">
          <el-form-item>
            <el-radio-group v-model="create.backupStrategy">
              <el-radio :label="0" :disabled="backupStrategyParent[0].value">全备+增备</el-radio>
              <el-radio :label="1" :disabled="backupStrategyParent[1].value">全备+日志</el-radio>
              <el-radio :label="2" :disabled="backupStrategyParent[2].value">增备+日志</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form-item>
        <el-form-item label="备份策略">
          <el-radio-group v-model="tmpTimeStrategy">
            <el-radio :label="0" :disabled="timeStrategyParent[0].value">单次</el-radio>
            <el-radio :label="1" :disabled="timeStrategyParent[1].value">每天</el-radio>
            <el-radio :label="2" :disabled="timeStrategyParent[2].value">每周</el-radio>
            <el-radio :label="3" :disabled="timeStrategyParent[3].value">每月</el-radio>
            <el-radio :label="4" :disabled="timeStrategyParent[4].value">频率</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单次备份" v-show="isShowOnce" prop="singleTime">
          <el-date-picker
            v-model="create.singleTime"
            type="datetime"
            :picker-options="pickerSingleTime"
            placeholder="请选择日期时间"
            default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="每月备份" v-show="isShowDay" prop="datePoints">
          <el-select v-model="create.datePoints" multiple placeholder="请选择日期">
            <el-option
              v-for="item in datePointsInfo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每周备份" v-show="isShowWeek" prop="weekPoints">
          <el-select v-model="create.weekPoints" multiple placeholder="请选择周几">
            <el-option
              v-for="item in weekPointsInfo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="间隔小时" v-show="isShowTimeRate">
          <el-input-number v-model="create.timeIntervel" :step="2" :min="2" :max="24"></el-input-number>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in create.timePoints"
          :label="'备份时间'"
          :key="domain.key"
          prop="timePoints"
          v-show="isShowTime"
        >
          <el-col :span="11">
            <el-time-select
              v-model="domain.value"
              :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
              placeholder="请选择时间点">
            </el-time-select>
          </el-col>
          <el-col :span="11">
            <el-button @click.prevent="removeTimePoint(domain)" v-show="index !== 0">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item v-show="isShowTime">
          <el-button type="primary" @click="addTimePoint">新增时间点</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" :loading="createLoading" @click="createOracle">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 创建数据库备份配置页面 end-->
  </section>
</template>
<script>
  import {createOracleBackupPlans} from '../../api/oracle';
  var datePoints = [];
  for (var i = 1; i < 32; i++) {
      datePoints.push({ value: i, label: i + '号' });
  }
  var weekPoints = [{
    value: '1',
    label: '周一'
  }, {
    value: '2',
    label: '周二'
  }, {
    value: '3',
    label: '周三'
  }, {
    value: '4',
    label: '周四'
  }, {
    value: '5',
    label: '周五'
  }, {
    value: '6',
    label: '周六'
  }, {
    value: '7',
    label: '周日'
  }]
  export default {
    props: ['backupStrategyParent', 'timeStrategyParent'],
    name: 'AddBackupPlan',
    data() {
      var valiSingleTime = (rule, value, callback) => {
        if (this.tmpTimeStrategy === 0) {
          if (!value) {
            callback(new Error('请选择单次备份时间'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      var valiTimePoints = (rule, value, callback) => {
        if (this.tmpTimeStrategy === 1 || this.tmpTimeStrategy === 2 || this.tmpTimeStrategy === 3) {
          var i = 0;
          value.map((item) => {
            if (item.value != '') {
              callback();
              i = 1;
            }
          });
          if (i === 0) {
            callback(new Error('时间请至少选择一个'));
          }
        } else {
          callback();
        }
      };
      var valiWeekPoints = (rule, value, callback) => {
        if (this.tmpTimeStrategy === 2) {
          if (value.length === 0) {
            callback(new Error('每周请至少选择一天'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      var valiDatePoints = (rule, value, callback) => {
        if (this.tmpTimeStrategy === 3) {
          if (value.length === 0) {
            callback(new Error('每月请至少选择一天'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        createLoading: false,
        dialogCreateVisible: false,
        isShowOnce: true,
        isShowTime: false,
        isShowTimeRate: false,
        isShowDay: false,
        isShowWeek: false,
        weekPointsInfo: weekPoints,
        datePointsInfo: datePoints,
        create: {
          timePoints: [{
            value: ''
          }],
          startTime: '',
          backupStrategy: 0,
          timeIntervel: '',
          singleTime: '',
          weekPoints: [],
          datePoints: [],
          backupUrl: '',
        },
        tmpTimeStrategy: 0,
        rules: {
          startTime: [
            {required: true, message: '请选择开始时间', trigger: 'change'}
          ],
          singleTime: [
            {validator: valiSingleTime, trigger: 'change'}
          ],
          weekPoints: [
            {validator: valiWeekPoints, trigger: 'change'}
          ],
          timePoints: [
            {validator: valiTimePoints, trigger: 'change'}
          ],
          datePoints: [
            {validator: valiDatePoints, trigger: 'change'}
          ]
        },
        pickerSingleTime: {
          disabledDate: (time) => {
            return time.getTime() < new Date(this.create.startTime).getTime();
          }
        },
        pickerStartTime: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime();
          }
        }
      };
    },
    methods: {
      // 重置表单
      resetCreateOracle() {

        console.log(this.create.timePoints)
        this.$refs.create.resetFields();
        console.log(this.create)
      },
      createOracle() {
        this.$refs.create.validate((valid) => {
          if (valid) {
            this.createLoading = true;
            var arr = [];
            this.create.timePoints.map((item) => {
              arr.push(item.value);
            });
            var oracle = {
              startTime: this.create.startTime,
              backupStrategy: this.create.backupStrategy,
              timeIntervel: this.create.timeIntervel,
              timeStrategy: this.tmpTimeStrategy,
              singleTime: this.create.singleTime,
              weekPoints: this.create.weekPoints,
              datePoints: this.create.datePoints,
              timePoints: arr,
              backupUrl: this.create.backupUrl,
            }
            console.log('POSE数据:')
            console.log(oracle)
            console.log(this.create)
            // 向请求服务端id已知
            var id = 1000;
            createOracleBackupPlans(id, oracle).then((response) => {
              console.log(response.data.message);
              this.$message.success('创建数据库备份配置成功!');
              this.dialogCreateVisible = false;
              this.createLoading = false;
              this.create.timePoints.splice(1, this.create.timePoints.length - 1);
              setTimeout(this.resetCreateOracle(), 5000)
              //;
            }).catch((error) => {
              console.log('创建数据库备份配置失败:')
              console.log(error);
              this.createLoading = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      removeTimePoint(item) {
        var index = this.create.timePoints.indexOf(item)
        if (index !== -1) {
          this.create.timePoints.splice(index, 1)
        }
      },
      addTimePoint() {
        this.create.timePoints.push({
          value: '',
          key: Date.now()
        });
      },
      getTimeStrategy(val) {
        if (val === 0) {
          this.emptyCreateInfo();
          this.isShowOnce = true;
        } else if (val === 1) {
          this.emptyCreateInfo();
          this.isShowTime = true;
        } else if (val === 2) {
          this.emptyCreateInfo();
          this.isShowTime = true;
          this.isShowWeek = true;
        } else if (val === 3) {
          this.emptyCreateInfo();
          this.isShowTime = true;
          this.isShowDay = true;
        } else if (val === 4) {
          this.emptyCreateInfo();
          this.isShowTimeRate = true;
        }
      },
      emptyCreateInfo() {
        this.isShowOnce = false;
        this.isShowTime = false;
        this.isShowTimeRate = false;
        this.isShowDay = false;
        this.isShowWeek = false;
      }
    },
    watch: {
      tmpTimeStrategy: function (newVal, oldVal) {
        this.getTimeStrategy(newVal);
      }
    },
  };
</script>
