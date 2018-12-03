import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/home/total',
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
    url: '/home/onekeymanage',
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
export {
  fetchAll,
  fetchBackup,
  fetchRestore,
  fetchInitconn,
  fetchSpaceUse,
  fetchBackupPlan,
  fetchBackupPlanDetail,
  cancelHighlight
};
