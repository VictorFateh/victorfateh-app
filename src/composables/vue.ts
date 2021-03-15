import { SetupContext } from '@vue/composition-api';
import VueRouter from 'vue-router';
import { Framework } from 'vuetify';

export interface VueComposables {
  $router: VueRouter;
  $nextTick(callback: (this: this) => void): void;
  $nextTick(): Promise<void>;
  $vuetify: Framework;
}

export function useVue(context: SetupContext): VueComposables {
  const { $router, $nextTick, $vuetify } = context.root;
  return {
    $router,
    $nextTick,
    $vuetify
  };
}