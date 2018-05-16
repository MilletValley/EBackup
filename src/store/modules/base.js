import isEmpty from 'lodash/isEmpty';
import types from '../type';
import { login, validateToken, logout } from '../../api/user';
import { userToken } from '../../utils/storage';
import { basicRouters, asyncRouters } from '../../router';

const state = {
  token: '',
  userInfo: {},
  roles: [],
  // routers: [], // 不显示定义就不会报错？
};
const getters = {
  userId(state) {
    return state.userInfo.id;
  },
  loginName(state) {
    return state.userInfo.loginName;
  },
  userName(state) {
    return state.userInfo.userName;
  },
  password(state) {
    return state.userInfo.password;
  },
};
/* eslint no-shadow: 0 */
const mutations = {
  [types.SET_TOKEN](state, { token }) {
    state.token = token;
  },
  [types.CLEAR_TOKEN](state) {
    state.token = '';
  },
  [types.SET_USERINFO](state, payload) {
    state.userInfo = payload;
  },
  [types.CLEAR_LOGININFO](state) {
    state.token = '';
    state.userInfo = {};
    state.roles = [];
    state.routers = [];
  },
  [types.SET_ROUTERS](state, routers) {
    state.routers = [...basicRouters, ...routers];
  },
  [types.UPDATE_USERINFO](state, form) {
    state.userInfo.loginName = form.newUsername;
    state.userInfo.password = form.newPassword;
  },
};

const hasPermission = (roles, route) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0);
  }
  return true;
};

const actions = {
  /**
   * 登陆获得Token
   * @param {*} param0
   * @param {*} loginData
   */
  loginForToken({ commit }, loginData) {
    // loginData: { loginName, password, rememberMe }
    return login(loginData)
      .then(res => {
        const { data } = res.data;
        userToken.save(data.token, loginData.rememberMe ? 7 : undefined);
        commit(types.SET_TOKEN, data);
        return res.data;
      })
      .catch(error => Promise.reject(error));
  },
  /**
   * 根据Token获取用户信息
   * @param {*} param0
   * @param {*} param1
   */
  getUserInfo({ commit }, { token }) {
    return validateToken(token).then(res => {
      const { data: user, message } = res.data;
      if (isEmpty(user)) {
        return Promise.reject(message);
      }
      commit(types.SET_USERINFO, user);
      return user;
    });
  },
  /**
   * 更新用户信息
   * @param {*} param0
   * @param {*} param1
   */
  updateUserInfo({ commit }, form) {
    commit('types.UPDATE_USERINFO', form);
  },
  /**
   * 使用Token登陆
   * @param {*} param0
   * @param {*} param1
   */
  loginByToken({ dispatch }, { token }) {
    return dispatch('getUserInfo', { token }).then(user =>
      dispatch('generateRoutes', user)
    );
  },
  /**
   * 根据角色，以及静态的router meta，生成动态的路由
   * @param {*} param0
   * @param {*} param1
   */
  generateRoutes(context, { roles }) {
    const roleIds = roles.map(role => role.id);
    return new Promise(resolve => {
      let accessedRouters;
      if (roleIds.indexOf('admin') >= 0) accessedRouters = asyncRouters;
      else {
        accessedRouters = asyncRouters.filter(v => {
          if (hasPermission(roleIds, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(childRouter => {
                if (hasPermission(roleIds, childRouter)) {
                  return childRouter;
                }
                return false;
              });
            }
            return v;
          }
          return false;
        });
      }
      context.commit(types.SET_ROUTERS, accessedRouters);
      resolve(accessedRouters);
    });
  },
  /**
   * 全套登陆流程
   * @param {*} param0
   * @param {*} loginData
   */
  loginForAll({ dispatch }, loginData) {
    return dispatch('loginForToken', loginData).then(({ data }) =>
      dispatch('loginByToken', { token: data.token })
    );
  },
  logout({ commit }, token) {
    return logout({ token }).then(res => {
      const { message } = res.data;
      commit(types.CLEAR_LOGININFO);
      userToken.remove();
      return message;
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
