import { createRouter, createWebHistory } from "vue-router"; // Importing Vue Router 4
import store from "@/store"; // Import Vuex store
import Dashboard from "@/views/Dashboard.vue";
import LoginView from "@/views/Auth/Login.vue";
import ForgotPassword from "@/views/Auth/ForgotPassword.vue";
import ResetPassword from "@/views/Auth/ResetPassword.vue";
import AuthLayout from "@/layouts/AuthLayouts.vue";
import changePassword from "@/views/Auth/changePassword.vue";
import userProfile from "@/views/Auth/userProfile.vue";
import AddDairy from "@/views/Dairy/AddDairy.vue";
import DairyList from "@/views/Dairy/DairyList.vue";
import AddCenter from "@/views/Centers/AddCenter.vue";
import CenterList from "@/views/Centers/CenterList.vue";
import AddDoctor from "@/views/Doctors/AddDoctor.vue";
import DoctorList from "@/views/Doctors/DoctorList.vue";
import PolicyList from "@/views/Policies/PolicyList.vue";
import AddPolicy from "@/views/Policies/AddPolicy.vue";
import CattleList from "@/views/Cattles/CattleList.vue";
import AddCattle from "@/views/Cattles/AddCattle.vue";
import CattleDetails from "@/views/Cattles/CattleDetails.vue";
import InsuranceCompanyList from "@/views/InsuraceCompany/InsuranceCompanyList.vue";
import AddInsuranceCompany from "@/views/InsuraceCompany/AddInsuranceCompany.vue";
import CertificateList from "@/views/Cattles/CertificateList.vue";
import FailUploads from "@/views/Cattles/FailUploads.vue";
const routes = [
  { path: "/login", name: "Login", component: LoginView },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  { path: "/reset-password", name: "ResetPassword", component: ResetPassword },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login", // Redirect to login if the route does not match
  },
  {
    path: "/",
    component: AuthLayout,
    meta: { requiresAuth: true }, // Add meta field to indicate that authentication is required
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          title: "Dashboard",
          allowedRoles: ["Admin", "superadmin", "Doctor", "center"],
        },
      },
      {
        path: "change-password",
        name: "Change Password",
        component: changePassword,
        meta: {
          title: "Change Password",
          allowedRoles: [
            "Admin",
            "superadmin",
            "Doctor",
            "insurance",
            "center",
          ],
        },
      },
      {
        path: "/profile",
        name: "UserProfile",
        component: userProfile,
        meta: { title: "Profile", allowedRoles: ["Doctor"] },
      },
      {
        path: "/dairies",
        name: "Dairies",
        component: DairyList,
        meta: {
          requiresAuth: true,
          title: "Dairy Management",
          allowedRoles: ["superadmin"],
        }, // Add this route to the auth-required section
        children: [
          {
            path: "add",
            name: "AddDairy",
            component: AddDairy,
            meta: { title: "Add Dairy" },
          },
          {
            path: "edit/:id",
            name: "EditDairy",
            component: AddDairy,
            meta: { title: "Edit Dairy" },
            props: true,
          },
        ],
      },
      {
        path: "/centers",
        name: "Centers",
        component: CenterList,
        meta: {
          requiresAuth: true,
          title: "Center Management",
          allowedRoles: ["Admin", "superadmin"],
        }, // Add this route to the auth-required section
        children: [
          {
            path: "add",
            name: "AddCenter",
            component: AddCenter,
            meta: { title: "Add Center" },
          },
          {
            path: "edit/:id",
            name: "EditCenter",
            component: AddCenter,
            meta: { title: "Edit Center" },
            props: true,
          },
        ],
      },
      {
        path: "/doctors",
        name: "Doctors",
        component: DoctorList,
        meta: {
          requiresAuth: true,
          title: "Doctor Management",
          allowedRoles: ["Admin", "superadmin", "center"],
        }, // Add this route to the auth-required section
        children: [
          {
            path: "add",
            name: "AddDoctor",
            component: AddDoctor,
            meta: { title: "Add Doctor" },
          },
          {
            path: "edit/:id",
            name: "EditDoctor",
            component: AddDoctor,
            meta: { title: "Edit Doctor" },
            props: true,
          },
        ],
      },
      {
        path: "/insurence-compnies",
        name: "InsurenceCompnies",
        component: InsuranceCompanyList,
        meta: {
          requiresAuth: true,
          title: "Insurance Company Management",
          allowedRoles: ["superadmin"],
        }, // Add this route to the auth-required section
        children: [
          {
            path: "add",
            name: "AddInsuranceComany",
            component: AddInsuranceCompany,
            meta: { title: "Add Insurance Company" },
          },
          {
            path: "edit/:id",
            name: "EditInsuranceCompany",
            component: AddInsuranceCompany,
            meta: { title: "Edit Insurance Company" },
            props: true,
          },
        ],
      },
      {
        path: "/policies",
        name: "Policies",
        component: PolicyList,
        meta: {
          requiresAuth: true,
          title: "Policy Management",
          allowedRoles: ["insurance"],
        }, // Add this route to the auth-required section
        children: [
          {
            path: "add",
            name: "AddPolicy",
            component: AddPolicy,
            meta: { title: "Add Policy" },
          },
          {
            path: "edit/:id",
            name: "EditPolicy",
            component: AddPolicy,
            meta: { title: "Edit Policy" },
            props: true,
          },
        ],
      },
      {
        path: "/cattles",
        name: "Cattles",
        component: CattleList,
        meta: {
          requiresAuth: true,
          title: "Cattle Management",
          allowedRoles: [
            "Doctor",
            "insurance",
            "Admin",
            "superadmin",
            "center",
          ],
        }, // Add this route to the auth-required section
        children: [
          {
            path: "add/:policyId",
            name: "AddCattle",
            component: AddCattle,
            meta: { title: "Add Cattle" },
            props: true,
          },
        ],
      },
      {
        path: "/certificates/:cattleId",
        name: "ListCertificate",
        component: CertificateList,
        meta: { allowedRoles: ["Doctor"] },
        props: true,
      },
      {
        path: "/cattle/:id",
        name: "CattleDetails",
        component: CattleDetails,
        props: true,
        meta: { allowedRoles: ["Doctor"] },
      },
      {
        path: "/reload-photos",
        name: "ReloadPhotos",
        component: FailUploads,
        meta: { allowedRoles: ["Doctor"], title: "Photo Management" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const user = store.getters["auth/user"];
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "Login" });
    } else if (to.meta.role && user.role !== to.meta.role) {
      next({ name: "Home" }); // Redirect to home if the user doesn't have the required role
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
