export const EmailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const RequiredRules = [(v: any) => !!v || "Required"];
export const RequiredEmailRules = [...RequiredRules, (v: any) => EmailRegex.test(v) || "Invalid email address"];
export const RequiredSelectRules = [(v: any) => v !== undefined || "Required"];

export const LocatorRegex = /^[0-9]{9}$/;
export const RequiredLocatorRules = [...RequiredRules, (v: any) => LocatorRegex.test(v) || "Invalid locator"];