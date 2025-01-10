<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="insuranceCompanyName"
              label="Insurance Company Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="insuranceCompanyEmail"
              label="Insurance Company Email"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="username"
              label="Username"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-btn :disabled="!valid" color="primary" @click="submitForm">
              {{ editInsuranceCompany ? "Update" : "Add" }}
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
import { addDairyOffline, updateDairyOffline } from "@/utils/offlineService";
export default {
  props: ["editInsuranceCompany"],
  data() {
    return {
      insuranceCompanyName: this.editInsuranceCompany
        ? this.editInsuranceCompany.name
        : "",
      username: this.editInsuranceCompany
        ? this.editInsuranceCompany.username
        : "",
      insuranceCompanyEmail: this.editInsuranceCompany
        ? this.editInsuranceCompany.email
        : "",
      valid: false,
      errorMessage: "",
      successMessage: "",
      rules: {
        required: (v) => !!v || "This field is required",
      },
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
    };
  },
  components: {
    "error-warning-message": ErrorWarningMessage,
  },
  computed: {
    ...mapGetters("auth", ["user"]), // Get the current user from Vuex
  },
  methods: {
    close() {
      this.$emit("close");
    },
    // Check if the current user is a super admin
    isSuperAdmin() {
      return this.user && this.user.role === "superadmin";
    },
    async submitForm() {
      if (!this.isSuperAdmin()) {
        this.errorMessage = "You do not have permission to access this page.";
        return;
      }
      const insuranceComapnyData = {
        name: this.insuranceCompanyName,
        username: this.username,
        email: this.insuranceCompanyEmail,
        role: "insurance",
        type: "insurance",
        added_by: this.user.id,
      };
      if (navigator.onLine) {
        if (this.editInsuranceCompany) {
          insuranceComapnyData.id = this.editInsuranceCompany.id;
          try {
            const response = await axios.put(
              API_ROUTES.UPDATE_USER,
              insuranceComapnyData
            );
            console.log(response);
            this.successMessage = "insurance Comapny updated successfully!";
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message || "An error occurred";
          }
        } else {
          try {
            const response = await axios.post(
              API_ROUTES.REGISTER_USER,
              insuranceComapnyData
            );
            console.log(response);
            this.successMessage = "Insurance Comapny added successfully!";
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message || "An error occurred";
          }
        }
        this.$emit("insurance-company-updated");
        this.close();
      } else {
        if (this.editInsuranceCompany) {
          try {
            await updateDairyOffline(insuranceComapnyData);
            this.successMessage = "Dairy saved offline. Will sync when online.";
            this.clearForm();
          } catch (error) {
            this.errorMessage = "Could not update dairy offline.";
          }
        } else {
          try {
            await addDairyOffline(insuranceComapnyData);
            this.successMessage = "Dairy saved offline. Will sync when online.";
            this.clearForm();
          } catch (error) {
            this.errorMessage = "Could not save dairy offline.";
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
