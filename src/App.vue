<template>
  <v-app>
    <nav-bar />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { reactive, ref } from "@vue/composition-api";

export default {
  components: { NavBar: () => import("./components/core/NavBar.vue") },
  setup(_props) {
    // UI
    const drawer = ref();

    // Data
    const menu = reactive([
      {
        title: "About",
        to: "/about",
      },
      {
        title: "Experience",
        to: "/experience",
      },
      {
        title: "Contact",
        to: "/contact",
      },
    ]);
    const homeTitle = ref("Victor Fateh");

    return {
      // UI
      drawer,

      // Data
      menu,
      homeTitle,

    };
  },
};
</script>