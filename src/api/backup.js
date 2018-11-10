import baseApi from './base';
// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const fetchBackupPlans = (type, id) =>
  baseApi
    .request({
      method: 'get',
      url: `/${type}s/${id}/${type}-backup-plans`,
    })
    .then(res => {
      const { data: plans } = res.data;
      plans.forEach(p => {
        if (p.config.timePoints) {
          p.config.timePoints = timePoints2Obj(p.config.timePoints);
        }
      });
      return res;
    });

const fetchBackupResults = (type, id) =>
  baseApi.request({
    method: 'get',
    url: `/${type}s/${id}/results`,
  });

// API https://nei.netease.com/interface/detail/?pid=28187&id=88119
const createMySqlBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/mysqls/${id}/mysql-backup-plans`,
    data: plan,
  });
const createBackupPlan = (type, { id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/${type}s/${id}/${type}-backup-plans`,
      data: plan,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        res.data.data.config.timePoints = timePoints2Obj(timePoints);
      }
      return res;
    });

const deleteBackupPlan = (type, id) =>
  baseApi.request({
    method: 'delete',
    url: `/${type}-backup-plans/${id}`,
  });

const updateMySqlBackupPlan = (type, { id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/${type}-backup-plans/${id}`,
    data: plan,
  });

const updateBackupPlan = (type, { id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/${type}-backup-plans/${id}`,
      data: plan,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        res.data.data.config.timePoints = timePoints2Obj(timePoints);
      }
      return res;
    });

const fetchBackupOperation = (type, id) =>
  baseApi.request({
    method: 'get',
    url: `/${type}-backup-plans/${id}`,
  });

const createSingleRestorePlan = (type, { id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/${type}-backup-results/${id}/${type}-restore-plans`,
      data,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        res.data.data.config.timePoints = timePoints2Obj(timePoints);
      }
      return res;
    });
const fetchRestorePlans = (type, id) =>
  baseApi
    .request({
      method: 'get',
      url: `/${type}s/${id}/${type}-restore-plans`,
    })
    .then(res => {
      const { data: plans } = res.data;
      plans.forEach(p => {
        if (p.config.timePoints) {
          p.config.timePoints = timePoints2Obj(p.config.timePoints);
        }
      });
      return res;
    });

const fetchRestoreRecords = (type, id) =>
  baseApi.request({
    method: 'get',
    url: `/${type}s/${id}/restore-records`,
  });

const createRestorePlan = (type, { id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/${type}s/${id}/${type}-restore-plans`,
      data,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        res.data.data.config.timePoints = timePoints2Obj(timePoints);
      }
      return res;
    });

const deleteRestorePlan = (type, planId) =>
  baseApi.request({
    method: 'delete',
    url: `/${type}-restore-plans/${planId}`,
  });

const updateRestorePlan = (type, data) =>
  baseApi
    .request({
      method: 'patch',
      url: `/${type}-restore-plans/${data.id}`,
      data,
    })
    .then(res => {
      if (res.data.data.config) {
        const { timePoints } = res.data.data.config;
        res.data.data.config.timePoints = timePoints2Obj(timePoints);
      }
      return res;
    });

const fetchRestoreOperation = (type, id) =>
  baseApi.request({
    method: 'get',
    url: `/${type}-restore-plans/${id}`,
  });

export {
  fetchBackupPlans,
  fetchBackupResults,
  createMySqlBackupPlan,
  createBackupPlan,
  deleteBackupPlan,
  updateMySqlBackupPlan,
  updateBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
  fetchRestoreOperation
};
