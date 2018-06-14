import baseApi from './base';

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
