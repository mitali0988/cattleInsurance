import AuthService from '@/api/authService';
import TokenService from '@/utils/tokenService';

export default {
  namespaced: true,
  state: {
    token: TokenService.getToken() || '',
    user: TokenService.getUser() || {},
    errorMessage: '',
    successMessage: '', 
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ERROR_MESSAGE(state, message) {
      state.errorMessage = message;
    },
    SET_SUCCESS_MESSAGE(state, message) {
      state.successMessage = message; // Store the success message
    },
    CLEAR_ERROR_MESSAGE(state) {
      state.errorMessage = '';
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await AuthService.login(credentials);
        if (response.token) {
          commit('SET_TOKEN', response.token);
          commit('SET_USER', response.user);
          return response.redirect || '/dashboard';
        }
      } catch (error) {
        commit('SET_ERROR_MESSAGE', error.message);
        throw error;
      }
    },
    async forgotPassword({ commit }, email) {
      try {
        const response = await AuthService.forgotPassword(email);
        commit('SET_SUCCESS_MESSAGE', 'Password reset link sent to your email.');
        return response;
      } catch (error) {
        // Commit the error message to Vuex store
        commit('SET_ERROR_MESSAGE', error.message || 'Something went wrong. Please try again.');
        throw error;
      }
    },
    async resetPassword({ commit }, { token, password }) {
      try {
        const response = await AuthService.resetPassword(token, password);
        commit('SET_SUCCESS_MESSAGE', 'Your password has been successfully reset.');
        return response;
      } catch (error) {
        commit('SET_ERROR_MESSAGE', error.message || 'An error occurred. Please try again later.');
        throw error;
      }
    },
    async changePassword({ commit }, password) {
      try {
        const response = await AuthService.changePassword(password);
        commit('SET_SUCCESS_MESSAGE', 'Your password has been successfully reset.');
        return response;
      } catch (error) {
        commit('SET_ERROR_MESSAGE', error.message || 'An error occurred. Please try again later.');
        throw error;
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit('SET_TOKEN', '');
      commit('SET_USER', {});
    },
    clearErrorMessage({ commit }) {
      commit('CLEAR_ERROR_MESSAGE');
    },
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
