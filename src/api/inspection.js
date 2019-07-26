import baseApi from './base';

const updateInspectionActive = (url, data) =>
  baseApi.request({
    methods: 'post',
    data,
    url: '/inspection/activate'
  });

export {
  updateInspectionActive
};
