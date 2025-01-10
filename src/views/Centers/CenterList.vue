<template>
  <v-container>
    <v-row justify="space-between">
      <v-col><h2>Center List</h2></v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openCenterModal()">Add Center</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="centers"
      item-key="id"
      class="elevation-1 mt-4"
    >
      <!-- Use the full v-slot syntax here -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="blue" @click="openCenterModal(item)"
          >mdi-pencil</v-icon
        >
        <v-icon small color="red" @click="deleteCenter(item.id)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal for AddCenter component -->
    <v-dialog v-model="centerModal" max-width="600px">
      <v-col cols="12">
        <v-card>
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title>
              {{ editCenter ? "Edit Center" : "Add Center" }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="centerModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <add-center
              :editCenter="editCenter"
              @center-updated="fetchCenters"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
    <!-- <v-dialog v-model="centerModal">
      <add-center :editCenter="editCenter" @center-updated="fetchCenters" />
    </v-dialog>-->
  </v-container>
</template>

<script>
import AddCenter from "@/views/Centers/AddCenter.vue";
import {
  getOfflineCenters,
  deleteOfflineCenters,
} from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  components: { AddCenter },
  data() {
    return {
      headers: [
        { title: "Center Name", key: "name" },
        { title: "Username", key: "username" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      centers: [],
      centerModal: false,
      editCenter: null, // Holds center object if editing
    };
  },
  methods: {
    async fetchCenters() {
      if (navigator.onLine) {
        // Fetch centers from the server
        const response = await axios.get(`${API_ROUTES.GET_USERS}?type=Center`);
        this.centers = response.data.user;
      } else {
        // Load from offline storage
        this.centers = await getOfflineCenters();
      }
    },
    openCenterModal(center = null) {
      this.editCenter = center;
      this.centerModal = true;
    },
    async deleteCenter(centerId) {
      if (navigator.onLine) {
        await axios.delete(`${API_ROUTES.DELETE_USER}?id=${centerId}`);
      } else {
        // Offline delete (remove from IndexedDB)
        await deleteOfflineCenters(centerId);
      }
      this.fetchCenters(); // Refresh center list
    },
  },
  mounted() {
    this.fetchCenters(); // Load centers on page load
  },
};
</script>

<style scoped>
.v-container {
  max-width: 800px;
  margin: auto;
}
</style>
