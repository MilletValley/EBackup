import throttle from 'lodash/throttle';
import IIcon from '@/components/IIcon';
import DatabaseUpdateModal from '@/components/DatabaseUpdateModal';
import TabPanels from '@/components/common/TabPanels';
import {
	databaseRoleMapping,
	linkStateMapping,
	databaseStateMapping,
} from '../../utils/constant';

import {
	fetchBackupPlans,
	createBackupPlan,
	updateBackupPlan,
	fetchBackupResults,
	fetchRestorePlans,
	fetchRestoreRecords,
	fetchBackupOperation,
	fetchRestoreOperation,
	deleteRestorePlan,
	deleteBackupPlan,
	createSingleRestorePlan,
	createRestorePlan,
	updateRestorePlan,
} from '../../api/backup';

import {
	fetchOne
} from '../../api/database';

const detailPageMixin = {
	props: ['id'],
	data() {
		return {
			infoLoading: true, // 信息loading
			details: {
				host: {},
			},
			link: {},
			// detailsEditModal: false,
			btnLoading: false,
			backupPlans: [],
			restorePlans: [], // 恢复计划
			restoreRecords: [], // 恢复记录
			results: [], // 备份集
			backupPlanModalVisible: false,
			restorePlanModalVisible: false,

			selectedBackupPlan: {},
			selectedBackupResultId: -1,
			selectedRestorePlan: {},
			singleRestoreCreateModalVisible: false,
			timer: null,

			updateResults: this.throttleMethod(() => {
				fetchBackupResults(this.type, this.id)
					.then(res => {
						const { data: result } = res.data;
						this.results = result;
					})
					.catch(error => {
						this.$message.error(error);
					});
			}),
			updateRestorePlanAndRecords: this.throttleMethod(() => {
				fetchRestorePlans(this.type, this.id)
					.then(res => {
						const { data: restorePlans } = res.data;
						this.restorePlans = restorePlans;
					})
					.catch(error => {
						this.$message.error(error);
					});
				fetchRestoreRecords(this.type, this.id)
					.then(res => {
						const { data: restoreRecords } = res.data;
						this.restoreRecords = restoreRecords;
					})
					.catch(error => {
						this.$message.error(error);
					});
			}),
			// selectedBackupPlanId: -1,
			// TODO: 暂时使用一个data变量存储选择的计划id，也许有更优雅的实现方式
			throttleRefreshBackup: this.throttleMethod(id => {
				fetchBackupOperation(this.type, id)
					.then(response => {
						const { data } = response.data;
						const { state, startTime, consume, size } = data;
						Object.assign(
							this.backupPlans.find(
								plan => plan.id === id
							),
							{
								state,
								startTime,
								consume,
								size,
							}
						);
					})
					.catch(error => {
						this.$message.error(error);
					});
			}),
			// selectedRestorePlanId: -1,
			throttleRefreshRestore: this.throttleMethod(id => {
				fetchRestoreOperation(this.type, id)
					.then(response => {
						const { data } = response.data;
						const { state, startTime, consume } = data;
						Object.assign(
							this.restorePlans.find(
								plan => plan.id === id
							),
							{
								state,
								startTime,
								consume,
							}
						);
					})
					.catch(error => {
						this.$message.error(error);
					});
			}),
		};
	},
	created() {
		this.fetchData();
	},
	mounted() {
		this.setTimer(this.timer);
	},
	destroyed() {
		this.clearTimer(this.timer);
	},
	beforeRouteUpdate(to, from, next) {
		this.fetchData();
		next();
	},
	computed: {
		role() {
			if (!this.details || !this.detilas.role) return databaseRoleMapping[0];
			return databaseRoleMapping[this.details.role];
		},
	},
	methods: {
		switchPane(name) {
			if (name === 'results') {
				this.updateResults();
			}
		},
		// 节流函数 5s只触发一次
		throttleMethod(fn) {
			return throttle(fn, 5000, {
				leading: true,
				trailing: false
			});
		},
		// dropdown
		addPlanBtnClick(command) {
			if (command === 'backup') {
				this.backupPlanModalVisible = true;
				this.action = 'create';
			} else if (command === 'restore') {
				this.restorePlanModalVisible = true;
				this.restoreAction = 'create';
			}
		},
		// 单次恢复弹窗
		initSingleRestoreModal(id) {
			this.selectedBackupResultId = id;
			this.singleRestoreCreateModalVisible = true;
		},
		// 修改恢复计划
		selectRestorePlan(restorePlanId) {
			this.selectedRestorePlan = this.restorePlans.find(plan => plan.id === restorePlanId);
			this.restorePlanModalVisible = true;
			this.restoreAction = 'update';
		},
		// 修改备份计划
		selectBackupPlan(backupPlanId) {
			this.selectedBackupPlan = this.backupPlans.find(plan => plan.id === backupPlanId);
			this.backupPlanModalVisible = true;
			this.action = 'update';
		},
		roleIconName(role) {
			switch (role) {
				case 1:
					return 'zhu';
				case 2:
					return 'bei';
				default:
					return '';
			}
		},
		setTimer() {
			this.clearTimer();
			this.timer = setInterval(() => {
				this.RefreshTime();
			}, 20000);
		},
		clearTimer() {
			clearInterval(this.timer);
		},
		getDatabaseDetails() {
			fetchOne(this.type, this.id)
				.then(res => {
					const { data: db } = res.data;
					this.details = db;
				})
				.catch(error => {
					this.$message.error(error);
					this.$router.push({ name: `${this.type}List` });
				})
				.then(() => {
					this.infoLoading = false;
				});
		},
		getBackupPlanList() {
			fetchBackupPlans(this.type, this.id)
				.then(res => {
					const { data: plans } = res.data;
					this.backupPlans = plans;
				})
				.catch(error => {
					this.$message.error(error);
				});
		},
		getBackupResults() {
			fetchBackupResults(this.type, this.id)
				.then(res => {
					const { data: result } = res.data;
					this.results = result;
				})
				.catch(error => {
					this.$message.error(error);
				});
		},
		getRestorePlans() {
			fetchRestorePlans(this.type, this.id).then(res => {
				const { data: plans } = res.data;
				this.restorePlans = plans;
			}).catch(error => {
				this.$message.error(error);
			});
		},
		getRestoreRecords() {
			fetchRestoreRecords(this.type, this.id).then(res => {
				const { data: records } = res.data;
				this.restoreRecords = records;
			}).catch(error => {
				this.$message.error(error);
			});
		},
		fetchData() {
			this.getDatabaseDetails();
			this.getBackupPlanList();
			this.getBackupResults();
			this.getRestorePlans();
			this.getRestoreRecords();
		},
		RefreshTime() {
			this.getBackupPlanList();
			this.getRestorePlans();
		},
		confirmCallback(plan, type) {
			(type === 'update' ? updateBackupPlan(this.type, { id: plan.id, plan }) : createBackupPlan(this.type, { id: this.id, plan }))
				.then(res => {
					console.log(res)
					const { message } = res.data;
					this.backupPlanModalVisible = false;
					this.$message.success(message);
					this.getBackupPlanList();
				})
				.catch(error => {
					this.$message.error(error);
					return false;
				})
				.then(() => {
					this.btnLoading = false;
				});
		},
		restoreConfirmCallback(plan, type) {
			console.log(plan)
			(type === 'update' ? updateRestorePlan(this.type, { id: plan.id, plan }) : createRestorePlan(this.type, { id: this.id, plan }))
				.then(res => {
					console.log(res)
					const { message } = res.data;
					this.restorePlanModalVisible = false;
					this.$message.success(message);
					this.getRestorePlans();
				})
				.catch(error => {
					this.$message.error(error);
					return false;
				})
				.then(() => {
					this.btnLoading = false;
				});
		},
		// 刷新单个备份计划
		refreshSingleBackupPlan(planId) {
			this.throttleRefreshBackup(planId);
		},
		// 刷新单个恢复计划
		refreshSingleRestorePlan(planId) {
			this.throttleRefreshRestore(planId);
		},
		deleteRestorePlan(planId) {
			deleteRestorePlan(this.type, planId)
				.then(() => {
					this.restorePlans.splice(
						this.restorePlans.findIndex(plan => plan.id === planId),
						1
					);
					this.$message.success('删除成功');
				})
				.catch(error => {
					this.$message.error(error);
				});
		},
		deleteBackupPlan(planId) {
			deleteBackupPlan(this.type, planId).then(() => {
				this.backupPlans.splice(
					this.backupPlans.findIndex(plan => plan.id === planId),
					1
				);
				this.$message.success('删除成功');
			}).catch(error => {
				this.$message.error(error);
			});
		},
		singleConfirmCallback(plan){
			this.addSingleRestorePlan(plan);
		},
		addSingleRestorePlan(plan) {
			this.btnLoading = true;
			createSingleRestorePlan(this.type, plan)
				.then(res => {
					const { data: restorePlan, message } = res.data;
					// this.restorePlans.unshift(restorePlan);
					this.singleRestoreCreateModalVisible = false;
					this.$message.success(message);
					this.getRestorePlans();
				})
				.catch(error => {
					this.$message.error(error);
				})
				.then(() => {
					this.btnLoading = false;
				});
		},
		updateDetails(data) {
			this.btnLoading = true;
			modifyOne(this.type, data)
				.then(res => {
					const { data: mysql, message } = res.data;
					// FIXME: mock数据保持id一致，生产环境必须删除下面一行
					// mysql.id = this.details.id;
					this.details = mysql;
					this.detailsEditModal = false;
					this.$message.success(message);
				})
				.catch(error => {
					this.$message.error(error);
				})
				.then(() => {
					this.btnLoading = false;
				});
		},
		databaseStateStyle(value) {
			switch (value) {
				case 0:
					return 'info';
				case 1:
					return 'success';
				case 2:
					return 'danger';
			}
		},
	},
	components: {
		IIcon,
		DatabaseUpdateModal,
		TabPanels,
	},
	filters: {
		linkStateFilter(value) {
			return linkStateMapping[value];
		},
		databaseStateFilter(value) {
			return databaseStateMapping[value];
		},
		databaseRoleFilter(value) {
			return databaseRoleMapping[value].substr(0, 1);
		},
	},
};

// eslint-disable-next-line
export { detailPageMixin };
