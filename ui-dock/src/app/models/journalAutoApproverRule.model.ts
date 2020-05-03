/** *****************************************************************************
Licensed Materials - Property of IBM 6949-XXX ã Copyright IBM Corp. 2019
All Rights Reserved US Government Users Restricted Rights - Use, duplication 
or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
***************************************************************************** */

import { TemplateMasterPartialModel } from './templateMaster.model';
import { userIdType } from '../services/types';
import { GroupElementStorageModel } from './groupMaster.model';

export class JournalAutoApproverRuleModel {
    id: number;
    category: string;
    template: TemplateMasterPartialModel;
    conditions: Array<JournalAutoApproverRuleCondition>;
    action: JournalAutoApproverRuleActionType;
    exception: JournalAutoApproverRuleException;
    isException: boolean;
    createdOn: number;
    createdBy: userIdType;
    updatedOn: number;
    updatedBy: userIdType;
    comments: string;
    isBlocked: boolean;
    condText: string;
    actionReviewer2: userIdType;

    constructor(category: string = "", template: TemplateMasterPartialModel = new TemplateMasterPartialModel(),
        conditions: Array<JournalAutoApproverRuleCondition> = new Array<JournalAutoApproverRuleCondition>(),
        action: JournalAutoApproverRuleActionType = new JournalAutoApproverRuleActionType(),
        exception: JournalAutoApproverRuleException = new JournalAutoApproverRuleException(),
        isException: boolean = false, id: number = 0, createdOn: number = null, createdBy: userIdType = null,
        updatedOn: number = null, updatedBy: userIdType = null, comments: string = "", isBlocked: boolean = false) {
        this.category = category;
        this.template = template;
        this.conditions = conditions;
        this.action = action;
        this.exception = exception;
        this.isException = isException;
        this.id = id;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.updatedOn = updatedOn;
        this.updatedBy = updatedBy;
        this.comments = comments;
        this.isBlocked = isBlocked;
        this.actionReviewer2 = "";
    }
}

export class JournalAutoApproverRuleCondition {
    columnName: string;
    operator: string;
    value: string;
    andOr: string;
    typ: string;
    startWorkday: string;
    endWorkday: string;
    reviewer: userIdType;

    constructor(columnName: string = "", operator: string = "", value: string = "", 
        andOr: string = "", typ: string = "", startWorkday: string = "", endWorkday: string = "",
        reviewer: userIdType = null) {
        this.columnName = columnName;
        this.operator = operator;
        this.value = value;
        this.andOr = andOr;
        this.typ = typ;
        this.startWorkday = startWorkday;
        this.endWorkday = endWorkday;
        this.reviewer = reviewer;
    }
}

export class JournalAutoApproverRuleActionType {
    code: string;
    value: string;
    isReview2ListShow: boolean;
    isShowInActionArea: boolean;
    isShowInExceptionArea: boolean;

    constructor(code: string = "", value: string = "", isReview2ListShow: boolean = false,
        isShowInActionArea: boolean = false, isShowInExceptionArea: boolean = false) {
        this.code = code;
        this.value = value;
        this.isReview2ListShow = isReview2ListShow;
        this.isShowInActionArea = isShowInActionArea;
        this.isShowInExceptionArea = isShowInExceptionArea;
    }
}

export class JournalAutoApproverRuleException {
    group1: GroupElementStorageModel;
    group2: GroupElementStorageModel;
    action: JournalAutoApproverRuleActionType;

    constructor(group1: GroupElementStorageModel = new GroupElementStorageModel(), 
        group2: GroupElementStorageModel = new GroupElementStorageModel(),
        action: JournalAutoApproverRuleActionType = new JournalAutoApproverRuleActionType()) {
        this.group1 = group1;
        this.group2 = group2;
        this.action = action;
    }
}