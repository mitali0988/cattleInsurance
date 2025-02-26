<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form ref="form" v-if="!cattleId">
            <!-- Two-column Layout -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-if="!editCattle"
                  v-model="tagNo"
                  label="Tag Number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="breed"
                  label="Breed"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="rightHorn"
                  label="Right Horn"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="switchOfTail"
                  label="Switch Of Tail"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="sumInsured"
                  label="Sum Insured"
                  type="number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="lactation"
                  label="Lactation"
                  type="number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="species"
                  label="Animal Species"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="color"
                  label="Body Color"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="leftHorn"
                  label="Left Horn"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="age"
                  label="Approx Age (yrs)"
                  type="number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="value"
                  label="Market Value"
                  type="number"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="milk"
                  label="Milk (ltr/day)"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Additional Fields -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="marks"
                  label="Other Marks"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row v-if="!editCattle">
              <FileUpload
                :leftPhoto="leftPhoto"
                :rightPhoto="rightPhoto"
                :frontPhoto="frontPhoto"
                :backPhoto="backPhoto"
                :tagPhoto="tagPhoto"
                @compressed="updateFile"
              />
            </v-row> -->

            <!-- Submit Button -->

            <v-row>
              <v-col cols="12" class="text-center">
                <v-btn color="primary" @click="submitForm">
                  {{ editCattle ? "Update" : "Add" }}</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
          <v-row v-if="cattleId && !editCattle">
            <v-col cols="12" class="text-center">
              <FileUpload
                :leftPhoto="leftPhoto"
                :rightPhoto="rightPhoto"
                :frontPhoto="frontPhoto"
                :backPhoto="backPhoto"
                :tagPhoto="tagPhoto"
                @compressed="updateFile"
              />
              <v-btn
                :disabled="!isPhotoValid"
                color="primary"
                @click="savePhotos"
                >Save Photos</v-btn
              >
            </v-col>
          </v-row>
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
import imageCompression from "browser-image-compression";
import FileUpload from "@/components/FileUpload.vue";
export default {
  props: ["leadId", "editCattle"],

  data() {
    return {
      tagNo: this.editCattle ? this.editCattle.tagNo : "",
      rightHorn: this.editCattle ? this.editCattle.rightHorn : "",
      switchOfTail: this.editCattle ? this.editCattle.switchOfTail : "",
      sumInsured: this.editCattle ? this.editCattle.sumInsured : "",
      lactation: this.editCattle ? this.editCattle.lactation : "",
      age: this.editCattle ? this.editCattle.age : "",
      breed: this.editCattle ? this.editCattle.breed : "",
      marks: this.editCattle ? this.editCattle.marks : "",
      species: this.editCattle ? this.editCattle.species : "",
      color: this.editCattle ? this.editCattle.color : "",
      leftHorn: this.editCattle ? this.editCattle.leftHorn : "",
      value: this.editCattle ? this.editCattle.value : "",
      milk: this.editCattle ? this.editCattle.milk : "",
      cattleId: null,
      showFileUpload: false,
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
    isPhotoValid() {
      // Dynamically check if all photo fields are filled
      const arePhotosValid = [
        this.leftPhoto,
        this.rightPhoto,
        this.frontPhoto,
        this.backPhoto,
        this.tagPhoto,
      ].every((photo) => !!photo);

      return arePhotosValid;
    },
    isFormValid() {
      return this.$refs.form ? this.$refs.form.validate() : false;
    },
  },

  methods: {
    savePhotos() {
      const formData = new FormData();
      formData.append("photo_for", "health certificate");
      console.log("dddddddd", this);
      // Append photos to FormData
      if (this.leftPhoto) formData.append("photos[left]", this.leftPhoto);
      if (this.rightPhoto) formData.append("photos[right]", this.rightPhoto);
      if (this.frontPhoto) formData.append("photos[front]", this.frontPhoto);
      if (this.backPhoto) formData.append("photos[back]", this.backPhoto);
      if (this.tagPhoto) formData.append("photos[tag]", this.tagPhoto);
      formData.append("id", this.cattleId);
      try {
        const response = axios.post(API_ROUTES.UPDATE_CATTLE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          skipLoader: true,
        });
        console.log(response);
        this.successMessage = "Photos added successfully!";
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "An error occurred";
      }
      this.$emit("cattle-updated");
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
    // Handle file upload and compression if needed
    async handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      // Check if file size exceeds 2 MB
      const maxSize = 1 * 1024 * 1024; // 2 MB in bytes
      if (file.size > maxSize) {
        try {
          const compressedFile = await this.compressFile(file);
          this.leftPhoto = compressedFile;
          alert("File was compressed to under 2MB!");
        } catch (error) {
          console.error("File compression failed:", error);
        }
      }
    },

    // Compress image file if it's larger than 2 MB
    async compressFile(file) {
      const options = {
        maxSizeMB: 1, // 2 MB
        maxWidthOrHeight: 1920, // You can set a max width or height for the image
        useWebWorker: true,
      };

      try {
        const compressedBlob = await imageCompression(file, options);

        // Convert the compressed Blob to a File object with the desired format (e.g., .jpg)
        const compressedFile = new File(
          [compressedBlob],
          "compressed-image.jpg",
          {
            type: "image/jpeg", // Ensure the file is a JPEG
          }
        );

        return compressedFile;
      } catch (error) {
        console.error("Error compressing file:", error);
        throw error;
      }
    },

    async submitForm() {
      const formData = new FormData();
      Object.keys(this.$data).forEach((key) => {
        formData.append(key, this.$data[key]);
      });
      // Add policyId and added_by to the formData
      formData.append("leadId", this.leadId);
      formData.append("added_by", this.user.id);

      if (navigator.onLine) {
        if (this.editCattle) {
          formData.append("id", this.editCattle.id);
          try {
            const response = await axios.put(
              API_ROUTES.UPDATE_CATTLE,
              formData
            );
            console.log(response);
            this.successMessage = "Cattle updated successfully!";
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message || "An error occurred";
          }
        } else {
          try {
            const response = await axios.post(API_ROUTES.ADD_CATTLE, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log("ererererer", response);
            this.cattleId = response.data.cattle_id;
            this.successMessage = "Cattle added successfully!";
            //  this.$emit("cattle-updated");
            //this.clearForm();
          } catch (error) {
            this.errorMessage =
              error.response?.data?.message ||
              "An error occurred while submitting.";
          }
        }
        //this.$emit("cattle-updated");
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
    openFileUpload() {
      this.showFileUpload = true;
    },
    clearForm() {
      Object.keys(this.$data).forEach((key) => {
        if (typeof this.$data[key] === "string") this.$data[key] = "";
        if (Array.isArray(this.$data[key])) this.$data[key] = [];
        if (typeof this.$data[key] === "number") this.$data[key] = null;
      });
      /*this.leftPhoto = null;
      this.rightPhoto = null;
      this.frontPhoto = null;
      this.backPhoto = null;
      this.tagPhoto = null;*/
    },
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 20px;
}
</style>
