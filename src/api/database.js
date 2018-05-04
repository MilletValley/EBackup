import baseApi from './base';

const deleteBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `backup-plans/${id}`,
  });

const updateBackupPlans = ({ id, plan }) =>
  baseApi.request({
    method: 'patch',
    url: `/backup-plans/${id}`,
    data: plan,
  });

export { deleteBackupPlan, updateBackupPlans };
