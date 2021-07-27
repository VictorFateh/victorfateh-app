<template>
  <div>
    <v-navigation-drawer v-model="drawer" app floating class="hidden-md-and-up">
      <v-list class="text-center">
        <v-list-item link @click="drawer = false">
          <v-list-item-title>
            <v-icon>mdi-close</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item link to="/">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item v-for="m in menu" :key="m.title" link :to="m.to" exact>
          <v-list-item-content>
            <v-list-item-title>{{ m.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="white" flat>
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="grey darken-1" size="32" />

        <v-spacer />

        <v-btn v-for="link in menu" :key="link.title" text :to="link.to">
          {{ link.title }}
        </v-btn>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/composition-api";

export default {
  name: "Navbar",

  setup() {
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

    return { drawer, menu };
  },
};
</script>

<style>

</style>