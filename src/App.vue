<template>
  <v-app>
    <v-main>
      <AppLoader v-if="isLoading" />
      <!-- Global Loader -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppLoader from "./components/AppLoader.vue";
import { mapGetters } from "vuex";
import { syncOfflinePhotos } from "@/utils/offlineService";
export default {
  name: "App",
  created() {
    window.addEventListener("online", this.handleOnlineEvent);
  },
  beforeUnmount() {
    window.removeEventListener("online", this.handleOnlineEvent);
  },
  components: {
    AppLoader,
  },
  computed: {
    ...mapGetters("loader", ["isLoading"]), // Access Vuex loader state
  },
  data: () => ({
    //
  }),
  methods: {
    async handleOnlineEvent() {
      console.log("Detected online status. Starting offline data sync...");
      try {
        await syncOfflinePhotos();
        //this.$store.dispatch("dairy/fetchDairies");
        console.log("Offline data sync completed successfully.");
      } catch (error) {
        console.error("Error syncing offline data:", error);
      }
    },
  },
};
</script>
