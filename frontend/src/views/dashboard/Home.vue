<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col
                cols="12"
                sm="10"
                md="8"
                lg="6"
                xl="4"
            >
                <v-card>
                    <v-card-title>
                        Config Studio Stats
                        <v-spacer />
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                        />
                        <v-spacer />
                        <v-btn
                            color="accent"
                            @click="refresh"
                        >
                            Refresh
                        </v-btn>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="tableItems"
                        class="elevation-6"
                        :loading="loading"
                        :search="search"
                    />
                </v-card>
            
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from "@vue/composition-api";
import { useAppFlow, useDashboard, useVue } from "../../composables";
import axios from "axios";

// const { dashboardFlow } = useAppFlow();

export default defineComponent({

    // props: {
    //     locator: {
    //         type: String,
    //         required: false
    //     }
    // },

    components: {
        Lookup: () => import("../../components/dashboard/Lookup.vue"),
        Loading: () => import("../../components/Loading.vue"),
        Alert: () => import("../../components/Alert.vue")
    },

    setup(props, context) {
        const loading = ref<boolean>(false);
        const result = ref<object>();
        const headers = [
          {
            text: 'Tenant',
            align: 'start',
            value: 'tenant',
          },
          { text: 'Logins', value: 'logins' }
        ]

        const tableItems = <any>[];


        onMounted(async () => {
            try {
                loading.value = true;
                return axios
                .get("https://rlcpkfecn1.execute-api.eu-west-1.amazonaws.com/prod", {headers: {}})
                .then(response => {
                    loading.value = false;
                    console.log(JSON.stringify(response.data.body));
                    for (const [key, value] of Object.entries(response.data.body)) {
                        // console.log(`${key}: ${value}`);

                        tableItems.push({
                            tenant: key,
                            logins: value
                        })
                    }
                    result.value = response.data.body
                    return response;
                });
            } catch (error) {
                loading.value = false;
                return "error";
            }
        });

        function refresh() {
            authenticateAdmin();
        };

        async function authenticateAdmin() {
           try {
                loading.value = true;
                return axios
                .get("https://rlcpkfecn1.execute-api.eu-west-1.amazonaws.com/prod", {headers: {}})
                .then(response => {
                    loading.value = false;
                    console.log(JSON.stringify(response.data));
                    return response;
                });
            } catch (error) {
                loading.value = false;
                return "error";
            }
        };

        // result.value = await authenticateAdmin();

        const { $router, $nextTick } = useVue(context);

        const hasPolicy = ref<boolean>();

        async function lookup(locator: string) {
            loading.value = true;
        }

        return {
            loading,
            hasPolicy,
            result,
            refresh,
            headers,
            tableItems,
            search: ''
        };
    },
});
</script>
