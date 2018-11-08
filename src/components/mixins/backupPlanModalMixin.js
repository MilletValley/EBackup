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
	data(){
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
		title(){
			if(this.action === 'update'){
				return '更新备份计划';
			}else if (this.action === 'query'){
				return '查看备份计划';
			}
			return '添加备份计划'
		}
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
				id,
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
			return {id, name, config};
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
		type: {
			type: String,
			validator(value) {
				return ['oracle', 'sqlserver', 'mysql', 'windows', 'linux', 'vm', '', 'dm'].includes(value);
			},
		},
		id: {
			type: Number,
			// required: true,
		},
		database: {
			type: Object,
		},
		visible: {
			type: Boolean,
			required: true,
		},
		btnLoading: {
			type: Boolean,
		},
		selectionHosts: {
			type: Array,
			// required: true,
		},
	},
	data() {
		const singleTimeValidate = (rule, value, callback) => {
			if (this.formData.timeStrategy === 1 && !value) {
				callback(new Error('请输入恢复时间'));
			} else {
				callback();
			}
		};
		const startTimeValidate = (rule, value, callback) => {
			if ([2, 3].indexOf(this.formData.timeStrategy) !== -1 && !value) {
				callback(new Error('请输入计划时间'));
			} else {
				callback();
			}
		};
		const weekPointsValidate = (rule, value, callback) => {
			if (this.formData.timeStrategy === 2 && value.length === 0) {
				callback(new Error('请输入循环星期'));
			} else {
				callback();
			}
		};
		const timePointsValidate = (rule, value, callback) => {
			if (this.formData.timePoints.every(p => !p.value)) {
				callback(new Error('请输入时间点'));
			} else {
				callback();
			}
		};
		const datePointsValidate = (rule, value, callback) => {
			if (this.formData.timeStrategy === 3 && value.length === 0) {
				callback(new Error('请输入循环日期'));
			} else {
				callback();
			}
		};
		const detailInfoDisplayName = mapping[this.type];
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
				detailInfo: [
					{
						required: true,
						message: `请输入${detailInfoDisplayName}`,
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
				singleTime: [
					{
						validator: singleTimeValidate,
						trigger: 'blur',
					},
				],
				startTime: [
					{
						validator: startTimeValidate,
						trigger: 'blur',
					},
				],
				weekPoints: [
					{
						validator: weekPointsValidate,
						trigger: 'blur',
					},
				],
				timePoints: [
					{
						validator: timePointsValidate,
						trigger: 'blur',
					}
				],
				datePoints: [
					{
						validator: datePointsValidate,
						trigger: 'blur',
					},
				],
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
		detailInfoDisplayName() {
			return mapping[this.type];
		},
		isFileHost() {
			return this.type === 'windows' || this.type === 'linux';
		},
		isHW() {
			const path = this.$route.path;
			return this.$route.path.substring(4, path.lastIndexOf('/')) === 'hwVirtual';
		},
		isVMware() {
			const path = this.$route.path;
			return this.$route.path.substring(4, path.lastIndexOf('/')) === 'virtual';
		}
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
		pruneData(formData) {
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
			const filteredTimePoints = this.filteredTimePoints;
			return new Promise((resolve, reject) => {
				if (timeStrategy === 1) {
					if (dayjs(singleTime) < dayjs()) reject('单次时间必须晚于当前时间');
					config = { timeStrategy, recoveringStrategy, singleTime, ...other };
				} else {
					if (dayjs(startTime) < dayjs()) reject('计划时间必须晚于当前时间');
					// if (timePoints.every(p => !p.value)) {
					//   reject('请至少输入一个时间点');
					// }
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
					config.timePoints = filteredTimePoints(timePoints);
				}
				resolve({ name, config });
			});

			// return { name, config };
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
