import baseApi from './base';

/**
 * 查询恢复验证结果列表
 * @param {Number} id 数据库id
 */
const getRestoreVerificationResultList = id =>
  baseApi.request({
    method: 'get',
    url: `/verify/restore/list/${id}`,
  });
/**
 * 查询一键接管验证结果列表
 * @param {Number} id 一键接管id
 */
const getTakeoverVerificationResultList = id =>
  baseApi.request({
    method: 'get',
    url: `/verify/takeover/list/${id}`,
  });

export {
  getRestoreVerificationResultList,
  getTakeoverVerificationResultList
};
