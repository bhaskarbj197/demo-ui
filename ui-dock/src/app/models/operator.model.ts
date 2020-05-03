/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class OperatorModel {
    value: string;
    code: string;
    typ: string;
    help?: string;
    isValueCoded: boolean;
    isApplyInValidationRule?: boolean;
    isApplyInStepCreation?: boolean;
    isApplyInAutoApproverRule?: boolean;
    functionsApplicable: Array<string> = [];
}
