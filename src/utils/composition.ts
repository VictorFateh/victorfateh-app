import { Ref, ref } from '@vue/composition-api';

export function required<T>(value: T): NonNullable<T> {
  if (!value)
    throw new Error("Dependency not found!");
  return value as NonNullable<T>;
}

export function templateRef<T>(): Ref<NonNullable<T>> {
  return ref<T | undefined>() as Ref<NonNullable<T>>;
}