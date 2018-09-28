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

  //根据设备获取主机信息
const fetchDetailsById = id => 
  baseApi.request({
    method: 'get',
    url: `/hosts/details/${id}`
  });

  //添加主机
const addServer = (data) => 
  baseApi.request({
    method: 'post',
    url: '/hosts/server',
    data: data
  });

const fetchServerList = () => 
  baseApi.request({
    method: 'get',
    url: '/hosts/server/list'
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
  fetchDetailsById,
  addServer,
  fetchServerList
};
