/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';

export class resultTabModel implements Deserialize{
    deserialize(input: any): this {
        Object.assign(this, input);
        this.isNewTab = input.newTab == 'Y' ? true : false;
        this.isNewCol = input.newCol == 'Y' ? true : false;
        return this;
    }
    colName: string;
    tabName: string;
    newCol: string;
    newTab: string;
    isNewTab: boolean;
    isNewCol: boolean;
}
