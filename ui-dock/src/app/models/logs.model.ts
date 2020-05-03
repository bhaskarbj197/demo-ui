/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class LogsModel {
    time: any;
    message: string;
    timeParamValue: boolean;
    isSuccess?: boolean;

    constructor(message: string, isSuccess: boolean = true, timeParamValue: boolean = false, time?: any) {
        this.time = (timeParamValue || (time !== undefined && time !== null && timeParamValue)) ? time : Date.now();
        this.message = message;
        this.isSuccess = isSuccess;
    }
}

export class LogTypeModel {
    id: number;
    name: string;
    isActive: boolean;
}
