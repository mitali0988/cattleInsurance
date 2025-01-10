<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form v-model="valid" ref="form">
            <!-- New Fields -->
            <v-text-field
              v-model="policyNumber"
              label="Policy Number"
              :rules="[rules.required]"
              required
              :readonly="editPolicy"
            ></v-text-field>

            <v-row>
              <v-col cols="12" md="6">
                <!-- From Date Picker -->
                <v-menu
                  v-model="fromDateMenu"
                  activator="parent"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  max-width="300"
                  offset-y
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="fromDateDisplay"
                      label="From Date"
                      readonly
                      v-bind="props"
                      @click="fromDateMenu = true"
                      :error="fromDateError"
                      required
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fromDate"
                    show-adjacent-months
                    scrollable
                    @update:model-value="selectFromDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="6">
                <!-- To Date Picker -->
                <v-menu
                  v-model="toDateMenu"
                  activator="parent"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  max-width="300"
                  offset-y
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="toDateDisplay"
                      label="To Date"
                      readonly
                      v-bind="props"
                      @click="toDateMenu = true"
                      :error="toDateError"
                      required
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="toDate"
                    :min="fromDate"
                    show-adjacent-months
                    scrollable
                    @update:model-value="selectToDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-text-field
              v-model="hypothecation"
              label="Hypothecation"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <v-text-field
              v-model="premiumAmount"
              label="Premium Amount"
              type="number"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-file-input
              v-if="editPolicy"
              v-model="endorsmentDocument"
              label="Upload Policy Endorsment Document"
              :rules="[rules.required]"
              accept=".pdf,.doc,.docx"
              required
            ></v-file-input>

            <v-file-input
              v-else
              v-model="policyDocument"
              label="Upload Policy Document"
              :rules="[rules.required]"
              accept=".pdf,.doc,.docx"
              required
            ></v-file-input>

            <!-- Submit Button -->
            <v-btn :disabled="!valid" color="primary" @click="submitForm">
              {{ editPolicy ? "Update" : "Add" }}
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
  props: ["editPolicy", "lead_id"],
  data() {
    return {
      policyNumber: this.editPolicy ? this.editPolicy.policyNumber : "",
      hypothecation: this.editPolicy ? this.editPolicy.hypothecation : "",
      premiumAmount: this.editPolicy ? this.editPolicy.premiumAmount : "",
      policyDocument: null, // Stores the uploaded document
      endorsmentDocument: null,
      fromDate: this.editPolicy ? new Date(this.editPolicy.fromDate) : null, // Selected raw From Date
      toDate: this.editPolicy ? new Date(this.editPolicy.toDate) : null, // Selected raw To Date
      fromDateDisplay: this.editPolicy
        ? new Date(this.editPolicy.fromDate).toLocaleDateString("en-CA")
        : "", // Formatted From Date
      toDateDisplay: this.editPolicy
        ? new Date(this.editPolicy.toDate).toLocaleDateString("en-CA")
        : "", // Formatted To Date
      fromDateMenu: false, // From Date menu visibility
      toDateMenu: false, // To Date menu visibility
      fromDateError: false, // Tracks validation for "From Date"
      toDateError: false, // Tracks validation for "To Date",
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
    selectFromDate(date) {
      if (date) {
        this.fromDate = date;
        this.fromDateDisplay = new Date(date).toLocaleDateString("en-CA"); // Format date for display
        this.fromDateMenu = false; // Close the calendar
        this.validateDates(); // Ensure validation
      }
    },

    // Handler for selecting a "To Date"
    selectToDate(date) {
      if (date) {
        this.toDate = date;
        this.toDateDisplay = new Date(date).toLocaleDateString("en-CA"); // Format date for display
        this.toDateMenu = false; // Close the calendar
        this.validateDates(); // Ensure validation
      }
    },

    // Validate the date range
    validateDates() {
      if (this.fromDate && this.toDate) {
        this.toDateError = new Date(this.toDate) < new Date(this.fromDate);
        this.fromDateError = false; // "From Date" is valid as long as it exists
      }
    },

    close() {
      this.$emit("close");
    },
    async submitForm() {
      const policyData = new FormData();
      policyData.append("policyNumber", this.policyNumber);
      policyData.append("policyFromDate", this.fromDateDisplay);
      policyData.append("policyToDate", this.toDateDisplay);
      policyData.append("hypothecation", this.hypothecation);
      policyData.append("premiumAmount", this.premiumAmount);
      policyData.append("added_by", this.user.id);
      policyData.append("lead_id", this.lead_id);

      if (this.policyDocument) {
        policyData.append("policyDocument", this.policyDocument);
      }
      if (this.endorsmentDocument) {
        policyData.append("endorsmentDocument", this.endorsmentDocument);
      }

      try {
        if (this.editPolicy) {
          policyData.append("id", this.editPolicy.id);
          await axios.post(API_ROUTES.UPDATE_POLICY, policyData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.successMessage = "Policy updated successfully!";
        } else {
          await axios.post(API_ROUTES.ADD_POLICY, policyData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.successMessage = "Policy added successfully!";
        }
        this.$emit("policy-updated");
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
