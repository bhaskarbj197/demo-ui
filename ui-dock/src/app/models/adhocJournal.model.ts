/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { TemplateMasterPartialModel } from './templateMaster.model';
import { RuleSetModel } from './validationRules.model';
import { UserPartialModel } from './user.model';
import { journalIdType } from '../services/types';

export class AdhocJournalModel {
    id: journalIdType;
    name: string;
    description: string;
    frequency: string;
    template: TemplateMasterPartialModel;
    businessRule: RuleSetModel;
    superUser: UserPartialModel;
    reviewer: UserPartialModel;
    approver: UserPartialModel;
    preparer: UserPartialModel;
    dataEntryType: string;
    fileInfo: any;
    status: string;
    requesterEmail: string;

    constructor(id: journalIdType = 0, name: string = "", description: string = "", status: string = "", 
        frequency: string = "Adhoc", template: TemplateMasterPartialModel = new TemplateMasterPartialModel(), 
        reviewer: UserPartialModel = new UserPartialModel(), superUser: UserPartialModel = new UserPartialModel(), 
        fileInfo: any = null, businessRule: RuleSetModel = new RuleSetModel(), requesterEmail: string = "",
        dataEntryType: string = "", approver: UserPartialModel = new UserPartialModel(),
        preparer: UserPartialModel = new UserPartialModel()){
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.frequency = frequency;
        this.template = template;
        this.superUser = superUser;
        this.reviewer = reviewer;
        this.approver = approver;
        this.dataEntryType = dataEntryType;
        this.fileInfo = fileInfo;
        this.businessRule = businessRule;
        this.preparer = preparer;
        this.requesterEmail = requesterEmail;
    }
}

export class AdhocJournalDetailModel extends AdhocJournalModel {
    dataColumns: Array<DataColumnModel>;
    dataValues: Array<Array<string>>;

    constructor(id: journalIdType = 0, name: string = "", description: string = "", status: string = "", 
        frequency: string = "Adhoc", template: TemplateMasterPartialModel = new TemplateMasterPartialModel(), 
        reviewer: UserPartialModel = new UserPartialModel(), superUser: UserPartialModel = new UserPartialModel(), 
        fileInfo: any = null, businessRule: RuleSetModel = new RuleSetModel(), requesterEmail: string = "",
        dataEntryType: string = "", approver: UserPartialModel = new UserPartialModel(),
        preparer: UserPartialModel = new UserPartialModel(), dataColumns: Array<DataColumnModel> = new Array<DataColumnModel>(),
        dataValues: Array<Array<string>> = [[]]) {
        super(id, name, description, status, frequency, template, reviewer, superUser, fileInfo, businessRule, requesterEmail,
            dataEntryType, approver, preparer);
        this.dataColumns = dataColumns;
        this.dataValues = dataValues;
    }
}

export class DataColumnModel {
    col: string;
    typ: string;

    constructor(col: string = "", typ: string = "") {
        this.col = col;
        this.typ = typ;
    }
}

export class AdhocJournalForAdvisorModel {
    id: journalIdType;
    name: string;
    frequency: string;
    runDate: number;
    status: string;
    validationStatus: string;
    financialImpact: string;

    constructor(id: journalIdType = 0, name: string = "", frequency: string = "", runDate: number = 0, 
        status: string = "", validationStatus: string = "", financialImpact: string = ""){
        this.id = id;
        this.name = name;
        this.frequency = frequency;
        this.status = status;
        this.runDate = runDate;
        this.validationStatus = validationStatus;
        this.financialImpact = financialImpact;
    }
}