import baseApi from './base';

const login = ({ loginName, password, remeberMe }) =>
  baseApi.request({
    method: 'post',
    url: '/login',
    data: {
      loginName,
      password,
      remeberMe,
    },
  });

const logout = ({ token }) =>
  baseApi.request({
    method: 'post',
    url: '/logout',
    data: {
      token,
    },
  });

const fetchUsersByToken = token =>
  baseApi.request({
    method: 'get',
    url: '/users',
    params: {
      token,
    },
  });

const fetchRolesByUserId = userId =>
  baseApi.request({
    method: 'get',
    url: `/users/${userId}/roles`,
  });

export { login, logout, fetchUsersByToken, fetchRolesByUserId };
