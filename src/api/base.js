import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store/index';
import router from '../router/index';
import types from '../store/type';

const baseApi = axios.create({
  baseURL: '/api/v1',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

baseApi.interceptors.response.use(undefined, error => {
  const { data, status } = error.response;
  if (status === 401) {
    // 401 NOT AUTHORIZED = token失效
    const { message } = data;
    Message.error({
      message,
    });
    store.commit(types.CLEAR_LOGININFO);
    router.push('/login');
  } else if (status === 403) {
    // 403 FORBIDDEN 权限不足
  }
});

export default baseApi;
