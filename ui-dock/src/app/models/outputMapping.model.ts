/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class OutputMappingModel {
    isTable: boolean;
    value: string;
    columnName: string;
    templateColum: string;
}

export class OutputMappingNativeModel {
    destCol: string;
    errorAction: string;
    srcData: string;
    srcTyp: string;
}
