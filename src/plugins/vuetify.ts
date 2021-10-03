import Vue from "vue";
import Vuetify, { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: { iconfont: "mdi" },
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: "#0c1929",
        secondary: "#3a4654",
        accent: "#44c18e",
        anchor: colors.blueGrey.base,
        error: colors.red.lighten1,
        warning: colors.deepOrange.lighten1,
        info: "#2196F3",
        background: "#F5F5F5"
        // success: colors.green.lighten2,
      }
    } 
  } 
});