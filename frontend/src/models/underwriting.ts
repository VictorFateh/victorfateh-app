import { AutomatedUnderwritingResult } from '@socotra/api';

export interface UnderwritingModel {
  decision?: AutomatedUnderwritingResult;
  notes?: string[];
}

export function getUnderwritingColor(decision: AutomatedUnderwritingResult) {
  switch (decision) {
    case "accept":
      return "success";

    case "none":
      return "warning";

    case "reject":
      return "error";

    default:
      return "info";
  }
}

export function getUnderwritingIcon(decision: AutomatedUnderwritingResult) {
  switch (decision) {
    case "accept":
      return "mdi-check";

    case "none":
      return "mdi-human-greeting";

    case "reject":
      return "mdi-alert-circle";

    default:
      return "mdi-information";
  }
}
