<template>
    <v-row
        align="center"
        justify="center"
    >
        <v-col
            cols="12"
            class="text-center"
        >
            <v-progress-circular
                size="90"
                width="14"
                :color="color"
                indeterminate
            />
        </v-col>
        <v-col
            cols="12"
            class="text-center"
        >
            <h3 class="display-1 text-center font-weight-light">{{ title }}</h3>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

interface ComponentProps {
    title: string;
    color: string;
}

export default defineComponent<ComponentProps>({
    props: {
        title: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: "primary"
        }
    }
});
</script>
