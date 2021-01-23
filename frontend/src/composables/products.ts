import { required } from "@/utils";
import { ApiFactory, ProductConfigurationResponse, ProductsApiClient } from "@socotra/api";
import { inject, InjectionKey, provide, Ref, ref, watch } from "@vue/composition-api";
import { FieldConfig, getTenantConfig, initTenantConfig, ProductConfig } from "./productConfig";

const ConfigKey: InjectionKey<ProductsComposable> = Symbol("ProductsComposable");

export interface ProductsComposable {
  setup(): Promise<void>;
  product(name: string): ProductConfig;
  selectRef(field: FieldConfig): Ref<Array<string> | undefined>;
}

type ConfigLoader = () => Promise<ProductConfigurationResponse[]>;

function bind(composable: ProductsComposable): ProductsComposable {
  return {
    setup() {
      return composable.setup()
    },
    product(name) {
      return composable.product(name)
    },
    selectRef(field: FieldConfig): Ref<Array<string> | undefined> {
      return composable.selectRef(field);
    }
  };
}

export function provideProducts(factory: ApiFactory): ProductsComposable {

  const composable = new Composable(async () => {
    const productsApi = factory.client(ProductsApiClient);
    return await productsApi.getAll();
  });

  provide(ConfigKey, composable);
  return bind(composable);
}

export function useProducts(): ProductsComposable {
  return bind(required(inject(ConfigKey)));
}

class Composable implements ProductsComposable {

  private readonly configRef = ref<ProductConfigurationResponse[]>();

  private initialised = false;

  constructor(
    private readonly loader: ConfigLoader) {

    watch(
      this.configRef,
      (newValue) => {
        if (newValue)
          initTenantConfig(newValue)
      });
  }

  async setup(): Promise<void> {
    if (!this.initialised) {
      this.initialised = true;
      const config = await this.loader();
      if (config)
        this.configRef.value = config;
    }
  }

  product(name: string): ProductConfig {
    return getTenantConfig().product(name);
  }

  selectRef(field: FieldConfig): Ref<Array<string> | undefined> {
    const selectRef = ref<Array<string> | undefined>();
    field.onReady(() => selectRef.value = field.asSelect()?.values);
    return selectRef;
  }
}
