/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class ResultSetTabModel {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
    folderType?: string;
}

export class ResultSetDataModel {
    fileData: Array<Array<string>>;
    fileHeader: Array<string>;
    fileName: string;
    fileType: string;
}
