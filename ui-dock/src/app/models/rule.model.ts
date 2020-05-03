/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class RuleModel {
    id: number;
    code: string;
    name: string;
    params: Array<RuleParamModel>;
    helpText?: string;
}

export class RuleParamModel {
    seq: number;
    typ: string;
    value: string;
    isUserEntry: boolean;
    isActive: boolean;
}
