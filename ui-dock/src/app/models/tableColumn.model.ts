/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class TableColumnModel {
    value: string;
    css: string;
    isCenter: boolean;
    width: number;
    isAbleToSort: boolean;
    isSorted: boolean;
    sortDirection: string;
    linkedProperty: string;

    constructor(value: string = "", width: number = 0, isCenter: boolean = false, css: string = "", 
        isAbleToSort: boolean = false, isSorted: boolean = false, sortDirection: string = "", linkedProperty: string = "") {
        this.value = value;
        this.css = css;
        this.isCenter = isCenter;
        this.width = width;
        this.isAbleToSort = isAbleToSort;
        this.isSorted = isSorted;
        this.sortDirection = sortDirection;
        this.linkedProperty = linkedProperty;
    }
}