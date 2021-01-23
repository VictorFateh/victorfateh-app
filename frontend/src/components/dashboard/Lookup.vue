<template>
    <v-form v-model="formValid">
        <v-container style="max-width:400px;">
            <v-card elevation="12">
                <v-card-title>Lookup Policy</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="locator"
                                :rules="RequiredLocatorRules"
                                type="number"
                                filled
                                label="Policy number"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="primary"
                        @click="lookupClick"
                    >
                        Lookup
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { RequiredLocatorRules } from "../../utils";

export default defineComponent({
    setup(props, context) {

        const formValid = ref<boolean>(false);
        const locator = ref<string>();

        function lookupClick() {
            if (formValid.value)
                context.emit("lookup", locator.value);
        }

        return {
            formValid,
            lookupClick,
            locator,
            RequiredLocatorRules
        };
    }
});
</script>
