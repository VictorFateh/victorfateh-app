<template>
    <v-form v-model="formValid">
        <v-container style="max-width:900px;">
            <v-card elevation="12">
                <v-card-title>
                    <h2 class="display-2 mt-4 mb-2 primary--text">
                        Let's talk
                    </h2>
                </v-card-title>
                <loading
                    v-if="loading"
                    color="accent"
                    title="Please wait..."
                />
                <v-card-text v-else>
                    <v-form
                        ref="form"
                        v-model="valid"
                    >
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="name"
                                    :rules="nameRules"
                                    label="Name"
                                    solo
                                    required
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="email"
                                    :rules="emailRules"
                                    label="E-mail"
                                    required
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" md="4">
                                <v-select
                                    v-model="select"
                                    :items="items"
                                    :rules="[v => !!v || 'Item is required']"
                                    label="Item"
                                    required
                                />
                            </v-col>
                        </v-row>
                        
                        <v-row>
                            <v-btn
                                :disabled="!valid"
                                color="success"
                                class="mr-4"
                                @click="validate"
                            >
                                Validate
                            </v-btn>
                        </v-row>
                    </v-form>
                </v-card-text>
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

        const name = ref<string>();



        function validate() {
            this.$refs.form.validate();
        }

       

        const underwritingColor = ref<string>();
        const underwritingIcon = ref<string>();

        return {
            loading,
            formValid,
            currentStep,
            
            // underwriting
            underwritingColor,
            underwritingIcon,

            validate,

            valid: true,

            name,
            nameRules: [
                v => !!v || 'Name is required',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            select: null,
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
            checkbox: false,
        };
    }
});
</script>
