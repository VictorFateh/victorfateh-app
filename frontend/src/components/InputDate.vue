<template>
    <v-menu
        ref="menu"
        v-model="showPicker"
        :close-on-content-click="false"
        transition="scale-transition"
        min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                :value="displayValue"
                :label="label"
                :rules="rules"
                :color="color"
                :outlined="outlined"
                readonly
                :clearable="!readonly && clearable"
                v-on="readonly ? null : on"
                @click:clear="date = null"
            />
        </template>
        <v-date-picker
            ref="picker"
            v-model="selectedValue"
            :min="min"
            :max="max"
            :allowed-dates="allowedDates"
            :color="color"
            @change="changed"
        />
    </v-menu>
</template>

<script lang="ts">
import { default as dayjs } from "dayjs";
import { defineComponent, reactive, computed, toRefs, ref, watch } from "@vue/composition-api";
import { useVue } from '../composables';
import { DatePickerFormat } from '../utils';

const PickerFormat = DatePickerFormat;
// const DisplayFormat = "DD MMMM YYYY";
const DisplayFormat = "DD-MM-YYYY";

export default defineComponent({
    props: {
        label: {
            type: String,
            default: "Date"
        },
        value: {
            type: String,
            default: undefined
        },
        color: {
            type: String,
            default: undefined
        },
        outlined: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: true
        },
        rules: {
            type: Array,
            default: undefined
        },
        min: {
            type: String,
            required: false
        },
        max: {
            type: String,
            required: false
        },
        allowedDates: {
            type: Function,
            required: false
        }
    },
    setup(props, context) {
        const { $nextTick } = useVue(context);
        const today = dayjs();

        const selectedValue = ref<string>();
        const showPicker = ref(false);

        const displayValue = computed(() => {
            return selectedValue.value ? dayjs(selectedValue.value!, PickerFormat).format(DisplayFormat) : "";
        });

        watch(
            () => props.value,
            newValue => {
                selectedValue.value = newValue;
            },
            {
                immediate: true
            }
        );

        const menu = ref<any>(null);
        const picker = ref<any>(null);

        function changed() {
            menu.value.save(selectedValue.value);
            context.emit("input", selectedValue.value);
        }

        return {
            showPicker,
            selectedValue,
            displayValue,
            menu,
            picker,
            changed
        };
    }
});
</script>
