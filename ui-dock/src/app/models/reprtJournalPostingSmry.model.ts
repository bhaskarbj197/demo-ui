/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { journalIdType, documentIdType } from '../services/types';

export class ReprtJournalPostingSmryModel {
    journalId: journalIdType;
    journalName: string;
    runDate: string;
    frequency: string;
    documentId: documentIdType;
    postingDate: number;
    runStatus: string;
    postingStatus: string;
    message: string;

    constructor(journalId: journalIdType = 0, journalName: string = "", runDate: string = "", frequency: string = "",
        documentId: documentIdType = null, postingDate: number = 0, runStatus: string = "", postingStatus: string = "",
        message: string = "") {
        this.journalId = journalId;
        this.journalName = journalName;
        this.runDate = runDate;
        this.frequency = frequency;
        this.documentId = documentId;
        this.postingDate = postingDate;
        this.runStatus = runStatus;
        this.postingStatus = postingStatus;
        this.message = message;
    }
}

export class ReportSearchParamModel {
    constructor() {}

    month: number;
    startDate: number;
    endDate: number;
    runStatus: string;
    postingStatus: string;
    hasDocId: boolean;


}