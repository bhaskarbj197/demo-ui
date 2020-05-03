/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class JournalPostingRprtFilterPropertyModel {
    
    month: number = 1;
    startDate: object = null;
    endDate: object = null;
    documentIdCheck: string = "";
    runStatus: string = "";
    postingStatus: string = "";

    constructor(defaultStatus: string = ""){
        this.month = 1;
        this.startDate = null;
        this.endDate = null;
        this.documentIdCheck = defaultStatus;
        this.runStatus = defaultStatus;
        this.postingStatus = defaultStatus;
    }
}
