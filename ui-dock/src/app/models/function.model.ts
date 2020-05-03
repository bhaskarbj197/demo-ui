/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class FunctionModel {
    id: number;
    code: string;
    name: string;
    isVisible: boolean;
    isInputTableDisabled?: boolean;
    isNoCommand?: boolean;
    isManualEntryBox?: boolean;
    isExcelFunction?: boolean;
    tabs: Array<FunctionTabModel>;
}

export class FunctionTabModel {
    id: number;
    name: string;
    typ: string;
    isFunctionBox: boolean;
    isColumnBox: boolean;
    isOperatorBox: boolean;
    isValueBox: boolean;
    isTableBox: boolean;
    displayStatus: string;
    stepDataList: Array<StepDataModel>;
    isNewColumnMandatory?: boolean;
    isNewColumnDisabled?: boolean;
    category?: string;
}

export class StepDataModel {
    seq: number;
    column: string;
    params: Array<StepDataParamModel>;
    isEditing: boolean;
}

export class StepDataParamModel {
    seq: number;
    typ: string;
    value: string;
    isUserEntry: boolean;
    isActive: boolean;
    originalValue?: string;
    inputTableName?: string;
    isValueCoded: boolean;
}

export class SearchPdfTextModel {
    searchText: string;
    cellNumber: number;

    constructor(searchText: string = "", cellNumber: number = 0) {
        this.searchText = searchText;
        this.cellNumber = cellNumber;
    }
}

export class ExcelFunctionListModel {
    name: string; 
    value: string;
    typ: string;
    isSelected: boolean;

    constructor(name: string = "", value: string = "", typ: string = "", isSelected: boolean = false) {
        this.name = name;
        this.value = value;
        this.typ = typ;
        this.isSelected = isSelected;
    }
}