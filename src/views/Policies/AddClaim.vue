<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form v-model="valid" ref="form">
            <!-- New Fields -->
            <v-text-field
              v-model="claimNumber"
              label="Claim Number"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-row>
              <v-col cols="12" md="6">
                <!-- From Date Picker -->
                <v-menu
                  v-model="lossDateMenu"
                  activator="parent"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  max-width="300"
                  offset-y
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="lossDateDisplay"
                      label="Date of loss"
                      readonly
                      v-bind="props"
                      @click="lossDateMenu = true"
                      :error="lossDateError"
                      required
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="lossDate"
                    show-adjacent-months
                    scrollable
                    @update:model-value="selectLossDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-text-field
              v-model="investigator"
              label="Investigator"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-file-input
              v-model="claimDocument"
              label="Upload Claim Document"
              :rules="[rules.required]"
              accept=".pdf,.doc,.docx"
              required
            ></v-file-input>

            <!-- Submit Button -->
            <v-btn :disabled="!valid" color="primary" @click="submitForm">
              Add
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
//import { addPolicyOffline, updatePolicyOffline } from "@/utils/offlineService";

export default {
  props: ["cattleId"],
  data() {
    return {
      claimNumber: "",
      investigator: "",
      claimDocument: null, // Stores the uploaded document
      lossDate: null, // Selected raw From Date
      lossDateDisplay: "", // Formatted From Date
      lossDateMenu: false, // From Date menu visibility
      lossDateError: false, // Tracks validation for "From Date"
      valid: false,
      errorMessage: "",
      successMessage: "",
      rules: {
        required: (v) => !!v || "This field is required",
        toDateAfterFromDate: (v) =>
          !this.fromDate ||
          new Date(v) >= new Date(this.fromDate) ||
          "To Date must be after From Date",
      },
    };
  },
  components: {
    "error-warning-message": ErrorWarningMessage,
  },
  computed: {
    ...mapGetters("auth", ["user"]),
  },
  methods: {
    selectLossDate(date) {
      if (date) {
        this.lossDate = date;
        this.lossDateDisplay = new Date(date).toLocaleDateString("en-CA"); // Format date for display
        this.lossDateMenu = false; // Close the calendar
      }
    },

    close() {
      this.$emit("close");
    },
    async submitForm() {
      const claimData = new FormData();
      claimData.append("claimNumber", this.claimNumber);
      claimData.append("lossDate", this.lossDateDisplay);
      claimData.append("investigator", this.investigator);
      claimData.append("added_by", this.user.id);
      claimData.append("cattle_id", this.cattleId);

      if (this.claimDocument) {
        claimData.append("claimDocument", this.claimDocument);
      }

      try {
        await axios.post(API_ROUTES.ADD_CLAIM, claimData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.successMessage = "Claim added successfully!";

        this.$emit("claim-updated");
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "An error occurred.";
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
