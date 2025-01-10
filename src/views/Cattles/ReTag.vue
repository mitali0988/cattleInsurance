<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-card>
          <v-form ref="form">
            <!-- Display Previous Tags -->
            <div v-if="previousTags.length">
              <h4>Previous Tags:</h4>
              <v-chip v-for="tag in previousTags" :key="tag.id" class="ma-2">
                {{ tag.tag_number }}
              </v-chip>
            </div>

            <!-- Display Current Tag -->
            <div>
              <h4>Current Tag:</h4>
              {{ currentTag }}
            </div>

            <!-- Input New Tag -->
            <v-text-field
              v-model="newTag"
              label="New Tag"
              :rules="[rules.required]"
              required
            ></v-text-field>

            <FileUpload
              :leftPhoto="leftPhoto"
              :rightPhoto="rightPhoto"
              :frontPhoto="frontPhoto"
              :backPhoto="backPhoto"
              :tagPhoto="tagPhoto"
              @compressed="updateFile"
            />
            <!-- Save Button -->
            <v-btn :disabled="!isFormValid" color="primary" @click="saveTag">
              Save
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
import { API_ROUTES } from "@/utils/apiConstants";
import ErrorWarningMessage from "@/components/ErrorWarningMessage";
import FileUpload from "@/components/FileUpload.vue";
import { addPhotoOffline, retryOfflinePhotos } from "@/utils/offlineService";
export default {
  props: ["cattleId", "currentTag"],
  data() {
    return {
      valid: false,
      newTag: "",
      previousTags: [],
      previewImages: [],
      compressedImages: [],
      labels: [
        "Left Photo",
        "Right Photo",
        "Front Photo",
        "Back Photo",
        "Tag Photo",
      ],
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
        this.newTag &&
        this.leftPhoto &&
        this.rightPhoto &&
        this.frontPhoto &&
        this.backPhoto &&
        this.tagPhoto
      );
    },
  },
  methods: {
    async handleOnline() {
      const uploadCallback = async (photo) => {
        const formData = new FormData();
        formData.append("id", photo.cattleId);
        formData.append("new_tag", photo.newTag);
        formData.append("photo_for", "ReTag certificate");
        formData.append("added_by", photo.added_by);
        formData.append("photos[left]", photo.leftPhoto);
        formData.append("photos[right]", photo.rightPhoto);
        formData.append("photos[front]", photo.frontPhoto);
        formData.append("photos[back]", photo.backPhoto);
        formData.append("photos[tag]", photo.tagPhoto);

        await axios.post(API_ROUTES.SAVE_TAGS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      };

      try {
        await retryOfflinePhotos(uploadCallback);
        this.successMessage = "All offline photos uploaded successfully!";
      } catch (error) {
        this.errorMessage = "Error uploading offline photos. Please try again.";
        console.error("Retry upload error:", error);
      }
    },
    async updateFile({ file, index }) {
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

    async fetchTags() {
      try {
        const response = await axios.get(
          `${API_ROUTES.GET_TAGS}?id=${this.cattleId}`
        );
        if (response.data.success) {
          const data = response.data;
          this.previousTags = data.previousTags;
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    },
    async saveTag() {
      if (!this.isFormValid) return;

      const formData = new FormData();
      formData.append("id", this.cattleId);
      formData.append("new_tag", this.newTag);
      formData.append("added_by", this.user.id);
      formData.append("photo_for", "ReTag certificate");

      if (this.leftPhoto) formData.append("photos[left]", this.leftPhoto);
      if (this.rightPhoto) formData.append("photos[right]", this.rightPhoto);
      if (this.frontPhoto) formData.append("photos[front]", this.frontPhoto);
      if (this.backPhoto) formData.append("photos[back]", this.backPhoto);
      if (this.tagPhoto) formData.append("photos[tag]", this.tagPhoto);

      if (!navigator.onLine) {
        const tagData = {
          cattleId: this.cattleId,
          newTag: this.newTag,
          added_by: this.user.id,
          photo_for: "ReTag Certificate",
          leftPhoto: this.leftPhoto,
          rightPhoto: this.rightPhoto,
          frontPhoto: this.frontPhoto,
          backPhoto: this.backPhoto,
          tagPhoto: this.tagPhoto,
        };
        await addPhotoOffline(tagData);
        this.errorMessage = "Photo saved offline. Will upload when online.";
        console.log("ggggggggg");
        if (
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller
        ) {
          console.log("aaaaaaaaaaaaa");
          navigator.serviceWorker.ready.then((registration) => {
            console.log("registered");
            registration.sync.register("save-tag"); // Register sync task for 'save-tag'
          });
        }
        return;
      }

      try {
        const response = await axios.post(API_ROUTES.SAVE_TAGS, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          this.successMessage = "Tag updated successfully!";

          this.$emit("tag-updated"); // Notify parent component
        } else {
          this.errorMessage = response?.data?.message || "An error occurred";
          console.error(response.data.message);
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error("Error saving tag:", error);
      }
    },
  },
  mounted() {
    window.addEventListener("online", this.handleOnline);
    this.fetchTags();
  },
  beforeUnmount() {
    window.removeEventListener("online", this.handleOnline);
  },
};
</script>
<style scoped>
.photo-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}
.preview-item {
  text-align: center;
  width: 120px;
}
.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
