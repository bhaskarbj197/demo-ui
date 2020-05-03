/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class ModifyInputFileInfoModel {
    type: string;
    fileName: string;
    start: number;
    end: number;
    displayStatus: string;

    constructor(type: string = "", fileName: string = "", start: number = 0, end: number = 0, 
        displayStatus: string = "hide") {
        this.type = type;
        this.fileName = fileName;
        this.start = start;
        this.end = end;
        this.displayStatus = displayStatus;
    }
}
