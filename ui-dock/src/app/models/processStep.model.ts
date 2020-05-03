/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { resultTabModel } from './resultTab.model';
import { Deserialize } from '../services/interfaces/deserialize';

export class ProcessStepModel implements Deserialize {
    deserialize(input: any): this {
        Object.assign(this, input);
        this.resultTab = new resultTabModel().deserialize(input.resultTab);
        return this;
    }
    id: number;
    comment: string;
    inputTab: Array<string>;
    resultTab: resultTabModel;
    command: Array<ProcessCommandModel>;
    operation: ProcessOperationModel;
}

export class ProcessCommandModel{
    name: string;
    seq: number;
    typ: string;
    value: string;
}

export class ProcessOperationModel{
    func: string;
    typ: string;
}