import baseApi from './base';

const fetchProduction = () =>
  baseApi.request({
    method: 'get',
    url: '/backuprestoreproductions',
  });

const fetchEbackup = () =>
  baseApi.request({
    method: 'get',
    url: '/backuprestoreebackup',
  });

const createProduction = productionData =>
  baseApi.request({
    method: 'post',
    url: '/backuprestoreproductions',
    data: productionData,
  });

export {
  fetchProduction,
  fetchEbackup,
  createProduction,
};
