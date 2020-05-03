/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class ValidationRuleCategoryModel {
    name: string;
    code: string;
    isDisabled: boolean;
    isColumnListShow: boolean;
    isOperatorShow: boolean;
    isDestColumnValueShow: boolean;
    isAndOrShow: boolean;

    constructor(name: string = "", code: string = "", isDisabled: boolean = true, isColumnListShow: boolean = true,
        isOperatorShow: boolean = true, isDestColumnValueShow: boolean = true, isAndOrShow: boolean = true){
        this.name = name;
        this.code = code;
        this.isDisabled = isDisabled;
        this.isColumnListShow = isColumnListShow;
        this.isOperatorShow = isOperatorShow;
        this.isDestColumnValueShow = isDestColumnValueShow;
        this.isAndOrShow = isAndOrShow;
    }
}