import baseApi from './base';

const fetchAll = () =>
  baseApi.request({
    method: 'get',
    url: '/total',
  });
export default fetchAll;
