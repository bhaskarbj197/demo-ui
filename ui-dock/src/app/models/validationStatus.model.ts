/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { journalIdType } from '../services/types';

export class ValidationStatusModel {
    journalId: journalIdType; 
    journalName: string; 
    runDate: number;
    totalCount: number;
    validationPassCount: number;
    validationFailCount: number;
    validationStatus: string;

    constructor(journalId: journalIdType = 0, journalName: string = "", runDate: number = 0, totalCount: number = 0,
        validationPassCount: number = 0, validationFailCount: number = 0, validationStatus: string = "") {
        this.journalId = journalId;
        this.journalName = journalName;
        this.runDate = runDate;
        this.totalCount = totalCount;
        this.validationPassCount = validationPassCount;
        this.validationFailCount = validationFailCount;
        this.validationStatus = validationStatus;
    }
}