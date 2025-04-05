<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form ref="form">
            <!-- Two-column Layout -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="reason"
                  label="Reason of Death"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="place"
                  label="Place of Death"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="illDays"
                  label="Illness Days"
                  type="number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-col>
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
                <v-col>
                  <v-text-field
                    v-model="time"
                    @click="menu2 = true"
                    label="Time of Death"
                    readonly
                  >
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      activator="parent"
                      transition="scale-transition"
                    >
                      <v-time-picker
                        v-if="menu2"
                        v-model="time"
                        full-width
                        @update:model-value="menu2 = false"
                      ></v-time-picker>
                    </v-menu>
                  </v-text-field>
                </v-col>
              </v-col>
              <FileUpload
                :leftPhoto="leftPhoto"
                :rightPhoto="rightPhoto"
                :frontPhoto="frontPhoto"
                :backPhoto="backPhoto"
                :tagPhoto="tagPhoto"
                @compressed="updateFile"
              />
            </v-row>

            <!-- Submit Button -->
            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn
                  :disabled="!isFormValid"
                  color="primary"
                  @click="submitForm"
                >
                  Add</v-btn
                >
              </v-col>
            </v-row>
          </v-form>

          <!-- Error and Success Messages -->
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
import { addCattleOffline } from "@/utils/offlineService";
import FileUpload from "@/components/FileUpload.vue";
export default {
  props: ["cattleId"],

  data() {
    return {
      reason: "",
      place: "",
      illDays: "",
      valid: false,
      lossDate: null, // Selected raw From Date
      lossDateDisplay: "", // Formatted From Date
      lossDateMenu: false, // From Date menu visibility
      lossDateError: false, // Tracks validation for "From Date"
      time: null,
      menu2: false,
      leftPhoto: null,
      rightPhoto: null,
      frontPhoto: null,
      backPhoto: null,
      tagPhoto: null,
      errorMessage: "",
      successMessage: "",
      rules: {
        required: (v) => !!v || "This field is required",
      },
      photoRules: [
        (value) => !!value || "Photo is required",
        (value) =>
          !value ||
          value.size < 2 * 1024 * 1024 ||
          "Photo size should be < 2MB",
      ],
    };
  },

  components: {
    "error-warning-message": ErrorWarningMessage,
    FileUpload,
  },

  computed: {
    ...mapGetters("auth", ["user"]),
    isFormValid() {
      // Ensure all photos are provided and the new tag is valid
      return (
        this.leftPhoto &&
        this.rightPhoto &&
        this.frontPhoto &&
        this.backPhoto &&
        this.tagPhoto &&
        this.lossDateDisplay &&
        this.reason &&
        this.place &&
        this.time
      );
    },
  },

  methods: {
    selectLossDate(date) {
      if (date) {
        this.lossDate = date;
        this.lossDateDisplay = new Date(date).toLocaleDateString("en-CA"); // Format date for display
        this.lossDateMenu = false; // Close the calendar
      }
    },
    updateFile({ file, index }) {
      // Update the file for the corresponding index
      switch (index) {
        case 0:
          this.leftPhoto = file;
          break;
        case 1:
          this.rightPhoto = file;
          break;
        case 2:
          this.frontPhoto = file;
          break;
        case 3:
          this.backPhoto = file;
          break;
        case 4:
          this.tagPhoto = file;
          break;
        default:
          break;
      }
    },
    async submitForm() {
      const formData = new FormData();
      Object.keys(this.$data).forEach((key) => {
        formData.append(key, this.$data[key]);
      });

      // Add policyId and added_by to the formData
      formData.append("id", this.cattleId);
      formData.append("added_by", this.user.id);
      formData.append("photo_for", "Death certificate");

      if (this.leftPhoto) formData.append("photos[left]", this.leftPhoto);
      if (this.rightPhoto) formData.append("photos[right]", this.rightPhoto);
      if (this.frontPhoto) formData.append("photos[front]", this.frontPhoto);
      if (this.backPhoto) formData.append("photos[back]", this.backPhoto);
      if (this.tagPhoto) formData.append("photos[tag]", this.tagPhoto);

      if (navigator.onLine) {
        try {
          const response = await axios.post(
            API_ROUTES.UPDATE_CATTLE,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response);
          this.successMessage = "Cattle updated successfully!";
        } catch (error) {
          this.errorMessage =
            error.response?.data?.message || "An error occurred";
        }

        this.$emit("death-updated");
      } else {
        try {
          await addCattleOffline(formData);
          this.successMessage = "Cattle saved offline. Will sync when online.";
          this.clearForm();
        } catch (error) {
          this.errorMessage = "Could not save cattle offline.";
        }
      }
    },

    clearForm() {
      Object.keys(this.$data).forEach((key) => {
        if (typeof this.$data[key] === "string") this.$data[key] = "";
        if (Array.isArray(this.$data[key])) this.$data[key] = [];
        if (typeof this.$data[key] === "number") this.$data[key] = null;
      });
      this.leftPhoto = null;
      this.rightPhoto = null;
      this.frontPhoto = null;
      this.backPhoto = null;
      this.tagPhoto = null;
    },
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 20px;
}
</style>
