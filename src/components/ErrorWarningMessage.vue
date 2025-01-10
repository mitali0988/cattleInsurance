<template>
  <v-alert
    v-if="show"
    :type="type"
    :value="true"
    dismissible
    class="mt-3"
    @input="closeAlert"
  >
    <v-icon left>
      {{ icon }}
    </v-icon>
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "error", // can be 'error', 'warning', 'info', 'success'
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    icon() {
      switch (this.type) {
        case "error":
          return "mdi-alert-circle";
        case "warning":
          return "mdi-alert";
        case "info":
          return "mdi-information";
        case "success":
          return "mdi-check-circle";
        default:
          return "mdi-alert-circle";
      }
    },
  },
  methods: {
    closeAlert() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
