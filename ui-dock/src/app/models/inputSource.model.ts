/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { DefaultValueObject } from "./defaultValueObject.model";
import { journalIdType } from '../services/types';

export class InputSourceModel {
    locationType: DefaultValueObject;
    sourceContact: DefaultValueObject;
    sourceID: DefaultValueObject;
    sourceLocation: DefaultValueObject;
    sourceName: DefaultValueObject;
    sourceType: DefaultValueObject;
    isMaster: DefaultValueObject;
    pdfExtractor: DefaultValueObject;
}


export class bulkInputFilesModel {
    journalId: journalIdType;
    fileName: string;
    fileSize: number;
    isValid: boolean;
    failedReasons: string;

    constructor(journalId: journalIdType = 0, fileName: string = "", fileSize: number = 0, isValid: boolean = false, 
        failedReasons: string = "") {
        this.journalId = journalId;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.isValid = isValid;
        this.failedReasons = failedReasons;
    }
}