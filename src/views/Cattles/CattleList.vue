<template>
  <v-container>
    <v-row justify="space-between">
      <v-col><h2>Cattle List</h2></v-col>
      <v-col class="text-right" v-if="user.role == 'Doctor'">
        <v-btn color="primary" @click="openLeadModal">Add New Lead</v-btn>
      </v-col>
    </v-row>
    <v-text-field
      v-model="searchQuery"
      label="Search Leads"
      outlined
      dense
      clearable
      class="mb-4"
    />
    <!-- Grouped Cattle by Lead -->
    <v-expansion-panels>
      <v-expansion-panel v-for="lead in filteredLeads" :key="lead.lead_id">
        <v-expansion-panel-title>
          <div>
            <strong>Lead ID: {{ lead.lead_id }}</strong>
            <span v-if="lead.policyNumber">
              - Policy: {{ lead.policyNumber }}</span
            >
            <span> - {{ lead.beneficiary_name }}</span>
            <span> - Added By: {{ lead.name }}</span>
            <span>
              - On:
              {{ new Date(lead.date_added).toLocaleDateString("en-GB") }}</span
            >
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card>
            <v-col>
              <v-btn color="error" @click="openConfirmDialog(lead.lead_id)"
                >Delete Lead</v-btn
              >
            </v-col>
            <v-col class="text-right">
              <v-btn
                v-if="lead.policyDocument"
                small
                color="blue"
                @click="openDownloadLink(lead.policyDocument)"
                >Download Policy Document</v-btn
              >
            </v-col>

            <v-col class="text-right">
              <v-btn
                v-if="user.role == 'insurance' && lead.policyNumber == null"
                color="primary"
                @click="openPolicyModel(lead.lead_id)"
                >Add Policy</v-btn
              >
              <v-btn
                v-if="user.role == 'Doctor'"
                color="primary"
                @click="openCattleModal(null, lead.lead_id)"
                >Add Cattle</v-btn
              >
            </v-col>

            <!-- Cattle Table -->
            <v-data-table
              :headers="tableHeaders"
              :items="lead.cattle"
              :search="searchQuery"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  v-if="
                    !item.policyNumber &&
                    user.role == 'Doctor' &&
                    showEditButton(item.date_added)
                  "
                  color="blue"
                  icon
                  @click="openCattleModal(item, lead.lead_id)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="
                    !item.policyNumber &&
                    user.role == 'Doctor' &&
                    showEditButton(item.date_added)
                  "
                  color="blue"
                  icon
                  @click="deleteCattle(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  :to="`/cattle/${item.id}`"
                  color="blue"
                  class="text-white"
                  rounded
                >
                  View Details
                </v-btn>
                <v-btn
                  v-if="user.role == 'insurance'"
                  :to="{
                    name: 'ListCertificate',
                    params: { cattleId: item.id },
                  }"
                >
                  View Certificates
                </v-btn>
                <v-btn
                  v-if="item.claimDocument"
                  small
                  color="blue"
                  @click="openDownloadLink(item.claimDocument)"
                  >Download Claim Document</v-btn
                >
              </template>
            </v-data-table>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Modals -->
    <v-dialog v-model="showConfirm" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text
          >Are you sure you want to delete this lead? It will delete all the
          cattles along with this.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showConfirm = false">Cancel</v-btn>
          <v-btn color="error" text @click="confirmDelete">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cattleModal" max-width="600px" persistent scrollable>
      <v-card class="cattle-dialog-card">
        <!-- Dialog Toolbar with Close Button -->
        <v-toolbar dense flat>
          <v-toolbar-title>
            {{ editCattle ? "Edit Cattle" : "Add Cattle" }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cattleModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- Dialog Content -->
        <v-card-text class="form-scroll-container">
          <add-cattle
            :editCattle="editCattle"
            @cattle-updated="fetchData('cattleModal')"
            :lead-id="selectedLead"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="policyModel" max-width="600px" persistent>
      <v-col cols="12">
        <v-card style="max-height: 90vh; overflow-y: auto">
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title> Add Policy </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="policyModel = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <add-policy
              @policy-updated="fetchData('policyModel')"
              :lead_id="policy_lead_id"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
    <v-dialog v-model="leadModal" max-width="600px" persistent>
      <v-col cols="12">
        <v-card style="max-height: 90vh; overflow-y: auto">
          <v-toolbar dense flat>
            <v-toolbar-title>Add New Lead</v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="leadModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <add-lead @lead-updated="fetchData('leadModal')" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "@/utils/api";
import AddCattle from "./AddCattle.vue";
import AddLead from "./AddLead.vue";
import AddPolicy from "../Policies/AddPolicy.vue";
import { mapGetters } from "vuex";
import { API_ROUTES } from "@/utils/apiConstants";

export default {
  components: { AddCattle, AddLead, AddPolicy },
  data() {
    return {
      leads: [],
      leadModal: false,
      cattleModal: false,
      policyModel: false,
      selectedLead: null,
      showConfirm: false,
      editCattle: null,
      policy_lead_id: null,
      searchQuery: "",
      tableHeaders: [
        { title: "Tag Number", key: "current_tag" },
        { title: "Breed", key: "breed" },
        { title: "Species", key: "species" },
        { title: "Sum Insured", key: "sumInsured" },
        { title: "Actions", key: "actions", sortable: false },
      ],
    };
  },
  computed: {
    ...mapGetters("auth", ["user"]),
    filteredLeads() {
      if (!this.searchQuery) return this.leads;

      const query = this.searchQuery.toLowerCase();
      return this.leads.filter((lead) => {
        return (
          (lead.lead_id && lead.lead_id.toString().includes(query)) ||
          (lead.beneficiary_name &&
            lead.beneficiary_name.toLowerCase().includes(query)) ||
          (lead.name && lead.name.toLowerCase().includes(query)) ||
          (lead.policyNumber &&
            lead.policyNumber.toLowerCase().includes(query)) ||
          (lead.date_added &&
            new Date(lead.date_added)
              .toLocaleDateString("en-GB")
              .includes(query))
        );
      });
    },
  },
  methods: {
    openConfirmDialog(id) {
      this.policy_lead_id = id;
      this.showConfirm = true;
    },
    async confirmDelete() {
      try {
        await axios.delete(
          `${API_ROUTES.DELETE_LEAD}?id=${this.policy_lead_id}`
        );
        this.fetchData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      this.policy_lead_id = null;
      this.showConfirm = false;
    },
    viewCattle(cattle) {
      // Pass data to detail page
      this.$router.push({
        name: "CattleDetails",
        params: { id: cattle.id }, // Pass ID in route parameter
        state: { cattle }, // Pass entire cattle object using state
      });
    },
    openDownloadLink(item) {
      console.log("bbbbbbbbbbbbb", item);
      if (item) {
        window.open(item, "_blank"); // Open link in a new tab
      } else {
        console.error("No download link available");
      }
    },
    async deleteCattle(item) {
      try {
        await axios.delete(`${API_ROUTES.DELETE_CATTLE}?id=${item.id}`);
        this.fetchData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fetchData(calledFrom = "") {
      try {
        let cattlesResponse = [];
        if (this.user.role == "insurance") {
          cattlesResponse = await axios.get(
            `${API_ROUTES.GET_CATTLES}?insurance=${this.user.id}`
          );
        } else if (this.user.role == "superadmin") {
          cattlesResponse = await axios.get(API_ROUTES.GET_CATTLES);
        } else {
          if (this.user.type == "Dairy") {
            cattlesResponse = await axios.get(
              `${API_ROUTES.GET_CATTLES}?dairy=${this.user.id}`
            );
          } else if (this.user.type == "Center") {
            cattlesResponse = await axios.get(
              `${API_ROUTES.GET_CATTLES}?center=${this.user.id}`
            );
          } else {
            cattlesResponse = await axios.get(
              `${API_ROUTES.GET_CATTLES}?center=${this.user.center_id}`
            );
          }
        }

        this.leads = cattlesResponse.data.cattles || [];
        if (calledFrom != "") {
          if (calledFrom == "cattleModal") {
            this.cattleModal = false;
          }
          if (calledFrom == "leadModal") {
            this.leadModal = false;
          }
          if (calledFrom == "policyModel") {
            this.policyModel = false;
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    openCattleModal(cattle = null, leadId) {
      console.log("innnnnn");
      this.selectedLead = leadId;
      this.editCattle = cattle;
      this.cattleModal = true;
    },
    openLeadModal() {
      this.leadModal = true;
    },
    openPolicyModel(policy_lead) {
      this.policy_lead_id = policy_lead;
      this.policyModel = true;
    },
    showEditButton(dateAdded) {
      const addedDate = new Date(dateAdded.replace(" ", "T"));
      const differenceInDays =
        (Date.now() - addedDate.getTime()) / (1000 * 60 * 60 * 24);
      return differenceInDays <= 5;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 20px;
}
.cattle-dialog-card {
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
}

.form-scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex-grow: 1;
}
</style>
