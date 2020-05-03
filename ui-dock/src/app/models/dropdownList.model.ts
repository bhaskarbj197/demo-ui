/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class DropdownListModel {
    code: number|string;
    val: string;

    constructor(_code: number|string, _val: string = "") {
        this.code = _code;
        this.val = _val;
    }
}
