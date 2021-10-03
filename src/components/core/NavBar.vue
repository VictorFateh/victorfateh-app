<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      right
      class="hidden-md-and-up"
    >
      <v-list class="text-center">
        <v-list-item
          link
          @click="drawer = false"
        >
          <v-list-item-title>
            <v-icon>mdi-close</v-icon>
          </v-list-item-title>
        </v-list-item>

        <v-list-item to="/" exact>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="m in menu"
          :key="m.title"
          link
          :to="m.to"
          exact
        >
          <v-list-item-content>
            <v-list-item-title>{{ m.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-right flat>
      <v-container class="py-0 px-0 fill-height d-flex flex-row justify-end" style="max-width: 1200px;">
        <router-link to="/" class="text-decoration-none text-uppercase"><span class="text-h5">Victor Fateh</span></router-link>
        
        <v-spacer />
        
        <div v-if="$vuetify.breakpoint.mdAndUp">
          <v-btn
            v-for="m in menu"
            :key="m.title"
            :text="!m.highlight"
            :to="m.to"
            :ripple="false"
            class="font-weight-bold"
          >
          
            {{ m.title }}
          </v-btn>
        </div>
      </v-container>

      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click.stop="drawer = !drawer"
      />
    </v-app-bar></div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Navbar",

  setup() {
    // UI
    const drawer = ref<boolean>(false);

    // Data
    const menu = reactive([
      {
        title: "Fun",
        to: "/fun",
      }, 
      {
        title: "Experience",
        to: "/experience",
      },
      {
        title: "Connect",
        to: "/connect",
      },
    ]);

    return { drawer, menu };
  },
});
</script>