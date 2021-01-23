import VueCompositionApi from "@vue/composition-api";
import Vue from "vue";
import App from "./App.vue";
import GlobalFilters from './plugins/filters';
import vuetify from "./plugins/vuetify";
import router from "./router";
import "./styles/main.scss";
import "./utils";

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);
Vue.use(GlobalFilters);

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");
