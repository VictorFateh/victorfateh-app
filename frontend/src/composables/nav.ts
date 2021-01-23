import { required } from '@/utils';
import { inject, InjectionKey, provide, Ref, ref } from '@vue/composition-api';
import { Route } from 'vue-router';

const NavKey: InjectionKey<NavComposable> = Symbol("Nav");

export interface NavItemName {
  title: string;
  name: string;
}

export interface NavItem {
  title: string;
  to: string | Partial<Route>;
  highlight?: boolean;
}

export interface NavComposable {
  showSubNav: Ref<boolean>;
  subNavItems: Ref<Array<NavItem>>;
}

export function provideNav(): NavComposable {
  const composable: NavComposable = {
    showSubNav: ref<boolean>(false),
    subNavItems: ref<Array<NavItem>>([])
  };
  provide(NavKey, composable);
  return composable;
}

export function useNav(): NavComposable {
  return required(inject(NavKey));
}
