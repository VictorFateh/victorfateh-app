import { required } from '@/utils';
import { ApiClientConstructor, configureClassicAuth, RestClientEvents, RestHttpClient } from '@socotra/api';
import { inject, InjectionKey, provide } from '@vue/composition-api';
import { AuthService, SettingsService } from '.';

const ApiFactoryKey: InjectionKey<ApiFactory> = Symbol("ApiFactory");

export interface ApiComposables {
  api: ApiFactory;
}

export interface ApiFactory {
  client<T>(creator: ApiClientConstructor<T>): T;
}

export function provideApiFactory(settings: SettingsService, auth: AuthService): ApiComposables {
  const api = new ApiFactoryProvider(settings, auth);
  provide(ApiFactoryKey, api);

  return {
    api
  };
}

export function useApiFactory(): ApiComposables {
  return {
    api: required(inject(ApiFactoryKey))
  };
}

export class ApiFactoryProvider implements ApiFactory {
  constructor(private settings: SettingsService, private auth: AuthService) {
  }

  async token(): Promise<string> {
    const token = await this.auth.token();
    // if (!token)
    //   throw new Error("Could not obtain authentication token");
    return token!.value;
  }

  events(authenticated: boolean = true): RestClientEvents {
    return {
      configure: async (_config, req) => {
        const { api } = await this.settings.load();
        let token: string | undefined = undefined;
        if (authenticated) {
          token = await this.token();
          configureClassicAuth(req, token!);
        }
      }
    };
  }

  client<T>(creator: ApiClientConstructor<T>, authenticated: boolean = true): T {
    return new creator(new RestHttpClient({}, this.events(authenticated)));
  }
}
