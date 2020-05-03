/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { TemplateMasterPartialModel } from './templateMaster.model';
import { RuleSetModel } from './validationRules.model';
import { FrequencyModel } from './frequency.model';
import { TimeZoneModel } from './timeZone.model';
import { CalendarPartialModel } from './calendar.model';
import { GroupElementStorageModel } from './groupMaster.model';
import { userIdType } from '../services/types';

export class AboutModel {
    journalInfo: AboutJournalInfoModel;
    workflow: AboutWorkflowModel;
    riskManagement: AboutRiskManagementModel;

    constructor(journalInfo: AboutJournalInfoModel = new AboutJournalInfoModel(), 
        workflow: AboutWorkflowModel = new AboutWorkflowModel(), riskManagement: AboutRiskManagementModel = new AboutRiskManagementModel()) {
        this.journalInfo = journalInfo;
        this.workflow = workflow;
        this.riskManagement = riskManagement;
    }
}

export class AboutJournalInfoModel {
    name: string;
    id: number;
    description: string;
    frequency: FrequencyModel;
    template: TemplateMasterPartialModel;
    isReversal: boolean;


    constructor(name: string = "", id: number = 0, description: string = "", frequency: FrequencyModel = new FrequencyModel(), 
        template: TemplateMasterPartialModel = new TemplateMasterPartialModel()) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.frequency = frequency;
        this.template = template;
        this.isReversal = false;
    }
}

export class AboutWorkflowModel {
    superuser: userIdType;
    approver: userIdType;
    reviewer: userIdType;
    preparer: userIdType;

    constructor(superuser: userIdType = null, approver: userIdType = null, reviewer: userIdType = null) {
        this.superuser = superuser;
        this.approver = approver;
        this.reviewer = reviewer;
    }
}

export class AboutRiskManagementModel {
    sourceSLA: string;
    sourceSLATime: number;
    sourceContact: string;
    postDate: string;
    postDateTime: number;
    timezone: TimeZoneModel;
    postContact: string;
    businessRules: RuleSetModel;
    calendar: CalendarPartialModel;
    group1: GroupElementStorageModel;
    group2: GroupElementStorageModel;

    constructor(sourceSLA: string = "", sourceSLATime: number = 0, sourceContact: string = "", postDate: string = "", postDateTime: number = 0,
        timezone: TimeZoneModel = new TimeZoneModel(), postContact: string = "", businessRules: RuleSetModel = new RuleSetModel(),
        calendar: CalendarPartialModel = new CalendarPartialModel(), group1: GroupElementStorageModel = new GroupElementStorageModel(),
        group2: GroupElementStorageModel = new GroupElementStorageModel()) {
        this.sourceSLA = sourceSLA;
        this.sourceSLATime = sourceSLATime;
        this.sourceContact = sourceContact;
        this.postDate = postDate;
        this.postDateTime = postDateTime;
        this.timezone = timezone;
        this.postContact = postContact;
        this.businessRules = businessRules;
        this.calendar = calendar;
        this.group1 = group1;
        this.group2 = group2;
    }
}