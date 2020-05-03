/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { SortTypes } from '../enums/sortTypes';

export class TableConfigModel {
    pageIndex: number;
    pageCount: number;
    sortBy: string;
    sortDirection: SortTypes;

    constructor(pageIndex: number = 0, pageCount: number = 0, sortBy: string = "", sortDirection: SortTypes = SortTypes.NONE) {
        this.pageIndex = pageIndex;
        this.pageCount = pageCount;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }
}