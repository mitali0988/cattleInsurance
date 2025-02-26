// store/modules/dairy.js

import {
  getOfflineDairies,
  saveDairiesOffline,
  deleteOfflineDairy,
} from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  namespaced: true,
  state: {
    dairies: [],
  },
  mutations: {
    SET_DAIRIES(state, dairies) {
      state.dairies = dairies;
    },
    ADD_DAIRY(state, dairy) {
      state.dairies.push(dairy);
    },
    DELETE_DAIRY(state, dairyId) {
      state.dairies = state.dairies.filter((dairy) => dairy.id !== dairyId);
    },
  },
  actions: {
    async fetchDairies({ commit }) {
      if (navigator.onLine) {
        const response = await axios.get(`${API_ROUTES.GET_USERS}?type=Dairy`);
        commit("SET_DAIRIES", response.data.user);
        await saveDairiesOffline(response.data.user); // Save to offline storage
      } else {
        const offlineDairies = await getOfflineDairies();
        commit("SET_DAIRIES", offlineDairies);
      }
    },
    async addDairy({ commit }, dairyData) {
      if (navigator.onLine) {
        const response = await axios.post(API_ROUTES.REGISTER_USER, dairyData);
        commit("ADD_DAIRY", response?.data);
      } else {
        // Save to offline if no internet
        await saveDairiesOffline([dairyData]);
      }
    },
    async deleteDairy({ commit }, dairyId) {
      if (navigator.onLine) {
        await axios.delete(`${API_ROUTES.DELETE_USER}?id=${dairyId}`);
        commit("DELETE_DAIRY", dairyId);
      } else {
        await deleteOfflineDairy(dairyId);
        commit("DELETE_DAIRY", dairyId);
      }
    },
  },
  getters: {
    dairies: (state) => state.dairies,
  },
};
