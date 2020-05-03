/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';
import { companyIdType } from '../services/types';

export class TemplateMasterModel implements Deserialize{
    deserialize(input: TemplateMasterReqResModel): this {
        this.id = input.templateId;
        this.name = input.templateName;
        this.crReq = input.columnNameCrMandatory;
        this.drReq = input.columnNameDrMandatory;
        this.isActive = input.isActive;
        this.crToDisplay = (this.crReq && this.crReq.length > 0) ?  this.crReq.join(", ") : "";
        this.drToDisplay = (this.drReq && this.drReq.length > 0) ?  this.drReq.join(", ") : "";
        this.companyId = input.companyId;
        return this;
    }
    id: number;
    name: string = "";
    isActive: boolean = true;
    crReq?: Array<string> = [];
    drReq?: Array<string> = [];
    crToDisplay: string;
    drToDisplay: string;
    companyId: companyIdType = null;
}

export class TemplateMasterReqResModel implements Deserialize{
    deserialize(input: TemplateMasterModel): this {
        this.templateId = input.id;
        this.templateName = input.name;
        this.isActive = input.isActive;
        this.columnNameCrMandatory = input.crReq;
        this.columnNameDrMandatory = input.drReq;
        this.companyId = input.companyId;
        return this;
    }

    templateId: number;
    templateName: string;
    isActive: boolean;
    columnNameCrMandatory?: Array<string>;
    columnNameDrMandatory?: Array<string>;
    companyId: companyIdType;
}

export class TemplateMasterPartialModel {
    id: number;
    name: string;

    constructor(id: number = 0, name: string = ""){
        this.id = id;
        this.name = name;
    }
}