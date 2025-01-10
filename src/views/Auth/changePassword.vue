<template>
  <v-container class="d-flex justify-center align-center" fill-height>
    <v-card class="pa-5">
      <v-card-title class="text-center">Change Password</v-card-title>
      <v-card-text>
        <v-form ref="changePasswordForm" v-model="valid" lazy-validation>
          <!-- New Password -->
          <v-text-field
            v-model="newPassword"
            label="New Password"
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>

          <!-- Confirm New Password -->
          <v-text-field
            v-model="confirmPassword"
            label="Confirm New Password"
            :rules="confirmPasswordRules"
            type="password"
            required
          ></v-text-field>

          <!-- Error and Success Message -->
          <error-warning-message
            v-if="message"
            :message="message"
            :type="messageType"
            :show="showMessage"
            @close="clearMessages"
          />
          <!-- Change Password Button -->
          <v-btn
            :disabled="!valid"
            class="mt-4 bg-green-darken-2 text-white"
            @click="submit"
            block
          >
            Change Password
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ErrorWarningMessage from "@/components/ErrorWarningMessage.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ChangePassword",
  components: {
    "error-warning-message": ErrorWarningMessage,
  },
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      valid: false,
      showMessage: false,
      message: "",
      messageType: "",
      passwordRules: [(v) => !!v || "Password is required"],
      confirmPasswordRules: [
        (v) => v === this.newPassword || "Passwords do not match",
      ],
    };
  },
  computed: {
    ...mapGetters("auth", ["errorMessage", "successMessage"]),
  },
  methods: {
    ...mapActions("auth", ["changePassword", "clearMessages"]),
    async submit() {
      this.showMessage = false;
      try {
        // Call the changePassword method in authService
        console.log("ccccc", this.newPassword);
        await this.changePassword(this.newPassword);

        // Handle success response
        this.message = this.successMessage;
        this.messageType = "success"; // Set type to 'success'
        this.showMessage = true;
        // Optionally, redirect to login or another page
        // this.$router.push("/login");
      } catch (err) {
        this.message = this.errorMessage;
        this.messageType = "error"; // Set type to 'error'
        this.showMessage = true;
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
  min-height: 100vh; /* Full viewport height */
}

.v-card {
  width: 100%;
  max-width: 400px; /* Optional, to limit card width */
}
</style>
