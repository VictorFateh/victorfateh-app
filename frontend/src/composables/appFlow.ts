import { required } from '@/utils';
import { ApiFactory } from '@socotra/api';
import { inject, InjectionKey, provide } from '@vue/composition-api';
import { CreateAppFlow, CreateAppFlowProvider } from './flows';
import { DashboardAppFlow, DashboardAppFlowProvider } from './flows';

const AppFlowKey: InjectionKey<AppFlowComposables> = Symbol("AppFlow");

export interface AppFlowComposables {
  createFlow: CreateAppFlow;
  dashboardFlow: DashboardAppFlow;
}

export function provideAppFlow(api: ApiFactory): AppFlowComposables {
  const composables: AppFlowComposables = {
    createFlow: new CreateAppFlowProvider(api),
    dashboardFlow: new DashboardAppFlowProvider(api)
  };
  provide(AppFlowKey, composables);
  return composables;
}

export function useAppFlow(): AppFlowComposables {
  return required(inject(AppFlowKey));
}
