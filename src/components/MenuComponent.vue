<template>
  <v-navigation-drawer app v-model="drawer" permanent>
    <v-list dense>
      <!-- Loop over all children routes and create a list item for each -->
      <v-list-item v-for="route in filteredChildRoutes" :key="route.path" link>
        <!-- Only render list item if route has a valid title -->
        <v-list-item-title
          v-if="route.meta.title"
          @click="navigateTo(route.path)"
        >
          {{ route.meta.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import store from "@/store"; // Import Vuex store
export default {
  name: "MenuComponent",
  data() {
    return {
      drawer: true, // Control the drawer open/close state
    };
  },
  computed: {
    userRole() {
      const user = store.getters["auth/user"];
      return user.role; // Adjust as per your Vuex structure
    },

    // Fetch authenticated routes from the router, including nested child routes
    authRoutes() {
      // We filter the routes that require authentication, from the root layout.
      return this.$router.options.routes.filter(
        (route) => route.meta?.requiresAuth && route.children
      );
    },

    filteredChildRoutes() {
      return this.getAllChildRoutes(this.authRoutes).filter((route) => {
        // Check if the route's allowedRoles includes the user role
        return (
          !route.meta.allowedRoles || // Show if no specific allowedRoles defined
          route.meta.allowedRoles.includes(this.userRole) // Show if role matches
        );
      });
    },
  },
  methods: {
    // Recursive function to get all child routes from the parent routes
    getAllChildRoutes(routes) {
      let childRoutes = [];

      routes.forEach((route) => {
        if (route.children) {
          // Only push child routes, not the parent route itself
          route.children.forEach((childRoute) => {
            // Add the child route only if it has a valid title
            if (childRoute.meta?.title) {
              childRoutes.push(childRoute);
            }
          });
        }
      });

      return childRoutes;
    },

    // Handle navigation to selected route
    navigateTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
