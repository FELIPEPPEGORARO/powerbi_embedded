import * as msal from '@azure/msal-node';
import axios, { AxiosRequestConfig } from 'axios';
import { IEmbedParams, IEmbedToken, IPowerBiAuthentication } from '../pbi/dto';

export default class PowerBiBusiness {

  public async getPowerBiAuthentication(): Promise<IPowerBiAuthentication> {
    const reportId = process.env.REPORT_ID;
    const clientId = process.env.CLIENT_ID;
    const workspaceId = process.env.WORKSPACE_ID;
    const embedParams = await this.getEmbedParamsForSingleReport(workspaceId, reportId);
    return {
      accessToken: embedParams.embedToken.token,
      reportId,
      clientId,
      embedUrl: embedParams.reportsDetail.embedUrl,
      expiry: embedParams.embedToken.expiration,
    };
  }

  private async getAccessToken(clientId: string, clientSecret: string, authority: string): Promise<string> {
    const msalConfig = {
      auth: {
        clientId,
        authority,
        clientSecret,
      },
    };
    const clientApplication = new msal.ConfidentialClientApplication(msalConfig);
    const requestData = {
      scopes: [process.env.SCOPE_BASE],
    };
    const authenticationResult = await clientApplication.acquireTokenByClientCredential(requestData);
    return authenticationResult.accessToken;
  }

  private async getEmbedParamsForSingleReport(workspaceId: string, reportId: string): Promise<IEmbedParams> {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = await this.getRequestHeaders();
    const config: AxiosRequestConfig = {
      headers,
    };
    const result = await axios.get(reportInGroupApi, config);
    const resultJson = await result.data;
    const reportsDetail = {
      reportId: resultJson.id,
      reportName: resultJson.name,
      embedUrl: resultJson.embedUrl,
    };
    const datasetIds = [resultJson.datasetId];
    const embedToken = await this.getEmbedTokenForSingleReportSingleWorkspace(reportId, datasetIds, workspaceId);
    const reportEmbedConfig = {
      reportsDetail,
      embedToken,
    };
    return reportEmbedConfig;
  }

  private async getRequestHeaders(): Promise<Record<string, string>> {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const authority = `${process.env.AUTHORITY_URL}${process.env.TENANT_ID}`;
    const token = await this.getAccessToken(clientId, clientSecret, authority);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    return headers;
  }

  private async getEmbedTokenForSingleReportSingleWorkspace(
    reportId: string,
    datasetIds: string[],
    targetWorkspaceId: string,
  ): Promise<IEmbedToken> {
    const formData = {
      reports: [{
        id: reportId,
      }],
      datasets: [],
      targetWorkspaces: [{
        id: targetWorkspaceId,
      }],
    };
    for (const datasetId of datasetIds) {
      formData.datasets.push({
        id: datasetId,
      });
    }
    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
    const headers = await this.getRequestHeaders();
    const config: AxiosRequestConfig = {
      headers,
    };
    const body = JSON.stringify(formData);
    const result = await axios.post(embedTokenApi, body, config);
    return result.data;
  }
}
