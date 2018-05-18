import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/oracles',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/oracles/${id}`,
  });

const createOne = oracleData =>
  baseApi.request({
    method: 'post',
    url: '/oracles',
    data: oracleData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/oracles/${id}`,
  });

const modifyOne = oracleData =>
  baseApi.request({
    method: 'patch',
    url: `/oracles/${oracleData.id}`,
    data: oracleData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/oracles',
    data: ids,
  });

const fetchBackupPlans = id =>
  baseApi.request({
    method: 'get',
    url: `/oracles/${id}/oracle-backup-plans`,
  });

const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/oracles/${id}/results`,
  });

// API https://nei.netease.com/interface/detail/?pid=28187&id=88119
const createOracleBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/oracles/${id}/oracle-backup-plans`,
    data: plan,
  });

const deleteOracleBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/oracle-backup-plans/${id}`,
  });

const updateOracleBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/oracle-backup-plans/${id}`,
    data: plan,
  });

const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/oracle-backup-plans/${id}`,
  });

// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));
const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/oracle-backup-results/${id}/oracle-restore-plans`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config = timePoints2Obj(timePoints);
      return res;
    });
const fetchRestorePlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/oracles/${id}/oracle-restore-plans`,
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

const fetchRestoreRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/oracles/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/oracles/${id}/oracle-restore-plans`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const deleteRestorePlan = planId =>
  baseApi.request({
    method: 'delete',
    url: `/oracle-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/oracle-restore-plans/${data.id}`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config = timePoints2Obj(timePoints);
      return res;
    });
export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  deleteSome,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createOracleBackupPlan,
  deleteOracleBackupPlan,
  updateOracleBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
};
