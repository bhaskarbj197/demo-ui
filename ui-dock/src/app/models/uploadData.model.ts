/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';

export class UploadDataModel implements Deserialize{
    deserialize(input: any): this {
        Object.assign(this, input);
        this.file = input.File;
        this.size = input.Size;
        this.isAvailable = input.Available == 'Yes';
        this.date = (!input.Time || input.Time === "na") ? null : input.Time;
        this.isUploaded = false;
        this.lastUpdated = (!input.Time || input.Time === "na") ? null : input.Time;
        this.isMaster = false;
        this.errorMessage = input.msg ? input.msg : "";
        return this;
    }
    file: string;
    size: any;
    isAvailable:boolean;
    date: string;
    Time: any;
    isUploaded: boolean;
    lastUpdated: string;
    isMaster: boolean;
    errorMessage: string;
}
