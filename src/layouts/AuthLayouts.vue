<template>
  <v-app>
    <!-- Header component, common across all authenticated pages -->
    <HeaderComponent :drawer="drawer" @toggle-drawer="toggleDrawer" />

    <!-- Menu component, common across all authenticated pages -->
    <MenuComponent v-model="drawer" />

    <!-- The actual page content will be rendered here -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue"; // Import Header component
import MenuComponent from "@/components/MenuComponent.vue"; // Import Menu component

export default {
  components: {
    HeaderComponent,
    MenuComponent,
  },
  data() {
    return {
      drawer: true, // Drawer starts as open
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer; // Toggle the drawer state
    },
  },
};
</script>
