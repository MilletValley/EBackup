import types from '../type';
import { login, fetchUsersByToken, logout } from '../../api/user';
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
    return login(loginData).then(res => {
      const { data } = res.data;
      userToken.save(data.token, loginData.rememberMe ? 7 : undefined);
      commit(types.SET_TOKEN, data);
      return res.data;
    });
  },
  /**
   * 根据Token获取用户信息
   * @param {*} param0
   * @param {*} param1
   */
  getUserInfo({ commit }, { token }) {
    return fetchUsersByToken(token).then(res => {
      const { data: users } = res.data;
      if (users.length === 0) {
        // TODO: 理论上 应该不需要这个判断，如果Token失效，后端应该返回错误，被拦截
        return Promise.reject('Token无效');
      }
      commit(types.SET_USERINFO, users[0]);
      return users[0];
    });
  },

  /**
   * 使用Token登陆
   * @param {*} param0
   * @param {*} param1
   */
  loginByToken({ dispatch }, { token }) {
    return (
      dispatch('getUserInfo', { token })
        // .then(user => dispatch('getUserRoles', user))
        .then(user => dispatch('generateRoutes', user))
    );
  },
  /**
   * 根据角色，以及静态的router meta，生成动态的路由
   * @param {*} param0
   * @param {*} param1
   */
  generateRoutes(context, { roles }) {
    // TODO: 角色返回类型是对象则需要加上下面这句
    const _roles = roles.map(role => role.id);
    return new Promise(resolve => {
      let accessedRouters;
      if (_roles.indexOf('admin') >= 0) accessedRouters = asyncRouters;
      else {
        accessedRouters = asyncRouters.filter(v => {
          if (hasPermission(_roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(childRouter => {
                if (hasPermission(_roles, childRouter)) {
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
