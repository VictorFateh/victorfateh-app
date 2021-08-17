import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueCompositionAPI from "@vue/composition-api";
import VueMeta from "vue-meta";
import "./styles/main.scss";

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);

Vue.use(VueMeta);

new Vue({
  router,
  vuetify,
  render: h => h(App) 
}).$mount("#app");