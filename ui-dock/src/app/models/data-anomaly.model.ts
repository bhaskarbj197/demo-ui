/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { journalIdType } from '../services/types';

export class DataAnomalyModel{
    anomalyCount: number;
    fileName: string;
    fileData: Array<AnomalyInputDataModel>;
    fileHeader: Array<string>;
    targetName: string;    
    totalCount: number;
    targetNameIndex: number;

    constructor(anomalyCount: number = 0, fileName: string = "", fileData: Array<AnomalyInputDataModel> = [], fileHeader: Array<string> = [],
        targetName: string = "", totalCount: number = 0, targetNameIndex: number = 0) {
        this.anomalyCount = anomalyCount;
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileHeader = fileHeader;
        this.targetName = targetName;
        this.totalCount = totalCount;
        this.targetNameIndex = targetNameIndex;
    }
}

export class AnomalyInputDataModel{
    isAnomaly: boolean = false;
    anomalyComments: string;
    dataValue: Array<string>;

    constructor(isAnomaly: boolean = false, anomalyComments: string = "", dataValue: Array<string>= []) {
        this.isAnomaly = isAnomaly;
        this.anomalyComments = anomalyComments;
        this.dataValue = dataValue;
    }
}

export class DataAnomalyPartialModel{
    anomalyStatus: string;
    journalId: journalIdType;
    journalName: string;    
    runDate: number;
    typ: string;

    constructor(anomalyStatus: string = "", journalId: journalIdType = 0, journalName: string = "", runDate: number = 0, typ: string = "") {
        this.anomalyStatus = anomalyStatus;
        this.journalId = journalId;
        this.journalName = journalName;
        this.runDate = runDate;
        this.typ = typ;
    }
}