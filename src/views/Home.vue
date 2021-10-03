<template>
  <v-container :fill-height="$vuetify.breakpoint.mdAndUp" fluid style="max-width: 1000px;">
    <v-row v-if="loading" align="center" justify="center">
      <v-col cols="12" class="text-center ">
        <fun-loading-message @exit="exitIntro" />
      </v-col>
    </v-row>
    <v-row v-else align="center">
      <v-col cols="12" md="6" align="center">
        <v-img
          v-if="$vuetify.breakpoint.mdAndUp"
          max-width="300"
          hover
          :src="require(`../assets/landing/profile-${imageURL}.png`)"
          @click="imageClick"
        />
        <v-img
          v-else
          max-width="300"
          max-height="300"
          position="100% 6%"
          :src="require(`../assets/landing/profile-${imageURL}.png`)"
          @click="imageClick"
        />
        <span class="caption">(click to see my alternate form)</span>
      </v-col>
      <v-col cols="12" md="6">
        <v-card align="start" color="background" flat class="mx-2">
          <span class="body-1">Hi Victor here,</span><br>
          <span class="body-1">Product geek that writes code.</span><br>
          <span class="body-1">If I'm not figuring out why something sucks to use I'm off doing one of the following:</span><br>
          <ul>
            <li>one</li>
          </ul>
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { VueTyper } from "vue-typer";
import Vue from "vue";

export default defineComponent({
  metaInfo: { title: "Home" },
  components: { 
    VueTyper,
    FunLoadingMessage: () => import("../components/FunLoadingMessage.vue")
  },
  setup(){
 
    const loading = ref<boolean>();

    const imageURL = ref<string>("real");

    onMounted(() => {
      if(!Vue.$cookies.get("introViewed")){
        loading.value = true;
      }else{
        loading.value = false;
      }
    });

    function exitIntro(){
      try {
        Vue.$cookies.set("introViewed", true);
        loading.value = false;
      }catch(error){
        console.log(error);
      }
    }

    function imageClick(){
      if(imageURL.value == "real"){
        imageURL.value = "cartoon";
      }else{
        imageURL.value = "real";
      }
    }

    return{ 
      loading,
      imageURL,
      exitIntro,
      imageClick
    };
  }
});
</script>