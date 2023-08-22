export interface IPowerBiAuthentication {

    accessToken: string;

    reportId: string;

    clientId: string;

    embedUrl: string;

    expiry: string;

}


export interface IEmbedToken {

    token: string;

    expiration: string;

}

export interface IReportsDetail {

    reportId: string;

    reportName: string;

    embedUrl: string;

}

export interface IEmbedParams {

    reportsDetail: IReportsDetail;

    embedToken: IEmbedToken;

}