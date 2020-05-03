/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class RunHistoryModel {
    isSuccess: boolean;
    message: string;
    runDate: string;

    constructor(isSuccess: boolean, message: string, runDate: string) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.runDate = runDate;
    }
}

export class RunHistoryPartialModel {
    status: string;
    runDate: string;

    constructor(status: string = "", runDate: string = "") {
        this.status = status;
        this.runDate = runDate;
    }
}