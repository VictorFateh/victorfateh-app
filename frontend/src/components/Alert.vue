<template>
    <v-alert
        :type="alertType"
        elevation="12"
        prominent
        border="top"
    >
        <v-row align="center">
            <v-col class="grow">
                <div>
                    <strong>{{ alertTitle }}</strong>
                    {{ message }}
                    <ul
                        v-if="items"
                        class="mt-4"
                    >
                        <li
                            v-for="(item, index) in items"
                            :key="index"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </v-col>
            <!-- <v-col
                v-if="actionTitle"
                class="shrink"
            >
                <v-btn
                    color="white"
                    elevation="0"
                    light
                    @click="actionClick"
                >
                    {{ actionTitle }}
                </v-btn>
            </v-col> -->
        </v-row>
    </v-alert>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "@vue/composition-api";

export default defineComponent({
    props: {
        type: {
            type: String,
            default: "info"
        },
        title: {
            type: String
        },
        message: {
            type: String,
            required: false
        },
        items: {
            type: Array as PropType<Array<string>>,
            required: false
        },
        actionTitle: {
            type: String,
            required: false,
            default: undefined
        }
    },
    setup(props, context) {

        const validTypes = ["info", "success", "warning", "error"];
        const alertType = validTypes.indexOf(props.type) !== -1 ? props.type : "info";
        const alertTitle = props.title || alertType.charAt(0).toUpperCase() + alertType.slice(1);

        function actionClick() {
            context.emit("action");
        }

        return {
            alertType,
            alertTitle,
            actionClick
        };
    }
});
</script>
