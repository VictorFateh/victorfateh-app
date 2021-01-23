import { required } from '@/utils';
import { AccountApi, AccountApiClient, RestClient, RestHttpClient } from '@socotra/api';
import { inject, InjectionKey, provide } from '@vue/composition-api';
import { default as dayjs } from "dayjs";
import { SettingsService } from '.';

export interface AuthComposable {
  auth: AuthService;
}

const AuthKey: InjectionKey<AuthService> = Symbol("Auth");

export function provideAuth(settings: SettingsService): AuthComposable {

  const auth = new AuthProvider(settings);
  provide(AuthKey, auth);

  return {
    auth
  };
}

export function useAuth(): AuthComposable {
  return {
    auth: required(inject(AuthKey))
  };
}

export interface AuthToken {
  value: string;
  expires: number;
}

export interface AuthService {
  token(): Promise<AuthToken | undefined>;
}

class AuthProvider implements AuthService {

  private _token?: Promise<AuthToken>;
  private _timeoutId?: number;

  constructor(private settings: SettingsService) { }

  reset(): void {
    this._token = undefined;
    this.clearTimer();
  }

  token(): Promise<AuthToken | undefined> {

    if (!this._token) {
      this._token = new Promise(async (resolve, reject) => {
        try {
          const { hostName, username, password } = await this.settings.load();
          const res = await this.accountApi().authenticate({
            hostName,
            username,
            password
          });

          this.beginExpirationTimer(res.expiresTimestamp);

          resolve({
            value: res.authorizationToken,
            expires: res.expiresTimestamp
          });
        }
        catch (err) {
          reject(err);
        }
      });
    }
    return this._token;
  }

  private client(): RestClient {
    return new RestHttpClient({});
  }

  private accountApi(): AccountApi {
    return new AccountApiClient(this.client());
  }

  private beginExpirationTimer(expiresTimestamp: number) {

    // clear existing timer (if any)
    this.clearTimer();

    // calculate number of milliseconds minus 5 minutes until token expiry
    // const expires = dayjs(expiresTimestamp, "x").subtract(5, "m");
    // const timeout = expires.diff(dayjs(), "ms");
    const timeout = 300000;

    // create timer
    this.startTimer(timeout);
  }

  private startTimer(timeout: number) {
    this._timeoutId = window.setTimeout(() => {
      this._token = undefined;
      this._timeoutId = undefined;
    }, timeout);
  }

  private clearTimer() {
    if (this._timeoutId) {
      window.clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }
  }
}
