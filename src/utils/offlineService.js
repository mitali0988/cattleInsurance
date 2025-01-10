import axios from "@/utils/api";

import { API_ROUTES } from "./apiConstants";

const offlineQueue = []; // Temporary in-memory queue
const OFFLINE_STORE = "dairies";
import { openDB } from "idb";

async function getDB() {
  return openDB("DairyAppDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(OFFLINE_STORE)) {
        db.createObjectStore(OFFLINE_STORE, { keyPath: "id" });
      }
    },
  });
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
  const db = await getDB();
  const tx = db.transaction(OFFLINE_STORE, "readwrite");
  await tx.store.delete(dairyId);
  await tx.done;
}
export async function syncOfflineData() {
  while (offlineQueue.length) {
    const action = offlineQueue.shift();
    try {
      if (action.type === "add") {
        await axios.post(API_ROUTES.REGISTER_USER, action.data);
      } else if (action.type === "update") {
        await axios.put(API_ROUTES.UPDATE_USER, action.data);
      }
    } catch (error) {
      console.error("Failed to sync action:", action, error);
      // Optionally re-add to queue for retry
      offlineQueue.unshift(action);
      throw error;
    }
  }
}
