<template>
    <v-row>
        <v-col cols="6">
            <v-text-field
                v-model="adminUsername"
                :rules="RequiredRules"
                label="Admin Username"
                filled
            />
        </v-col>
        <v-col>
            <v-text-field
                v-model="adminPassword"
                :rules="RequiredRules"
                type="password"
                label="Admin Password"
                filled
            />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, PropType, watch } from "@vue/composition-api";
import { RequiredRules } from "../../utils";
import { AdminModel } from "../../models";

export default defineComponent({
    props: {
        value: {
            type: Object as PropType<AdminModel>,
            required: true
        }
    },

    setup(props, context) {
        const adminUsername = ref<string>(props.value.username);
        const adminPassword = ref<string>(props.value.password);

        watch([adminUsername, adminPassword], ([newUsername, newPassword]) => {
            context.emit("input", {
                username: newUsername,
                password: newPassword
            } as AdminModel);
        });

        return {
            adminUsername,
            adminPassword,
            RequiredRules
        };
    }
});
</script>
