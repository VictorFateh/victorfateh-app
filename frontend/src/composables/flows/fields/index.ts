import { FieldGroupsByLocatorCharacteristics, FieldValueCharacteristics } from '@socotra/api';

export function asFieldValuesArray(locators: string[], groups: FieldGroupsByLocatorCharacteristics): FieldValueCharacteristics[] {
  if (locators) {
    const list: FieldValueCharacteristics[] = [];
    for (const locator of locators)
      list.push(groups[locator]);
    return list;
  }
  else {
    return [];
  }
}

export function asYesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

export function asInt(value: string[], defaultValue: number): number {
  return value?.length > 0 ? parseInt(value[0]) : defaultValue;
}

export function asString(value: string[]): string {
  return value?.length > 0 ? value[0] : "";
}

export function asBooleanFromYesNo(value: string): boolean {
  return value === "Yes";
}

export function asNumberFromCurrency(value: string): number {
  const result = parseFloat(value.replace("$", "").replace(",", ""));
  return isNaN(result) ? 0 : result;
}
