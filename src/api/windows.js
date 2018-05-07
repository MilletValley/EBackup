import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/windows',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/windows/${id}`,
  });

const createOne = data =>
  baseApi.request({
    method: 'post',
    url: '/windows',
    data,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/windows/${id}`,
  });

const modifyOne = data =>
  baseApi.request({
    method: 'patch',
    url: `/windows/${data.id}`,
    data,
  });

export { fetchAll, fetchOne, createOne, deleteOne, modifyOne };
