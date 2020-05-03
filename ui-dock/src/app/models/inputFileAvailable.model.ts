/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { journalIdType } from '../services/types';

export class InputFileAvailableModel {
    errorType: string;
    journalId: journalIdType;
    journalName: string;    
    runDate: number;
    status: string;
    message: string;

    constructor(errorType: string = "", journalId: journalIdType = 0, journalName: string = "", runDate: number = 0, 
        status: string = "", message: string = "") {
        this.errorType = errorType;
        this.journalId = journalId;
        this.journalName = journalName;
        this.runDate = runDate;
        this.status = status;
        this.message = message;
    }
}