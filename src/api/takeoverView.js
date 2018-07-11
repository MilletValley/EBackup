import baseApi from './base';

const fetchProduction = () =>
  baseApi.request({
    method: 'get',
    url: '/takeoverproductions',
  });

const fetchEbackup = () =>
  baseApi.request({
    method: 'get',
    url: '/takeoverebackup',
  });

const createItem = newData =>
  baseApi.request({
    method: 'post',
    url: '/takeoverproductions',
    data: newData,
  });

export {
  fetchProduction,
  fetchEbackup,
  createItem
};
