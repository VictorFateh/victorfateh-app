<template>
  <div>
    <div>
      <v-avatar>
        <v-tooltip v-if="end" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn 
              small 
              color="accent" 
              outlined 
              icon 
              v-bind="attrs"
              @click="exitClick"
              v-on="on"
            >X</v-btn>
          </template>
          <span>it was nice talking to you</span>
        </v-tooltip>
        <half-circle-spinner
          v-else
          :size="25"
          :color="'#0c1929'"
        />
      </v-avatar>
    </div>
    <span v-if="start">initializing your experience</span>
    <vue-typer
      v-if="!start && loadingMessage && !end"
      :text="loadingMessage"
      :repeat="0" 
      caret-animation="phase" 
    />
    <span v-if="end">stop forever</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { HalfCircleSpinner } from "epic-spinners";
import { VueTyper } from "vue-typer";

export default defineComponent({
  components: { HalfCircleSpinner, VueTyper },
  setup(_props, context){

    const { emit } = context;

    const loadingMessage = ref<string>("loading your experience");
    const start = ref<boolean>(true);
    const end = ref<boolean>(false);

    function exitClick(){
      emit("exit");
    }

    onMounted(() => {
      setTimeout(() => {
        loadingMessage.value = "I'm not actually \"initializing\" anything";
        start.value = false;
        setTimeout(() => {
          loadingMessage.value = "but I'm glad I can waste your time :)";
          setTimeout(() => {
            end.value = true;
          }, 4000);
        }, 4000);
      }, 4000);
      
    });
    
    return{ loadingMessage, start, end, exitClick };
  }
});
</script>