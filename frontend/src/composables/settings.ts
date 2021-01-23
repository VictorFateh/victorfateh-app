import { required } from '@/utils';
import { inject, InjectionKey, provide } from '@vue/composition-api';
import { default as axios } from "axios";

const SettingsKey: InjectionKey<SettingsService> = Symbol("Settings");

export interface SettingsComposable {
  settings: SettingsService;
}

export function provideSettings(service: SettingsService): SettingsComposable {
  const loader = new SettingsLoader(service);
  provide(SettingsKey, loader);
  return {
    settings: loader
  };
}

export function useSettings(): SettingsComposable {
  return {
    settings: required(inject(SettingsKey))
  };
}

export interface Settings {
  api: string;
  hostName: string;
  username: string;
  password: string;
}

export interface SettingsService {
  load(): Promise<Settings>;
}

class SettingsLoader implements SettingsService {

  private _settings?: Promise<Settings>;

  constructor(private provider: SettingsService) { }

  reset(): void {
    this._settings = undefined;
  }

  load(): Promise<Settings> {

    if (!this._settings)
      this._settings = this.provider.load();

    return this._settings;
  }
}

export class SettingsUriProvider implements SettingsService {

  constructor(private uri: string) { }

  async load(): Promise<Settings> {
    const res = await axios.get<Settings>(this.uri);
    if (!res.data)
      throw new Error("Empty response");
    return res.data;
  }
}


export class SettingsEnvProvider implements SettingsService {
  load(): Promise<Settings> {
    return Promise.resolve({
      api: process.env["SOCOTRA_API"] || "",
      hostName: process.env["SOCOTRA_HOSTNAME"] || "",
      username: process.env["SOCOTRA_USERNAME"] || "",
      password: process.env["SOCOTRA_PASSWORD"] || ""
    });
  }
}
