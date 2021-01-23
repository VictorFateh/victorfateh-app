<template>
    <v-row>
        <v-col cols="6">
            <v-text-field
                v-model="username"
                :rules="RequiredRules"
                label="Username"
                filled
            />
        </v-col>
        <v-col>
            <v-text-field
                v-model="email"
                :rules="RequiredEmailRules"
                type="email"
                label="Email"
                filled
            />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, PropType, watch } from "@vue/composition-api";
import { RequiredEmailRules, RequiredRules } from "../../utils";
import { useProducts } from "../../composables";
import { UserModel } from "../../models";

export default defineComponent({
    props: {
        value: {
            type: Object as PropType<UserModel>,
            required: true
        }
    },

    setup(props, context) {

        const { setup, selectRef } = useProducts();

        const loading = ref<boolean>(true);

        const username = ref<string>(props.value.username);
        const email = ref<string>(props.value.email);

        watch([username, email], ([newUsername, newEmail]) => {
            context.emit("input", {
                username: newUsername,
                email: newEmail
            } as UserModel);
        });

        onMounted(async () => {
            try {
                // await setup();
            }
            finally {
                loading.value = false;
            }
        });

        return {
            loading,
            RequiredEmailRules,
            RequiredRules,
            username,
            email
        };
    }
});
</script>
