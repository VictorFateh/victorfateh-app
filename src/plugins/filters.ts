import Vue, { PluginObject } from 'vue';
import dayjs from "dayjs";
import { ShortDateFormat, LongDateFormat, USCurrencyFormat } from '@/utils';

type VueFilter = (value?: any) => string;

function capitalize(value?: string): string {
  return value?.split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ") || "";
}

function timestamp(value: string, format = 'DD MMMM YYYY'): string {
  return dayjs(value, "x").format(format);
}

function date(value: string, format = ShortDateFormat): string {
  return dayjs(value).format(format);
}

function timestampDiffDays(value: string, compare: string = "0"): string {
  return dayjs(value, "x").diff(dayjs(compare, "x"), "day").toString();
}

function displayDate(value: string) {
  return date(value, LongDateFormat);
}

function currency(value: number, currencyFormat: Intl.NumberFormat = USCurrencyFormat): string {
  return currencyFormat.format(value);
}

function join(value: string, separator = ''): string {
  return Array.isArray(value) ? value.join(separator) : value;
}

interface GlobalFilterOptions {
  [key: string]: VueFilter;
}

const DefaultGlobalFilters: GlobalFilterOptions = {
  capitalize,
  timestamp,
  timestampDiffDays,
  date,
  displayDate,
  currency,
  join
};

class GlobalFilters implements PluginObject<GlobalFilterOptions> {
  install(vue: typeof Vue, options: GlobalFilterOptions = DefaultGlobalFilters) {
    for (const key in options)
      vue.filter(key, options[key]);
  }
}

export default new GlobalFilters();