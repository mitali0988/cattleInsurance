
export default {
  namespaced: true,
  state: {
    cattleData: null,
  },
  mutations: {
    setCattleData(state, data) {
      state.cattleData = data;  // Mutate the state with new data
    }
  },
  actions: {
    fetchCattleData({ commit }, cattleId) {
      // Fetch cattle data from API
      axios.get(`/api/cattle/${cattleId}`).then(response => {
        commit('setCattleData', response.data);  // Set the fetched data to state
      });
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    errorMessage: (state) => state.errorMessage,
    successMessage: (state) => state.successMessage, 
    user(state) {
      return state.user;
    },
  },
};
