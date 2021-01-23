import { DateFieldConfiguration, EmailFieldConfiguration, FieldConfiguration, FieldConfigurationTypeName, GroupFieldConfiguration, LookupFieldConfiguration, MediaFieldConfiguration, NumberFieldConfiguration, SelectFieldConfiguration, StringFieldConfiguration } from '@socotra/api';

export type ReadyCall<T> = (context: T) => void;

export interface BaseConfig<T> {
  exists(): boolean;
  onReady(call: ReadyCall<T>): void;
  extract<E>(cb: (self: T) => E): E;
}

export interface FieldConfig extends BaseConfig<FieldConfig> {
  readonly name: string;
  readonly type?: FieldConfigurationTypeName;
  readonly order?: number;
  readonly title?: string;
  readonly config?: Readonly<FieldConfiguration>;

  asDate(): Readonly<DateFieldConfiguration> | undefined;
  asEmail(): Readonly<EmailFieldConfiguration> | undefined;
  asMedia(): Readonly<MediaFieldConfiguration> | undefined;
  asNumber(): Readonly<NumberFieldConfiguration> | undefined;
  asString(): Readonly<StringFieldConfiguration> | undefined;
  asSelect(): Readonly<SelectFieldConfiguration> | undefined;
  asGroup(): Readonly<GroupFieldConfiguration> | undefined;
  asLookup(): Readonly<LookupFieldConfiguration> | undefined;
}

export interface GroupFieldConfig extends BaseConfig<GroupFieldConfig> {
  readonly name: string;

  field(name: string): FieldConfig;
}

export interface FieldsConfig<T> extends BaseConfig<T> {
  field(name: string): FieldConfig;
  group(name: string): GroupFieldConfig;
}

export interface PerilConfig extends FieldsConfig<PerilConfig> {
  readonly name: string;
}

export interface ExposureConfig extends FieldsConfig<ExposureConfig> {
  readonly name: string;
  readonly displayName?: string;

  peril(name: string): PerilConfig;
}

export interface PolicyConfig extends FieldsConfig<PolicyConfig> {
  exposure(name: string): ExposureConfig;
}

export interface PremiumReportConfig extends FieldsConfig<PremiumReportConfig> {
  readonly reportName: string;
}

export interface ProductConfig extends BaseConfig<ProductConfig> {
  readonly name: string;
  readonly version: string | undefined;

  policy(): PolicyConfig;
  premiumReport(name: string): PremiumReportConfig;
}

export interface TenantConfig extends BaseConfig<TenantConfig> {
  product(name: string): ProductConfig;
}
