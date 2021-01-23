import { getTenantConfig } from '@/composables/productConfig';

export const Product = getTenantConfig().product("productName").extract(product => ({
  name: product.name,
  policy: product.policy().extract(policy => ({
    fields: policy.extract(policy => ({
      field: policy.field("field")
    }))
  })),
  premiumReports: {
    standardReport: product.premiumReport("standardReport").extract(report => ({
      fields: report.extract(report => ({
        field: report.field("field"),
        groups: report.group("groups").extract(group => ({
          name: group.name,
          fields: {
            field: group.field("field")
          }
        }))
      }))
    }))
  }
}));
