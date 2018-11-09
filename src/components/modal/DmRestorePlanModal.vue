<template>
  <el-dialog custom-class="min-width-dialog"
             :before-close="beforeModalClose"
             @open="modalOpened"
             @close="modalClosed"
             :visible.sync="modalVisible">
    <span slot="title">
      {{title}}
      <span style="color: #999999"> (ID: {{restorePlan.id}})</span>
    </span>
    <el-form size="small"
             label-position="right"
             label-width="100px"
             :model="formData"
             :rules="rules"
             ref="restorePlanCreateForm">
        <el-form-item label="计划名称"
                      prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="恢复设备"
                      prop="hostIp">
          <span slot="label">恢复设备
              <el-popover placement="top" trigger="hover"
                  content="类型为易备环境的设备"
                  >
                  <i class="el-icon-info" slot="reference"></i>
              </el-popover>
          </span>  
          <el-select v-model="formData.hostIp"
                      style="width: 100%;">
            <el-option v-for="host in availableHostsForRestore"
                        :key="host.id"
                        :value="host.hostIp"
                        :label="`${host.name}(${host.hostIp})`">
              <span style="float: left">{{ host.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ host.hostIp }}</span>
            </el-option>
          </el-select>
        </el-form-item>
				<el-row>
					<el-col :span="12" >
						<el-form-item label="数据库名"
													prop="dbName">
							<el-input v-model="formData.dbName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="端口号"
													prop="dbPort">
							<el-input v-model.number="formData.dbPort"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
        
				<el-row>
					<el-col :span="12">
						<el-form-item label="登录名"
													prop="loginName">
							<el-input v-model="formData.loginName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="登录密码"
													prop="password">
							<input-toggle v-model="formData.password"
														:hidden.sync="hiddenPassword"></input-toggle>
						</el-form-item>
					</el-col>
				</el-row>
			
      	<time-interval :form-data="formData" :type="type" ref="timeIntervalComponent"></time-interval>
    </el-form>
    <span slot="footer">
      <el-button type="primary"
                 @click="confirmBtnClick"
                 :loading="btnLoading">确定</el-button>
      <el-button @click="cancelButtonClick">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import isEqual from 'lodash/isEqual';
import {
  restoreTimeStrategyMapping as strategys,
  weekMapping,
} from '../../utils/constant';
import { createRestorePlan as createSqlserverRestorePlan } from '../../api/sqlserver';
import { createRestorePlan as createOracleRestorePlan } from '../../api/oracle';
import { createRestorePlan as createMySqlRestorePlan } from '../../api/mysql';
import { createRestorePlan as createDB2RestorePlan } from '../../api/db2';
import { restorePlanModalMixin } from '../mixins/backupPlanModalMixin';

import TimeInterval from '@/components/common/TimeInterval';

const baseFormData = {
	name: '',
	hostIp: '',
	dbName: '',
	dbPort: '',
	loginName: '',
	password: '',
	startTime: '',
	singleTime: '',
	datePoints: [],
	timePoints: [{ value: '00:00', key: Date.now() }],
	weekPoints: [], // 必须初始化为数组，checkbox group才能识别
	timeStrategy: 1, // 默认单次执行
};

export default {
  name: 'RestorePlanCreateModal',
  mixins: [restorePlanModalMixin],
  components: {
    TimeInterval,
  },
  data() {
    return {
      type: 'dm',
      formData: Object.assign({}, baseFormData), // 备份数据
      originFormData: Object.assign({}, baseFormData), // 原始数据
      rules: {
				name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
				hostIp: [
          { required: true, message: '请输入设备', trigger: 'blur' },
          {
            pattern:
              '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
            message: 'IP地址不正确',
            trigger: 'blur',
          },
        ],
				dbName: [
					{
						required: true,
						message: `请输入数据库名`,
						trigger: 'blur',
					},
				],
				dbPort: [{
					required: true,
					message: '请输入端口号',
					trigger: 'blur'
				},
				{
					pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
					message: '请输入0-65535之间的数字',
					trigger: 'blur'
				}],
				loginName: [
					{ required: true, message: '请输入登录名', trigger: 'blur' },
				],
				password: [
				  { required: true, message: '请输入登录密码', trigger: 'blur' },
				],
      },
    };
  },
  methods: {
		confirmBtnClick() {
      this.$refs.restorePlanCreateForm.validate(valid => {
				this.$refs.timeIntervalComponent.validate().then(res => {
					if (valid && res) {
						let data = this.pruneFormData(this.formData);
						if(this.action === 'update'){
							data.id = this.restorePlan.id;
							data.config.id = this.restorePlan.config.id;
						}
						this.$emit('confirm', data, this.action);
					} 
				})
				.catch( error => {
					if(error && valid){
						this.$message.error(error);
					}
				});
      });
		},
    // confirmBtnClick() {
    //   this.$refs.restorePlanCreateForm.validate(valid => {
    //     if (valid) {
    //       this.pruneData(this.formData)
    //         .then(({ name, config }) => {
    //           // const { loginName, detailInfo} = config;
    //           // let conf = Object.assign({},config);
    //           // if(this.isVMware){
    //           //   conf.loginName = detailInfo;
    //           //   conf.detailInfo = loginName;
    //           // }
    //           this.$emit('confirm', {
    //             id: this.database.id,
    //             data: { name, config },
    //           });
    //         })
    //         .catch(error => {
    //           this.$message.error(error);
    //         });
    //     } else {
    //       return false;
    //     }
    //   });
		// },
		fmtData(plan){
      if (plan.config.timePoints.length === 0) {
        plan.config.timePoints.push({ value: '00:00', key: Date.now() })
			}
			const {name, config, ...other} = plan;
      const {id, startTime, timeStrategy, ...otherConfig} = config;
			return {
				name,
				startTime: timeStrategy === 1 ? '' : startTime,
				timeStrategy,
				...otherConfig
			}
    },
    modalOpened() {
			console.log(this.restorePlan)
			if(this.action === 'update' || this.action === 'query'){
        this.originFormData = Object.assign({}, baseFormData, this.fmtData({...this.restorePlan}));
      }else{
        this.originFormData = Object.assign({}, baseFormData);
      }
			this.formData = Object.assign({}, this.originFormData);
			console.log(this.formData)
    },
    modalClosed() {
      this.formData = { ...this.originFormData };
      this.$refs.restorePlanCreateForm.clearValidate();
      this.hiddenPassword = true;
    },
  },
};
</script>
<style >
</style>
