/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';

export class GroupMasterModel implements Deserialize{
    private getElementsToDisplay(elements: Array<GroupElementModel>) {
        let resultText: string = "";
        let nameArray: Array<string> = [];
        if(elements && elements.length > 0) {
            nameArray = elements.map(data => data.name);
            resultText = nameArray.join(", ");
        }
        return resultText;
    }
    deserialize(input: GroupMasterReqResModel): this {
        this.id = input.groupId;
        this.name = input.groupName;
        this.code = "group-" + this.id.toString();
        this.elements = input.elements;
        this.elementsToDisplay = this.getElementsToDisplay(this.elements);
        this.isActive = input.isActive;
        return this;
    }

    id: number;
    code: string;
    name: string = "";
    isActive: boolean = false;
    elementsToDisplay: string ;
    elements?: Array<GroupElementModel> = [];
}

export class GroupMasterReqResModel implements Deserialize{
    deserialize(input: GroupMasterModel): this {
        Object.assign(this, input);
        this.elements = input.elements;
        return this;
    }
    groupId: number;
    groupName: string;
    isActive: boolean;
    elements?: Array<GroupElementModel> = [];
}

export class GroupElementModel implements Deserialize{
    deserialize(input: any): this {
        return Object.assign(this, input);
    }
    id: number;
    name: string = "";
}

export class GroupElementStorageModel {
    groupName: string;
    element: string;

    constructor(groupName: string = "", element: string = ""){
        this.groupName = groupName;
        this.element = element;
    }
}