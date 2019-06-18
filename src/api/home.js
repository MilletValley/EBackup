import baseApi from './base';

const fetchBackupStatistics = () =>
  baseApi.request({
    method: 'get',
    url: '/home/backup-statistics',
  });
const fetchRestoreStatistics = () =>
  baseApi.request({
    method: 'get',
    url: '/home/restore-statistics',
  });
const fetchTakeOverStatistics = () =>
  baseApi.request({
    method: 'get',
    url: '/home/takeover-statistics',
  });
const fetchBackup = () =>
  baseApi.request({
    method: 'get',
    url: '/home/backup',
  });
const fetchRestore = () =>
  baseApi.request({
    method: 'get',
    url: '/home/restore',
  });
const fetchInitconn = () =>
  baseApi.request({
    method: 'get',
    url: '/home/takeover',
  });

const fetchSpaceUse = () =>
  baseApi.request({
    method: 'get',
    url: '/home/space'
  });

const fetchBackupPlan = () =>
  baseApi.request({
    method: 'get',
    url: '/home/backup-plans'
  });

const fetchBackupPlanDetail = (id, type) =>
  baseApi.request({
    method: 'get',
    url: `/home/backup-plan/details?id=${id}&type=${type}`
  });

const cancelHighlight = (id, type) =>
  baseApi.request({
    method: 'put',
    url: `/backup-plan/cancel-highlight?id=${id}&type=${type}`
  });

const fetchRestorePlan = () =>
  baseApi.request({
    method: 'get',
    url: '/home/restore-plans'
  });

const fetchRestorePlanDetail = (id, type) =>
  baseApi.request({
    method: 'get',
    url: `/home/restore-plan/details?id=${id}&type=${type}`
  });

const cancelRestoreHighlight = (id, type) =>
  baseApi.request({
    method: 'put',
    url: `/restore-plan/cancel-highlight?id=${id}&type=${type}`
  });

const getMonitorInfo = (id, type) =>
  baseApi.request({
    method: 'get',
    url: `/get-monitor-id?id=${id}&type=${type}`
  });

const getVersion = () =>
  baseApi.request({
    method: 'get',
    url: '/get-version'
  });
export {
  fetchBackupStatistics,
  fetchRestoreStatistics,
  fetchTakeOverStatistics,
  fetchBackup,
  fetchRestore,
  fetchInitconn,
  fetchSpaceUse,
  fetchBackupPlan,
  fetchBackupPlanDetail,
  cancelHighlight,
  fetchRestorePlan,
  fetchRestorePlanDetail,
  cancelRestoreHighlight,
  getMonitorInfo,
  getVersion
};
