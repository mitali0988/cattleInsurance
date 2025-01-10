<template>
  <v-container>
    <v-row justify="space-between">
      <v-col><h2>Doctor List</h2></v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openDoctorModal()">Add Doctor</v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="doctors"
      item-key="id"
      class="elevation-1 mt-4"
    >
      <!-- Use the full v-slot syntax here -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small color="blue" @click="openDoctorModal(item)"
          >mdi-pencil</v-icon
        >
        <v-icon small color="red" @click="deleteDoctor(item.id)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>

    <!-- Modal for AddCenter component -->
    <v-dialog v-model="doctorModal" max-width="600px">
      <v-col cols="12">
        <v-card>
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title>
              {{ editDoctor ? "Edit Doctor" : "Add Doctor" }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="doctorModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <add-doctor
              :editDoctor="editDoctor"
              @doctor-updated="fetchDoctors"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
    <!-- <v-dialog v-model="doctorModal">
      <add-doctor :editDoctor="editDoctor" @doctor-updated="fetchDoctors" />
    </v-dialog>-->
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import AddDoctor from "@/views/Doctors/AddDoctor.vue";
import {
  getOfflineDoctors,
  deleteOfflineDoctors,
} from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  components: { AddDoctor },
  data() {
    return {
      headers: [
        { title: "Doctor Name", key: "name" },
        { title: "Username", key: "username" },
        { title: "Email", key: "email" },
        { title: "Phone", key: "phone" },
        { title: "Registration Code", key: "registrationCode" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      doctors: [],
      doctorModal: false,
      editDoctor: null, // Holds center object if editing
    };
  },
  computed: {
    ...mapGetters("auth", ["user"]), // Get the current user from Vuex
  },
  methods: {
    async fetchDoctors() {
      if (navigator.onLine) {
        // Fetch centers from the server
        let response = [];
        if (this.user.type == "Center") {
          response = await axios.get(
            `${API_ROUTES.GET_USERS}?type=Doctor&center_id=${this.user.id}`
          );
        } else if (this.user.type == "Dairy") {
          response = await axios.get(
            `${API_ROUTES.GET_USERS}?type=Doctor&dairy_id=${this.user.id}`
          );
        } else {
          response = await axios.get(`${API_ROUTES.GET_USERS}?type=Doctor`);
        }
        this.doctors = response.data.user;
      } else {
        // Load from offline storage
        this.doctos = await getOfflineDoctors();
      }
    },
    openDoctorModal(doctor = null) {
      this.editDoctor = doctor;
      this.doctorModal = true;
    },
    async deleteDoctor(doctorId) {
      if (navigator.onLine) {
        await axios.delete(`${API_ROUTES.DELETE_USER}?id=${doctorId}`);
      } else {
        // Offline delete (remove from IndexedDB)
        await deleteOfflineDoctors(doctorId);
      }
      this.fetchDoctors(); // Refresh center list
    },
  },
  mounted() {
    this.fetchDoctors(); // Load centers on page load
  },
};
</script>

<style scoped>
.v-container {
  max-width: 800px;
  margin: auto;
}
</style>
