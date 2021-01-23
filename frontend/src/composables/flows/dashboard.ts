import { PolicyResponse, ApiFactory, PolicyApiClient, PremiumReportResponse, PremiumReportingApiClient, PremiumReportUpdateRequest, PremiumReportCreateRequest } from '@socotra/api';

export interface DashboardAppFlow {
  getPolicy(locator: string): Promise<PolicyResponse>;
  getAllPremiumReports(locator: string): Promise<PremiumReportResponse[]>;
  createPremiumReport(policyLocator: string, value: PremiumReportCreateRequest): Promise<PremiumReportResponse>;
  updatePremiumReport(locator: string, update: PremiumReportUpdateRequest): Promise<PremiumReportResponse>;
  issuePremiumReport(locator: string): Promise<PremiumReportResponse>;
}

export class DashboardAppFlowProvider implements DashboardAppFlow {
  constructor(private api: ApiFactory) {
  }

  getPolicy(locator: string): Promise<PolicyResponse> {
    return this.api.client(PolicyApiClient).get(locator);
  }

  getAllPremiumReports(policyLocator: string): Promise<PremiumReportResponse[]> {
    return this.api.client(PremiumReportingApiClient).getAll(policyLocator);
  }

  createPremiumReport(policyLocator: string, value: PremiumReportCreateRequest): Promise<PremiumReportResponse> {
    return this.api.client(PremiumReportingApiClient).create(policyLocator, value);
  }

  updatePremiumReport(locator: string, value: PremiumReportUpdateRequest): Promise<PremiumReportResponse> {
    return this.api.client(PremiumReportingApiClient).update(locator, value);
  }

  issuePremiumReport(locator: string): Promise<PremiumReportResponse> {
    return this.api.client(PremiumReportingApiClient).issue(locator);
  }
}
