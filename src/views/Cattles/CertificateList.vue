<template>
  <v-container>
    <v-row justify="space-between">
      <v-col><h2>Certificate List</h2></v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="certificates"
      item-key="id"
      class="elevation-1 mt-4"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="blue" @click="openDownloadLink(item)"
          >mdi-download</v-icon
        >
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { getOfflineDairies } from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  data() {
    return {
      headers: [
        { title: "Certificate Type", key: "file_type" },
        { title: "Created At", key: "created_at" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      certificates: [],
    };
  },
  methods: {
    async fetchCertificates() {
      if (navigator.onLine) {
        // Fetch dairies from the server
        const response = await axios.get(
          `${API_ROUTES.GET_CERTIFICATES}?id=${this.$route.params.cattleId}`
        );
        this.certificates = response.data.certificates;
      } else {
        // Load from offline storage
        this.certificates = await getOfflineDairies();
      }
    },
    openDownloadLink(item) {
      console.log("aaaaaaaaaaaa", item);
      if (item.file_url) {
        window.open(item.file_url, "_blank"); // Open link in a new tab
      } else {
        console.error("No download link available");
      }
    },
  },
  mounted() {
    this.fetchCertificates(); // Load dairies on page load
  },
};
</script>

<style scoped>
.v-container {
  max-width: 800px;
  margin: auto;
}
</style>
