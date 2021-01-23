
export type Callback<T> = (value: T) => void;
export type Factory<T, A = void> = (args: A) => T;
export type Predicate<T> = (value: T, index: number, array: Array<T>) => boolean;

export type PickPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export class Lazy<T> {

  private _value?: T;

  constructor(private readonly factory: Factory<T>) {
  }

  get hasValue(): boolean {
    return this._value !== undefined;
  }

  get value(): T {
    if (!this._value)
      this._value = this.factory();
    return this._value;
  }
}

export function coalesce<T>(...args: Array<T | Factory<T>>): T | undefined {
  for (const arg of args) {
    const value = arg instanceof Function ? arg() : arg;
    if (value !== undefined)
      return value;
  }
  return undefined;
}
