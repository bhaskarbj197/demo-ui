/**
 * *****************************************************************************
 * Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
 * All Rights Reserved US Government Users Restricted Rights - Use, duplication
 * or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 * *****************************************************************************
 */

export interface IAppConfig {
    env: string;
    apiBaseUrl: string;
    envDisplayName: string;
    isEnvNameShow: boolean;
    advisorHardcodeSetting: boolean;
    keyCloak: any;
    helpUrl: string;
    isKeyCloakUse: boolean;
    keycloakAccName: string;
    encrpKey: string;
    encrpPlusReplaceKey: string;
    isConnectToOrct: boolean;
    orctBaseUrl: string;
    isOrctUrlEncrp: boolean;
    orctGetUrl: string;
    orctPostUrl: string;
    orctPostFormUrl: string;
    orctPutUrl: string;
    orctDeleteUrl: string;
}
