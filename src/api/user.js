import baseApi from './base';

const login = ({ loginName, password, rememberMe }) =>
  baseApi.request({
    method: 'post',
    url: '/login',
    data: {
      loginName,
      password,
      rememberMe,
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

const createUserInfo = ({ user }) =>
  baseApi.request({
    method: 'post',
    url: '/users',
    data: {
      user,
    },
  });

const getUsersInfo = () =>
  baseApi.request({
    method: 'get',
    url: '/users',
    data: {},
  });

const updateUserInfo = ({ id, user }) =>
  baseApi.request({
    method: 'patch',
    url: `/users/${id}`,
    data: {
      user,
    },
  });

const resetPassword = ({ id, password }) =>
  baseApi.request({
    method: 'patch',
    url: `/users/${id}`,
    data: {
      id,
      password,
    },
  });

const deleteUserInfo = ({ id }) =>
  baseApi.request({
    method: 'delete',
    url: `/users/${id}`,
    data: {},
  });

const deleteUsersInfo = ({ ids }) =>
  baseApi.request({
    method: 'delete',
    url: '/users',
    data: {
      ids,
    },
  });

export {
  login,
  logout,
  fetchUsersByToken,
  createUserInfo,
  getUsersInfo,
  updateUserInfo,
  resetPassword,
  deleteUserInfo,
  deleteUsersInfo,
};
