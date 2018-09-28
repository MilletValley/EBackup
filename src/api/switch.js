import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/oracle-switch-plans',
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/oracle-switch-plans',
    data,
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/oracle-switch-plans/${id}`,
  });

const fetchNum = () =>
  baseApi.request({
    method: 'get',
    url: '/plan-details',
  });
export {
  fetchAll,
  createOne,
  fetchOne,
  fetchNum
};
