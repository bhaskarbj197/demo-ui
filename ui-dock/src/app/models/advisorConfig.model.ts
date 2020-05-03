/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';

export class AdvisorConfigModel implements Deserialize{
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
    constructor() {
        this.fileName = "";
        this.columnName = "";
        this.model = "";
        this.url = "";
    }
    fileName: string;
    columnName:string;
    model: string;
    url: string;
}
