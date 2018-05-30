import types from '../type';
import { fetchAll, createOne, deleteOne, modifyOne } from '../../api/host';

const state = {
  hostInfo: [],
};

const mutations = {
  [types.GET_HOST](state, host) {
    state.hostInfo = host;
  },
  [types.ADD_HOST](state, data) {
    state.hostInfo.push(data);
  },
  [types.DEL_HOST](state, id) {
    state.hostInfo.forEach(index => {
      if (state.hostInfo[index].id === id) {
        state.hostInfo.splice(index, 1);
      }
    });
  },
  [types.UPDATE_HOST](state, data) {
    state.hostInfo.forEach(index => {
      if (state.hostInfo[index].id === data.id) {
        state.hostInfo[index] = data;
      }
    });
  }
};
const actions = {
  getHost({ commit }) {
    return fetchAll()
      .then(res => {
        const { data: host } = res.data;
        commit(types.GET_HOST, host);
      })
      .catch(error => Promise.reject(error));
  },
  addHost({ commit }, data) {
    return createOne(data)
      .then(res => {
        const { data: host } = res.data;
        commit(types.ADD_HOST, host);
      })
      .catch(error => Promise.reject(error));
  },
  delHost({ commit }, id) {
    return deleteOne(id)
      .then(() => {
        commit(types.DEL_HOST, id);
      })
      .catch(error => Promise.reject(error));
  },
  updateHost({ commit }, data) {
    return modifyOne(data)
      .then(res => {
        const { data: host } = res.data;
        commit(types.UPDATE_HOST, host);
      })
      .catch(error => Promise.reject(error));
  }
};
export default {
  state,
  mutations,
  actions,
};
