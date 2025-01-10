<template>
  <v-container class="change-password-form" max-width="600">
    <v-card>
      <v-card-title class="text-h5">User Profile</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateProfile" ref="form">
          <div>
            <label>Registration code: {{ user.registrationCode }}</label>
          </div>
          <v-text-field
            v-model="user.name"
            label="Name"
            outlined
            :rules="[(v) => !!v || 'Name is required']"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            label="Email"
            outlined
            :rules="[
              (v) => !!v || 'Email is required',
              (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
            ]"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.phone"
            label="Phone"
            outlined
            :rules="[(v) => !!v || 'Phone number is required']"
          ></v-text-field>
          <v-btn
            type="submit"
            class="mt-4 bg-green-darken-2 text-white"
            :disabled="!valid"
          >
            Update
          </v-btn>
        </v-form>
        <p v-if="message">{{ message }}</p>
      </v-card-text>
    </v-card>
  </v-container>

  <!--
  <div class="profile">
    <h2>User Profile</h2>

    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="user.name" id="name" required />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="user.email" id="email" disabled />
      </div>

      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="text" v-model="user.phone" id="phone" />
      </div>
      <div class="form-group">
        <label for="phone">Registration Code:</label>
        <input
          type="text"
          v-model="user.registrationCode"
          id="registrationCode"
        />
      </div>

      <button type="submit">Update Profile</button>
    </form>
  </div>-->
</template>

<script>
import apiClient from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  data() {
    return {
      user: {
        name: "",
        email: "",
        phone: "",
        registrationCode: "",
      },
      valid: true, // Control form validity
      message: "",
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      if (storedUser) {
        this.user = storedUser;
      } else {
        // Fetch user data from API if needed
        try {
          const response = await apiClient.get(API_ROUTES.GET_USER);
          this.user = response.data.user;
        } catch (error) {
          console.error("Failed to load user data", error);
        }
      }
    },
    async updateProfile() {
      const form = this.$refs.form;
      if (form.validate()) {
        try {
          const response = await apiClient.put(
            API_ROUTES.UPDATE_USER,
            this.user
          );
          this.message =
            response.data.message || "User Profile updated successfully!";
          // Update localStorage after successful update
          localStorage.setItem("userData", JSON.stringify(this.user));
        } catch (error) {
          this.message =
            "Error: " +
            (error.response?.data?.message || "Error updating profile!");
          console.error("Error updating profile", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.change-password {
  margin-top: 20px;
}
.change-password a {
  color: #007bff;
  text-decoration: none;
}
</style>
