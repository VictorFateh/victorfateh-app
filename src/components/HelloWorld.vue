<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <h1 class="text-md-h1 text-sm-h2">Victor Fateh</h1>

        <p>
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a href="https://community.vuetifyjs.com" target="_blank">Discord Community</a>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from "@vue/composition-api";

export default {
  name: "HelloWorld",

  setup() {
    const title = ref("something");

    return { title, };
  },
};
</script>
