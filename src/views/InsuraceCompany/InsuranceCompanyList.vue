<template>
  <v-container>
    <v-row justify="space-between">
      <v-col><h2>Insurance Comapny List</h2></v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openInsuranceCompanyModal()"
          >Add Insurance Company</v-btn
        >
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="insuranceCompnies"
      item-key="id"
      class="elevation-1 mt-4"
    >
      <!-- Use the full v-slot syntax here -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="blue" @click="openInsuranceCompanyModal(item)"
          >mdi-pencil</v-icon
        >
        <v-icon small color="red" @click="deleteinsuranceCompany(item.id)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal for AddDairy component -->
    <v-dialog v-model="insuranceComapnyModal" max-width="600px">
      <v-col cols="12">
        <v-card>
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title>
              {{
                editInsuranceCompany
                  ? "Edit insurance Company"
                  : "Add Insurance Company"
              }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="insuranceComapnyModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <add-insurance-company
              :editInsuranceCompany="editInsuranceCompany"
              @insurance-company-updated="fetchInsuranceCompnies"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
  </v-container>
</template>

<script>
import AddInsuranceCompany from "./AddInsuranceCompany.vue";
import { getOfflineDairies, deleteOfflineDairy } from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  components: { AddInsuranceCompany },
  data() {
    return {
      headers: [
        { title: "Insurance Company Name", key: "name" },
        { title: "Username", key: "username" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      insuranceCompnies: [],
      insuranceComapnyModal: false,
      editInsuranceCompany: null, // Holds dairy object if editing
    };
  },
  methods: {
    async fetchInsuranceCompnies() {
      if (navigator.onLine) {
        // Fetch dairies from the server
        const response = await axios.get(
          `${API_ROUTES.GET_USERS}?type=insurance`
        );
        this.insuranceCompnies = response.data.user;
      } else {
        // Load from offline storage
        this.insuranceCompnies = await getOfflineDairies();
      }
    },
    openInsuranceCompanyModal(insuranceCompany = null) {
      this.editInsuranceCompany = insuranceCompany;
      this.insuranceComapnyModal = true;
    },
    async deleteinsuranceCompany(insuranceCompanyId) {
      if (navigator.onLine) {
        await axios.delete(
          `${API_ROUTES.DELETE_USER}?id=${insuranceCompanyId}`
        );
      } else {
        // Offline delete (remove from IndexedDB)
        await deleteOfflineDairy(insuranceCompanyId);
      }
      this.fetchInsuranceCompnies(); // Refresh dairy list
    },
  },
  mounted() {
    this.fetchInsuranceCompnies(); // Load dairies on page load
  },
};
</script>

<style scoped>
.v-container {
  max-width: 800px;
  margin: auto;
}
</style>
