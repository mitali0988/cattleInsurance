import axios from "@/utils/api";
import { openDB } from "idb";
import { API_ROUTES } from "./apiConstants";

const offlineQueue = []; // Temporary in-memory queue
const OFFLINE_STORE = "dairies";
const OFFLINE_PHOTO_STORE = "photoUploads";

async function getDB() {
  return openDB("DairyAppDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(OFFLINE_STORE)) {
        db.createObjectStore(OFFLINE_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(OFFLINE_PHOTO_STORE)) {
        db.createObjectStore(OFFLINE_PHOTO_STORE, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function savePhotoOffline(photo) {
  const db = await getDB();
  const tx = db.transaction(OFFLINE_PHOTO_STORE, "readwrite");
  const offlineData = { 
    photo: formDataToJson(photo) // Convert FormData to JSON
  };
  await tx.store.put(offlineData);
  await tx.done;
}

// Retrieve all stored photos
export async function getOfflinePhotos() {
  const db = await getDB();
  return db.getAll(OFFLINE_PHOTO_STORE);
}

// Sync photos when online
export async function syncOfflinePhotos() {
  try {
    const db = await getDB();
    if (!db.objectStoreNames.contains(OFFLINE_PHOTO_STORE)) {
      console.error("Object store does not exist! Cannot sync offline photos.");
      return;
    }

    
  const photos = await getOfflinePhotos();
  for (const photo of photos) {
    try {
      const formData = new FormData();
      
      // Convert JSON back to FormData
      Object.keys(photo.photo).forEach((key) => {
        if (photo.photo[key].startsWith("data:")) {
          // Convert Base64 back to Blob
          const byteCharacters = atob(photo.photo[key].split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          formData.append(key, blob, "offline-upload.jpg");
        } else {
          formData.append(key, photo.photo[key]);
        }
      });


      await axios.post(API_ROUTES.UPDATE_CATTLE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        skipLoader: true,
      });
     // await axios.post("/api/upload-photo", photo);
      console.log("Photo uploaded:", photo);
    } catch (error) {
      console.error("Photo upload failed:", error);
    }
  }
} catch (error) {
  console.error("Error syncing offline data:", error);
}
}

function formDataToJson(formData) {
  const json = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      // Convert Blob (file) to Base64 for storage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(value);
        reader.onloadend = () => {
          json[key] = reader.result; // Store as Base64 string
          resolve(json);
        };
      });
    } else {
      json[key] = value;
    }
  }
  return json;
}
// Save dairies offline
export async function saveDairiesOffline(dairies) {
  const db = await getDB();
  const tx = db.transaction(OFFLINE_STORE, "readwrite");
  await Promise.all(dairies.map((dairy) => tx.store.put(dairy)));
  await tx.done;
}

// Get offline dairies
export async function getOfflineDairies() {
  const db = await getDB();
  return db.getAll(OFFLINE_STORE);
}

export async function addDairyOffline(data) {
  offlineQueue.push({ type: "add", data });
}

export async function updateDairyOffline(data) {
  offlineQueue.push({ type: "update", data });
}
export async function deleteOfflineDairy(dairyId) {
  offlineQueue.push({ type: "delete", data: dairyId }); // Queue deletion
  await deleteOfflineDairy(dairyId); // Remove from IndexedDB
}
export async function syncOfflineData() {
  while (offlineQueue.length) {
    const action = offlineQueue.shift();
    try {
      if (action.type === "add") {
        await axios.post(API_ROUTES.REGISTER_USER, action.data);
      } else if (action.type === "update") {
        await axios.put(API_ROUTES.UPDATE_USER, action.data);
      } else if (action.type === "delete") {
        await axios.delete(`${API_ROUTES.DELETE_USER}?id=${action.data}`);
      }
    } catch (error) {
      console.error("Failed to sync action:", action, error);
      // Optionally re-add to queue for retry
      offlineQueue.unshift(action);
      throw error;
    }
  }
}
