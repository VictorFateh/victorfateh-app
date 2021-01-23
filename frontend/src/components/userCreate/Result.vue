<template>
    <v-container fluid>
        <!-- <alert
            :type="alertType"
            :title="alertTitle"
            :message="alertMessage"
            :items="alertItems"
            :action-title="actionTitle"
            @action="actionClick"
        /> -->
        <v-alert
            :type="alertType"
            elevation="12"
            prominent
            border="top"
            @action="actionClick"
        >
            <v-row align="center">
                <v-col class="grow">
                    <div>
                        <strong>{{ alertTitle }}</strong>
                        {{ alertMessage }}
                    </div>
                </v-col>
            </v-row>
        </v-alert>
        <v-card elevation="12" fluid>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <p>
                            {{ date }}, your socotra id, {{ userResult.name }}, {{ userResult.email }}, {{ userResult.username }}, {{ userResult.password }}
                        </p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, PropType } from "@vue/composition-api";
import { RequiredRules, RequiredEmailRules, RequiredSelectRules } from "../../utils";
import { ResultModel } from "../../models";
import moment from 'moment'

export default defineComponent({
    props: {
        value: {
            type: Object as PropType<ResultModel>,
            required: true
        }
    },

    components: {
        Alert: () => import("../Alert.vue"),
    },

    setup(props, context) {

        const alertType = ref<string>();
        const alertTitle = ref<string>();
        const alertMessage = ref<string>('Please copy the information below into confluence (linked above)');
        const userResult = ref<any>(props.value.userResult);
        const date = moment(userResult.createdTimestamp).format('YYYY-MM-DD');


        if(props.value.errorMessage){
            alertType.value = "error";
            alertTitle.value = "There has been an error";
            alertMessage.value = props.value.errorMessage;
            // error stuff
        }
        else{
            alertType.value = "success";

            // alertTitle.value = userResult?.createdTimestamp;
            alertTitle.value = "User created succesfully"

            // alertMessage.value = `${userResult?.createdTimestamp}, YOUR-SOCOTRA-USERNAME, ${userResult?.name}, ${userResult?.email}, ${userResult?.username}, ${userResult?.password}`;
        
        }

        let actionTitle: string = "";
        
        function actionClick() {
            context.emit("action", { error: alertMessage.value ? true: false });
        }

        return {
            alertType,
            alertTitle,
            alertMessage,
            actionTitle,
            actionClick,
            userResult,
            date
        };
    }
});
</script>
