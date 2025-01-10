<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="doctorName"
              label="Doctor Name"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model="doctorEmail"
              label="Email"
              outlined
              :rules="[
                (v) => !!v || 'Email is required',
                (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
              ]"
              required
            ></v-text-field>

            <v-text-field
              v-model="registrationCode"
              label="Registration Code"
              outlined
              type="text"
              :rules="[(v) => !!v || 'Registration Code is required']"
              required
              :readonly="editDoctor"
            ></v-text-field>

            <!-- Phone -->
            <v-text-field
              v-model="phone"
              label="Phone"
              outlined
              :rules="[(v) => !!v || 'Phone number is required']"
            ></v-text-field>

            <v-select
              v-model="selectedCenter"
              :items="centers"
              item-title="name"
              item-value="id"
              label="Select Center"
              :rules="[rules.required]"
              required
            ></v-select>

            <v-btn :disabled="!valid" color="primary" @click="submitForm">
              {{ editDoctor ? "Update" : "Add" }}
            </v-btn>
          </v-form>

          <error-warning-message
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            :show="errorMessage !== ''"
            @close="errorMessage = ''"
          />
          <error-warning-message
            v-if="successMessage"
            :message="successMessage"
            type="success"
            :show="successMessage !== ''"
            @close="successMessage = ''"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "@/utils/api";
import ErrorWarningMessage from "@/components/ErrorWarningMessage";
import { API_ROUTES } from "@/utils/apiConstants";
import {
  addDoctorOffline,
  updateDoctorOffline,
  getOfflineCenters,
  // addCenterOffline,
} from "@/utils/offlineService";
export default {
  props: ["editDoctor"],
  data() {
    return {
      doctorName: this.editDoctor ? this.editDoctor.name : "",
      doctorEmail: this.editDoctor ? this.editDoctor.email : "",
      registrationCode: this.editDoctor ? this.editDoctor.registrationCode : "",
      phone: this.editDoctor ? this.editDoctor.phone : "",
      selectedCenter: this.editDoctor ? this.editDoctor.center_id : null, // Track selected center
      centers: [], // Store center options
      valid: false,
      errorMessage: "",
      successMessage: "",
      rules: {
        required: (v) => !!v || "This field is required",
      },
    };
  },
  mounted() {
    this.fetchCenters();
  },
  components: {
    "error-warning-message": ErrorWarningMessage,
  },
  computed: {
    ...mapGetters("auth", ["user"]), // Get the current user from Vuex
  },
  methods: {
    async fetchCenters() {
      if (navigator.onLine) {
        try {
          let response = [];
          if (this.user.type == "Center") {
            response = await axios.get(
              `${API_ROUTES.GET_USERS}?type=Center&added_by=${this.user.added_by}`
            );
          } else {
            response = await axios.get(`${API_ROUTES.GET_USERS}?type=Center`);
          }

          this.centers = response.data.user;
          //await addCenterOffline(this.centers); // Cache centers offline
        } catch (error) {
          this.errorMessage =
            error.response?.data?.message || "Failed to fetch centers";
        }
      } else {
        // Load centers from offline storage
        this.centers = await getOfflineCenters();
      }
    },
    close() {
      this.$emit("close");
    },
    // Check if the current user is a super admin
    async submitForm() {
      const doctorData = {
        name: this.doctorName,
        username: this.registrationCode,
        email: this.doctorEmail,
        registrationCode: this.registrationCode,
        phone: this.phone,
        role: "Doctor",
        type: "Doctor",
        added_by: this.user.id,
        center_id: this.selectedCenter, // Include selected center ID
      };
      if (navigator.onLine) {
        if (this.editDoctor) {
          doctorData.id = this.editDoctor.id;
          try {
            const response = await axios.put(
              API_ROUTES.UPDATE_USER,
              doctorData
            );
            console.log(response);
            this.successMessage = "Doctor updated successfully!";
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message || "An error occurred";
          }
        } else {
          try {
            const response = await axios.post(
              API_ROUTES.REGISTER_USER,
              doctorData
            );
            console.log(response);
            this.successMessage = "Doctor added successfully!";
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message || "An error occurred";
          }
        }
        this.$emit("doctor-updated");
        this.close();
      } else {
        if (this.editDoctor) {
          try {
            await updateDoctorOffline(doctorData);
            this.successMessage =
              "Doctor saved offline. Will sync when online.";
            this.clearForm();
          } catch (error) {
            this.errorMessage = "Could not update center offline.";
          }
        } else {
          try {
            await addDoctorOffline(doctorData);
            this.successMessage =
              "Center saved offline. Will sync when online.";
            this.clearForm();
          } catch (error) {
            this.errorMessage = "Could not save center offline.";
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 20px;
}
</style>
