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

const createSingleRestorePlan = ({ id, data }) =>
  baseApi.request({
    method: 'post',
    url: `/oracle-backup-results/${id}/oracle-restore-plans`,
    data,
  });
const fetchRestorePlans = id =>
  baseApi.request({
    method: 'get',
    url: `/oracles/${id}/oracle-restore-plans`,
  });

const fetchRestoreRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/oracles/${id}/restore-records`,
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
};
