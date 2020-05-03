/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class DocEvidenceModel {
    fileName: string;
    fileType: string;
    markedUpFileName: string;
    comments: string;

    constructor(fileName: string = "", fileType: string = "", markedUpFileName: string = "", comments: string = "") {
        this.fileName = fileName;
        this.fileType = fileType;
        this.markedUpFileName = markedUpFileName;
        this.comments = comments;
    }
}
