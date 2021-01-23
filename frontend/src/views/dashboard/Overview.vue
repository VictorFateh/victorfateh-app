<template>
    <v-container fluid>
        <underwriting
            v-if="underwritingModel"
            :value="underwritingModel"
            :allow-action="allowUnderwritingAction"
            @action="actionClick"
        />
        <v-container
            v-else
            fluid
        >
            <v-row>
                <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    align="center"
                    class="fill-height"
                >
                    <v-card
                        elevation="12"
                        class="fill-height"
                        :style="$vuetify.breakpoint.xs ? '' : 'min-height:320px;'"
                    >
                        <v-card-title>
                            Overview
                        </v-card-title>
                        <v-card-text>
                            Details...
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch, toRef, Ref, reactive, WatchStopHandle, onUnmounted } from "@vue/composition-api";
import { useAppFlow, useDashboard, useVue } from "../../composables";
import { PolicyResponse, PremiumReportResponse } from "@socotra/api";
import { UnderwritingModel, ReportModel, toPremiumReportFieldValues, toPremiumReportFieldGroups } from "../../models";
import { Route } from 'vue-router';
import dayjs from 'dayjs';
import { DatePickerFormat } from "../../utils";

export default defineComponent({

    props: {
        locator: {
            type: String,
            required: false
        }
    },

    components: {
        Underwriting: () => import("../../components/Underwriting.vue")
    },

    setup(props, context) {

        const { $router, $nextTick } = useVue(context);
        const { policy, clearPolicy, getUnderwriting, report, premiumReports, addPremiumReport } = useDashboard();
        const { dashboardFlow } = useAppFlow();

        const allowUnderwritingAction = ref<boolean>(false);
        const underwritingModel = ref<UnderwritingModel>();

        // policy state
        watch(
            policy,
            (newPolicy) => {

                // check underwriting result
                const underwriting = getUnderwriting();
                if (underwriting?.decision === "accept") {

                    // clear underwriting details
                    underwritingModel.value = undefined;

                    // initialise overview
                    initOverview(newPolicy!.locator);
                }
                else {

                    // set underwriting details
                    underwritingModel.value = {
                        decision: underwriting?.decision,
                        notes: underwriting?.notes
                    };
                    allowUnderwritingAction.value = underwriting?.decision === "none";
                }
            },
            {
                immediate: true
            }
        );

        function initOverview(locator: string) {
        }

        // check policy state when in referral
        function actionClick(data: any) {

            const { decision } = data;

            if (decision === "none") {

                // clear policy
                clearPolicy();

                // redirect to dashboard
                $router.push({
                    name: "dashboard",
                    params: {
                        locator: $router.currentRoute.params.locator
                    }
                });
            }
        }

        return {
            underwritingModel,
            allowUnderwritingAction,
            actionClick
        };
    }
});
</script>
