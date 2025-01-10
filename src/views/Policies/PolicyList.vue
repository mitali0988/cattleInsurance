<template>
  <v-container>
    <v-row justify="space-between">
      <v-col><h2>Policy List</h2></v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="policies"
      item-key="id"
      class="elevation-1 mt-4"
    >
      <!-- Use the full v-slot syntax here -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="blue" @click="openPolicyModal(item)"
          >mdi-pencil</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal for AddCenter component -->
    <v-dialog v-model="policyModal" max-width="600px">
      <v-col cols="12">
        <v-card>
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title> Edit Policy </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="policyModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <add-policy
              :editPolicy="editPolicy"
              @policy-updated="fetchPolicies"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
  </v-container>
</template>

<script>
import AddPolicy from "./AddPolicy.vue";
import {
  getOfflinePolicies,
  deleteOfflinePolicies,
} from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  components: { AddPolicy },
  data() {
    return {
      headers: [
        { title: "Policy Number", key: "policyNumber" },
        { title: "Policy From Date", key: "fromDate" },
        { title: "Policy To Date", key: "toDate" },
        { title: "Policy Amount", key: "premiumAmount" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      policies: [],
      policyModal: false,
      editPolicy: null, // Holds center object if editing
    };
  },
  methods: {
    async fetchPolicies() {
      if (navigator.onLine) {
        // Fetch centers from the server
        const response = await axios.get(API_ROUTES.GET_POLICIES);
        this.policies = response.data.policy;
      } else {
        // Load from offline storage
        this.policies = await getOfflinePolicies();
      }
    },
    openPolicyModal(policy = null) {
      this.editPolicy = policy;
      this.policyModal = true;
    },
    async deletePolicy(policyId) {
      if (navigator.onLine) {
        await axios.delete(`${API_ROUTES.DELETE_POLICY}?id=${policyId}`);
      } else {
        // Offline delete (remove from IndexedDB)
        await deleteOfflinePolicies(policyId);
      }
      this.fetchPolicies(); // Refresh center list
    },
  },
  mounted() {
    this.fetchPolicies(); // Load centers on page load
  },
};
</script>

<style scoped>
.v-container {
  max-width: 800px;
  margin: auto;
}
</style>
