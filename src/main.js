import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store
import vuetify from './plugins/vuetify'; // Vuetify plugin
import './registerServiceWorker'

createApp(App)
  .use(router)
  .use(store) // Register the store with Vue
  .use(vuetify)
  .mount('#app');