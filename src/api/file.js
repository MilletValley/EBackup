import isEqual from 'lodash/isEqual';
import baseApi from './fileBase';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const total = (totalArr, prop) =>
  totalArr.map(child => child[prop]).reduce((pre, cur) => Number(pre) + Number(cur));

const fmtBackupPlan = plan => {
  const childState = plan.backupFiles.map(file => file.state);
  if (Array.from(new Set(childState)).length === 1 && childState[0] === 0) {
    plan.state = 0;
  } else if (Array.from(new Set(childState)).length === 1 && childState[0] === 2) {
    plan.state = 2;
  } else if (childState.includes(3)) {
    plan.state = 3;
  } else {
    plan.state = 1;
  }
  plan.backupFiles.forEach(p => {
    if (plan.backupType === 1) { // 文件备份
      if (!p.sourceSize) {
        p.percentage = 0;
      } else if (isEqual(p.sourceSize, p.backupSize)) {
        p.percentage = 100;
      } else {
        p.percentage = Math.ceil(Math.abs((p.progress - p.backupSize) / (p.sourceSize - p.backupSize)) * 100);
      }
      if (p.state === 2 && p.percentage >= 95) { // 已完成
        p.percentage = 100;
      } else if (p.state === 0) { // 未开始
        p.percentage = 0;
      } else if (p.percentage >= 100) { // 进行中，且进度大于100%
        p.percentage = 99;
      }
    } else { // 卷备份、系统备份
      // eslint-disable-next-line
      const reg = /.*\(([^\(\)]*)\).*\(([^\(\)]*)\).*/;
      const result = p.progress.match(reg);
      if (!result) {
        p.diskInfo = '';
        p.percentage = 0;
      } else {
        if (result[1]) {
          if (p.state === 2) {
            p.diskInfo = `卷${result[1]}已备份完成`;
          }
          if (p.state === 1) {
            p.diskInfo = `正在备份卷${result[1]}`;
          }
          if (p.state === 3) {
            p.diskInfo = `备份卷${result[1]}失败`;
          }
        }
        if (result[2]) {
          const percentage = Number(result[2].substring(0, result[2].length - 1));
          p.percentage = isNaN(percentage) ? 0 : percentage;
        }
      }
      if (p.state === 2 && p.percentage >= 95) { // 已完成
        p.percentage = 100;
      } else if (p.state === 0) { // 未开始
        p.percentage = 0;
      } else if (p.percentage >= 100) { // 进行中，且进度大于100%
        p.percentage = 99;
      }
      p.progress = Math.abs(p.sourceSize - p.backupSize) * p.percentage * 0.01 + Number(p.backupSize);
    }
  });
  ({
    size: plan.size,
    progress: plan.progress,
    percentage: plan.percentage
  } = {
    size: total(plan.backupFiles, 'sourceSize'),
    progress: total(plan.backupFiles, 'progress'),
    percentage: total(plan.backupFiles, 'percentage') / plan.backupFiles.length
  });
  if (plan.percentage > 0 && plan.percentage < 1) {
    plan.percentage = 1;
  } else if (plan.percentage > 99 && plan.percentage < 100) {
    plan.percentage = 99;
  } else {
    plan.percentage = Math.ceil(plan.percentage);
  }
  if (plan.backupType !== 1) {
    ({
      diskInfo: plan.diskInfo,
      sourcePath: plan.sourcePath,
      targetPath: plan.targetPath,
      consume: plan.consume,
      errorMsg: plan.errorMsg
    } = plan.backupFiles[0]);
  }
  return plan;
};

const fmtRestorePlan = plan => {
  const childState = plan.restorePath.map(file => file.state);
  if (Array.from(new Set(childState)).length === 1 && childState[0] === 0) {
    plan.state = 0;
  } else if (Array.from(new Set(childState)).length === 1 && childState[0] === 2) {
    plan.state = 2;
  } else if (childState.includes(3)) {
    plan.state = 3;
  } else {
    plan.state = 1;
  }
  plan.restorePath.forEach(p => {
    if (plan.restoreType === 1) { // 文件恢复
      p.percentage = Math.ceil((p.progress / p.sourceSize) * 100);
      if (p.state === 2 && p.percentage >= 95) { // 已完成
        p.percentage = 100;
      } else if (p.state === 0) { // 未开始
        p.percentage = 0;
      } else if (p.percentage >= 100) { // 进行中，且进度大于100%
        p.percentage = 99;
      }
    } else { // 系统恢复
      // eslint-disable-next-line
      const percentage = p.progress.replace(/[^0-9]/ig, '');
      const volumeReg = p.progress.replace(/[^a-zA-Z]/g, '');
      const volume = p.progress.substr(p.progress.indexOf(volumeReg), 3);
      if (!volume || !percentage) {
        p.diskInfo = '';
        p.percentage = 0;
      } else {
        if (p.state === 2) {
          p.diskInfo = `卷${volume}已恢复完成`;
        }
        if (p.state === 1) {
          p.diskInfo = `正在恢复卷${volume}`;
        }
        if (p.state === 3) {
          p.diskInfo = `恢复卷${volume}失败`;
        }
        p.percentage = isNaN(percentage) ? 0 : percentage;
      }
      if (p.state === 2 && p.percentage >= 95) { // 已完成
        p.percentage = 100;
      } else if (p.state === 0) { // 未开始
        p.percentage = 0;
      } else if (p.percentage >= 100) { // 进行中，且进度大于100%
        p.percentage = 99;
      }
      p.progress = p.sourceSize * p.percentage * 0.01;
    }
  });
  ({
    size: plan.size,
    progress: plan.progress,
    percentage: plan.percentage
  } = {
    size: total(plan.restorePath, 'sourceSize'),
    progress: total(plan.restorePath, 'progress'),
    percentage: total(plan.restorePath, 'percentage') / plan.restorePath.length
  });
  if (plan.percentage > 0 && plan.percentage < 1) {
    plan.percentage = 1;
  } else if (plan.percentage > 99 && plan.percentage < 100) {
    plan.percentage = 99;
  } else {
    plan.percentage = Math.ceil(plan.percentage);
  }
  if (plan.restoreType !== 1) {
    ({
      diskInfo: plan.diskInfo,
      sourcePath: plan.sourcePath,
      targetPath: plan.targetPath,
      consume: plan.consume,
      pointPath: plan.pointPath,
      errorMsg: plan.errorMsg
    } = plan.restorePath[0]);
  }
  return plan;
};

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/file-hosts',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}`,
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/file-hosts/${data.id}`,
    data,
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/file-hosts',
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-hosts/${id}`,
  });

// 获取单个filehost下的所有备份计划
const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/file-hosts/${id}/file-host-backup-plans`,
    })
    .then(res => {
      const { data: plans } = res.data;
      plans.map(p => {
        if (p.config.timePoints) {
          p.config.timePoints = timePoints2Obj(p.config.timePoints);
        }
        return fmtBackupPlan(p);
      });
      return res;
    });

// 创建单个filehost下的一个备份计划
const createBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/file-hosts/${id}/file-host-backup-plans`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

// 创建单个filehost下的一个备份计划（立即执行）
// const createSingleBackupPlan = ({ id, plan }) =>
//   baseApi.request({
//     method: 'post',
//     url: `/file-hosts/${id}/file-host-single-backup-plan`,
//     data: plan
//   });

// 修改单个filehost下的一个备份计划
const updateBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/file-host-backup-plans/${id}`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

// 删除单个filehost下的一个备份计划
const deleteBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-host-backup-plans/${id}`,
  });

// 查询单个filehost下的一个备份计划（刷新）
const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/file-host-backup-plans/${id}`,
  })
    .then(res => {
      const { data } = res.data;
      res.data.data = fmtBackupPlan(data);
      return res;
    });

// 获取单个filehost下的所有备份集
const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}/results`,
  });

// 获取单个filehost备份计划产生的备份集
const fetchOneBackupResult = id =>
  baseApi.request({
    method: 'get',
    url: `/file-host-backup-plans/${id}/results`,
  });

// 删除备份集(根据备份计划id)
const deleteResultByPlanId = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-host-backup-plans/${id}/file-host-backup-results`,
  });

// 删除备份集(根据备份集id)
const deleteResultById = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-host-backup-results/${id}`,
  });

// 终止所有备份计划
const stopAllBackupPlan = id =>
  baseApi.request({
    method: 'patch',
    url: `/file-hosts/${id}/file-host-backup-plans`
  });

const stopAllPlans = id =>
  baseApi.request({
    method: 'patch',
    url: `/file-hosts/${id}/plans`
  });

// 终止所有恢复计划
const stopAllRestorePlan = id =>
  baseApi.request({
    method: 'patch',
    url: `/file-hosts/${id}/file-host-restore-plans`
  });

// 根据父文件夹路径获取子文件(夹)节点
const fetchChildNodes = ({ id, path }) =>
  baseApi.request({
    method: 'post',
    url: `file-hosts/${id}/file-nodes`,
    data: {
      path
    }
  });

// 获取单个filehost下的所有恢复计划
const fetchRestorePlans = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}/file-host-restore-plans`,
  })
    .then(res => {
      const { data: plans } = res.data;
      plans.map(p => fmtRestorePlan(p));
      return res;
    });

// 查询单个filehost下的一个恢复计划(刷新)
const fetchRestoreOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/file-host-restore-plans/${id}`,
  })
    .then(res => {
      const { data } = res.data;
      res.data.data = fmtRestorePlan(data);
      return res;
    });

// 创建filehost下的恢复计划(立即执行)
const createSingleRestorePlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/file-host-backup-results/${id}/file-host-restore-plans`,
    data: plan
  });

// 删除filehost下的单个恢复计划
const deleteSingleRestorePlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-host-restore-plans/${id}`,
  });

// 获取单个filehost下的所有恢复记录
const fetchRestoreRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}/restore-records`,
  });

// 获取恢复源路径(根据备份计划id)
const fetchPathByPlanId = id =>
  baseApi.request({
    method: 'get',
    url: `/file-host-backup-plans/${id}/file-host-origin-path`
  });

// 获取恢复源路径(根据备份集id)
const fetchPathByResultId = id =>
  baseApi.request({
    method: 'get',
    url: `/file-host-backup-results/${id}/file-host-origin-path`
  });

// 根据设备id获取恢复目标路径
const fetchPathByHostId = id =>
  baseApi.request({
    methods: 'get',
    url: `/file-hosts/${id}/file-target-path`
  });

export {
  fetchAll,
  fetchOne,
  modifyOne,
  createOne,
  deleteOne,
  fetchBackupPlans,
  createBackupPlan,
  // createSingleBackupPlan,
  updateBackupPlan,
  deleteBackupPlan,
  fetchBackupOperation,
  fetchBackupResults,
  fetchOneBackupResult,
  deleteResultByPlanId,
  deleteResultById,
  stopAllBackupPlan,
  stopAllRestorePlan,
  stopAllPlans,
  fetchChildNodes,
  fetchRestorePlans,
  fetchRestoreOperation,
  createSingleRestorePlan,
  deleteSingleRestorePlan,
  fetchRestoreRecords,
  fetchPathByPlanId,
  fetchPathByResultId,
  fetchPathByHostId
};
