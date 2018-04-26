import types from '../../store/type';

const state = {
  breadcrumb: [],
};

/* eslint no-shadow: 0 */
const mutations = {
  [types.SET_BREADCRUMB](state, breadcrumb) {
    state.breadcrumb = breadcrumb;
  },
};

export default { state, mutations };
