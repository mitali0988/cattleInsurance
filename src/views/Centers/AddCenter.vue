<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form v-model="valid" ref="form">
            <v-text-field
              v-model="centerName"
              label="Center Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="centerEmail"
              label="Center Email"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="username"
              label="Username"
              :rules="[rules.required]"
              required
              :readonly="editCenter"
            ></v-text-field>

            <v-btn :disabled="!valid" color="primary" @click="submitForm">
              {{ editCenter ? "Update" : "Add" }}
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
import { addCenterOffline, updateCenterOffline } from "@/utils/offlineService";
export default {
  props: ["editCenter"],
  data() {
    return {
      centerName: this.editCenter ? this.editCenter.name : "",
      username: this.editCenter ? this.editCenter.username : "",
      centerEmail: this.editCenter ? this.editCenter.email : "",
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
    async submitForm() {
      const centerData = {
        name: this.centerName,
        username: this.username,
        email: this.centerEmail,
        role: "Admin",
        type: "Center",
        added_by: this.user.id,
      };
      if (navigator.onLine) {
        if (this.editCenter) {
          centerData.id = this.editCenter.id;
          try {
            const response = await axios.put(
              API_ROUTES.UPDATE_USER,
              centerData
            );
            console.log(response);
            this.successMessage = "Center updated successfully!";
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message || "An error occurred";
          }
        } else {
          try {
            const response = await axios.post(
              API_ROUTES.REGISTER_USER,
              centerData
            );
            console.log(response);
            this.successMessage = "Center added successfully!";
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message || "An error occurred";
          }
        }
        this.$emit("center-updated");
        this.close();
      } else {
        if (this.editCenter) {
          try {
            await updateCenterOffline(centerData);
            this.successMessage =
              "Center saved offline. Will sync when online.";
            this.clearForm();
          } catch (error) {
            this.errorMessage = "Could not update center offline.";
          }
        } else {
          try {
            await addCenterOffline(centerData);
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
