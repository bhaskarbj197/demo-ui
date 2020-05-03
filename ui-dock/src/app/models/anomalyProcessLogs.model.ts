/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';
import { journalIdType } from '../services/types';

export class AnomalyProcessLogsModel {
    totalNoFilterStep: number;
    anomalyStepCount: number;
    records: Array<AnomalyProcessLogsDataModel>;

    constructor(totalNoFilterStep: number = 0, anomalyStepCount: number = 0){
        this.totalNoFilterStep = totalNoFilterStep;
        this.anomalyStepCount = anomalyStepCount;
        this.records = new Array<AnomalyProcessLogsDataModel>();
    }
}

export class AnomalyProcessLogsDataModel {
    comment: string;
    inFileName: string;
    inRowCount: number;
    isAnomaly: boolean;
    journalId: journalIdType;
    operation: string;
    operationName: string;
    outFileName: string;
    outRowCount: number;
    removeCount: number;
    runDate: string;
    stepNo: number;

    constructor(comment: string = "", inFileName: string = "", inRowCount: number = 0, 
        isAnomaly: boolean = false, journalId: journalIdType = 0, 
        operation: string = "", operationName: string = "", outFileName: string = "", 
        outRowCount: number = 0, removeCount: number = 0, runDate: string = "", stepNo: number = 0){
        this.comment = comment;
        this.inFileName = inFileName;
        this.inRowCount = inRowCount;
        this.isAnomaly = isAnomaly;
        this.journalId = journalId;
        this.operation = operation;
        this.operationName = operationName;
        this.outFileName = outFileName;
        this.outRowCount = outRowCount;
        this.removeCount = removeCount;
        this.runDate = runDate;
        this.stepNo = stepNo;
    }    
}

export class AnomalyProcessLogsHistoryModel implements Deserialize{
    deserialize(input: any): this {
        return Object.assign(this, input);
    }
    runDate: string;
    removeRecordCount: number;
}
