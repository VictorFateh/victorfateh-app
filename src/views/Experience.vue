<template>
    <v-form v-model="formValid">
        <v-container style="max-width:900px;">
            <v-card elevation="12">
                <v-card-title>
                    Create User
                </v-card-title>
                <v-stepper
                    v-model="currentStep"
                    alt-labels
                    class="elevation-0"
                >
                    <v-stepper-header flat>
                        <v-stepper-step
                            step="1"
                            color="accent"
                            :complete="currentStep > 1"
                        >
                            Admin Login
                        </v-stepper-step>
                        <v-divider />
                        <v-stepper-step
                            step="2"
                            color="accent"
                            :complete="currentStep > 2"
                        >
                            User Details
                        </v-stepper-step>
                        <v-divider />

                        <v-stepper-step
                            step="3"
                            :color="underwritingColor"
                            :complete-icon="underwritingIcon"
                            :complete="currentStep > 2 && !loading"
                        >
                            Output
                        </v-stepper-step>
                    </v-stepper-header>
                </v-stepper>
                <loading
                    v-if="loading"
                    color="accent"
                    title="Please wait..."
                />
                <v-card-text v-else>
                    <admin-details
                        v-if="currentStep == 1"
                        v-model="adminModel"
                    />
                    <account-details
                        v-if="currentStep == 2"
                        v-model="userModel"
                    />
                    <sign-up-complete
                        v-if="currentStep == 3"
                        :value="resultModel"
                        @action="actionClick"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        v-show="currentStep < 3"
                        color="accent"
                        :disabled="!formValid || loading"
                        @click="nextClick"
                    >
                        Next
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-form>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from "@vue/composition-api";
import { useVue } from '../composables';

export default defineComponent({
    components: {
        Loading: () => import("../components/Loading.vue")
    },

    setup(_props, context) {

        const { $router } = useVue(context);

        const loading = ref<boolean>(false);
        const formValid = ref<boolean>(false);
        const currentStep = ref<number>(1);

        const underwritingColor = ref<string>();
        const underwritingIcon = ref<string>();

        async function nextClick(): Promise<void> {
            loading.value = true;
            try {
                switch (currentStep.value) {
                    case 1:
                        // authToken.value = await createFlow.authenticateAdmin(adminModel.value);
                        currentStep.value++;
                        break;
                    case 2:
                        // const result = await createFlow.createPolicy(authToken.value!, userModel.value);
                        
                        // if (result.errorMessage) {
                        //     resultModel.value.errorMessage = result.errorMessage;
                        // }
                        // else {
                        //     resultModel.value.userResult = result.userResult;
                        //     currentStep.value++;
                        // }
                        break;
                }
            }
            finally {
                loading.value = false;
            }
        }

        function actionClick(data: any) {
            const { error } = data;
            if(error){
                currentStep.value = 2;
            }
        }

        return {
            loading,
            formValid,
            currentStep,
            // underwriting
            underwritingColor,
            underwritingIcon,
            // events
            nextClick,
            actionClick
        };
    }
});
</script>
