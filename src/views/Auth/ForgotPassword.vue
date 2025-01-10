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
          <v-card-title class="text-center">Forgot Password</v-card-title>
          <v-card-text>
            <v-form ref="forgotPasswordForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
                required
              ></v-text-field>

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
                Send Reset Link
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
  name: "ForgotPassword",
  components: {
    "error-warning-message": ErrorWarningMessage,
  },
  data() {
    return {
      email: "",
      valid: false,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      showMessage: false, // Controls whether to show message
      message: "", // Holds the message text
      messageType: "", // Holds the message type ('error' or 'success')
    };
  },
  computed: {
    ...mapGetters("auth", ["errorMessage", "successMessage"]),
  },
  methods: {
    ...mapActions("auth", ["forgotPassword", "clearErrorMessage"]),
    async submit() {
      this.showMessage = false;
      try {
        await this.forgotPassword(this.email); // Call the AuthService's forgotPassword method
        this.message = this.successMessage;
        this.messageType = "success"; // Set type to 'success'
        this.showMessage = true; // Show success message

        //this.$router.push("/login"); // Redirect to login after successful request
      } catch (error) {
        this.message = this.errorMessage;
        this.messageType = "error"; // Set type to 'error'
        this.showMessage = true; // Show error message

        // Error message is already handled by Vuex
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
