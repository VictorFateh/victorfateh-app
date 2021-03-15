<template>   
    <v-container fluid mb-4>
        <v-row>
            <v-col cols="12">
                <h2 class="display-3 text-center my-8 primary--text">
                    Hi, I'm Victor
                </h2>
            </v-col>
        </v-row>
        <v-row>
            
            <v-col
                cols="12"
                sm="3"
            />

            <v-col
                cols="12"
                sm="6"
            >
                
                <v-sheet
                    min-height="10vh"
                    rounded="lg"
                    class="font-weight-medium pa-6"
                    elevation="2"
                >
                    <v-row>
                        <v-col cols="12" md="4" class="text-center">
                            <v-img
                                class="mx-auto"
                                max-height="600"
                                max-width="250"
                                src="/assets/victor-cutout.png"
                            />
                            <span class="subtitle-2">(Not to scale btw)</span>
                        </v-col>
                        <v-col cols="12" md="8">
                            <div class="pa-4">
                                <p>This is where I'm supposed to give you some big long spiel about who I am, let's keep it simple:</p>
                                <p>
                                    <ul>
                                        <li>I like enterprise technology</li>
                                        <li>I'm experienced in enterprise technology</li>
                                        <li>I live to bridge the gap between engineering &hArr; product</li>
                                    </ul>
                                </p>
                                <p>When I'm not knee deep in building a better deployments team I'm probably doing one of the following</p>
                                <p>
                                    <ul>
                                        <li>Working on cars</li>
                                        <li>Flying airplanes</li>
                                        <li>Writing code to make someone's life easier (ie. mine)</li>
                                    </ul>
                                </p>
                                <p>That's enough for this card, if you really want more go <router-link to="/experience">here</router-link></p>
                            </div>
                        </v-col>
                    </v-row>
                    
                </v-sheet>
            </v-col>

            <v-col
                cols="12"
                sm="3"
            />
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
    components: {
    },

    setup(_props, context) {
        const loading = ref<boolean>(true);

        setTimeout(() => {
            loading.value = false;
        }, 1000);

        return {
            loading
        };
    }
});
</script>

