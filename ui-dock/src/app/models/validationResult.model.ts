/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class ValidationResultModel {
    category: string;
    description: string;
    statusText: string;
    isSuccess: boolean;
    type: string;
    validationNo: number;

    constructor(category: string = "", description: string = "", statusText: string = "", isSuccess: boolean = false, 
        type: string = "", validationNo: number = 0){
        this.category = category;
        this.description = description;
        this.statusText = statusText;
        this.isSuccess = isSuccess;
        this.type = type;
        this.validationNo = validationNo;
    }
}