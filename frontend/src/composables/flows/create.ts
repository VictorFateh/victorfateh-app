import { UnderwritingModel, AdminModel, UserModel, ResultModel } from '@/models';
import { ApiFactory, PolicyholderApiClient, PolicyApiClient, PremiumReportResponse } from '@socotra/api';
import axios from "axios";
import generator from 'generate-password'
export interface CreateAppFlow {
  authenticateAdmin(admin: AdminModel): Promise<string>;
  createPolicy(policyholderLocator: string, model: UserModel): Promise<ResultModel>;
  issuePolicy(locator: string): Promise<void>;
}

export class CreateAppFlowProvider implements CreateAppFlow {
  constructor(private api: ApiFactory) {
  }

  async authenticateAdmin(model: AdminModel): Promise<string> {

    const {
      username,
      password
    } = model;

    const data = { username, password }
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        return axios
          .post("https://api.sandbox.socotra.com/account/v1/authenticateInternal", data, {headers})
          .then(response => {
            return response.data.authorizationToken;
          });
      } catch (error) {
        return "error";
      }
  }

  async createPolicy(authToken: string, model: UserModel): Promise<ResultModel> {

    const { username, email } = model;

    const generatedPassword = generator.generate({
        length: 12,
        numbers: true
    });

    try {
        const data = {
          name: username,
          username: username,
          password: generatedPassword,
          email,
          type: "account.internal"
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: authToken
        };
        return axios
          .post("https://api.sandbox.socotra.com/account/v1/account", data, {
            headers
          })
          .then(response => {
            return {
                userResult: {
                    createdTimestamp: response.data.createdTimestamp,
                    username: response.data.username,
                    name: response.data.name,
                    email: response.data.email,
                    password: generatedPassword
                }
            }
          });
      } catch (error) {
        return {
            errorMessage: error
        };
      }

    // const policyStartTimestamp = dayjs().startOf("day").valueOf();

    // const policyEndTimestamp = dayjs().add(10, "year").startOf("day").valueOf();

    // const response = await this.api.client(PolicyApiClient).create({
    //   policyholderLocator,
    //   productName: "productName",
    //   exposures: [{
    //     exposureName: "exposureName",
    //     perils: [{
    //       name: "perilName"
    //     }]
    //   }],
    //   fieldGroups: [],
    //   fieldValues: {
    //     field,
    //     toggle: asYesNo(toggle)
    //   },
    //   finalize: true,
    //   policyStartTimestamp,
    //   policyEndTimestamp
    // });

    // let underwriting: UnderwritingModel | undefined;
    // const automatedUnderwritingResult = response.modifications[0].automatedUnderwritingResult;
    // if (automatedUnderwritingResult) {
    //   const { decision, notes } = automatedUnderwritingResult;
    //   underwriting = {
    //     decision,
    //     notes
    //   };
    // }
    // return {
    //   locator: response.locator,
    //   underwriting
    // };
  }

  async issuePolicy(locator: string): Promise<void> {
    await this.api.client(PolicyApiClient).issue(locator);
  }
}
