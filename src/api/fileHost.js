import baseApi from './base';

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

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/file-hosts/${data.id}`,
    data,
  });

const fetchBackupPlans = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}/file-host-backup-plans`,
  });

const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/file-hosts/${id}/results`,
  });

const createBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/file-hosts/${id}/file-host-backup-plans`,
    data: plan,
  });

const deleteBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/file-host-backup-plans/${id}`,
  });

const updateBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/file-host-backup-plans/${id}`,
    data: plan,
  });

const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/file-host-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi.request({
    method: 'post',
    url: `/file-host-backup-results/${id}/file-host-restore-plans`,
    data,
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createBackupPlan,
  deleteBackupPlan,
  updateBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
};
