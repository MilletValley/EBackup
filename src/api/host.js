import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/hosts',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/hosts/${id}`,
  });

const createOne = hostData =>
  baseApi.request({
    method: 'post',
    url: '/hosts',
    data: hostData,
  });

const deleteOne = id =>
  baseApi.request({
    method: 'delete',
    url: `/hosts/${id}`,
  });

const modifyOne = hostData =>
  baseApi.request({
    method: 'patch',
    url: `/hosts/${hostData.id}`,
    data: hostData,
  });

const deleteSome = ids =>
  baseApi.request({
    method: 'delete',
    url: '/hosts',
    data: ids,
  });

const createSwitches = (hostLinkId, formData) =>
  baseApi.request({
    method: 'post',
    url: `/host-links/${hostLinkId}/switches`,
    data: formData,
  });

const deleteLinks = linkId =>
  baseApi.request({
    method: 'delete',
    url: `/host-links/${linkId}`,
  });

export {
  fetchAll,
  fetchOne,
  createOne,
  deleteOne,
  deleteSome,
  modifyOne,
  createSwitches,
  deleteLinks,
};
