
/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

export class FrequencyModel {
    id: number;
    name: string;
    isActive: boolean;

    constructor(id: number = 0, name: string = "", isActive: boolean = true) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
    }
}