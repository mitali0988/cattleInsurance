// store/modules/loader.js
const state = {
  isLoading: false, // Loader state
};

const mutations = {
  SET_LOADING(state, status) {
    state.isLoading = status;
  },
};

const actions = {
  showLoader({ commit }) {
    commit('SET_LOADING', true);
  },
  hideLoader({ commit }) {
    commit('SET_LOADING', false);
  },
};

const getters = {
  isLoading: (state) => state.isLoading,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
