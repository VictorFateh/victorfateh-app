import { FieldValues, FieldGroupCreateRequest, PremiumReportResponse, FieldGroupsByLocatorCharacteristics, FieldValueCharacteristics } from '@socotra/api';
import { Product } from '.';

export interface ReportModel {
  field: string;
  toggle: boolean;
  groups: Array<ReportGroupModel>;
}

export interface ReportGroupModel {
  field: string;
}

function toYesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

export function toPremiumReportFieldValues(report: ReportModel, days: number): FieldValues {
  return {
    field: report.field,
    toggle: toYesNo(report.toggle)
  };
}

function fromCurrency(value: string): number {
  const result = parseFloat(value.replace("$", "").replace(",", ""));
  return isNaN(result) ? 0 : result;
}

export function toPremiumReportFieldGroups(report: ReportModel): FieldGroupCreateRequest[] {

  return report.groups.map<FieldGroupCreateRequest>(group => ({
    fieldName: Product.premiumReports.standardReport.fields.groups.name,
    fieldValues: {
      field: group.field
    }
  }));
}

function asInt(value: string[], defaultValue: number): number {
  return value?.length > 0 ? parseInt(value[0]) : defaultValue;
}

function asString(value: string[]): string {
  return value?.length > 0 ? value[0] : "";
}

function fromYesNo(value: string): boolean {
  return value === "Yes";
}

export function fromPremiumReport(report: PremiumReportResponse): ReportModel {
  const fieldValues = report.fieldValues;
  return {
    field: asString(fieldValues.field),
    toggle: fromYesNo(asString(fieldValues.toggle)),
    groups: toFieldValuesArray(fieldValues.groups, report.fieldGroupsByLocator).map<ReportGroupModel>(values => ({
      field: asString(values.field)
    }))
  };
}

function toFieldValuesArray(locators: string[], groups: FieldGroupsByLocatorCharacteristics): FieldValueCharacteristics[] {
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