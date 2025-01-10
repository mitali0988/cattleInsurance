<template>
  <v-app-bar app color="green-darken-2" dark>
    <!-- Drawer Toggle Button (Optional) -->
    <v-btn icon @click="toggleDrawer">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- Logo and Title -->
    <v-toolbar-title>
      <v-img
        src="@/assets/cowlogo.jpg"
        alt="Logo"
        max-width="40"
        class="mr-2"
      ></v-img>
    </v-toolbar-title>

    <!-- Spacer to push user info and logout button to the right -->
    <v-spacer></v-spacer>

    <!-- User name -->
    <div class="mr-4">
      <span>Welcome {{ user?.name }}</span>
    </div>

    <!-- Logout button -->
    <v-btn icon @click="logout" color="white">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex"; // For Vuex getters

export default {
  name: "HeaderComponent",

  computed: {
    // Retrieve user data from Vuex store
    ...mapGetters("auth", ["user"]),
  },

  methods: {
    // Method to toggle side drawer (if applicable)
    toggleDrawer() {
      this.$emit("toggle-drawer"); // You can implement drawer toggle in the parent component
    },

    // Logout the user and clear the session
    logout() {
      this.$store.dispatch("auth/logout"); // Vuex action to log out the user
      this.$router.push("/login"); // Redirect to login page
    },
  },
};
</script>

<style>
/* Add custom styles if needed */
</style>
