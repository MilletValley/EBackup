import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/sqlservers',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${id}`,
  });

const createOne = sqlServerData =>
  baseApi.request({
    method: 'post',
    url: '/sqlservers',
    data: sqlServerData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/sqlservers/${id}`,
  });

const modifyOne = sqlServerData =>
  baseApi.request({
    method: 'patch',
    url: `/sqlservers/${sqlServerData.id}`,
    data: sqlServerData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/sqlservers',
    data: ids,
  });

const fetchBackupPlans = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${id}/sqlserver-backup-plans`,
  });

const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${id}/results`,
  });

const createSqlServerBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/sqlservers/${id}/sqlserver-backup-plans`,
    data: plan,
  });

const deleteSqlServerBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/sqlserver-backup-plans/${id}`,
  });

const updateSqlServerBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/sqlserver-backup-plans/${id}`,
    data: plan,
  });

const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlserver-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi.request({
    method: 'post',
    url: `/sqlserver-backup-results/${id}/sqlserver-restore-plans`,
    data,
  });

const fetchRestorePlans = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${id}/sqlserver-restore-plans`,
  });

const fetchRestoreRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi.request({
    method: 'post',
    url: `/sqlservers/${id}/sqlserver-restore-plans`,
    data,
  });

const deleteRestorePlan = planId =>
  baseApi.request({
    method: 'delete',
    url: `/sqlserver-restore-plans/${planId}`,
  });

const updateRestorePlan = restorePlan =>
  baseApi.request({
    method: 'patch',
    url: `/sqlserver-restore-plans/${restorePlan.id}`,
    data: restorePlan,
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
  createSqlServerBackupPlan,
  deleteSqlServerBackupPlan,
  updateSqlServerBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
};
