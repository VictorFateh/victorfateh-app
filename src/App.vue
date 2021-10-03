<template>
  <v-app>
    <nav-bar app />
    <v-main>
      <v-slide-y-transition mode="out-in">
        <router-view />
      </v-slide-y-transition>
    </v-main>
    <small-footer />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { 
    NavBar: () => import("@/components/core/NavBar.vue"),
    SmallFooter: () => import("@/components/core/Footer.vue")
  },
  metaInfo: { titleTemplate: "%s | Victor Fateh" },
  setup() {
    return {};
  },
});
</script>