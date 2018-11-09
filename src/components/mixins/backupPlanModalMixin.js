import isEqual from 'lodash/isEqual';
import dayjs from 'dayjs';
import InputToggle from '@/components/InputToggle';
import {
	restoreTimeStrategyMapping as strategys,
	weekMapping,
} from '../../utils/constant';

const backupPlanModalMixin = {
	props: {
		visible: {
			type: Boolean,
		},
		btnLoading: {
			type: Boolean,
		},
		backupPlan: {
			type: Object
		},
		action: {
			type: String
		}
	},
	data() {
		return {
			formData: {},
			originFormData: {}
		}
	},
	computed: {
		modalVisible: {
			get() {
				return this.visible;
			},
			set(value) {
				if (!value) {
					this.$emit('update:visible', value);
				}
			},
		},
		title() {
			if (this.action === 'update') {
				return '更新备份计划';
			} else if (this.action === 'query') {
				return '查看备份计划';
			}
			return '添加备份计划';
		},
	},
	methods: {
		// 时间点去重排序
		filteredTimePoints(timePoints) {
			return Array.from(
				new Set(timePoints.map(p => p.value).filter(p => p))
			).sort(
				(a, b) =>
					a.slice(0, 2) * 60 +
					a.slice(3, 5) -
					b.slice(0, 2) * 60 +
					b.slice(3, 5)
			);
		},
		pruneFormData(formData) {
			const {
				name,
				timeStrategy,
				singleTime,
				startTime,
				datePoints,
				weekPoints,
				timePoints,
				hourInterval,
				minuteInterval,
				...other
			} = formData;
			let config;
			switch (timeStrategy) {
				case 0:
					config = { timeStrategy, singleTime, ...other };
					break;
				case 1:
					config = {
						timeStrategy,
						startTime,
						timeInterval: minuteInterval,
						...other,
					};
					break;
				case 2:
					config = {
						timeStrategy,
						startTime,
						timeInterval: hourInterval * 60,
						...other,
					};
					break;
				case 3:
					config = { timeStrategy, startTime, timePoints, ...other };
					break;
				case 4:
					config = {
						timeStrategy,
						startTime,
						weekPoints,
						timePoints,
						...other,
					};
					break;
				case 5:
					config = {
						timeStrategy,
						startTime,
						datePoints,
						timePoints,
						...other,
					};
					break;
				default:
			}
			if ([3, 4, 5].includes(timeStrategy)) {
				config.timePoints = this.filteredTimePoints(timePoints);
				// 全备+增备下按星期重排
				if (timeStrategy === 4) {
					config.weekPoints.sort((a, b) => a - b);
				}
			}
			return { name, config };
		},
		cancel() {
			this.hasModifiedBeforeClose(() => {
				this.modalVisible = false;
			});
		},
		// 关闭之前 验证是否有修改
		beforeModalClose(done) {
			this.hasModifiedBeforeClose(done);
		},
		hasModifiedBeforeClose(fn) {
			if (isEqual(this.formData, this.originFormData)) {
				fn();
			} else {
				this.$confirm('有未保存的修改，是否退出？', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				})
					.then(() => {
						fn();
					})
					.catch(() => { });
			}
		},
	},
};

const restorePlanModalMixin = {
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		btnLoading: {
			type: Boolean,
		},
		restorePlan: {
			type: Object
		},
		action: {
			type: String
		}
	},
	data() {
		const baseFormData = {
			name: '',
			hostIp: '',
			startTime: '',
			singleTime: '',
			datePoints: [],
			timePoints: [{ value: '00:00', key: Date.now() }],
			weekPoints: [], // 必须初始化为数组，checkbox group才能识别
			timeStrategy: 1, // 默认单次执行
		};
		// 文件单次恢复 增加覆盖策略
		if (this.isFileHost) {
			baseFormData.recoveringStrategy = 1;
		}
		return {
			// 原始表单值
			hiddenPassword: true,
			originFormData: Object.assign({}, baseFormData),
			formData: Object.assign({}, baseFormData),
			strategys, // 时间策略
			weekMapping, // 星期映射
			rules: {
				name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
				hostIp: [
					{ required: true, message: '请输入主机IP', trigger: 'blur' },
					{
						pattern:
							'^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$',
						message: 'IP地址不正确',
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
				// password: [
				//   { required: true, message: '请输入登录密码', trigger: 'blur' },
				// ],
			},
		};
	},
	computed: {
		modalVisible: {
			get() {
				return this.visible;
			},
			set(value) {
				if (!value) {
					this.$emit('update:visible', value);
				}
			},
		},
		title() {
			if (this.action === 'update') {
				return '更新恢复计划';
			} else if (this.action === 'query') {
				return '查看恢复计划';
			}
			return '添加恢复计划'
		},
		// 用于恢复的设备
		// 1.易备环境下的设备
		// 2.type类型设备
		// 3.没有“安装”数据库
		availableHostsForRestore() {
			const mysqlEbackupHosts = this.$store.getters[`${this.type}Hosts`].filter(
				h => h.hostType === 2
			);
			return mysqlEbackupHosts;
		},
	},
	methods: {
		// 时间点去重排序
		filteredTimePoints(timePoints) {
			return Array.from(
				new Set(timePoints.map(p => p.value).filter(p => p))
			).sort(
				(a, b) =>
					a.slice(0, 2) * 60 +
					a.slice(3, 5) -
					b.slice(0, 2) * 60 +
					b.slice(3, 5)
			);
		},
		// 精简计划数据，返回不同时间策略下所需要的数据
		pruneFormData(formData) {
			console.log(formData)
			const {
				name,
				timeStrategy,
				startTime,
				singleTime,
				timePoints,
				weekPoints,
				datePoints,
				recoveringStrategy,
				...other
			} = formData;
			let config;
			if (timeStrategy === 1) {
				config = { timeStrategy, recoveringStrategy, singleTime, ...other };
			} else {
				if (timeStrategy === 2) {
					// 按周循环
					config = {
						timeStrategy,
						startTime,
						timePoints,
						weekPoints,
						...other,
					};
				} else if (timeStrategy === 3) {
					// 按月循环
					config = {
						timeStrategy,
						startTime,
						timePoints,
						datePoints,
						...other,
					};
				}
			}
			config.timePoints = this.filteredTimePoints(timePoints);
			return { name, config };
		},
		// 点击取消按钮
		cancelButtonClick() {
			this.hasModifiedBeforeClose(() => {
				this.modalVisible = false;
			});
		},
		// 关闭之前 验证是否有修改
		beforeModalClose(done) {
			this.hasModifiedBeforeClose(done);
		},
		hasModifiedBeforeClose(fn) {
			if (isEqual(this.formData, this.originFormData)) {
				fn();
			} else {
				this.$confirm('有未保存的修改，是否退出？', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				})
					.then(() => {
						fn();
					})
					.catch(() => { });
			}
		},
	},
	components: {
		InputToggle,
	},
};

export { restorePlanModalMixin, backupPlanModalMixin };
