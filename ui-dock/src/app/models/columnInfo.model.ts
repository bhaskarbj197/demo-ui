/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class ColumnInfoModel {
    constructor(columnName: string, columnCode: string, columnType?: string, tab?: string) {
        this.columnName = columnName;
        this.columnCode = columnCode;
        this.columnType = columnType? columnType : "";
        this.tab = tab? tab : "";
    }
    columnName: string;
    columnCode: string;
    columnType: string;
    tab: string;
}
