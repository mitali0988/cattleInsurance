<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form v-model="valid" ref="form">
            <!-- Two-column Layout -->
            <v-text-field
              v-model="name"
              label="Beneficiary Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="address"
                  label="Address"
                  :rules="[rules.required]"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="village"
                  label="Village"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="taluka"
                  label="Taluka"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="state"
                  label="State"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="phone"
                  label="Phone Number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="post"
                  label="Post"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="district"
                  label="District"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="pincode"
                  label="PinCode"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Additional Fields -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="financer"
                  label="Insured/Financer"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="branch"
                  label="Branch/Address"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="proposal"
                  label="Proposal/Loan A/C No"
                  :rules="[rules.required]"
                  required
                ></v-text-field>

                <v-select
                  v-model="insuranceCompnay"
                  :items="insuranceCompanies"
                  label="Insurance Company"
                  :rules="[rules.required]"
                  required
                  item-title="name"
                  item-value="id"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Submit Button -->
            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn :disabled="!valid" color="primary" @click="submitForm"
                  >Add Lead</v-btn
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

export default {
  data() {
    return {
      name: "",
      address: "",
      phone: "",
      village: "",
      taluka: "",
      state: "",
      financer: "",
      branch: "",
      proposal: "",
      insuranceCompnay: "",
      post: "",
      district: "",
      pincode: "",
      valid: false,
      errorMessage: "",
      successMessage: "",
      insuranceCompanies: [],
      rules: {
        required: (v) => !!v || "This field is required",
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
    async fetchInsuranceCompanies() {
      try {
        const response = await axios.get(
          `${API_ROUTES.GET_USERS}?type=insurance`
        );
        this.insuranceCompanies = response.data.user;
        console.log("aaaaaaaaaa", this.insuranceCompanies);
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message ||
          "Could not fetch insurance companies.";
      }
    },
    async submitForm() {
      const formData = new FormData();
      Object.keys(this.$data).forEach((key) => {
        formData.append(key, this.$data[key]);
      });
      formData.append("added_by", this.user.id);

      if (navigator.onLine) {
        try {
          await axios.post(API_ROUTES.ADD_LEAD, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.successMessage = "Lead added successfully!";
          this.$emit("lead-updated");
          //this.clearForm();
        } catch (error) {
          this.errorMessage =
            error.response?.data?.message ||
            "An error occurred while submitting.";
        }
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
    },
  },
  mounted() {
    this.fetchInsuranceCompanies();
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 20px;
}
</style>
