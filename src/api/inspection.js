import axios from 'axios';

const sendServerConfig = (url, data) =>
  axios.request({
    method: 'post',
    url: `http://${url}/api/v1/inspection/ebackup-config`,
    data,
    headers: { 'Content-Type': 'application/json' }
  });

const fetchInspectStatistics = url =>
  axios.request({
    method: 'get',
    url: `http://${url}/api/v1/inspection/home/count`,
  });

export {
  sendServerConfig,
  fetchInspectStatistics
};
