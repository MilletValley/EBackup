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
    url: `/oracles/${id}/backup-plans`,
  });

const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/oracles/${id}/results`,
  });


// API https://nei.netease.com/interface/detail/?pid=28187&id=88119
const createOracleBackupPlans = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/oracles/${id}/backup-plans`,
    data: plan,
  });

const createSqlserverBackupPlans = backupDate =>
  baseApi.request({
    method: 'post',
    url: `/sqlserver/${backupDate.id}/backup-plans`,
    data: {
      backupDate
    },
  });

const updateBackupPlans = ({ id, backupDate }) =>
  baseApi.request({
    method: 'patch',
    url: `/backup-plans/${id}`,
    data: {
      backupDate
    },

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
  createOracleBackupPlans,
  createSqlserverBackupPlans,
  updateBackupPlans,
};
