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

// 将时间字符串数组转为对象数组
const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/sqlserver-backup-results/${id}/sqlserver-restore-plans`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const fetchRestorePlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/sqlservers/${id}/sqlserver-restore-plans`,
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
    url: `/sqlservers/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/sqlservers/${id}/sqlserver-restore-plans`,
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
    url: `/sqlserver-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/sqlserver-restore-plans/${data.id}`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const fetchRestoreOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/sqlserver-restore-plans/${id}`,
  });

const fetchLinks = () =>
  baseApi.request({
    method: 'get',
    url: '/sqlserver-links',
  });

const createLinks = data =>
  baseApi.request({
    method: 'post',
    url: '/sqlserver-links',
    data,
  });

const createSwitches = data =>
  baseApi.request({
    method: 'post',
    url: '/sqlserver-switches',
    data,
  });

const fetchSwitches = linkId =>
  baseApi.request({
    method: 'get',
    url: `/sqlserver-links/${linkId}/switches`,
  });

const fetchLink = sqlserverId =>
  baseApi.request({
    method: 'get',
    url: `/sqlservers/${sqlserverId}/sqlserver-links`,
  });

const fetchLinkByLinkId = linkId =>
  baseApi.request({
    method: 'get',
    url: `/sqlserver-links/${linkId}`,
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
  fetchRestoreOperation,
  fetchLinks,
  createSwitches,
  createLinks,
  fetchSwitches,
  fetchLink,
  fetchLinkByLinkId,
};
