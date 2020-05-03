/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class AnalyticsModel {
    fileName: string;
    colName: string;
    modelName: string;
    url: string;

    constructor(fileName: string = "", colName: string = "", modelName: string = "", url: string = "") {
        this.fileName = fileName;
        this.colName = colName;
        this.modelName = modelName;
        this.url = url;
    }
}
