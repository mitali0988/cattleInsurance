<template>
  <v-row>
    <v-col cols="6">
      <h3>Lead Details</h3>
      <p><strong>Name:</strong> {{ cattle.beneficiary_name }}</p>
      <p><strong>Address:</strong> {{ cattle.address }}</p>
      <p><strong>Phone:</strong> {{ cattle.phone }}</p>
      <p><strong>Village:</strong> {{ cattle.village }}</p>
      <p><strong>State:</strong> {{ cattle.state }}</p>
      <p><strong>Taluka:</strong> {{ cattle.taluka }}</p>
      <p><strong>District:</strong> {{ cattle.district }}</p>
      <p><strong>Pincode:</strong> {{ cattle.pincode }}</p>
      <p><strong>Post:</strong> {{ cattle.post }}</p>
    </v-col>
    <v-col cols="6">
      <p>
        <strong>Insurance Company:</strong>
        {{ cattle.insurance_company }}
      </p>
      <p><strong>Financer:</strong> {{ cattle.financer }}</p>
      <p><strong>Branch:</strong> {{ cattle.branch }}</p>
      <p><strong>Proposal:</strong> {{ cattle.proposal }}</p>
      <p v-if="cattle.name != ''">
        <strong>Insurance Company: </strong>{{ cattle.name }}
      </p>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <h3>Cattle Details</h3>

      <p><strong>Age:</strong> {{ cattle.age }}</p>
      <p><strong>Breed:</strong> {{ cattle.breed }}</p>
      <p><strong>Secies:</strong> {{ cattle.address }}</p>
      <p><strong>Color:</strong> {{ cattle.phone }}</p>
      <p><strong>Marks:</strong> {{ cattle.village }}</p>
      <p><strong>Tag Number:</strong> {{ cattle.current_tag }}</p>
    </v-col>
    <v-col cols="6">
      <p><strong>Milk Production:</strong> {{ cattle.milk }} ltr/day</p>
      <p><strong>right Horn:</strong> {{ cattle.rightHorn }}</p>
      <p><strong>Left Horn:</strong> {{ cattle.leftHorn }}</p>
      <p><strong>Switch of Tail:</strong> {{ cattle.switchOfTail }}</p>
      <p><strong>Lactation:</strong> {{ cattle.lactation }}</p>
      <p><strong>Sum Insured:</strong> {{ cattle.sumInsured }}</p>
      <p><strong>Value:</strong> {{ cattle.value }}</p>
    </v-col>
  </v-row>
  <v-row v-if="cattle.death_reason">
    <v-col cols="12">
      <p><strong>Reason of death:</strong> {{ cattle.death_reason }}</p>
      <p><strong>Place of death:</strong> {{ cattle.death_place }}</p>
      <p><strong>Date of death:</strong> {{ cattle.death_date }}</p>
      <p><strong>Time of death:</strong> {{ cattle.death_time }}</p>

    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <div>
        <h4>Photos</h4>
        <v-row>
          <v-col
            v-for="(types, category) in cattle.photos"
            :key="category"
            class="category-block"
          >
            <h3>{{ category }}</h3>
            <div
              v-for="(photoUrl, type) in types"
              :key="type"
              class="photo-item"
            >
              <v-img
                :style="{
                  maxWidth: '400px',
                  maxHeight: '300px',
                  width: '100%',
                  height: 'auto',
                  border:'1px solid'
                }"
                :src="photoUrl"
              ></v-img>
              <p>{{ type }}</p>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["cattle"],
};
</script>
