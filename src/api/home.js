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
export {
  fetchAll,
  fetchBackup,
  fetchRestore,
  fetchInitconn,
  fetchSpaceUse
};
