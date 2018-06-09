import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/virtuals',
  });

const fetchOne = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/${id}`,
  });

// 获取单个虚拟机下的所有备份配置（计划）
const fetchBackupPlans = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/${id}/virtual-backup-plans`,
  });
// 获取单个虚拟机下的所有备份集
const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/${id}/results`,
  });

// 创建单个虚拟机下的一个备份配置（计划）
const createVirtualBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'post',
    url: `/virtuals/${id}/virtual-backup-plans`,
    data: plan,
  });
// 修改单个虚拟机下的一个备份计划
const updateVirtualBackupPlan = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/virtual-backup-plans/${id}`,
    data: plan,
  });
// 删除单个虚拟机下的一个备份计划
const deleteVirtualBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/virtual-backup-plans/${id}`,
  });
// 查询虚拟机下的一个备份计划
const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/virtual-backup-plans/${id}`,
  });

export {
  fetchAll,
  fetchOne,
  fetchBackupPlans,
  fetchBackupResults,
  createVirtualBackupPlan,
  updateVirtualBackupPlan,
  deleteVirtualBackupPlan,
  fetchBackupOperation,
};
// const fetchLinks = () =>
//   baseApi.request({
//     method: 'get',
//     url: '/virtual-links',
//   });

// const createLinks = data =>
//   baseApi.request({
//     method: 'post',
//     url: '/virtual-links',
//     data,
//   });

// const createSwitches = data =>
//   baseApi.request({
//     method: 'post',
//     url: '/virtual-switches',
//     data,
//   });

// const fetchSwitches = linkId =>
//   baseApi.request({
//     method: 'get',
//     url: `/virtual-links/${linkId}/switches`,
//   });
