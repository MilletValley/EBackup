import types from '../type';
import { fetchAll, createOne, deleteOne, modifyOne } from '../../api/host';

const state = {
  hosts: [],
};
/* eslint no-shadow: 0 */
const getters = {
  selectedHost: state => id => state.hosts.find(host => host.id === id) || {},
  oracleHosts: state => state.hosts.filter(host => host.databaseType === 1),
  sqlserverHosts: state =>
    state.hosts.filter(host => host.databaseType === 2),
  mysqlHosts: state => state.hosts.filter(host => host.databaseType === 5),
  db2Hosts: state => state.hosts.filter(host => host.databaseType === 6),
  dmHosts: state => state.hosts.filter(host => host.databaseType === 7)
};
const mutations = {
  [types.GET_HOST](state, host) {
    state.hosts = host;
  },
  [types.ADD_HOST](state, data) {
    state.hosts.push(data);
  },
  [types.DEL_HOST](state, id) {
    state.hosts.splice(state.hosts.findIndex(host => host.id === id), 1);
  },
  [types.UPDATE_HOST](state, data) {
    state.hosts.splice(
      state.hosts.findIndex(host => host.id === data.id),
      1,
      data
    );
  },
};
const actions = {
  fetchHost({ commit }) {
    return fetchAll()
      .then(res => {
        const { data: host } = res.data;
        commit(types.GET_HOST, host);
      })
      .catch(error => Promise.reject(error));
  },
  setHost({ commit }, host) {
    commit(types.GET_HOST, host);
  },
  createHost({ commit }, data) {
    return createOne(data)
      .then(res => {
        const { data: host } = res.data;
        // commit(types.ADD_HOST, host);
        return res;
      })
      .catch(error => Promise.reject(error));
  },
  deleteHost({ commit }, id) {
    return deleteOne(id)
      .then(() => {
        // commit(types.DEL_HOST, id);
      })
      .catch(error => Promise.reject(error));
  },
  updateHost({ commit }, data) {
    return modifyOne(data)
      .then(res => {
        const { data: host } = res.data;
        // FIXME: mock数据保持id一致，生产环境必须删除下面一行
        host.id = data.id;
        // commit(types.UPDATE_HOST, host);
        return res;
      })
      .catch(error => Promise.reject(error));
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
