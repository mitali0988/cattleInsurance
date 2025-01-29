// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { VTimePicker } from "vuetify/labs/VTimePicker";
// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify(
  {
    components: {
      VTimePicker,
    },
  }
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
);
