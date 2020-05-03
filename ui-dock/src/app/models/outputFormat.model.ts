/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class OutputFormatModel {
    id: number;
    colName: string;
    formatType: string;
    isPrefix: boolean;
    char: string;
    minLength: number;
    decimalPlace: number;
    isPrefixShow: boolean;
    isCharShow: boolean;
    isMinLenShow: boolean;
    isDecPlcShow: boolean;
    isError: boolean;

    constructor(colName: string = "", formatType: string = "", isPrefix: boolean = true, char: string = "",
        minLength: number = 0, decimalPlace: number = 0, isPrefixShow: boolean = false, isCharShow: boolean = false,
        isMinLenShow: boolean = false, isDecPlcShow: boolean = false, id: number= 0, isError: boolean = false) {
        this.id = id;
        this.colName = colName;
        this.formatType = formatType;
        this.isPrefix = isPrefix;
        this.char = char;
        this.minLength = minLength;
        this.decimalPlace = decimalPlace;
        this.isPrefixShow = isPrefixShow;
        this.isCharShow = isCharShow;
        this.isMinLenShow = isMinLenShow;
        this.isDecPlcShow = isDecPlcShow;
        this.isError = isError;
    }
}