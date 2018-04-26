import types from '../../store/type';

const state = {
  breadcrumb: [],
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
};

export default { state, mutations };
