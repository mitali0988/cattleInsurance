/*import { createStore } from 'vuex';
import { addTaskToDB, getTasksFromDB, syncTask } from './offline.js';

export default createStore({
  state: {
    tasks: [],
    unsyncedTasks: [],
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    setUnsyncedTasks(state, tasks) {
      state.unsyncedTasks = tasks;
    },
  },
  actions: {
    async loadTasks({ commit }) {
      const tasks = await getTasksFromDB();
      commit('setTasks', tasks);
      commit('setUnsyncedTasks', tasks.filter(task => !task.synced));
    },

    // Add a task (with photos and tags) to IndexedDB
    async addTask({ dispatch }, { task, photos, tags }) {
      // Assume photos are uploaded to the server and we get URLs
      const photoURLs = await Promise.all(photos.map(async (photo) => {
        const formData = new FormData();
        formData.append('file', photo);

        const response = await fetch('https://api.example.com/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return data.url;
        } else {
          console.error('Photo upload failed');
          return null;
        }
      }));

      const newTask = { ...task, tags, photos: photoURLs, synced: false };
      await addTaskToDB(newTask);
      dispatch('loadTasks');
    },

    // Sync a task (send to API)
    async syncTask({ dispatch }, task) {
      await syncTask(task);
      dispatch('loadTasks');
    },

    // Sync all unsynced tasks
    async syncAllTasks({ dispatch }) {
      await syncAllTasks();
      dispatch('loadTasks');
    },
  },
});*/
