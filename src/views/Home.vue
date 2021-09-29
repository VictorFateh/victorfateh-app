<template>
  <v-container fill-height fluid style="max-width: 1200px;">
    <v-row align="center" justify="center">
      <v-col v-if="loading" cols="12" class="text-center ">
        <fun-loading-message @exit="exitIntro" />
      </v-col>
      <v-col v-for="page in pages" v-else :key="page.name" cols="12" md="4">
        <v-card hover min-height="10vh" @click="loading=!loading">
          <v-card-title><v-icon>{{ page.icon }}</v-icon>{{ page.name }}</v-card-title>
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
    const pages = ref([
      {
        name: "About",
        icon: "mdi-pencil",
        message: "lol"
      },
      {
        name: "Experience",
        icon: "mdi-cog",
        message: "nice"
      },
      {
        name: "Contact",
        icon: "mdi-car",
        message: "try",
      }
    ]);
 
    const loading = ref<boolean>();

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

    return{ 
      pages,
      loading,
      exitIntro
    };
  }
});
</script>

<style lang="scss">
  .vue-typer .custom.caret {
     display: none;
  }
</style>