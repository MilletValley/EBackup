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
    url: `/sqlservers/${id}/backup-plans`,
  });

const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${id}/results`,
  });

const createSqlServerBackupPlans = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/sqlservers/${id}/backup-plans`,
    data: plan,
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
  createSqlServerBackupPlans,
};
