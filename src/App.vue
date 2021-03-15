<template>
    <v-app id="victorfateh">
        <v-navigation-drawer
            v-model="drawer"
            app
            floating
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
                <v-list-item
                    link
                    to="/"
                >
                    <v-list-item-title>Home</v-list-item-title>
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
                <v-list-item
                    link
                    @click="
                        toggleTheme();
                        drawer = false;
                    "
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ dark ? "Light" : "Dark" }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app
            flat
            clipped-left
        >
            <v-app-bar-nav-icon
                class="hidden-md-and-up"
                @click.stop="drawer = !drawer"
            />
            <v-toolbar-title class="d-flex flex-row justify-center">
                <router-link
                    to="/"
                    class="title"
                >
                    <img
                        v-if="!dark"
                        svg-inline
                        class="logo"
                        src="./assets/logo-light.svg"
                        alt="Logo"
                        width="48"
                        height="48"
                    >
                    <img
                        v-if="dark"
                        svg-inline
                        class="logo"
                        src="./assets/logo-dark.svg"
                        alt="Logo"
                        width="48"
                        height="48"
                    >
                    <!-- <span>VF</span> -->
                </router-link>
            </v-toolbar-title>
            <v-container
                class="hidden-sm-and-down"
                fluid
            >
                <v-row>
                    <v-col class="d-inline-flex justify-center">
                        <v-btn
                            v-for="m in menu"
                            :key="m.title"
                            :outlined="!!m.highlight"
                            :text="!m.highlight"
                            :to="m.to"
                            :ripple="false"
                        >
                            {{ m.title }}
                        </v-btn>
                        <v-btn
                            :ripple="false"
                            text
                            color="accent"
                            @click="toggleTheme"
                        >
                            {{ dark ? "Light" : "Dark" }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>

            <template
                v-if="showSubNav"
                v-slot:extension
            >
                <v-tabs
                    optional
                    centered
                >
                    <v-tab
                        v-for="(item, index) in subNavItems"
                        :key="index"
                        :to="item.to"
                    >
                        {{ item.title }}
                    </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>

        <v-main class="pl-0">
            <v-container fluid>
                <router-view />
            </v-container>
        </v-main>

        <v-footer color="#0c1929">
            <span class="white--text">victorfateh &copy; 2021</span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { useVue, provideNav, NavItem } from "./composables";

const menu: NavItem[] = [
    {
        title: "Home",
        to: "/"
    },
    {
        title: "experience",
        to: "/experience"
    },
    {
        title: "Work",
        to: "/work"
    },
    {
        title: "contact",
        to: "/contact"
    }
];

export default defineComponent({
    setup(_props: any, context: any) {

        const { $vuetify } = useVue(context);

        // UI
        const { showSubNav, subNavItems } = provideNav();
        const dark = ref($vuetify.theme.dark);
        const drawer = ref<boolean>();
        const confluenceURL = ref<string | undefined>();

        // events handler
        function toggleTheme() {
            dark.value = !dark.value;
            $vuetify.theme.dark = dark.value;
        }

        // events
        onMounted(async () => {
            // const { hostName } = await settings.load();
            confluenceURL.value = 'https://www.google.com';
        });

        return {
            dark,
            drawer,
            menu,
            toggleTheme,
            confluenceURL,
            showSubNav,
            subNavItems
        };
    }
});
</script>
