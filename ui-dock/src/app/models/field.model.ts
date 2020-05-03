/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class FieldModel {
    fieldName: string;
    fieldCode: string;
    typ: string;
    help: string;
    placeHolder: string;
    isRequired: boolean;
    value: string|number;
    validationRegex: string;
    visibility: boolean;
    isDisabled: boolean;
    defaultValue: string;
    list?: Array<object>;
    fieldBackLabelIcon?: string;
    adjoinedFieldCode: string;
    isAdjoined: boolean;
}
