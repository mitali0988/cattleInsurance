<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Failed Photo Uploads</h3>
        <v-alert v-if="!failedUploads.length" type="info">
          No failed uploads to display.
        </v-alert>
        <v-list v-if="failedUploads.length" dense>
          <v-list-item
            v-for="(upload, index) in failedUploads"
            :key="index"
            class="d-flex justify-space-between"
          >
            <div>
              <h5>{{ upload.photoType }} (Cattle ID: {{ upload.cattleId }})</h5>
              <img
                :src="upload.base64"
                alt="Failed Upload Preview"
                class="preview-image"
              />
            </div>
            <v-btn
              color="primary"
              @click="retryUpload(upload, index)"
              :loading="upload.isRetrying"
              :disabled="upload.isRetrying"
            >
              Retry
            </v-btn>
          </v-list-item>
        </v-list>
        <v-btn
          color="success"
          @click="retryAll"
          :disabled="!failedUploads.length || isRetryingAll"
          :loading="isRetryingAll"
          class="mt-4"
        >
          Retry All
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getOfflineFailedUploads,
  removeFailedUpload,
} from "@/utils/offlineService";
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  data() {
    return {
      failedUploads: [],
      isRetryingAll: false,
    };
  },
  methods: {
    async fetchFailedUploads() {
      this.failedUploads = await getOfflineFailedUploads();
    },
    async retryUpload(upload, index) {
      try {
        this.$set(this.failedUploads[index], "isRetrying", true);

        const formData = new FormData();
        formData.append("id", upload.cattleId);
        formData.append("new_tag", upload.newTag);
        formData.append(`photos[${upload.photoType}]`, upload.file);
        formData.append("photo_for", "ReTag certificate");

        const response = await axios.post(API_ROUTES.SAVE_TAGS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          // Remove from failed uploads
          await removeFailedUpload(upload.id);
          this.failedUploads.splice(index, 1);
          this.$toast.success(`${upload.photoType} uploaded successfully.`);
        } else {
          this.$toast.error(`Failed to retry ${upload.photoType}.`);
        }
      } catch (error) {
        console.error("Retry error:", error);
        this.$toast.error(`Failed to retry ${upload.photoType}.`);
      } finally {
        this.$set(this.failedUploads[index], "isRetrying", false);
      }
    },
    async retryAll() {
      this.isRetryingAll = true;
      const failedRetryIndexes = [];

      for (let index = 0; index < this.failedUploads.length; index++) {
        const upload = this.failedUploads[index];
        try {
          await this.retryUpload(upload, index);
        } catch (error) {
          failedRetryIndexes.push(index);
        }
      }

      if (failedRetryIndexes.length) {
        this.$toast.error("Some uploads could not be retried.");
      } else {
        this.$toast.success("All failed uploads retried successfully.");
      }

      this.isRetryingAll = false;
    },
  },
  mounted() {
    this.fetchFailedUploads();
  },
};
</script>

<style scoped>
.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
