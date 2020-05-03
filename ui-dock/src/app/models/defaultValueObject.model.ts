/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';

export class DefaultValueObject implements Deserialize {
    help: string;
    typ: string;
    value: any;
    constructor(type, val, help) {
        this.help = help;
        this.typ = type;
        this.value = val;
    }
    deserialize(input: any): this {
        Object.assign(this, input);
        //this.type = input.typ;
        return this;
    }
}
