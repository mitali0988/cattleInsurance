<template>
  <v-container class="d-flex justify-center align-center" fill-height>
    <v-row class="d-flex justify-center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-5">
          <v-card-title class="d-flex justify-center">
            <v-img
              src="@/assets/cowlogo.jpg"
              alt="Logo"
              max-width="150"
            ></v-img>
          </v-card-title>
          <v-card-title class="text-center">Reset Password</v-card-title>
          <v-card-text>
            <v-form ref="resetPasswordForm" v-model="valid" lazy-validation>
              <!-- New Password Field -->
              <v-text-field
                v-model="newPassword"
                label="New Password"
                :rules="passwordRules"
                type="password"
                required
              ></v-text-field>

              <!-- Confirm Password Field -->
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                :rules="confirmPasswordRules"
                type="password"
                required
              ></v-text-field>

              <!-- Display dynamic success or error message using ErrorWarningMessage component -->
              <error-warning-message
                v-if="message"
                :message="message"
                :type="messageType"
                :show="showMessage"
                @close="clearMessages"
              />

              <v-btn
                :disabled="!valid"
                class="mt-4 bg-green-darken-2 text-white"
                @click="submit"
                block
              >
                Reset Password
              </v-btn>

              <div class="mt-2 text-center">
                <router-link to="/login" class="text-grey-darken-1">
                  Back to Login
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ErrorWarningMessage from "@/components/ErrorWarningMessage.vue";

export default {
  name: "ResetPassword",
  components: {
    "error-warning-message": ErrorWarningMessage,
  },
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      valid: false,
      resetToken: this.$route.query.reset || "", // Get token from query parameter if available
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Password must be at least 6 characters long",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Confirm Password is required",
        (v) => v === this.newPassword || "Passwords do not match",
      ],
      showMessage: false,
      message: "",
      messageType: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["errorMessage", "successMessage"]),
  },
  methods: {
    ...mapActions("auth", ["resetPassword", "clearMessages"]),
    async submit() {
      this.showMessage = false; // Hide the message before sending the request
      try {
        await this.$store.dispatch("auth/resetPassword", {
          token: this.resetToken,
          password: this.newPassword,
        });
        this.message = this.successMessage;
        this.messageType = "success"; // Set type to 'success'
        this.showMessage = true; // Show success message
      } catch (error) {
        this.message = this.errorMessage;
        this.messageType = "error"; // Set type to 'error'
        this.showMessage = true; // Show error message
      }
    },
    clearMessages() {
      this.showMessage = false;
      this.message = ""; // Clear the message
      this.messageType = ""; // Clear the message type
      this.clearMessages(); // Clear messages in Vuex store as well
    },
  },
};
</script>

<style scoped>
.v-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.v-card {
  width: 100%;
  max-width: 400px;
}
</style>
