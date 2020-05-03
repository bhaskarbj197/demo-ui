/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class OutputHeaderTemplateModel {
    seq: number;
    label: string;
    typ: string;
    mappingCol: string;
    colLabel: string;
    staticValue: string;

    constructor(seq: number = 0) {
        this.seq = seq;
        this.label = "";
        this.typ = "";
        this.mappingCol = "";
        this.colLabel = "";
        this.staticValue = "";
    }
}

export class OutputHeaderTemplateTypeModel {
    code: string;
    value: string;
    mappingColumns: Array<OutputHeaderMappingColumnmsModel> = [];

    constructor(code: string = "", value: string = "", mappingColumns: Array<any> = []) {
        this.code = code;
        this.value = value;
        this.mappingColumns = mappingColumns;
    }
}

export class OutputHeaderMappingColumnmsModel {
    colLabel: string;
    mappingCol: string;
    mappingType: string;

    constructor(colLabel: string = "", mappingCol: string = "", mappingType: string = "") {
        this.colLabel = colLabel;
        this.mappingCol = mappingCol;
        this.mappingType = mappingType;
    }
}