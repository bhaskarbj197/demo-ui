/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { Deserialize } from '../services/interfaces/deserialize';
import { PopOverMsgKeyValue } from '../components/ui/popover/popover.component';
import { journalIdType } from '../services/types';

export class JournalInfoModel implements Deserialize{
    
    frequency: string;
    id: journalIdType;
    name: string;
    journalStatus: string;
    runDate: string;
    runStatus: string;
    template: string;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}

export class JournalInfoPartial{
    description: string;
    frequency: string;
    id: journalIdType;
    name: string;
    template: string;
    isAdhoc: boolean;
    advisorSegmentSelected: string;
    runDateSelected: string;

    constructor(description: string = "", frequency: string = "", id: journalIdType = 0, name: string = "", 
        template: string = "", isAdhoc: boolean = false,
        advisorSegmentSelected: string = "", runDateSelected: string = ""){
        this.description = description;
        this.frequency = frequency;
        this.id = id;
        this.name = name;
        this.template = template;
        this.isAdhoc = isAdhoc;
        this.advisorSegmentSelected = advisorSegmentSelected;
        this.runDateSelected = runDateSelected;
    }
}

export class BulkJournalModel implements Deserialize{
    deserialize(input: any): this {
        Object.assign(this, input);
        this.isValid = this.validationStatus === "Failed" ? false : true;
        this.failedReasons = this.findValidationMessages(this.validationFailReason);
        return this;
    }

    private findValidationMessages(failedReasons: Array<Object>) {
        var messages: Array<PopOverMsgKeyValue> = [];
        var keys = Object.keys(this);
        var rIndex: number = -1;
        for(var index=0; index < keys.length ; index++) {          
          rIndex = failedReasons.findIndex(data => data[keys[index]]);
          if(rIndex >= 0) {
            messages.push(new PopOverMsgKeyValue(keys[index], failedReasons[rIndex][keys[index]]));
          }
        }
        return messages;
    }

    slNo: number;
    jId: journalIdType;
    journalName: string;
    description: string;
    frequency: string;
    template: string;
    businessRules: string;
    grouping1: string;
    grouping2: string;
    calender: string;
    approver: string;
    reviewer: string;
    preparer: string;
    businessAdmin: string;
    timeZone: string;
    sourceSla: string;
    sourceSlaTime: string;
    sourceContact: string;
    postContact: string;
    postDate: string;
    postDateTime: string;
    isValid: boolean;
    validationStatus: string;
    validationFailReason: Array<Object>;
    failedReasons: Array<PopOverMsgKeyValue>;
    executionStatus: string;
    executionFailReason: Array<any>;
}
