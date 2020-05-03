/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';
import { journalIdType } from '../services/types';

export class AnomalyInputLogsModel {
    totalInputFile: number;
    anomaliCountFile: number;
    records: Array<AnomalyInputLogsDataModel>;

    constructor(totalInputFile: number = 0, anomaliCountFile: number = 0){
        this.totalInputFile = totalInputFile;
        this.anomaliCountFile = anomaliCountFile;
        this.records = new Array<AnomalyInputLogsDataModel>();
    }
}

export class AnomalyInputLogsDataModel {
    columnCount: number;
    comment: string;
    fileName: string;
    fileType: string;
    inputNo: number;
    isAnomaly: boolean;
    journalId: journalIdType;
    location: string;
    rowCount: number;
    runDate: string;
    source: string;

    constructor(columnCount: number = 0, comment: string = "", fileName: string = "", fileType: string = "", inputNo: number = 0, 
        isAnomaly: boolean = false, journalId: journalIdType = 0, location: string = "", rowCount: number = 0, runDate: string = "", source: string = ""){
        this.columnCount = columnCount;
        this.comment = comment;
        this.fileName = fileName;
        this.fileType = fileType;
        this.inputNo = inputNo;
        this.isAnomaly = isAnomaly;
        this.journalId = journalId;
        this.location = location;
        this.rowCount = rowCount;
        this.runDate = runDate;
        this.source = source;
    }
}

export class AnomalyInputLogsHistoryModel implements Deserialize{
    deserialize(input: any): this {
        return Object.assign(this, input);
    }
    runDate: string;
    removeRecordCount: number;
}
