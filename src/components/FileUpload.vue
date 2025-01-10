<template>
  <div class="photo-capture">
    <div v-if="!isComplete">
      <v-btn color="primary" @click="openCamera">{{ currentLabel }}</v-btn>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="camera"
        style="display: none"
        @change="handleFileChange"
      />
      <div v-if="imagePreview" class="preview-container">
        <h5>Preview:</h5>
        <img :src="imagePreview" class="preview-image" alt="Preview Image" />
      </div>
      <v-btn
        v-if="imagePreview"
        color="success"
        @click="nextStep"
        :disabled="step >= labels.length"
      >
        {{ nextLabel }}
      </v-btn>
    </div>
    <div v-else>
      <h4>All Captured Photos:</h4>
      <div class="all-previews">
        <div
          v-for="(preview, index) in allPreviews"
          :key="index"
          class="preview-box"
        >
          <h5>{{ labels[index] }}</h5>
          <img :src="preview" class="preview-image" alt="Preview Image" />
        </div>
      </div>
      <!-- <v-btn color="primary" @click="$emit('complete', allPreviews)"
        >Save Photos</v-btn
      >-->
    </div>
  </div>
</template>

<script>
import imageCompression from "browser-image-compression";

export default {
  props: {
    labels: {
      type: Array,
      default: () => [
        "Click Left Photo",
        "Click Right Photo",
        "Click Front Photo",
        "Click Back Photo",
        "Click Tag Photo",
      ],
    },
  },
  data() {
    return {
      step: 0,
      imagePreview: null,
      allPreviews: Array(5).fill(null),
      compressedImages: [],
      fileNames: [
        "left_photo.jpg",
        "right_photo.jpg",
        "front_photo.jpg",
        "back_photo.jpg",
        "tag_photo.jpg",
      ],
    };
  },
  computed: {
    currentLabel() {
      return this.labels[this.step] || "Capture Photo";
    },
    nextLabel() {
      return this.step < this.labels.length - 1
        ? "Next: " + this.labels[this.step + 1]
        : "Complete";
    },
    isComplete() {
      return this.step >= this.labels.length;
    },
  },
  methods: {
    openCamera() {
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Compress image
      const options = {
        maxSizeMB: 1, // Target size in MB
        maxWidthOrHeight: 1920, // Resize dimensions
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const base64Image = await this.fileToBase64(compressedFile);
        // Update preview and store the compressed image
        const fileName = this.fileNames[this.step];
        this.imagePreview = base64Image;
        this.allPreviews[this.step] = base64Image;
        this.compressedImages[this.step] = new File(
          [compressedFile],
          fileName,
          { type: compressedFile.type }
        );
        // Emit the file for the parent component
        this.$emit("compressed", {
          index: this.step,
          base64: base64Image,
          file: this.compressedImages[this.step],
        });
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    },
    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    nextStep() {
      if (this.isComplete) return;
      this.step += 1;
      this.imagePreview = null;
    },
  },
};
</script>

<style scoped>
.preview-container {
  margin-top: 20px;
  text-align: center;
}
.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.all-previews {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}
.preview-box {
  text-align: center;
  max-width: 140px;
}
</style>
