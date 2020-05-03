/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { journalIdType } from '../services/types';

export class SupportingDocModel {
    journalId: journalIdType;
    fileName: string;
    type: string;
    fileType: string;
    isActive: boolean;
    createdDate: number;

    constructor(journalId: journalIdType = 0, fileName: string = "", type: string = "", fileType: string = "", 
        isActive: boolean = false, createdDate: number = 0) {
        this.journalId = journalId;
        this.fileName = fileName;
        this.type = type;
        this.fileType = fileType;
        this.isActive = isActive;
        this.createdDate = createdDate;
    }
}
