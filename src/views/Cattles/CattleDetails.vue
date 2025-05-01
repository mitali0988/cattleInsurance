<template>
  <v-container>
    <v-col><h2>Cattle Details</h2></v-col>

    <v-row justify="space-between" v-if="user.role == 'Doctor'">
      <v-col class="text-right" v-if="!pdfLink">
        <v-btn color="primary" @click="generateCertificate('Health')"
          >Generate Health Certificate</v-btn
        >
      </v-col>
      <v-col class="text-right" v-if="cattle?.reTagPressed == 1">
        <v-btn color="primary" @click="generateCertificate('ReTag')"
          >Generate Re-Tag Certificate</v-btn
        >
      </v-col>
      <v-col class="text-right">
        <v-btn
          v-if="pdfType != 'Death Certificate'"
          color="primary"
          @click="openModal('DeathDetail')"
          >Generate Death Certificate</v-btn
        >
      </v-col>
      <v-col class="text-right" v-if="pdfType != 'Death Certificate'">
        <v-btn color="primary" @click="openModal('ReTag')">Retag</v-btn>
      </v-col>
      <v-col class="text-right" v-if="pdfLink">
        <router-link
          :to="{ name: 'ListCertificate', params: { cattleId: cattleId } }"
        >
          Download Certificates
        </router-link>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col
        class="text-right"
        v-if="pdfType == 'Death Certificate' && user.role == 'insurance'"
      >
        <v-btn color="primary" @click="openModal('Claim')">Add Claim</v-btn>
      </v-col>
      <v-col class="text-right" v-if="pdfLink">
        <router-link
          :to="{ name: 'ListCertificate', params: { cattleId: cattleId } }"
        >
          Download Certificates
        </router-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text v-if="cattle">
            <!-- Lead Information -->
            <cattle-info :cattle="cattle" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="reTagModal" max-width="600px" persistent="">
      <v-col cols="12">
        <v-card style="max-height: 90vh; overflow-y: auto">
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title> Retag </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="reTagModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <re-tag
              :cattleId="cattleId"
              :currentTag="cattle.current_tag"
              @tag-updated="tagUpdated"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
    <v-dialog v-model="claimModal" max-width="600px" persistent="">
      <v-col cols="12">
        <v-card style="max-height: 90vh; overflow-y: auto">
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title> Add Claim </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="claimModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <add-claim :cattleId="cattleId" @claim-updated="claimUpdated" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
    <v-dialog v-model="deathDetailModal" max-width="600px">
      <v-col cols="12">
        <v-card style="max-height: 90vh; overflow-y: auto">
          <!-- Dialog Toolbar with Close Button -->
          <v-toolbar dense flat>
            <v-toolbar-title> Death Details </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="deathDetailModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <!-- Dialog Content -->
          <v-card-text>
            <death-detail
              :cattleId="cattleId"
              @death-updated="onDeathUpdated"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "@/utils/api";
import { API_ROUTES } from "@/utils/apiConstants";
import jsPDF from "jspdf";
import ReTag from "./ReTag.vue";
import CattleInfo from "./CattleInfo.vue";
import DeathDetail from "./DeathDetail.vue";
import AddClaim from "../Policies/AddClaim.vue";
import { mapGetters } from "vuex";

export default {
  components: { ReTag, DeathDetail, CattleInfo, AddClaim },

  data() {
    return {
      cattle: null,
      errorMessage: "",
      reTagModal: false,
      deathDetailModal: false,
      claimModal: false,
      cattleId: this.$route.params.id,
      pdfLink: null,
      pdfType: null,
      enableRetagCertificate: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["user"]),
  },
  async created() {
    // Retrieve cattle data from state
    this.cattle = this.$route.state?.cattle;
    // If cattle data is not passed via state, fetch it using the id from params
    if (!this.cattle) {
      await this.fetchCattle();

      const id = this.$route.params.id;
      console.log(`Fetching data for cattle with ID: ${id}`);
      // Perform a fetch request to get cattle data using the id
    }
  },
  methods: {
    async onDeathUpdated() {
      await this.fetchCattle();
      this.generateCertificate("Death");
    },
    tagUpdated() {
      this.enableRetagCertificate = true;
      this.fetchCattle();
    },
    claimUpdated() {
      console.log("aaaa");
    },
    async fetchCattle() {
      try {
        const response = await axios.get(
          `${API_ROUTES.GET_CATTLE}?id=${this.cattleId}`
        );
        this.cattle = response.data.cattle;
        if (this.cattle.file_url) {
          this.pdfLink = this.cattle.file_url;
          this.pdfType = this.cattle.file_type;
        }
      } catch (error) {
        console.error("Error fetching cattle data:", error);
      }
    },
    showButton(type) {
      return this.pdfType === `${type} Certificate`;
    },

    openModal(type) {
      if (type === "ReTag") this.reTagModal = true;
      else if (type === "DeathDetail") this.deathDetailModal = true;
      else if (type === "Claim") this.claimModal = true;
    },
    async generateCertificate(type) {
      try {
        const pdf = new jsPDF();
        const letterheadImage = "/letterhead.jpg";

        const img = new Image();
        img.src = letterheadImage;
        img.onload = () => {
          this.createCertificatePDF(pdf, img, type);
        };
      } catch (error) {
        console.error(`Error generating ${type} Certificate:`, error);
      }
    },

    async savePDF(pdf, fileType) {
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("pdf", pdfBlob, `${fileType}_${this.cattleId}.pdf`);
      formData.append("fileType", fileType);
      formData.append("cattle_id", this.cattleId);
      formData.append("added_by", this.user.id);

      try {
        const result = await axios.post(API_ROUTES.ADD_PDF, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (result.data.success) {
          // Set the download link to the saved file
          this.pdfLink = result.data.fileUrl; // The server returns the file URL
          this.pdfType = fileType;
          if (fileType == "ReTag Certificate") {
            this.cattle.reTagPressed = 0;
          }
        }
      } catch (error) {
        console.error("Error saving the PDF:", error);
      }
    },
    createCertificatePDF(pdf, img, type) {
      const current_date = new Intl.DateTimeFormat("en-GB").format(new Date());
      console.log("ddddddd", current_date);
      pdf.addImage(img, "JPEG", 0, 0, 210, 297); // Full page background (A4 size)

      pdf.setFontSize(16);
      pdf.text(`${type} Certificate`, 105, 50, { align: "center" });

      pdf.setFontSize(12);
      let yPos = 70; // starting position
      pdf.text(
        `Name of Beneficiary: ${this.cattle.beneficiary_name}`,
        20,
        yPos
      );
      pdf.text(`Address: ${this.cattle.address}`, 20, (yPos += 10));
      pdf.text(`Phone: ${this.cattle.phone}`, 20, (yPos += 10));
      pdf.text(`Village: ${this.cattle.village}`, 20, (yPos += 10));
      pdf.text(`Taluka: ${this.cattle.taluka}`, 20, (yPos += 10));
      pdf.text(`State: ${this.cattle.state}`, 20, (yPos += 10));
      pdf.text(`Tag Number: ${this.cattle.current_tag}`, 20, (yPos += 10));
      pdf.text(`Animal Breed: ${this.cattle.breed}`, 20, (yPos += 10));
      pdf.text(`Right Horn: ${this.cattle.rightHorn}`, 20, (yPos += 10));
      pdf.text(`Switch of Tail: ${this.cattle.switchOfTail}`, 20, (yPos += 10));
      pdf.text(`Sum Insured: ${this.cattle.sumInsured}`, 20, (yPos += 10));
      pdf.text(`Lactation: ${this.cattle.lactation}`, 20, (yPos += 10));
      pdf.text(`Other Marks: ${this.cattle.marks}`, 20, (yPos += 10));
      pdf.text(`Insured/Financer: ${this.cattle.financer}`, 20, (yPos += 10));
      pdf.text(`Branch/Address: ${this.cattle.branch}`, 20, (yPos += 10));
      pdf.text(
        `Proposal/Loan Ac No: ${this.cattle.proposal}`,
        20,
        (yPos += 10)
      );
      pdf.text(
        `Insurance Company: ${this.cattle.insurance_company}`,
        20,
        (yPos += 10)
      );
      if (type == "Death") {
        pdf.text(
          `Reason of death: ${this.cattle.death_reason}`,
          20,
          (yPos += 10)
        );
        pdf.text(
          `Place of death: ${this.cattle.death_place}`,
          20,
          (yPos += 10)
        );
        pdf.text(`Illness Days: ${this.cattle.ill_days}`, 20, (yPos += 10));
        pdf.text(`Date of death: ${this.cattle.death_date}`, 20, (yPos += 10));
        pdf.text(`Time of death: ${this.cattle.death_time}`, 20, (yPos += 10));
      }

      let yPos2 = 80; // starting position
      pdf.text(`Date : ${current_date}`, 120, (yPos2 += 10));
      pdf.text(`Post: ${this.cattle.post}`, 120, (yPos2 += 10));
      pdf.text(`District: ${this.cattle.district}`, 120, (yPos2 += 10));
      pdf.text(`Pincode: ${this.cattle.pincode}`, 120, (yPos2 += 10));
      pdf.text(`Animal Species: ${this.cattle.species}`, 120, (yPos2 += 10));
      pdf.text(`Body Color: ${this.cattle.color}`, 120, (yPos2 += 10));
      pdf.text(`Left Horn: ${this.cattle.leftHorn}`, 120, (yPos2 += 10));
      pdf.text(`Approx Age(yrs): ${this.cattle.age} years`, 120, (yPos2 += 10));
      pdf.text(`Market Value: ${this.cattle.value}`, 120, (yPos2 += 10));
      pdf.text(`Milk(Ltr/Day): ${this.cattle.milk}`, 120, (yPos2 += 10));
      pdf.text(this.user.registrationCode, 180, 250, { align: "center" });
      pdf.text(this.user.name, 180, 260, { align: "center" });
      this.addPhotosToPDF(pdf, type);
    },
    addPhotosToPDF(pdf, fileType) {
      //let x = 20;
      let y = 5; // Initial Y position
      const photoWidth = 38;
      const photoHeight = 38;
      const spacing = 8;
      const pageWidth = 190;

      // Function to render photos dynamically
      const renderPhotos = (
        pdf,
        photos,
        title,
        startX,
        startY,
        isHorizontal = true,
        onComplete
      ) => {
        let x = startX;
        let y = startY;

        pdf.text(title, x, (y += 10)); // Title for the photo section
        y += 10;
        const photoTypes = ["left", "right", "front", "back", "tag"];
        let index = 0;
        const loadNextImage = () => {
          if (index >= photoTypes.length) {
            // After all images are processed, add text and call the completion callback
            pdf.text(this.user.registrationCode, 180, 280, { align: "center" });
            pdf.text(this.user.name, 180, 290, { align: "center" });

            onComplete?.(); // Callback when all photos are loaded
            return;
          }

          const type = photoTypes[index]; // Get the current photo type
          const img = new Image();
          img.src = photos[type];

          img.onload = () => {
            pdf.text(type, x, y + 1); // Add type name above the photo
            pdf.addImage(img, "JPEG", x, y + 3, photoWidth, photoHeight);

            if (isHorizontal) {
              x += photoWidth + spacing; // Move horizontally
              if (x + photoWidth > pageWidth) {
                x = startX; // Reset X position
                y += photoHeight + spacing; // Move to the next row
              }
            } else {
              y += photoHeight + spacing; // Move vertically
            }

            index++; // Move to the next photo type
            loadNextImage(); // Recursively load the next image in order
          };
        };

        // Start loading the first image
        loadNextImage();
      };

      // Add a new page
      pdf.addPage();

      //pdf.text("Photos:", x, (y += 10));

      // Access photos by category
      const photosByCategory = this.cattle.photos;
      if (fileType === "Health") {
        renderPhotos(
          pdf,
          photosByCategory["health certificate"],
          "Health Certificate Photos:",
          20,
          y,
          true, // Horizontal layout
          () => {
            this.savePDF(pdf, `${fileType} Certificate`);
          }
        );
      } else if (fileType === "ReTag") {
        renderPhotos(
          pdf,
          photosByCategory["health certificate"],
          "Health Certificate Photos:",
          20,
          y,
          false, // Vertical layout
          () => {
            // Render Retag photos after initial photos are done
            renderPhotos(
              pdf,
              photosByCategory["ReTag certificate"],
              "Retag Photos:",
              80,
              5,
              false, // Vertical layout
              () => {
                this.savePDF(pdf, `${fileType} Certificate`);
              }
            );
          }
        );
      } else if (fileType === "Death") {
        renderPhotos(
          pdf,
          photosByCategory["health certificate"],
          "Health Certificate Photos:",
          20,
          y,
          false, // Vertical layout
          () => {
            // Render Retag photos after initial photos are done
            if (photosByCategory["ReTag certificate"]) {
              console.log("innnnnnnnnn");
              renderPhotos(
                pdf,
                photosByCategory["ReTag certificate"],
                "Retag Photos:",
                80,
                5,
                false, // Vertical layout
                () => {
                  renderPhotos(
                    pdf,
                    photosByCategory["Death certificate"],
                    "Death Photos:",
                    140,
                    5,
                    false, // Vertical layout
                    () => {
                      this.savePDF(pdf, `${fileType} Certificate`);
                    }
                  );
                }
              );
            } else {
              renderPhotos(
                pdf,
                photosByCategory["Death certificate"],
                "Death Photos:",
                140,
                5,
                false, // Vertical layout
                () => {
                  this.savePDF(pdf, `${fileType} Certificate`);
                  this.deathDetailModal = false;
                }
              );
            }
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 20px;
}
</style>
