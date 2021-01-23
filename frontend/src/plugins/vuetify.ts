import Vue from "vue";
import Vuetify, { colors } from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    options: {
      customProperties: true
    },
    // dark: true,
    themes: {
      light: {
        primary: '#0c1929',
        secondary: '#3a4654',
        accent: '#44c18e',
        anchor: colors.blueGrey.base,
        error: colors.pink.darken1,
        warning: colors.deepOrange.base
        // info: colors.green.lighten2,
        // success: colors.green.lighten2,
      },
      dark: {
        primary: colors.grey.lighten2,
        secondary: colors.deepOrange.base,
        accent: '#44c18e',
        anchor: colors.blueGrey.base,
        error: colors.pink.darken1,
        warning: colors.deepOrange.base
        // error: colors.red.lighten3,
        // info: colors.green.lighten2,
        // success: colors.green.lighten2,
        // warning: colors.orange.lighten2
      }
    }
  }
});
