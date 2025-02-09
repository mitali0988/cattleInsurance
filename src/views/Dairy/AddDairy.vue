<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="dairyName"
              label="Dairy Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="dairyEmail"
              label="Diary Email"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="username"
              label="Username"
              :rules="[rules.required]"
              required
              :readonly="editDairy != null"
            ></v-text-field>

            <v-btn :disabled="!valid" color="primary" @click="submitForm">
              {{ editDairy ? "Update" : "Add" }}
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
  props: ["editDairy"],
  data() {
    return {
      dairyName: this.editDairy ? this.editDairy.name : "",
      username: this.editDairy ? this.editDairy.username : "",
      dairyEmail: this.editDairy ? this.editDairy.email : "",
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
      const dairyData = {
        name: this.dairyName,
        username: this.username,
        email: this.dairyEmail,
        role: "Admin",
        type: "Dairy",
        added_by: this.user.id,
      };
      if (navigator.onLine) {
        try {
          const response = this.editDairy
            ? await axios.put(API_ROUTES.UPDATE_USER, {
                ...dairyData,
                id: this.editDairy.id,
              })
            : await axios.post(API_ROUTES.REGISTER_USER, dairyData);

          this.successMessage =
            response?.message || "Dairy processed successfully!";
          this.$emit("dairy-updated");
          this.close();
        } catch (error) {
          this.errorMessage =
            error.response?.data?.message || "An error occurred";
        }
      } else {
        try {
          if (this.editDairy) {
            await updateDairyOffline({ ...dairyData, id: this.editDairy.id });
          } else {
            await addDairyOffline(dairyData);
          }

          this.successMessage =
            "Saved offline. Syncing will occur when online.";
          //this.clearForm();
          this.$emit("dairy-updated");
        } catch (error) {
          console.log(error);
          this.errorMessage = "Failed to save offline.";
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
