<template>
    <v-container fluid>
        <alert
            :type="type"
            :title="title"
            :message="message"
            :items="items"
            :action-title="actionTitle"
            @action="actionClick"
        />
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, PropType } from "@vue/composition-api";
import { RequiredRules, RequiredEmailRules, RequiredSelectRules } from "../utils";
import { UnderwritingModel } from "../models";

export default defineComponent({
    props: {
        value: {
            type: Object as PropType<UnderwritingModel>,
            required: true
        },
        allowAction: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    components: {
        Alert: () => import("./Alert.vue"),
    },

    setup(props, context) {

        const type = ref<string>();
        const title = ref<string>();
        const message = ref<string>();
        const items = ref<string[]>();

        let actionTitle: string = "";
        let actionEvent: string = "";

        switch (props.value?.decision) {
            case "accept":
                type.value = "success";
                title.value = "Congratulations";
                message.value = "Your policy is ready to view in the dashboard";
                actionTitle = "Dashboard";
                // actionEvent = "dashboard";
                break;
            case "none":
                type.value = "warning";
                title.value = "Referred!";
                message.value = "We're sorry but we need to run some additional checks:";
                items.value = props.value?.notes;
                actionTitle = "Check";
                // actionEvent = "check";
                break;
            case "reject":
                type.value = "error";
                title.value = "Error!";
                message.value = "We ran into the following problems:";
                items.value = props.value?.notes;
                actionTitle = "Retry";
                // actionEvent = "retry";
                break;
        }

        if (!props.allowAction)
            actionTitle = "";

        function actionClick() {
            context.emit("action", { decision: props.value?.decision });
        }

        return {
            type,
            title,
            message,
            items,
            actionTitle,
            actionClick
        };
    }
});
</script>
