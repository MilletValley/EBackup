import baseApi from './base';

const deleteBackupPlan = id =>
  baseApi.request({
    method: 'delete',
    url: `backup-plans/${id}`,
  });

export { deleteBackupPlan };
