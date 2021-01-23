import { DateFieldConfiguration, EmailFieldConfiguration, ExposureConfigurationResponse, FieldConfiguration, FieldConfigurationTypeName, GroupFieldConfiguration, LookupFieldConfiguration, MediaFieldConfiguration, NumberFieldConfiguration, PerilConfigurationResponse, PolicyConfigurationResponse, ProductConfigurationResponse, SelectFieldConfiguration, StringFieldConfiguration, PremiumReportingConfigurationResponse } from '@socotra/api';
import { BaseConfig, ExposureConfig, FieldConfig, FieldsConfig, GroupFieldConfig, PerilConfig, PolicyConfig, ProductConfig, ReadyCall, TenantConfig, PremiumReportConfig } from '.';

class ReadyStack<T> {

  private readonly queue = new Array<ReadyCall<T>>();
  private context?: T;

  enqueue(call: ReadyCall<T>): void {
    if (this.context)
      call(this.context);
    else
      this.queue.push(call);
  }

  run(context: T): void {
    this.context = context;
    let call = this.queue.shift();
    if (call) {
      do {
        call(context);
        call = this.queue.shift();
      } while (call);
    }
  }
}

type DeferredCall<T> = (data: T) => void;

class DeferredStack<T> {

  private readonly queue = new Array<DeferredCall<T>>();

  enqueue(call: DeferredCall<T>): void {
    this.queue.push(call);
  }

  run(data: T): void {
    let call = this.queue.shift();
    if (call) {
      do {
        call(data);
        call = this.queue.shift();
      } while (call);
    }
  }
}

class DeferredMap<K, V, T> {

  private readonly map = new Map<K, V>();
  private readonly deferred = new DeferredStack<T>();
  private _data?: T;

  init(data: T) {
    this._data = data;
    this.deferred.run(data);
  }

  getOrAdd(key: K, valueFactory: (key: K) => V, initialiser: (value: V, data: T) => void): V {

    const value = this.map.getOrAdd(key, valueFactory);

    if (this._data === undefined)
      this.deferred.enqueue(data => initialiser(value!, data));
    else
      initialiser(value, this._data);

    return value;
  }
}

abstract class DeferredInit<T, U> implements BaseConfig<T> {

  private readonly deferred = new DeferredStack<U>();
  private readonly ready = new ReadyStack<T>();

  private _data?: U;

  protected get data(): U | undefined {
    return this._data;
  }

  init(data: U): void {
    this._data = data;
    this.initObject(data);
    this.deferred.run(data);
    this.ready.run(this as unknown as T);
  }

  abstract initObject(data: U): void;

  value<K extends keyof U>(key: K, defaultValue?: U[K]): U[K] | undefined {
    if (!this.data)
      return defaultValue;
    else
      return this.data[key];
  }

  exists(): boolean {
    return this._data !== undefined;
  }

  extract<E>(cb: (self: T) => E): E {
    return cb(this as unknown as T);
  }

  onReady(call: ReadyCall<T>): void {
    this.ready.enqueue(call);
  }
}

abstract class Fields<T, U> extends DeferredInit<T, U> implements FieldsConfig<T> {

  private readonly groups = new DeferredMap<string, GroupField, FieldConfiguration[]>();
  private readonly fields = new DeferredMap<string, Field, FieldConfiguration[]>();

  initObject(data: U): void {
    this.initFields(this.getFields(data));
  }

  protected abstract getFields(data: U): FieldConfiguration[];

  private initFields(fields: FieldConfiguration[]): void {
    this.groups.init(fields);
    this.fields.init(fields);
  }

  group(name: string): GroupFieldConfig {
    return this.groups.getOrAdd(
      name,
      key => new GroupField(key),
      (value, data) => {
        const config = data.find(field => field.name === name && field.type === "group");
        if (config)
          value.init(config as GroupFieldConfiguration);
      });
  }

  field(name: string): FieldConfig {
    return this.fields.getOrAdd(
      name,
      key => new Field(key),
      (value, data) => {
        const config = data.find(field => field.name === name);
        if (config)
          value.init(config);
      });
  }
}

class Tenant extends DeferredInit<TenantConfig, ProductConfigurationResponse[]> implements TenantConfig {

  private readonly products = new DeferredMap<string, Product, ProductConfigurationResponse[]>();

  initObject(data: ProductConfigurationResponse[]) {
    this.products.init(data);
  }

  product(name: string): Product {
    return this.products.getOrAdd(
      name,
      key => new Product(key),
      (value, data) => {
        const config = data.find(p => p.name === name);
        if (config)
          value.init(config);
      });
  }
}

class Product extends DeferredInit<Product, ProductConfigurationResponse> implements ProductConfig {

  // private readonly _ready = new Array<ReadyCall<ProductConfig>>();
  private readonly _policy = new Policy();
  private readonly _premiumReports = new DeferredMap<string, PremiumReport, ProductConfigurationResponse>();

  constructor(public readonly name: string) {
    super();
  }

  initObject(data: ProductConfigurationResponse) {
    this._policy.init(data.policyConfiguration);
    this._premiumReports.init(data);
    // this._ready.forEach(call => call(this));
  }

  get version(): string | undefined {
    return this.value("configVersion");
  }

  policy(): Policy {
    return this._policy;
  }

  premiumReport(reportName: string): PremiumReportConfig {
    return this._premiumReports.getOrAdd(
      reportName,
      key => new PremiumReport(key),
      (value, data) => {
        const config = data.premiumReportingConfiguration?.find(report => report.reportName === reportName);
        if (config)
          value.init(config);
      });
  }
}

class PremiumReport extends Fields<PremiumReport, PremiumReportingConfigurationResponse> implements PremiumReportConfig {

  constructor(public readonly reportName: string) {
    super();
  }

  initObject(data: PremiumReportingConfigurationResponse) {
    super.initObject(data);
  }

  getFields(data: PremiumReportingConfigurationResponse): FieldConfiguration[] {
    return data.fields;
  }
}

class Policy extends Fields<Policy, PolicyConfigurationResponse> implements PolicyConfig {

  private readonly exposures = new DeferredMap<string, Exposure, PolicyConfigurationResponse>();

  initObject(data: PolicyConfigurationResponse) {
    super.initObject(data);
    this.exposures.init(data);
  }

  getFields(data: PolicyConfigurationResponse): FieldConfiguration[] {
    return data.fields;
  }

  exposure(name: string): ExposureConfig {
    return this.exposures.getOrAdd(
      name,
      key => new Exposure(key),
      (value, data) => {
        const config = data.exposures.find(exposure => exposure.name === name);
        if (config)
          value.init(config);
      });
  }
}

class Exposure extends Fields<Exposure, ExposureConfigurationResponse> implements ExposureConfig {

  private readonly perils = new DeferredMap<string, Peril, ExposureConfigurationResponse>();

  constructor(public readonly name: string) {
    super();
  }

  initObject(data: ExposureConfigurationResponse) {
    super.initObject(data);
    this.perils.init(data);
  }

  getFields(data: ExposureConfigurationResponse): FieldConfiguration[] {
    return data.fields;
  }

  get displayName(): string | undefined {
    return this.value("displayName");
  }

  peril(name: string): PerilConfig {
    return this.perils.getOrAdd(
      name,
      key => new Peril(key),
      (value, data) => {
        const config = data.perils.find(peril => peril.name === name);
        if (config)
          value.init(config);
      });
  }
}

class Peril extends Fields<Peril, PerilConfigurationResponse> implements PerilConfig {

  constructor(public readonly name: string) {
    super();
  }

  initObject(data: PerilConfigurationResponse) {
    super.initObject(data);
  }

  getFields(data: PerilConfigurationResponse): FieldConfiguration[] {
    return data.fields;
  }
}

class GroupField extends DeferredInit<GroupField, GroupFieldConfiguration> implements GroupFieldConfig {

  private readonly fields = new DeferredMap<string, Field, GroupFieldConfiguration>();

  constructor(public readonly name: string) {
    super();
  }

  initObject(data: GroupFieldConfiguration) {
    this.fields.init(data);
  }

  field(name: string): FieldConfig {
    return this.fields.getOrAdd(
      name,
      key => new Field(key),
      (value, data) => {
        const config = data.fields.find(field => field.name === name);
        if (config)
          value.init(config);
      });
  }
}

class Field extends DeferredInit<Field, FieldConfiguration> implements FieldConfig {

  constructor(public readonly name: string) {
    super();
  }

  initObject(data: FieldConfiguration): void {
    // do nothing
  }

  get type(): FieldConfigurationTypeName | undefined {
    return this.value("type");
  }

  get order(): number | undefined {
    return this.value("order");
  }

  get title(): string | undefined {
    return this.value("title");
  }

  get config(): Readonly<FieldConfiguration> | undefined {
    return this.data;
  }

  private asFieldType<T extends FieldConfiguration, K extends keyof T>(type: FieldConfigurationTypeName): Readonly<Pick<T, K>> | undefined {
    const config = this.data;
    if (config && config.type === type)
      return config as T;
    else
      return undefined;
  }

  asDate(): Readonly<DateFieldConfiguration> | undefined {
    return this.asFieldType("select");
  }

  asEmail(): Readonly<EmailFieldConfiguration> | undefined {
    return this.asFieldType("email");
  }

  asMedia(): Readonly<MediaFieldConfiguration> | undefined {
    return this.asFieldType("media");
  }

  asNumber(): Readonly<NumberFieldConfiguration> | undefined {
    return this.asFieldType("number");
  }

  asString(): Readonly<StringFieldConfiguration> | undefined {
    return this.asFieldType("string");
  }

  asSelect(): Readonly<SelectFieldConfiguration> | undefined {
    return this.asFieldType("select");
  }

  asGroup(): Readonly<GroupFieldConfiguration> | undefined {
    return this.asFieldType("group");
  }

  asLookup(): Readonly<LookupFieldConfiguration> | undefined {
    return this.asFieldType("lookup");
  }
}

const _tenant = new Tenant();

export function getTenantConfig(): TenantConfig {
  return _tenant;
}

export function initTenantConfig(data: ProductConfigurationResponse[]): void {
  _tenant.init(data);
}