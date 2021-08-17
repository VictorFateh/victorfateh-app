<template>
  <v-app>
    <nav-bar app />
    <v-main>
      <v-container fluid style="max-width: 1200px;">
        <v-slide-y-transition mode="out-in">
          <router-view />
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <v-footer app padless color="#F5F5F5" fixed>
      <v-container style="max-width: 1200px;" class="py-0 my-0">
        <v-col class="text-center body-2">
          {{ new Date().getFullYear() }}
        </v-col>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: { NavBar: () => import("@/components/core/NavBar.vue") },
  metaInfo: { titleTemplate: "%s | Victor Fateh" },
  setup(_props) {
    return {};
  },
});
</script>