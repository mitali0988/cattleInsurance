import { createStore } from 'vuex';
import auth from './auth';
import loader from './loader';
import offline from './offline';
import dairy from './modules/dairy';
export default createStore({
  modules: {
    auth,
    loader,
    offline,
    dairy
  },
});
