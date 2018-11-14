import types from '../../store/type';

const state = {
  breadcrumb: [],
  clientWidth: 0
};

/* eslint no-shadow: 0 */
const mutations = {
  [types.SET_BREADCRUMB](state, breadcrumb) {
    if (breadcrumb) {
      state.breadcrumb = breadcrumb;
    } else {
      state.breadcrumb = [];
    }
  },
  setClientWidth(state, width) {
    state.clientWidth = width;
  }
};

export default { state, mutations };
