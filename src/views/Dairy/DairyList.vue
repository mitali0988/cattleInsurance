<template>
  <v-container>
    <v-row justify="space-between">
      <v-col><h2>Dairy List</h2></v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openDairyModal()">Add Dairy</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="dairies"
      item-key="id"
      class="elevation-1 mt-4"
    >
      <!-- Use the full v-slot syntax here -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="blue" @click="openDairyModal(item)"
          >mdi-pencil</v-icon
        >
        <v-icon small color="red" @click="handleDeleteDairy(item.id)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal for AddDairy component -->
    <v-dialog v-model="dairyModal" max-width="600px">
      <v-col cols="12">
        <v-card>
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title>
              {{ editDairy ? "Edit Dairy" : "Add Dairy" }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dairyModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <add-dairy :editDairy="editDairy" @dairy-updated="fetchDairies" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AddDairy from "@/views/Dairy/AddDairy.vue";

export default {
  components: { AddDairy },
  data() {
    return {
      headers: [
        { title: "Dairy Name", key: "name" },
        { title: "Username", key: "username" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      dairyModal: false,
      editDairy: null, // Holds dairy object if editing
    };
  },
  computed: {
    ...mapState("dairy", ["dairies"]),
  },
  methods: {
    ...mapActions("dairy", ["fetchDairies", "deleteDairy"]),
    openDairyModal(dairy = null) {
      this.editDairy = dairy;
      this.dairyModal = true;
    },
    async handleDeleteDairy(dairyId) {
      await this.deleteDairy(dairyId); // Use Vuex action to delete dairy
      this.fetchDairies(); // Refresh dairy list
    },
  },
  mounted() {
    this.fetchDairies(); // Fetch dairies on component mount
  },
};
/*import { mapState } from "vuex";
import AddDairy from "@/views/Dairy/AddDairy.vue";
import {
  getOfflineDairies,
  saveDairiesOffline,
  deleteOfflineDairy,
} from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  components: { AddDairy },
  data() {
    return {
      headers: [
        { title: "Dairy Name", key: "name" },
        { title: "Username", key: "username" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      dairies: [],
      dairyModal: false,
      editDairy: null, // Holds dairy object if editing
    };
  },
  computed: {
    ...mapState("dairy", ["dairies"]),
  },
  methods: {
    async fetchDairies() {
      if (navigator.onLine) {
        // Fetch dairies from the server
        const response = await axios.get(`${API_ROUTES.GET_USERS}?type=Dairy`);
        this.dairies = response.data.user;
        await saveDairiesOffline(this.dairies);
      } else {
        // Load from offline storage
        this.dairies = await getOfflineDairies();
      }
    },
    openDairyModal(dairy = null) {
      this.editDairy = dairy;
      this.dairyModal = true;
    },
    async deleteDairy(dairyId) {
      if (navigator.onLine) {
        await axios.delete(`${API_ROUTES.DELETE_USER}?id=${dairyId}`);
      } else {
        // Offline delete (remove from IndexedDB)
        await deleteOfflineDairy(dairyId);
      }
      this.fetchDairies(); // Refresh dairy list
    },
  },
  mounted() {
    this.fetchDairies(); // Load dairies on page load
  },
  created() {
    this.$root.$on("data-synced", this.fetchDairies);
  },
  beforeUnmount() {
    this.$root.$off("data-synced", this.fetchDairies);
  },
};*/
</script>

<style scoped>
.v-container {
  max-width: 800px;
  margin: auto;
}
</style>
