<template>
    <v-container
        fluid
        pa-0
    >
        <h2 class="display-3 text-center my-16 primary--text">
            Sandbox Manager
        </h2>

        <v-row align="center">
            <v-col class="text-center">
                <!-- <v-progress-circular v-if="loading" color="red" indeterminate size="120" /> -->
                <v-btn
                    to="/userCreate"
                    color="accent"
                    large
                >Start</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
    components: {
        // Xxx: () => import("../components/xxx.vue")
    },

    setup(_props, context) {

        // const loading = ref<boolean>(false);

        return {
            // loading
        };
    }
});
</script>

