<template>
  <v-footer app padless color="#F5F5F5" fixed>
    <v-container style="max-width: 1200px;" class="py-0 my-0">
      <v-col class="text-center body-2">
        {{ new Date().getFullYear() }}
      </v-col>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Footer",

  setup() {

    return { };
  },
});
</script>