import baseApi from './base';
import base from '../store/modules/base';

const timePoints2Obj = timePointsStrArr =>
  timePointsStrArr.map(p => ({ value: p, key: p }));

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

const modifyOne = virtualData =>
  baseApi.request({
    method: 'patch',
    url: `/virtuals/${virtualData.id}`,
    data: virtualData,
  });
// 获取单个虚拟机下的所有备份配置（计划）
const fetchBackupPlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/virtuals/${id}/virtual-backup-plans`,
    })
    .then(res => {
      const { data: plans } = res.data;
      plans.forEach(p => {
        if (p.config.timePoints) {
          p.config.timePoints = timePoints2Obj(p.config.timePoints);
        }
      });
      return res;
    });
// 获取单个虚拟机下的所有备份集
const fetchBackupResults = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/${id}/results`,
  });

// 创建单个虚拟机下的一个备份配置（计划）
const createVirtualBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'post',
      url: `/virtuals/${id}/virtual-backup-plans`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });
// 创建多个虚拟机下的一个备份配置（计划）
const createMultipleVirtualBackupPlan = (plan) =>
  baseApi
    .request({
      method: 'post',
      url: '/virtuals/virtual-backup-plans/multiple',
      data: plan,
    })
    // .then(res => {
    //   const { timePoints } = res.data.data.config;
    //   res.data.data.config.timePoints = timePoints2Obj(timePoints);
    //   return res;
    // });
// 删除单个虚拟机下的一个备份计划
const deleteVirtualBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `/virtual-backup-plans/${id}`,
  });
// 修改单个虚拟机下的一个备份计划
const updateVirtualBackupPlan = ({ id, plan }) =>
  baseApi
    .request({
      method: 'patch',
      url: `/virtual-backup-plans/${id}`,
      data: plan,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });
// 查询虚拟机下的一个备份计划
const fetchBackupOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/virtual-backup-plans/${id}`,
  });

const createSingleRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/virtual-backup-results/${id}/virtual-restore-plans`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });
const fetchRestorePlans = id =>
  baseApi
    .request({
      method: 'get',
      url: `/virtuals/${id}/virtual-restore-plans`,
    })
    .then(res => {
      const { data: plans } = res.data;
      plans.forEach(p => {
        if (p.config.timePoints) {
          p.config.timePoints = timePoints2Obj(p.config.timePoints);
        }
      });
      return res;
    });

const fetchRestoreRecords = id =>
  baseApi.request({
    method: 'get',
    url: `/virtuals/${id}/restore-records`,
  });

const createRestorePlan = ({ id, data }) =>
  baseApi
    .request({
      method: 'post',
      url: `/virtuals/${id}/virtual-restore-plans`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const deleteRestorePlan = planId =>
  baseApi.request({
    method: 'delete',
    url: `/virtual-restore-plans/${planId}`,
  });

const updateRestorePlan = data =>
  baseApi
    .request({
      method: 'patch',
      url: `/virtual-restore-plans/${data.id}`,
      data,
    })
    .then(res => {
      const { timePoints } = res.data.data.config;
      res.data.data.config.timePoints = timePoints2Obj(timePoints);
      return res;
    });

const fetchRestoreOperation = id =>
  baseApi.request({
    method: 'get',
    url: `/virtual-restore-plans/${id}`,
  });

//获取备份计划列表
const fetchVmBackupPlanList = () => 
  baseApi.request({
    method: 'get',
    url: '/virtual-backup-plans/list'
  });

//根据备份计划获取虚拟机备份进度
const getVmsBackupResult = id => 
  baseApi.request({
    method: 'get',
    url: `/virtual-backup-plans/virtuals/details/${id}`
  });

export {
  fetchAll,
  fetchOne,
  modifyOne,
  fetchBackupPlans,
  fetchBackupResults,
  createVirtualBackupPlan,
  createMultipleVirtualBackupPlan,
  updateVirtualBackupPlan,
  deleteVirtualBackupPlan,
  fetchBackupOperation,
  createSingleRestorePlan,
  fetchRestorePlans,
  fetchRestoreRecords,
  createRestorePlan,
  deleteRestorePlan,
  updateRestorePlan,
  fetchRestoreOperation,
  fetchVmBackupPlanList,
  getVmsBackupResult
};
