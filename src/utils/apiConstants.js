// Define the base URL for your API (this can change depending on your environment)
export const BASE_URL = "https://pashudhanbima.in/API/cattleInsuranceApi";

// Define specific API endpoints
export const API_ROUTES = {
  REGISTER_USER: `${BASE_URL}/User/register.php`,
  UPDATE_USER: `${BASE_URL}/User/updateUser.php`,
  GET_USER: `${BASE_URL}/User/getUser.php`,
  LOGIN_USER: `${BASE_URL}/User/login.php`,
  GET_PROFILE: `${BASE_URL}/profile.php`,
  CHANGE_PASSWORD: `${BASE_URL}/User/resetPassword.php`,
  GET_USERS: `${BASE_URL}/User/getAllUsers.php`,
  DELETE_USER: `${BASE_URL}/User/deleteUser.php`,
  FORGOT_PASSWORD: `${BASE_URL}/User/forgotPassword.php`,
  GET_POLICIES: `${BASE_URL}/Policy/getAllPolicies.php`,
  DELETE_POLICY: `${BASE_URL}/Policy/deletePolicy.php`,
  ADD_POLICY:`${BASE_URL}/Policy/addPolicy.php`,
  ADD_CLAIM:`${BASE_URL}/Policy/addClaim.php`,
  UPDATE_POLICY:`${BASE_URL}/Policy/updatePolicy.php`,
  GET_CATTLES:`${BASE_URL}/Cattle/getAllCattles.php`,
  ADD_CATTLE:`${BASE_URL}/Cattle/addCattle.php`,
  UPDATE_CATTLE:`${BASE_URL}/Cattle/updateCattle.php`,
  DELETE_CATTLE:`${BASE_URL}/Cattle/deleteCattle.php`,
  DELETE_LEAD:`${BASE_URL}/Cattle/deleteLead.php`,
  ADD_LEAD:`${BASE_URL}/Cattle/addLead.php`,
  GET_LEADS:`${BASE_URL}/Cattle/getLeads.php`,
  GET_CATTLE:`${BASE_URL}/Cattle/getCattle.php`,
  GET_TAGS:`${BASE_URL}/Cattle/getTags.php`,
  SAVE_TAGS:`${BASE_URL}/Cattle/saveTag.php`,
  ADD_PDF:`${BASE_URL}/Cattle/savePDF.php`,
  GET_CERTIFICATES:`${BASE_URL}/Cattle/getCertificates.php`,
  // Add more API routes as needed
};
