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
          <v-card-title class="text-center">Login</v-card-title>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="username"
                label="Username"
                :rules="usernameRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                :rules="passwordRules"
                type="password"
                required
              ></v-text-field>
              <error-warning-message
                v-if="showError"
                :message="errorMessage"
                type="error"
                :show="showError"
                @close="clearError"
              />
              <v-btn
                :disabled="!valid"
                class="mt-4 bg-green-darken-2 text-white"
                @click="submit"
                block
              >
                Login
              </v-btn>

              <div class="mt-2 text-center">
                <router-link to="/forgot-password" class="text-grey-darken-1">
                  Forgot Password?
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
  name: "LoginView",
  components: {
    "error-warning-message": ErrorWarningMessage,
  },
  data() {
    return {
      username: "",
      password: "",
      valid: false,
      usernameRules: [(v) => !!v || "Username is required"],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  computed: {
    ...mapGetters("auth", ["errorMessage"]),
    showError() {
      return !!this.errorMessage;
    },
  },
  methods: {
    ...mapActions("auth", ["login", "clearErrorMessage"]),
    async submit() {
      try {
        const redirectPath = await this.login({
          username: this.username,
          password: this.password,
        });
        this.$router.push(redirectPath);
      } catch {
        // Error message is already handled by Vuex
      }
    },
    clearError() {
      this.clearErrorMessage();
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
