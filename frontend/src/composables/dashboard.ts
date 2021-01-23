import { required } from '@/utils';
import { inject, InjectionKey, provide, Ref, ref, reactive } from '@vue/composition-api';
import { PolicyResponse, AutomatedUnderwritingResultResponse, AutomatedUnderwritingResult, PremiumReportResponse } from '@socotra/api';
import { ReportModel, ReportGroupModel } from '@/models';

const DashboardKey: InjectionKey<DashboardComposable> = Symbol("Dashboard");

export interface DashboardComposable {
  readonly policy: Readonly<Ref<Readonly<PolicyResponse | undefined>>>;
  setPolicy(policy: PolicyResponse): void;
  clearPolicy(): void;
  getUnderwriting(): AutomatedUnderwritingResultResponse | undefined;
  getUnderwritingDecision(): AutomatedUnderwritingResult | undefined;

  readonly premiumReports: Readonly<Ref<Readonly<Array<PremiumReportResponse> | undefined>>>;
  setPremiumReports(reports: Array<PremiumReportResponse>): void;
  addPremiumReport(report: PremiumReportResponse): void;
  clearPremiumReports(): void;

  readonly report: Readonly<Ref<ReportModel>>;
  setReport(report: ReportModel): void;
  resetReport(): void;
}

export function provideDashboard(): DashboardComposable {
  const policyRef = ref<PolicyResponse>();
  const premiumReportsRef = ref<Array<PremiumReportResponse>>();
  const reportRef = ref(reactive(defaultReport()));

  const composable: DashboardComposable = {

    get policy(): Readonly<Ref<Readonly<PolicyResponse | undefined>>> {
      return policyRef;
    },
    setPolicy(policy: PolicyResponse): void {
      policyRef.value = policy;
    },
    clearPolicy(): void {
      policyRef.value = undefined;
    },
    getUnderwriting(): AutomatedUnderwritingResultResponse | undefined {
      return policyRef.value?.modifications[0].automatedUnderwritingResult;
    },
    getUnderwritingDecision(): AutomatedUnderwritingResult | undefined {
      return policyRef.value?.modifications[0].automatedUnderwritingResult?.decision;
    },

    get premiumReports(): Readonly<Ref<Readonly<Array<PremiumReportResponse> | undefined>>> {
      return premiumReportsRef;
    },
    setPremiumReports(reports: Array<PremiumReportResponse>): void {
      premiumReportsRef.value = reports;
    },
    addPremiumReport(report: PremiumReportResponse): void {
      premiumReportsRef.value = new Array(...premiumReportsRef.value || [], report);
    },
    clearPremiumReports(): void {
      premiumReportsRef.value = undefined;
    },

    get report(): Readonly<Ref<ReportModel>> {
      return reportRef;
    },
    setReport(report: ReportModel): void {
      reportRef.value = reactive(report);
    },
    resetReport(): void {
      reportRef.value = reactive(defaultReport());
    }
  };
  provide(DashboardKey, composable);
  return composable;
}

export function useDashboard(): DashboardComposable {
  return required(inject(DashboardKey));
}

function defaultReport(): ReportModel {
  return {
    field: "",
    toggle: false,
    groups: new Array<ReportGroupModel>()
  };
}